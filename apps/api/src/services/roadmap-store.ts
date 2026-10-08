import {pool} from "../db/pool.js";
import {studyDate} from "./daily-plan.js";
import {buildRoadmapDay,roadmapDates} from "./roadmap.js";
export const roadmapTaskSelect=`id,TO_CHAR(date,'YYYY-MM-DD') AS date,task_type AS "taskType",task_description AS "taskDescription",duration,status,priority,task_title AS title,resource_path AS href,task_reason AS reason,phase`;
export async function generateRoadmap(userId:string){
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const {rows:[profile]}=await client.query(`SELECT daily_study_minutes AS minutes,weak_skills AS "weakSkills",TO_CHAR(exam_date,'YYYY-MM-DD') AS "examDate",onboarding_completed AS complete FROM profiles WHERE user_id=$1 FOR UPDATE`,[userId]);
    if(!profile?.complete||!profile.minutes||!profile.examDate)throw new Error("Complete your learning profile before building a roadmap.");
    const today=studyDate(),dates=roadmapDates(today,profile.examDate);
    const existing=await client.query(`SELECT DISTINCT TO_CHAR(date,'YYYY-MM-DD') AS date FROM study_plans WHERE user_id=$1 AND date>=$2 AND date<$3`,[userId,today,profile.examDate]);
    const present=new Set(existing.rows.map(r=>r.date));
    const results=await client.query("SELECT 'writing' skill,AVG(overall_band) score FROM writing_evaluations e JOIN writing_attempts a ON a.id=e.attempt_id WHERE a.user_id=$1 UNION ALL SELECT 'speaking',AVG(overall_band) FROM speaking_evaluations e JOIN speaking_attempts a ON a.id=e.attempt_id WHERE a.user_id=$1",[userId]);
    const scores=Object.fromEntries(results.rows.filter(r=>r.score!==null).map(r=>[r.skill,Number(r.score)]));
    const tasks=dates.flatMap((date,index)=>present.has(date)?[]:buildRoadmapDay(Number(profile.minutes),profile.weakSkills??[],index,dates.length,scores).map(task=>({...task,date})));
    if(tasks.length)await client.query(`INSERT INTO study_plans(user_id,date,task_type,task_description,duration,priority,task_title,resource_path,task_reason,phase) SELECT $1,x.date::date,x.type,x.description,x.duration,x.priority,x.title,x.href,x.reason,x.phase FROM jsonb_to_recordset($2::jsonb) AS x(date text,type text,description text,duration smallint,priority smallint,title text,href text,reason text,phase text)`,[userId,JSON.stringify(tasks)]);
    // Never erase existing activities or completion when regenerating or changing goals.
    await client.query("UPDATE profiles SET roadmap_started_on=COALESCE(roadmap_started_on,(SELECT MIN(date) FROM study_plans WHERE user_id=$1 AND date<=$2::date),$2::date),roadmap_ends_on=$3::date-1 WHERE user_id=$1",[userId,today,profile.examDate]);
    await client.query("COMMIT");
    return {addedTasks:tasks.length,days:dates.length,endDate:dates.at(-1),preservedDays:present.size};
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
}
export async function getRoadmap(userId:string){
  const {rows:[profile]}=await pool.query(`SELECT current_level::double precision AS "currentLevel",target_band::double precision AS "targetBand",TO_CHAR(exam_date,'YYYY-MM-DD') AS "examDate",daily_study_minutes AS "dailyStudyMinutes",TO_CHAR(roadmap_started_on,'YYYY-MM-DD') AS "startDate",TO_CHAR(roadmap_ends_on,'YYYY-MM-DD') AS "endDate",weak_skills AS "weakSkills",onboarding_completed AS complete FROM profiles WHERE user_id=$1`,[userId]);
  const tasks=await pool.query(`SELECT ${roadmapTaskSelect} FROM study_plans WHERE user_id=$1 AND date>=COALESCE($2::date,CURRENT_DATE-30) AND date<=COALESCE($3::date,CURRENT_DATE+365) ORDER BY date,priority,created_at`,[userId,profile?.startDate??null,profile?.endDate??null]);
  return {profile:profile??{currentLevel:null,targetBand:null,examDate:null,dailyStudyMinutes:null,startDate:null,endDate:null,weakSkills:[],complete:false},today:studyDate(),tasks:tasks.rows};
}

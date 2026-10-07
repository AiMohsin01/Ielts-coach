import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types.js";
import { studyDate } from "../services/daily-plan.js";
const router=Router();
router.get("/progress",requireAuth,async(req:AuthenticatedRequest,res,next)=>{
  try{
    const id=req.user!.id;
    const [profile,w,s,weak,plan,reading,listening,writingAttempts,speakingAttempts]=await Promise.all([
      pool.query('SELECT target_band AS "targetBand",exam_date AS "examDate" FROM profiles WHERE user_id=$1',[id]),
      pool.query("SELECT overall_band AS band,e.created_at AS date FROM writing_evaluations e JOIN writing_attempts a ON a.id=e.attempt_id WHERE a.user_id=$1 ORDER BY e.created_at",[id]),
      pool.query("SELECT overall_band AS band,e.created_at AS date FROM speaking_evaluations e JOIN speaking_attempts a ON a.id=e.attempt_id WHERE a.user_id=$1 ORDER BY e.created_at",[id]),
      pool.query('SELECT label,occurrence_count AS count FROM student_weaknesses WHERE user_id=$1 ORDER BY occurrence_count DESC LIMIT 5',[id]),
      pool.query('SELECT task_description AS "taskDescription" FROM study_plans WHERE user_id=$1 AND status=\'pending\' AND date>=$2 ORDER BY date,priority LIMIT 3',[id,studyDate()]),
      pool.query('SELECT a.id,t.title,a.raw_score AS "rawScore",a.total_points AS "totalPoints",a.submitted_at AS "submittedAt" FROM reading_attempts a JOIN reading_tests t ON t.id=a.test_id WHERE a.user_id=$1 AND a.status=\'submitted\' ORDER BY a.submitted_at DESC LIMIT 30',[id]),
      pool.query('SELECT a.id,t.title,a.raw_score AS "rawScore",a.total_points AS "totalPoints",a.submitted_at AS "submittedAt" FROM listening_attempts a JOIN listening_tests t ON t.id=a.test_id WHERE a.user_id=$1 AND a.status=\'submitted\' ORDER BY a.submitted_at DESC LIMIT 30',[id]),
      pool.query('SELECT a.id,t.title,a.response_text AS "responseText",a.word_count AS "wordCount",a.submitted_at AS "submittedAt" FROM writing_attempts a JOIN writing_tasks t ON t.id=a.task_id WHERE a.user_id=$1 ORDER BY a.submitted_at DESC LIMIT 30',[id]),
      pool.query('SELECT a.id,q.prompt,a.transcript,a.audio_url AS "audioUrl",a.duration_seconds AS "durationSeconds",a.submitted_at AS "submittedAt" FROM speaking_attempts a LEFT JOIN speaking_questions q ON q.id=a.question_id WHERE a.user_id=$1 ORDER BY a.submitted_at DESC LIMIT 30',[id])
    ]);
    const skills={writing:w.rows.at(-1)?.band??null,speaking:s.rows.at(-1)?.band??null};
    const values=Object.values(skills).filter(x=>x!==null).map(Number);
    res.json({generatedAt:new Date().toISOString(),prediction:values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length*2)/2:null,profile:profile.rows[0],skills,improvement:{writing:w.rows,speaking:s.rows},weaknesses:weak.rows,recommendedNextSteps:plan.rows,practice:{reading:reading.rows,listening:listening.rows,writing:writingAttempts.rows,speaking:speakingAttempts.rows}});
  }catch(e){next(e);}
});
export default router;

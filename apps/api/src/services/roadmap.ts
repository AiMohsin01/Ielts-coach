import {buildDailyPlan} from "./daily-plan.js";
import {libraryModules} from "./library-catalog.js";
export const addDays=(date:string,days:number)=>new Date(Date.parse(date+"T12:00:00Z")+days*86400000).toISOString().slice(0,10);
export function roadmapDates(today:string,examDate:string){
  const days=Math.round((Date.parse(examDate+"T12:00:00Z")-Date.parse(today+"T12:00:00Z"))/86400000);
  if(!Number.isFinite(days)||days<1||days>365)throw new Error("Choose an exam date within the next 365 days to build your roadmap.");
  return Array.from({length:days},(_,i)=>addDays(today,i));
}
const modules:Record<string,string>={writing:"03-writing",speaking:"04-speaking",reading:"02-reading",listening:"01-listening",grammar:"05-grammar",vocabulary:"06-vocabulary"};
const guides:Record<string,string>={writing:"Plan a response, write it in your own words, then check whether every part of the question is answered.",speaking:"Choose a prompt, rehearse aloud and record an answer. Listen back for pauses and unclear wording.",reading:"Answer the original reading exercise, then write down the passage evidence for each mistake.",listening:"Listen to the original exercise without the transcript, answer the questions, then review what you missed.",grammar:"Complete the grammar quiz and create three original sentences using the structures you found difficult.",vocabulary:"Study one topic, pronounce each word and write an example. Rate only words you genuinely recall."};
export function buildRoadmapDay(minutes:number,weakSkills:string[],index:number,totalDays:number,scores:Record<string,number>={}){
  const ranked=buildDailyPlan(minutes,weakSkills,scores)[0].type;
  const cycle=[ranked,"grammar","reading","listening","speaking","vocabulary","writing"];
  const focus=cycle[index%cycle.length];
  const phase=index/Math.max(1,totalDays)>=.8?"Review & readiness":index/Math.max(1,totalDays)>=.35?"Skill practice":"Foundation";
  // Rotate the priority activity while retaining the learner's exact daily time budget.
  const tasks=buildDailyPlan(minutes,[focus],{[focus]:0});
  tasks[0].type=focus;
  return tasks.map((task,i)=>{
    const skill=task.type,mod=libraryModules.find(m=>m.slug===modules[skill]);
    const lesson=mod?.videos[(Math.floor(index/7)+i)%(mod?.videos.length??1)];
    const learn=phase==="Foundation"&&i===0&&lesson;
    const review=phase==="Review & readiness"&&index%3===2&&i===0;
    const title=learn?lesson.title:review?"Review your mistakes and rehearse your next step":`${skill[0].toUpperCase()+skill.slice(1)}: ${i===0?"focused practice":"daily review"}`;
    const href=learn?`/dashboard/content-library/${mod!.slug}?video=${lesson.id}`:review?"/dashboard/my-reports":["reading","listening","writing","speaking"].includes(skill)?`/practice/${skill}`:`/dashboard/${skill}`;
    const description=learn?"Watch the selected lesson, read the module notes, and write three takeaways in your personal notes.":review?"Open your saved attempts, explain the mistakes, and choose one exercise to retry. If you have no saved attempt yet, start a short practice session.":guides[skill]??"Review your study notes and practise the skill.";
    return {...task,title,href,description:description+` (Session ${i+1})`,phase,reason:i===0?`${phase}: ${skill} is today's focus. Your priority skill (${ranked}) receives an extra weekly session.`:"A short supporting activity reinforces vocabulary and accurate English alongside your main skill."};
  });
}

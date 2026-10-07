"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
type Task = { id:string; taskType:string; taskDescription:string; duration:number; status:string };
type CoachData = { tasks:Task[]; targetBand:number|null; examCountdown:number|null; studyStreak:number; bandPrediction:number|null; recommendations:{id:string;type:string;reason:string}[]; vocabulary:{mastered:number;due:number} };
const taskLink = (type:string) => ["writing","reading","listening","speaking"].includes(type) ? "/practice/"+type : type==="vocabulary" ? "/dashboard/vocabulary" : "/dashboard/grammar";
export function StudyCoach() {
  const [data,setData]=useState<CoachData|null>(null);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState("");
  const load=async()=>{const next=await api<CoachData>("/api/coach/dashboard");setData(next);};
  useEffect(()=>{load().catch(e=>setError(e.message));},[]);
  const generate=async()=>{
    setBusy("plan");setError("");setMessage("");
    try { await api("/api/coach/plan/generate",{method:"POST",body:"{}"});await load();setMessage("Today’s plan is ready. Any completed tasks are preserved. A new plan is available each day."); }
    catch(e){setError(e instanceof Error?e.message:"Could not create a plan. Please try again.");}
    finally{setBusy("");}
  };
  const complete=async(task:Task)=>{
    setBusy(task.id);setError("");
    try{await api("/api/coach/plan/"+task.id,{method:"PATCH",body:JSON.stringify({status:"completed"})});await load();setMessage("Task completed. Your progress is saved.");}
    catch(e){setError(e instanceof Error?e.message:"Could not save progress.");}finally{setBusy("");}
  };
  return <section className="p-5 sm:p-9">
    <div className="flex flex-wrap items-center justify-between gap-3"><a href="/" className="text-sm font-semibold text-ocean">← Overview</a><a href="/onboarding" className="btn-secondary">Edit learning profile</a></div>
    <h1 className="mt-7 text-3xl font-bold">Your study plan</h1>
    <p className="mt-2 text-slate-500">A daily roadmap based on your study time and priority skills.</p>
    {error&&<div role="alert" className="card mt-5 text-red-700"><p>{error}</p><button className="btn-secondary mt-3" onClick={()=>{setError("");load().catch(e=>setError(e.message));}}>Retry</button></div>}
    {!data&&!error&&<p role="status" className="mt-6">Loading your study plan…</p>}
    {data&&<>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">{[["Estimated band",data.bandPrediction??"Not assessed"],["Target band",data.targetBand??"Set your profile"],["Exam countdown",data.examCountdown===null?"Not set":data.examCountdown+" days"],["Study days this month",data.studyStreak]].map(([label,value])=><article className="card" key={String(label)}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></article>)}</div>
      <section className="card mt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Today’s plan</h2><p className="text-sm text-slate-500">Click Start practice to open an activity, then mark it complete.</p></div><button className="btn-primary" disabled={!!busy} onClick={generate}>{busy==="plan"?"Preparing…":data.tasks.length?"Refresh today’s plan":"Generate plan"}</button></div>
        <p role="status" aria-live="polite" className="mt-3 text-ocean">{message}</p>
        {data.tasks.length?<div className="mt-4 space-y-3">{data.tasks.map(task=><article className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-mist p-4" key={task.id}><div className="flex-1"><h3 className="font-bold capitalize">{task.taskType} · {task.duration} minutes</h3><p className="mt-1 text-sm text-slate-600">{task.taskDescription}</p></div><div className="flex flex-wrap gap-2"><a className="btn-secondary text-sm" href={taskLink(task.taskType)}>Start practice →</a><button className="btn-primary text-sm" disabled={!!busy||task.status==="completed"} onClick={()=>complete(task)}>{task.status==="completed"?"✓ Completed":busy===task.id?"Saving…":"Mark done"}</button></div></article>)}</div>:<p className="mt-4">Complete your <a href="/onboarding" className="underline">learning profile</a>, then generate your plan.</p>}
      </section>
      <div className="mt-6 grid gap-6 md:grid-cols-2"><section className="card"><h2 className="text-xl font-bold">Recommendations</h2>{data.recommendations.length?data.recommendations.map(r=><article className="mt-3 rounded-xl bg-red-50 p-4" key={r.id}><b className="capitalize">{r.type.replaceAll("_"," ")}</b><p className="mt-1 text-sm">{r.reason}</p></article>):<p className="mt-3 text-slate-500">Recommendations appear after evaluated practice. AI feedback requires a configured provider.</p>}</section><section className="card"><h2 className="text-xl font-bold">Vocabulary progress</h2><p className="mt-4 text-3xl font-bold">{data.vocabulary.mastered} <span className="text-base">mastered words</span></p><p className="mt-2">{data.vocabulary.due} words due for review</p><a className="btn-secondary mt-5" href="/dashboard/vocabulary">Open flashcards →</a><a className="btn-secondary mt-3" href="/dashboard/content-library">Open free video library →</a></section></div>
    </>}
  </section>;
}

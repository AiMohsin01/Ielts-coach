"use client";
import {useParams} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {api} from "../lib/api";
import {ExamPractice} from "./exam-practice";
type PracticeTest={id:string;title:string;description?:string;durationMinutes:number};
type Question={id:string;prompt:string;questionNumber:number;options:{label:string;value:string}[]};
const errorText=(e:unknown)=>e instanceof Error?e.message:"Something went wrong. Please try again.";
function useCatalog<T>(path:string,key:string){
  const [items,setItems]=useState<T[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
  const load=async()=>{setLoading(true);setError("");try{const data=await api<Record<string,T[]>>(path);setItems(data[key]);}catch(e){setError(errorText(e));}finally{setLoading(false);}};
  useEffect(()=>{load();},[path,key]);
  return {items,error,loading,load};
}
function Notice({error}:{error:string}){return error?<p role="alert" className="card mt-5 text-red-700">{error}</p>:null;}
function Empty({loading,error,retry,skill}:{loading:boolean;error:string;retry:()=>void;skill:string}){return <article className="card sm:col-span-2"><p role={error?"alert":"status"}>{error||(loading?"Loading practice content…":"No exercises are published yet.")}</p>{error&&<button className="btn-secondary mt-3" onClick={retry}>Retry</button>}<a className="btn-secondary mt-4" href={"/dashboard/content-library/"+({listening:"01-listening",reading:"02-reading",writing:"03-writing",speaking:"04-speaking"}[skill]??"00-introduction")}>Open free video lessons →</a></article>;}
export function PracticeScreen(){
  const {skill}=useParams<{skill:string}>();
  if(!["listening","reading","writing","speaking"].includes(skill))return <section className="p-8">Unknown practice module. <a href="/dashboard/mock-tests">Open practice menu</a></section>;
  return <section className="feature-page practice-page"><a className="text-sm font-semibold text-ocean" href="/dashboard/mock-tests">← All practice exercises</a><p className="mt-7 text-sm font-semibold uppercase tracking-widest text-ocean">Free practice module</p><h1 className="mt-2 text-4xl font-bold capitalize">{skill} practice</h1><p className="mt-3 text-sm text-slate-500">Original short practice exercises, not complete official IELTS examinations. AI assessment is separate and requires a configured provider.</p>{skill==="writing"?<Writing/>:skill==="speaking"?<Speaking/>:<ExamPractice key={skill} skill={skill as "listening"|"reading"}/>}</section>;
}
function Writing(){
  const catalog=useCatalog<any>("/api/practice/writing/tasks","tasks");
  const [task,setTask]=useState<any>(null),[text,setText]=useState(""),[message,setMessage]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  const save=async()=>{setBusy(true);setError("");try{const data=await api<any>("/api/practice/writing/tasks/"+task.id+"/attempts",{method:"POST",body:JSON.stringify({responseText:text})});setMessage("Response saved — "+data.attempt.wordCount+" words. AI feedback requires a configured provider.");}catch(e){setError(errorText(e));}finally{setBusy(false);}};
  if(!task)return <div className="mt-8 grid gap-4 sm:grid-cols-2">{catalog.items.length?catalog.items.map(t=><article className="card" key={t.id}><p className="text-sm text-ocean">{t.taskType.replace("_"," ")} · {t.category}</p><h2 className="mt-2 font-bold">{t.title}</h2><button className="btn-primary mt-4" onClick={()=>{setTask(t);setText("");setMessage("");setError("");}}>Open task</button></article>):<Empty loading={catalog.loading} error={catalog.error} retry={catalog.load} skill="writing"/>}</div>;
  return <section className="mt-8"><button className="btn-secondary" disabled={busy} onClick={()=>setTask(null)}>Choose another task</button><article className="card mt-5"><p className="text-sm text-ocean">{task.taskType.replace("_"," ")} · {task.timeLimitMinutes} minutes</p><h2 className="mt-2 text-xl font-bold">{task.title}</h2><p className="mt-4 whitespace-pre-wrap leading-7">{task.prompt}</p>{task.visualUrl&&<img className="mt-4 max-h-72 rounded-lg" src={task.visualUrl} alt="Writing task visual"/>}<label className="label mt-6" htmlFor="writing-answer">Your response</label><textarea id="writing-answer" className="min-h-64 w-full rounded-xl border p-4" value={text} onChange={e=>setText(e.target.value)} placeholder="Write your response here…"/><div className="mt-3 flex items-center gap-4"><button className="btn-primary" disabled={busy||!text.trim()} onClick={save}>{busy?"Saving…":"Save response"}</button><span>{text.trim()?text.trim().split(/\s+/).length:0} words</span></div><p role="status" className="mt-3 text-ocean">{message}</p><Notice error={error}/></article></section>;
}
function Speaking(){
  const catalog=useCatalog<any>("/api/practice/speaking/tests","tests");
  const [test,setTest]=useState<any>(null),[index,setIndex]=useState(0),[recording,setRecording]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  const recorder=useRef<MediaRecorder|null>(null),streamRef=useRef<MediaStream|null>(null),started=useRef(0);
  useEffect(()=>()=>{if(recorder.current){recorder.current.onstop=null;if(recorder.current.state!=="inactive")recorder.current.stop();}streamRef.current?.getTracks().forEach(track=>track.stop());},[]);
  const startTest=async(id:string)=>{setBusy(true);setError("");try{const data=await api<any>("/api/practice/speaking/tests/"+id);setTest(data.test);setIndex(0);setMessage("");}catch(e){setError(errorText(e));}finally{setBusy(false);}};
  const record=async()=>{
    if(recording){recorder.current?.stop();setRecording(false);setBusy(true);return;}
    setError("");setMessage("");
    try{
      if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined")throw new Error("Audio recording is unavailable in this browser. You can still rehearse these prompts aloud.");
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});streamRef.current=stream;
      const device=new MediaRecorder(stream),chunks:Blob[]=[];const question=test.questions[index];recorder.current=device;started.current=Date.now();
      device.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      device.onstop=async()=>{stream.getTracks().forEach(track=>track.stop());try{const form=new FormData();form.append("audio",new Blob(chunks,{type:device.mimeType}),"response.webm");form.append("questionId",question.id);form.append("durationSeconds",String(Math.round((Date.now()-started.current)/1000)));const response=await fetch((process.env.NEXT_PUBLIC_API_URL??"")+"/api/practice/speaking/tests/"+test.id+"/attempts",{method:"POST",credentials:"include",body:form});if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.message??"Recording could not be saved.");}setMessage("Recording saved. Free-hosting audio storage is temporary; AI assessment is not configured.");}catch(e){setError(errorText(e));}finally{setBusy(false);setRecording(false);}};
      device.start();setRecording(true);
    }catch(e){streamRef.current?.getTracks().forEach(track=>track.stop());setError(errorText(e));setBusy(false);}
  };
  if(!test)return <><Notice error={error}/><div className="mt-8 grid gap-4 sm:grid-cols-2">{catalog.items.length?catalog.items.map(t=><article className="card" key={t.id}><h2 className="font-bold">{t.title}</h2><p className="mt-2 text-sm">{t.instructions}</p><button className="btn-primary mt-4" disabled={busy} onClick={()=>startTest(t.id)}>Start speaking practice</button></article>):<Empty loading={catalog.loading} error={catalog.error} retry={catalog.load} skill="speaking"/>}</div></>;
  const q=test.questions[index];
  if(!q)return <div className="card mt-6">No prompts are published for this exercise. <button className="underline" onClick={()=>setTest(null)}>Choose another exercise</button></div>;
  return <section className="mt-8"><button className="btn-secondary" disabled={recording||busy} onClick={()=>setTest(null)}>Exit practice</button><article className="card mt-5"><p className="text-ocean">{q.part.replace("_"," ").toUpperCase()} · Question {index+1} of {test.questions.length}</p><h2 className="mt-3 text-2xl font-bold">{q.prompt}</h2>{q.cuePoints?.length>0&&<ul className="mt-4 list-disc pl-5">{q.cuePoints.map((point:string)=><li key={point}>{point}</li>)}</ul>}<p className="mt-4 text-sm">Preparation: {q.preparationSeconds}s · Suggested response: {q.responseSeconds}s</p><p className="mt-2 text-sm text-slate-500">You can practise aloud without recording. Saved recordings are temporary on free hosting.</p><button className="btn-primary mt-6" disabled={busy} onClick={record}>{recording?"Stop & save recording":busy?"Saving…":"Start recording"}</button><div className="mt-4 flex gap-3"><button className="btn-secondary" disabled={recording||busy||index===0} onClick={()=>{setIndex(index-1);setMessage("");}}>Previous question</button><button className="btn-secondary" disabled={recording||busy||index===test.questions.length-1} onClick={()=>{setIndex(index+1);setMessage("");}}>Next question</button></div><p role="status" className="mt-4 text-ocean">{message}</p><Notice error={error}/></article></section>;
}

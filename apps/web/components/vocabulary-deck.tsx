"use client";
import {useEffect,useState} from "react";
import {api} from "../lib/api";
type Word={id:string;word:string;meaning:string;exampleSentence:string;synonyms:string[];difficulty:string;masteryLevel:number};
export function VocabularyDeck(){
  const [words,setWords]=useState<Word[]>([]),[index,setIndex]=useState(0),[error,setError]=useState(""),[loaded,setLoaded]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const load=async()=>{try{const data=await api<{words:Word[]}>("/api/coach/vocabulary");setWords(data.words);setError("");}catch(e){setError(e instanceof Error?e.message:"Could not load flashcards.");}finally{setLoaded(true);}};
  useEffect(()=>{load();},[]);
  const word=words[index%Math.max(words.length,1)];
  const rate=async(level:number)=>{if(!word)return;setBusy(true);setError("");try{await api("/api/coach/vocabulary/"+word.id,{method:"PATCH",body:JSON.stringify({masteryLevel:level})});await load();setIndex((index+1)%words.length);setMessage("Review saved. Your next review date has been updated.");}catch(e){setError(e instanceof Error?e.message:"Could not save review.");}finally{setBusy(false);}};
  return <section className="mx-auto max-w-2xl p-5 sm:p-9"><a href="/dashboard/study-plan" className="text-sm font-semibold text-ocean">← Study plan</a><h1 className="mt-7 text-3xl font-bold">Vocabulary flashcards</h1><p className="mt-2 text-slate-500">Learn the meaning, use the word in your own sentence, then rate your recall.</p>
    {error&&<p role="alert" className="mt-4 text-red-700">{error} <button className="underline" onClick={load}>Retry</button></p>}
    {!loaded&&<p role="status" className="mt-5">Loading flashcards…</p>}
    {loaded&&!word&&!error&&<div className="card mt-6"><p>No cards are published yet.</p><a href="/dashboard/content-library/06-vocabulary" className="btn-secondary mt-4">Learn vocabulary with free videos →</a></div>}
    {word&&<><article className="card mt-7"><p className="text-sm text-ocean">Card {index%words.length+1} of {words.length} · {word.difficulty} · mastery {word.masteryLevel}/5</p><h2 className="mt-5 text-4xl font-bold">{word.word}</h2><p className="mt-6 text-lg">{word.meaning}</p><p className="mt-5 italic text-slate-600">“{word.exampleSentence}”</p><p className="mt-4 text-sm">Synonyms: {word.synonyms.join(", ")||"—"}</p></article><div className="mt-5 flex flex-wrap gap-2">{[0,1,2,3,4,5].map(level=><button disabled={busy} className="btn-secondary" key={level} onClick={()=>rate(level)}>{level===0?"Again":level===5?"Mastered":"Level "+level}</button>)}</div><div className="mt-4 flex gap-4"><button className="underline" disabled={busy} onClick={()=>setIndex((index-1+words.length)%words.length)}>← Previous</button><button className="underline" disabled={busy} onClick={()=>setIndex((index+1)%words.length)}>Next →</button></div></>}
    <p role="status" className="mt-4 text-ocean">{message}</p><a className="btn-secondary mt-6" href="/dashboard/content-library/06-vocabulary">Free vocabulary video lessons →</a>
  </section>;
}

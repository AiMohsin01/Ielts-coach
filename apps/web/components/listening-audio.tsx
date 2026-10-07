"use client";
import {useEffect,useState} from "react";
export function ListeningAudio({transcript,allowTranscript=true}:{transcript:string;allowTranscript?:boolean}){
  const [playing,setPlaying]=useState(false),[error,setError]=useState(""),[show,setShow]=useState(false);
  useEffect(()=>()=>{if("speechSynthesis" in window)window.speechSynthesis.cancel();},[]);
  const play=()=>{setError("");if(!("speechSynthesis" in window)){setError("Browser speech is unavailable. Use another browser or the free listening videos.");return;}window.speechSynthesis.cancel();if(playing){setPlaying(false);return;}const voice=new SpeechSynthesisUtterance(transcript);voice.lang="en-GB";voice.rate=.9;voice.onend=()=>setPlaying(false);voice.onerror=(event)=>{if(["canceled","interrupted"].includes(event.error))return;setPlaying(false);setError("Could not play this browser voice. Try another browser.");};window.speechSynthesis.speak(voice);setPlaying(true);};
  return <section className="listening-audio"><p>Browser-voice warm-up. Synthetic speech, not an official exam recording.</p><div className="feature-actions"><button className="workspace-primary-button" onClick={play}>{playing?"Stop playback":"▶ Play passage"}</button>{allowTranscript&&<button className="workspace-button" aria-expanded={show} onClick={()=>setShow(!show)}>{show?"Hide transcript":"Show transcript"}</button>}</div>{show&&<p className="listening-transcript">{transcript}</p>}{error&&<p role="alert" className="feature-notice error">{error}</p>}</section>;
}

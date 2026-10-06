import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { config } from "../../config.js";
import { speakingSystem, writingSystem } from "./prompts.js";
import type { AiProvider, SpeakingEvaluation, WritingEvaluation } from "./types.js";
export class LocalProvider implements AiProvider {
  private async generate(system:string,prompt:string){const r=await fetch(`${config.localAiBaseUrl}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:config.localAiModel,system,prompt,format:"json",stream:false})});if(!r.ok)throw new Error("Local AI is unavailable. Start Ollama or choose another configured provider.");const x=await r.json() as {response:string};return JSON.parse(x.response)}
  evaluateWriting(input:{prompt:string;category:string;response:string}){return this.generate(writingSystem,`Task category: ${input.category}\nTask: ${input.prompt}\nResponse: ${input.response}`) as Promise<WritingEvaluation>}
  evaluateSpeaking(input:{question:string;part:string;transcript:string}){return this.generate(speakingSystem,`Part: ${input.part}\nQuestion: ${input.question}\nTranscript: ${input.transcript}`) as Promise<SpeakingEvaluation>}
  async transcribeAudio(path:string){if(!config.localTranscriptionUrl)throw new Error("Local transcription is optional but not configured. Set LOCAL_TRANSCRIPTION_URL to a Whisper-compatible service.");const form=new FormData();form.append("file",new Blob([await readFile(path)]),basename(path));const r=await fetch(config.localTranscriptionUrl,{method:"POST",body:form});if(!r.ok)throw new Error("Local transcription service is unavailable.");return (await r.json() as {text:string}).text}
}

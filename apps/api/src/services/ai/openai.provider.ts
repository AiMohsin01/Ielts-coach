import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { config } from "../../config.js";
import type { AiProvider, SpeakingEvaluation, WritingEvaluation } from "./types.js";
import { evaluationSchema, speakingSystem, writingSystem } from "./prompts.js";
export class OpenAiProvider implements AiProvider {
  private key = config.openaiApiKey;
  private async completion(system: string, user: string) { if (!this.key) throw new Error("AI evaluation is not configured. Set OPENAI_API_KEY."); const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${this.key}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: config.evaluationModel, temperature: 0.2, response_format: evaluationSchema, messages: [{ role: "system", content: system }, { role: "user", content: user }] }) }); if (!response.ok) throw new Error(`AI provider error: ${response.status}`); const body = await response.json() as { choices: { message: { content: string } }[] }; return JSON.parse(body.choices[0].message.content); }
  evaluateWriting(input: { prompt: string; category: string; response: string }) { return this.completion(writingSystem, `Writing task category: ${input.category}\nTask: ${input.prompt}\nStudent response:\n${input.response}`) as Promise<WritingEvaluation>; }
  evaluateSpeaking(input: { question: string; part: string; transcript: string }) { return this.completion(speakingSystem, `IELTS ${input.part} question: ${input.question}\nStudent transcript:\n${input.transcript}`) as Promise<SpeakingEvaluation>; }
  async transcribeAudio(filePath: string) { if (!this.key) throw new Error("AI evaluation is not configured. Set OPENAI_API_KEY."); const bytes = await readFile(filePath); const form = new FormData(); form.append("model", config.transcriptionModel); form.append("language", "en"); form.append("file", new Blob([bytes]), basename(filePath)); const response = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${this.key}` }, body: form }); if (!response.ok) throw new Error(`Transcription provider error: ${response.status}`); return (await response.json() as { text: string }).text; }
}

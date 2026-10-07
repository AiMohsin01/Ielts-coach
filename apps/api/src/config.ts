import dotenv from "dotenv";
import { resolve } from "node:path";

// Workspace scripts run from apps/api; local direct runs may use this folder.
dotenv.config({ path: resolve(process.cwd(), "../../.env") });
dotenv.config();

const required = ["DATABASE_URL", "JWT_SECRET"] as const;
for (const key of required) if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);

export const config = {
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  clientUrl: process.env.CLIENT_URL ?? process.env.RENDER_EXTERNAL_URL ?? "http://localhost:3000",
  port: Number(process.env.PORT ?? 4000),
  isProduction: process.env.NODE_ENV === "production",
  aiProvider: process.env.AI_PROVIDER ?? "local",
  localAiBaseUrl: process.env.LOCAL_AI_BASE_URL ?? "http://localhost:11434",
  localAiModel: process.env.LOCAL_AI_MODEL ?? "llama3.2",
  localTranscriptionUrl: process.env.LOCAL_TRANSCRIPTION_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  evaluationModel: process.env.OPENAI_EVALUATION_MODEL ?? "gpt-4.1-mini",
  transcriptionModel: process.env.OPENAI_TRANSCRIPTION_MODEL ?? "gpt-4o-mini-transcribe"
};

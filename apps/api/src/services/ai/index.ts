import { config } from "../../config.js";
import { OpenAiProvider } from "./openai.provider.js";
import { LocalProvider } from "./local.provider.js";
import type { AiProvider } from "./types.js";
export function getAiProvider(): AiProvider { if (config.aiProvider === "local") return new LocalProvider(); if (config.aiProvider === "openai") return new OpenAiProvider(); throw new Error(`Unsupported AI_PROVIDER: ${config.aiProvider}`); }

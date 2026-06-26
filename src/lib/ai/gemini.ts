import { GoogleGenAI } from "@google/genai";
import type { z } from "zod";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export class MissingGeminiApiKeyError extends Error {
  constructor() {
    super("Chưa cấu hình GEMINI_API_KEY trong .env.local");
    this.name = "MissingGeminiApiKeyError";
  }
}

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new MissingGeminiApiKeyError();
  }
  return apiKey;
}

function getGeminiClient() {
  return new GoogleGenAI({ apiKey: getGeminiApiKey() });
}

function stripJsonFence(rawText: string): string {
  return rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

export async function generateJsonFromGemini<T>(prompt: string, responseSchema: z.ZodType<T>): Promise<T> {
  const ai = getGeminiClient();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.7,
      topP: 0.9,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini không trả về nội dung.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(stripJsonFence(text));
  } catch {
    throw new Error("Gemini trả về JSON không hợp lệ.");
  }

  return responseSchema.parse(parsedJson);
}

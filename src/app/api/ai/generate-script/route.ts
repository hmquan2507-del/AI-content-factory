import { NextResponse } from "next/server";
import { MissingGeminiApiKeyError, generateJsonFromGemini } from "@/lib/ai/gemini";
import { createGenerateScriptPrompt } from "@/lib/ai/prompts";
import { GenerateScriptRequestSchema, GenerateScriptResponseSchema } from "@/lib/ai/schemas";
import type { GenerateScriptResponse } from "@/lib/ai/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function normalizeHashtag(hashtag: string): string {
  const normalized = hashtag.trim().replace(/^#+/, "").replace(/\s+/g, "");
  return normalized ? `#${normalized}` : "#AIContent";
}

function normalizeScriptResponse(result: GenerateScriptResponse, durationSeconds = 30): GenerateScriptResponse {
  const slideCount = Math.max(result.slides.length, 1);
  const defaultDuration = Math.max(3, Math.round(durationSeconds / slideCount));

  return {
    ...result,
    slides: result.slides.map((slide, index) => ({
      ...slide,
      id: slide.id?.trim() || `slide-${index + 1}`,
      durationSec: slide.durationSec ?? defaultDuration,
    })),
    hashtags: result.hashtags.map(normalizeHashtag),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = GenerateScriptRequestSchema.parse(body);
    const geminiResult = await generateJsonFromGemini(
      createGenerateScriptPrompt(input),
      GenerateScriptResponseSchema,
    );
    const normalizedResult = normalizeScriptResponse(geminiResult, input.durationSeconds);
    const validatedResult = GenerateScriptResponseSchema.parse(normalizedResult);

    return NextResponse.json(validatedResult);
  } catch (error) {
    if (error instanceof MissingGeminiApiKeyError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dữ liệu gửi lên hoặc JSON Gemini không hợp lệ." }, { status: 400 });
    }

    return NextResponse.json({ error: "Không gọi được Gemini, đang dùng dữ liệu demo." }, { status: 502 });
  }
}

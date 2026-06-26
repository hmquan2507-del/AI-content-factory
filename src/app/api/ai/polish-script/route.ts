import { NextResponse } from "next/server";
import { MissingGeminiApiKeyError, generateJsonFromGemini } from "@/lib/ai/gemini";
import { createPolishScriptPrompt } from "@/lib/ai/prompts";
import { PolishScriptRequestSchema, PolishScriptResponseSchema } from "@/lib/ai/schemas";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = PolishScriptRequestSchema.parse(body);
    const result = await generateJsonFromGemini(createPolishScriptPrompt(input), PolishScriptResponseSchema);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MissingGeminiApiKeyError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dữ liệu gửi lên hoặc JSON Gemini không hợp lệ." }, { status: 400 });
    }

    return NextResponse.json({ error: "Không gọi được Gemini, đang giữ kịch bản hiện tại." }, { status: 502 });
  }
}

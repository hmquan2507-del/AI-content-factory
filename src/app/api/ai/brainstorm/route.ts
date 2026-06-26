import { NextResponse } from "next/server";
import { MissingGeminiApiKeyError, generateJsonFromGemini } from "@/lib/ai/gemini";
import { createBrainstormPrompt } from "@/lib/ai/prompts";
import { BrainstormRequestSchema, BrainstormResponseSchema } from "@/lib/ai/schemas";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = BrainstormRequestSchema.parse(body);
    const result = await generateJsonFromGemini(createBrainstormPrompt(input), BrainstormResponseSchema);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MissingGeminiApiKeyError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
    }

    return NextResponse.json({ error: "Không gọi được Gemini, đang dùng dữ liệu demo." }, { status: 502 });
  }
}

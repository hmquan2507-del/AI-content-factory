export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createContentItem, ContentActionError, listContentItems } from "@/lib/supabase/content-actions";

const PlatformSchema = z.enum(["TikTok", "YouTube Shorts", "Instagram Reels"]);
const ContentStatusSchema = z.enum(["Draft", "Ready", "Published"]);

const VisualKeywordSchema = z.enum([
  "idea",
  "warning",
  "money",
  "rocket",
  "voice",
  "script",
  "chart",
  "user",
  "brain",
  "calendar",
  "camera",
]);

const SlideSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.string(),
  overlayText: z.string(),
  visualDirection: z.string(),
  narration: z.string(),
  subtitle: z.string().optional(),
  visualKeyword: VisualKeywordSchema.optional(),
  bgGradient: z.string().optional(),
  durationSec: z.number().optional(),
});

const CreateContentSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tiêu đề content."),
  rawIdea: z.string().optional(),
  selectedHook: z.string().trim().min(1, "Vui lòng tạo hook trước khi lưu."),
  scriptBody: z.string().optional(),
  visualCues: z.string().optional(),
  slides: z.array(SlideSchema).default([]),
  caption: z.string().optional(),
  hashtags: z.array(z.string()).default([]),
  cta: z.string().optional(),
  platforms: z.array(PlatformSchema).default(["TikTok"]),
  status: ContentStatusSchema.default("Draft"),
});

function getErrorResponse(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message ?? "Dữ liệu content chưa hợp lệ." }, { status: 400 });
  }

  if (error instanceof ContentActionError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof Error && error.message) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ error: "Không thao tác được với Content Library." }, { status: 500 });
}

export async function GET() {
  try {
    const result = await listContentItems();
    return NextResponse.json({ items: result.data, usingFallback: Boolean(result.usingFallback), error: result.error });
  } catch (error) {
    return getErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = CreateContentSchema.parse(body);
    const item = await createContentItem(payload);

    return NextResponse.json({ item });
  } catch (error) {
    return getErrorResponse(error);
  }
}

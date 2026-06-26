import { z } from "zod";

export const PlatformSchema = z.enum(["TikTok", "YouTube Shorts", "Instagram Reels"]);

export const VisualKeywordSchema = z.enum([
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

export const TailwindGradientSchema = z.enum([
  "from-purple-950 via-slate-950 to-black",
  "from-indigo-950 via-slate-950 to-black",
  "from-cyan-950 via-slate-950 to-black",
  "from-rose-950 via-slate-950 to-black",
  "from-emerald-950 via-slate-950 to-black",
]);

export const BrainstormRequestSchema = z.object({
  niche: z.string().trim().min(2, "Vui lòng nhập ngách hoặc chủ đề rõ hơn."),
  tone: z.string().trim().min(2, "Vui lòng nhập tone nội dung."),
  targetAudience: z.string().trim().min(2, "Vui lòng nhập nhóm khách hàng mục tiêu."),
  brandVoice: z.string().trim().optional(),
});

export const BrainstormResponseSchema = z.object({
  title: z.string().trim().min(1),
  rawIdea: z.string().trim().min(1),
  angle: z.string().trim().min(1),
});

export const GeneratedSlideSchema = z.object({
  id: z.string().trim().optional(),
  slideText: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().optional(),
  visualKeyword: VisualKeywordSchema,
  bgGradient: TailwindGradientSchema,
  durationSec: z.number().int().positive().optional(),
});

export const GenerateScriptRequestSchema = z.object({
  rawTitle: z.string().trim().min(1, "Vui lòng nhập tiêu đề."),
  rawIdea: z.string().trim().min(1, "Vui lòng nhập ý tưởng thô."),
  brandVoice: z.string().trim().min(1, "Vui lòng nhập brand voice."),
  targetAudience: z.string().trim().min(1, "Vui lòng nhập target audience."),
  durationSeconds: z.number().int().min(15).max(90).optional(),
  platform: PlatformSchema.optional(),
});

export const GenerateScriptResponseSchema = z.object({
  hooks: z.array(z.string().trim().min(1)).min(1).max(5),
  selectedHook: z.string().trim().min(1),
  scriptBody: z.string().trim().min(1),
  visualCues: z.string().trim().min(1),
  slides: z.array(GeneratedSlideSchema).min(3).max(8),
  caption: z.string().trim().min(1),
  hashtags: z.array(z.string().trim().min(1)).min(1).max(12),
  cta: z.string().trim().min(1),
});

export const PolishScriptRequestSchema = z.object({
  scriptBody: z.string().trim().min(10, "Kịch bản quá ngắn để tối ưu."),
  directive: z.string().trim().min(2, "Vui lòng nhập yêu cầu tối ưu."),
  brandVoice: z.string().trim().min(1, "Vui lòng nhập brand voice."),
  targetAudience: z.string().trim().min(1, "Vui lòng nhập target audience."),
});

export const PolishScriptResponseSchema = z.object({
  optimizedScript: z.string().trim().min(1),
  improvedHook: z.string().trim().optional(),
  notes: z.array(z.string().trim().min(1)).min(1).max(6),
});

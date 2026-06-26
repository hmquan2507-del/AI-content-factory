import type { ContentItem, ContentStatus, Platform, SaveContentInput, SlideItem } from "@/lib/types";
import { createServerSupabaseClient, SupabaseConfigError } from "./server";
import type { ContentItemInsert, ContentItemRow, ContentItemUpdate } from "./database.types";

export type ContentActionResult<T> = {
  data: T;
  usingFallback?: boolean;
  error?: string;
};

export class ContentActionError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ContentActionError";
    this.status = status;
  }
}

const statusToDb: Record<ContentStatus, Lowercase<ContentStatus>> = {
  Draft: "draft",
  Ready: "ready",
  Published: "published",
};

const statusFromDb: Record<string, ContentStatus> = {
  draft: "Draft",
  ready: "Ready",
  published: "Published",
};

const allowedPlatforms: Platform[] = ["TikTok", "YouTube Shorts", "Instagram Reels"];

function getDateLabel(isoDate: string): string {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(isoDate));
}

function normalizePlatform(value: string | null | undefined): Platform {
  if (value && allowedPlatforms.includes(value as Platform)) {
    return value as Platform;
  }

  return "TikTok";
}

function normalizePlatforms(platforms: string[] | null | undefined): Platform[] {
  const normalized = (platforms ?? [])
    .map((platform) => normalizePlatform(platform))
    .filter((platform, index, arr) => arr.indexOf(platform) === index);

  return normalized.length ? normalized : ["TikTok"];
}

function normalizeStatus(status: string | null | undefined): ContentStatus {
  return statusFromDb[(status ?? "draft").toLowerCase()] ?? "Draft";
}

function getHook(row: ContentItemRow): string {
  return row.selected_hook || row.script_body?.split(".")[0] || "Chưa có hook.";
}

function ensureSlides(slides: unknown): SlideItem[] {
  if (!Array.isArray(slides)) return [];
  return slides.filter(Boolean) as SlideItem[];
}

export function mapContentRowToItem(row: ContentItemRow): ContentItem {
  const platforms = normalizePlatforms(row.platforms);

  return {
    id: row.id,
    title: row.title,
    hook: getHook(row),
    platform: platforms[0],
    platforms,
    status: normalizeStatus(row.status),
    createdAt: getDateLabel(row.created_at),
    updatedAt: getDateLabel(row.updated_at),
    rawIdea: row.raw_idea ?? undefined,
    scriptBody: row.script_body ?? undefined,
    visualCues: row.visual_cues ?? undefined,
    slides: ensureSlides(row.slides),
    caption: row.caption ?? undefined,
    hashtags: row.hashtags ?? [],
    cta: row.cta ?? undefined,
    audioUrl: row.audio_url,
    videoUrl: row.video_url,
  };
}

function toInsertPayload(input: SaveContentInput): ContentItemInsert {
  const title = input.title.trim();
  const platforms: Platform[] = input.platforms.length ? input.platforms : ["TikTok"];

  return {
    title,
    raw_idea: input.rawIdea?.trim() || null,
    selected_hook: input.selectedHook?.trim() || null,
    script_body: input.scriptBody?.trim() || null,
    visual_cues: input.visualCues?.trim() || null,
    slides: input.slides ?? [],
    caption: input.caption?.trim() || null,
    hashtags: input.hashtags ?? [],
    cta: input.cta?.trim() || null,
    platforms,
    status: statusToDb[input.status] ?? "draft",
  };
}

function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof SupabaseConfigError) return error.message;
  if (error instanceof ContentActionError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Không thao tác được với Supabase.";
}

export async function listContentItems(): Promise<ContentActionResult<ContentItem[]>> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("content_items").select("*").order("created_at", { ascending: false });

    if (error) throw new ContentActionError(error.message, 500);

    return { data: (data ?? []).map(mapContentRowToItem) };
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return { data: [], usingFallback: true, error: error.message };
    }

    throw new ContentActionError(getSupabaseErrorMessage(error), error instanceof ContentActionError ? error.status : 500);
  }
}

export async function createContentItem(input: SaveContentInput): Promise<ContentItem> {
  if (!input.title.trim()) {
    throw new ContentActionError("Vui lòng nhập tiêu đề content.", 400);
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("content_items").insert(toInsertPayload(input)).select().single();

    if (error) throw new ContentActionError(error.message, 500);
    if (!data) throw new ContentActionError("Supabase không trả về content vừa tạo.", 500);

    return mapContentRowToItem(data);
  } catch (error) {
    throw new ContentActionError(getSupabaseErrorMessage(error), error instanceof ContentActionError ? error.status : 500);
  }
}

export async function updateContentStatus(id: string, status: ContentStatus): Promise<ContentItem> {
  if (!id) throw new ContentActionError("Thiếu content id.", 400);

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("content_items")
      .update({ status: statusToDb[status] } satisfies ContentItemUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new ContentActionError(error.message, 500);
    if (!data) throw new ContentActionError("Không tìm thấy content cần cập nhật.", 404);

    return mapContentRowToItem(data);
  } catch (error) {
    throw new ContentActionError(getSupabaseErrorMessage(error), error instanceof ContentActionError ? error.status : 500);
  }
}

export async function deleteContentItem(id: string): Promise<void> {
  if (!id) throw new ContentActionError("Thiếu content id.", 400);

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("content_items").delete().eq("id", id);

    if (error) throw new ContentActionError(error.message, 500);
  } catch (error) {
    throw new ContentActionError(getSupabaseErrorMessage(error), error instanceof ContentActionError ? error.status : 500);
  }
}

export async function duplicateContentItem(id: string): Promise<ContentItem> {
  if (!id) throw new ContentActionError("Thiếu content id.", 400);

  try {
    const supabase = createServerSupabaseClient();
    const { data: source, error: readError } = await supabase.from("content_items").select("*").eq("id", id).single();

    if (readError) throw new ContentActionError(readError.message, 500);
    if (!source) throw new ContentActionError("Không tìm thấy content cần nhân bản.", 404);

    const insertPayload: ContentItemInsert = {
      title: `${source.title} (Copy)`,
      raw_idea: source.raw_idea,
      selected_hook: source.selected_hook,
      script_body: source.script_body,
      visual_cues: source.visual_cues,
      slides: ensureSlides(source.slides),
      caption: source.caption,
      hashtags: source.hashtags ?? [],
      cta: source.cta,
      platforms: normalizePlatforms(source.platforms),
      status: "draft",
      audio_url: source.audio_url,
      video_url: source.video_url,
    };

    const { data, error } = await supabase.from("content_items").insert(insertPayload).select().single();

    if (error) throw new ContentActionError(error.message, 500);
    if (!data) throw new ContentActionError("Supabase không trả về content vừa nhân bản.", 500);

    return mapContentRowToItem(data);
  } catch (error) {
    throw new ContentActionError(getSupabaseErrorMessage(error), error instanceof ContentActionError ? error.status : 500);
  }
}

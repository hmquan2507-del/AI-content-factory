import type { ContentItem, ContentStatus, SaveContentInput } from "./types";

export type ContentListResponse = {
  items: ContentItem[];
  usingFallback?: boolean;
  error?: string;
};

type ContentItemResponse = {
  item: ContentItem;
};

type ApiErrorPayload = {
  error?: string;
};

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as unknown;

  if (!response.ok) {
    const errorPayload = data as ApiErrorPayload;
    throw new Error(errorPayload.error || "Không thao tác được với Content Library.");
  }

  return data as T;
}

export async function fetchContentItems(): Promise<ContentListResponse> {
  const response = await fetch("/api/content", { method: "GET" });
  return readJson<ContentListResponse>(response);
}

export async function createContent(input: SaveContentInput): Promise<ContentItem> {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await readJson<ContentItemResponse>(response);
  return data.item;
}

export async function updateContentStatusApi(id: string, status: ContentStatus): Promise<ContentItem> {
  const response = await fetch(`/api/content/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await readJson<ContentItemResponse>(response);
  return data.item;
}

export async function deleteContentApi(id: string): Promise<void> {
  const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
  await readJson<{ success: boolean }>(response);
}

export async function duplicateContentApi(id: string): Promise<ContentItem> {
  const response = await fetch(`/api/content/${id}/duplicate`, { method: "POST" });
  const data = await readJson<ContentItemResponse>(response);
  return data.item;
}

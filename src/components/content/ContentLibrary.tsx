"use client";

import { Archive, CheckCircle2, Database, Info, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContentCard } from "./ContentCard";
import type { ContentItem, ContentStatus } from "@/lib/types";

type ContentLibrarySource = "demo" | "supabase" | "local";

type ContentLibraryProps = {
  items: ContentItem[];
  source: ContentLibrarySource;
  isLoading: boolean;
  busyItemId?: string | null;
  selectedItem?: ContentItem | null;
  onView: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onStatusChange: (item: ContentItem, status: ContentStatus) => void;
  onRefresh: () => void;
};

const sourceCopy: Record<ContentLibrarySource, { label: string; description: string; tone: "cyan" | "green" | "neutral" }> = {
  demo: {
    label: "Demo data",
    description: "Chưa có Supabase hoặc chưa có dữ liệu, đang hiển thị nội dung mẫu.",
    tone: "neutral",
  },
  supabase: {
    label: "Supabase connected",
    description: "Kho nội dung đang đọc và ghi dữ liệu thật từ Supabase.",
    tone: "green",
  },
  local: {
    label: "Local fallback",
    description: "Supabase đang lỗi, nội dung mới được lưu tạm trong phiên trình duyệt.",
    tone: "cyan",
  },
};

export function ContentLibrary({
  items,
  source,
  isLoading,
  busyItemId,
  selectedItem,
  onView,
  onDuplicate,
  onDelete,
  onStatusChange,
  onRefresh,
}: ContentLibraryProps) {
  const sourceMeta = sourceCopy[source];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanSoft-300">Library</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Kho nội dung đã tạo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Lưu lại các ý tưởng, kịch bản và video slide để quản lý nội dung dễ hơn. Phase 3 đã có Supabase fallback an toàn.
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-white">Danh sách content</h3>
              <Badge tone={sourceMeta.tone}>{sourceMeta.label}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-400">{isLoading ? "Đang tải dữ liệu..." : `${items.length} nội dung trong kho hiện tại`}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{sourceMeta.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
              {isLoading ? "Đang tải..." : "Tải lại"}
            </Button>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-aurora-500/12 text-aurora-300">
              {isLoading ? <Loader2 className="size-6 animate-spin" /> : source === "supabase" ? <Database className="size-6" /> : <Archive className="size-6" />}
            </div>
          </div>
        </div>

        {source !== "supabase" ? (
          <div className="mt-5 flex gap-3 rounded-3xl border border-cyanSoft-300/15 bg-cyanSoft-500/10 p-4 text-sm leading-6 text-slate-300">
            <Info className="mt-0.5 size-5 shrink-0 text-cyanSoft-300" />
            <p>
              Để dùng dữ liệu thật, tạo bảng bằng file <span className="font-bold text-white">supabase/schema.sql</span> rồi cấu hình
              <span className="font-bold text-white"> NEXT_PUBLIC_SUPABASE_URL</span> và
              <span className="font-bold text-white"> NEXT_PUBLIC_SUPABASE_ANON_KEY</span> trong <span className="font-bold text-white">.env.local</span>.
            </p>
          </div>
        ) : null}

        <div className="mt-5 grid gap-3">
          {items.length ? (
            items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                isBusy={busyItemId === item.id}
                onView={onView}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center">
              <p className="font-bold text-white">Kho nội dung đang trống</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Hãy quay lại Factory và bấm “Lưu vào kho nội dung”.</p>
            </div>
          )}
        </div>
      </Card>

      {selectedItem ? (
        <Card className="border-cyanSoft-300/20 bg-cyanSoft-500/5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 size-5 shrink-0 text-cyanSoft-300" />
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyanSoft-300">Xem nhanh content</p>
              <h3 className="mt-2 text-xl font-black text-white">{selectedItem.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedItem.hook}</p>
              {selectedItem.scriptBody ? (
                <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Script</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-300">{selectedItem.scriptBody}</p>
                </div>
              ) : null}
              {selectedItem.hashtags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedItem.hashtags.map((hashtag) => (
                    <span key={hashtag} className="rounded-full bg-cyanSoft-500/10 px-3 py-1 text-xs font-bold text-cyanSoft-300">
                      {hashtag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

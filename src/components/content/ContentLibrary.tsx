"use client";

import { Archive } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ContentCard } from "./ContentCard";
import type { ContentItem } from "@/lib/types";

type ContentLibraryProps = {
  items: ContentItem[];
  onView: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
};

export function ContentLibrary({ items, onView, onDuplicate, onDelete }: ContentLibraryProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanSoft-300">Library</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Kho nội dung đã tạo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Lưu lại các ý tưởng, kịch bản và video slide demo để quản lý nội dung dễ hơn.
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white">Danh sách content demo</h3>
            <p className="mt-1 text-sm text-slate-400">{items.length} nội dung trong kho hiện tại</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-aurora-500/12 text-aurora-300">
            <Archive className="size-6" />
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {items.length ? (
            items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onView={onView}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
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
    </div>
  );
}

import { Copy, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ContentItem, ContentStatus } from "@/lib/types";

const statuses: ContentStatus[] = ["Draft", "Ready", "Published"];

type ContentCardProps = {
  item: ContentItem;
  isBusy?: boolean;
  onView: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onStatusChange: (item: ContentItem, status: ContentStatus) => void;
};

const statusTone: Record<ContentStatus, "neutral" | "green" | "cyan"> = {
  Draft: "neutral",
  Ready: "green",
  Published: "cyan",
};

export function ContentCard({ item, isBusy = false, onView, onDuplicate, onDelete, onStatusChange }: ContentCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 transition hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[item.status]}>{item.status}</Badge>
            <Badge tone="purple">{item.platform}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-black leading-7 text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{item.hook}</p>
          {item.caption ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">Caption: {item.caption}</p> : null}
        </div>
        <p className="shrink-0 text-sm text-slate-500">{item.createdAt}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          Trạng thái
          <select
            value={item.status}
            disabled={isBusy}
            onChange={(event) => onStatusChange(item, event.target.value as ContentStatus)}
            className="cursor-pointer rounded-2xl border border-white/10 bg-ink-900 px-3 py-2 text-sm font-bold text-white outline-none transition hover:border-cyanSoft-300/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" icon={<Eye className="size-4" />} onClick={() => onView(item)} disabled={isBusy}>
            View
          </Button>
          <Button variant="ghost" size="sm" icon={<Copy className="size-4" />} onClick={() => onDuplicate(item)} disabled={isBusy}>
            {isBusy ? "Đang xử lý" : "Duplicate"}
          </Button>
          <Button variant="danger" size="sm" icon={<Trash2 className="size-4" />} onClick={() => onDelete(item)} disabled={isBusy}>
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

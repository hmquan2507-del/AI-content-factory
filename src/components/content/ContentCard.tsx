import { Copy, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ContentItem, ContentStatus } from "@/lib/types";

type ContentCardProps = {
  item: ContentItem;
  onView: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
};

const statusTone: Record<ContentStatus, "neutral" | "green" | "cyan"> = {
  Draft: "neutral",
  Ready: "green",
  Published: "cyan",
};

export function ContentCard({ item, onView, onDuplicate, onDelete }: ContentCardProps) {
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
        </div>
        <p className="shrink-0 text-sm text-slate-500">{item.createdAt}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" icon={<Eye className="size-4" />} onClick={() => onView(item)}>
          View
        </Button>
        <Button variant="ghost" size="sm" icon={<Copy className="size-4" />} onClick={() => onDuplicate(item)}>
          Duplicate
        </Button>
        <Button variant="danger" size="sm" icon={<Trash2 className="size-4" />} onClick={() => onDelete(item)}>
          Delete
        </Button>
      </div>
    </article>
  );
}

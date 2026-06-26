import { Brain, Calendar, Camera, ChartNoAxesColumn, DollarSign, Lightbulb, Mic2, Play, Rocket, ScrollText, Smartphone, TriangleAlert, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SlideItem, VisualKeyword } from "@/lib/types";
import { cn } from "@/lib/utils";

type VideoPreviewPanelProps = { title: string; slides: SlideItem[]; activeSlideIndex: number };
const gradientMap: Record<string, string> = {
  "from-purple-950 via-slate-950 to-black": "from-purple-950 via-slate-950 to-black",
  "from-indigo-950 via-slate-950 to-black": "from-indigo-950 via-slate-950 to-black",
  "from-cyan-950 via-slate-950 to-black": "from-cyan-950 via-slate-950 to-black",
  "from-rose-950 via-slate-950 to-black": "from-rose-950 via-slate-950 to-black",
  "from-emerald-950 via-slate-950 to-black": "from-emerald-950 via-slate-950 to-black",
};
const visualIconMap: Record<VisualKeyword, typeof Lightbulb> = { idea: Lightbulb, warning: TriangleAlert, money: DollarSign, rocket: Rocket, voice: Mic2, script: ScrollText, chart: ChartNoAxesColumn, user: User, brain: Brain, calendar: Calendar, camera: Camera };
function getPreviewTitle(slide?: SlideItem) {
  if (!slide?.overlayText) return "5 CÁCH AI GIÚP BẠN\nLÀM NỘI DUNG\nNHANH HƠN\nMỖI NGÀY";
  const words = slide.overlayText.toUpperCase().split(" ");
  const lines = [];
  for (let index = 0; index < words.length; index += 4) lines.push(words.slice(index, index + 4).join(" "));
  return lines.slice(0, 4).join("\n");
}

export function VideoPreviewPanel({ title, slides, activeSlideIndex }: VideoPreviewPanelProps) {
  const activeSlide = slides[activeSlideIndex] ?? slides[0];
  const gradientClass = gradientMap[activeSlide?.bgGradient ?? ""] ?? "from-indigo-950 via-slate-950 to-black";
  const VisualIcon = activeSlide?.visualKeyword ? visualIconMap[activeSlide.visualKeyword] : Smartphone;
  const previewTitle = getPreviewTitle(activeSlide);
  return (
    <Card className="border-white/10 bg-[#0D111C]/90">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="text-lg font-black text-white">Xem trước video</h2><p className="mt-1 text-sm text-slate-400">Khung dọc tối ưu TikTok, Shorts, Reels.</p></div>
        <Badge tone="purple">9:16</Badge>
      </div>
      <div className="mx-auto mt-5 max-w-[286px]">
        <div className="rounded-[2.25rem] border border-white/10 bg-gradient-to-b from-white/12 to-white/[0.03] p-2 shadow-glow">
          <div className={cn("aspect-[9/16] overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br p-4", gradientClass)}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.35rem] bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,.24),transparent_34%),radial-gradient(circle_at_88%_4%,rgba(139,92,246,.36),transparent_34%)] p-4">
              <div className="absolute -left-14 top-24 size-44 rounded-full bg-violet-500/24 blur-3xl" />
              <div className="absolute -right-16 bottom-10 size-44 rounded-full bg-cyan-400/18 blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,.14),transparent_26%,rgba(255,255,255,.04)_66%,transparent)]" />
              <div className="relative z-10 flex items-center justify-between"><span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/85">AI Studio</span><span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/75">0:00</span></div>
              <div className="relative z-10 space-y-4">
                <div className="flex size-14 items-center justify-center rounded-[1.25rem] border border-white/12 bg-white/10 text-cyanSoft-300 shadow-glow"><VisualIcon className="size-7" /></div>
                <h3 className="whitespace-pre-line text-[1.7rem] font-black uppercase leading-[1.02] tracking-tight text-white drop-shadow-sm">{previewTitle}</h3>
                <p className="max-w-[210px] text-sm font-medium leading-5 text-slate-200">{activeSlide?.subtitle || "Làm thông minh hơn, không phải chăm chỉ hơn."}</p>
              </div>
              <div className="relative z-10">
                <p className="mb-2 line-clamp-1 text-[11px] font-bold text-white/75">{title || "AI Content Factory"}</p>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/32 px-3 py-2"><Play className="size-3.5 fill-white text-white" /><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full w-2/5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" /></div><span className="text-[10px] font-bold text-white/80">0:32</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

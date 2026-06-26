import { Brain, Calendar, Camera, ChartNoAxesColumn, DollarSign, Lightbulb, Mic2, Rocket, ScrollText, Smartphone, TriangleAlert, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SlideItem, VisualKeyword } from "@/lib/types";
import { cn } from "@/lib/utils";

type SlideVideoPreviewProps = {
  title: string;
  slides: SlideItem[];
  activeSlideIndex: number;
};

const gradientMap: Record<string, string> = {
  "from-purple-950 via-slate-950 to-black": "from-purple-950 via-slate-950 to-black",
  "from-indigo-950 via-slate-950 to-black": "from-indigo-950 via-slate-950 to-black",
  "from-cyan-950 via-slate-950 to-black": "from-cyan-950 via-slate-950 to-black",
  "from-rose-950 via-slate-950 to-black": "from-rose-950 via-slate-950 to-black",
  "from-emerald-950 via-slate-950 to-black": "from-emerald-950 via-slate-950 to-black",
};

const visualIconMap: Record<VisualKeyword, typeof Lightbulb> = {
  idea: Lightbulb,
  warning: TriangleAlert,
  money: DollarSign,
  rocket: Rocket,
  voice: Mic2,
  script: ScrollText,
  chart: ChartNoAxesColumn,
  user: User,
  brain: Brain,
  calendar: Calendar,
  camera: Camera,
};

export function SlideVideoPreview({ title, slides, activeSlideIndex }: SlideVideoPreviewProps) {
  const activeSlide = slides[activeSlideIndex] ?? slides[0];
  const gradientClass = gradientMap[activeSlide?.bgGradient ?? ""] ?? "from-ink-850 via-ink-900 to-ink-950";
  const VisualIcon = activeSlide?.visualKeyword ? visualIconMap[activeSlide.visualKeyword] : Smartphone;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <Badge tone="purple">9:16 Preview</Badge>
          <h2 className="mt-3 text-lg font-black text-white">Xem trước video slide</h2>
        </div>
        <Smartphone className="size-5 text-cyanSoft-300" />
      </div>

      <div className="mx-auto mt-5 max-w-[260px]">
        <div className={cn("aspect-[9/16] overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br p-3 shadow-glow", gradientClass)}>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.45rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(139,92,246,.34),transparent_38%),linear-gradient(180deg,rgba(34,211,238,.12),rgba(7,10,19,.82))] p-4">
            <div className="absolute -right-10 top-10 size-32 rounded-full bg-cyanSoft-500/20 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-aurora-500/25 blur-3xl" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-bold text-white/85">AI Factory</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/70">{activeSlide?.duration}</span>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-cyanSoft-300">
                <VisualIcon className="size-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanSoft-300">Slide {activeSlideIndex + 1}</p>
              <h3 className="text-2xl font-black leading-tight text-white">
                {activeSlide?.overlayText ?? "Nhập ý tưởng để xem preview"}
              </h3>
              <p className="text-xs leading-5 text-slate-300">{activeSlide?.subtitle || activeSlide?.narration}</p>
            </div>

            <div className="relative z-10">
              <div className="mb-3 flex gap-1.5">
                {slides.map((slide, index) => (
                  <span
                    key={slide.id}
                    className={index <= activeSlideIndex ? "h-1.5 flex-1 rounded-full bg-cyanSoft-300" : "h-1.5 flex-1 rounded-full bg-white/15"}
                  />
                ))}
              </div>
              <p className="line-clamp-2 text-[11px] font-semibold text-white/80">{title || "Video demo chưa đặt tiêu đề"}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

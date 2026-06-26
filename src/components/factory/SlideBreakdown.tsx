import { ChevronRight, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SlideItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type SlideBreakdownProps = { slides: SlideItem[]; activeSlideIndex: number; onSlideSelect: (index: number) => void };

export function SlideBreakdown({ slides, activeSlideIndex, onSlideSelect }: SlideBreakdownProps) {
  return (
    <Card className="overflow-hidden border-white/10 bg-[#0D111C]/90 p-0">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
        <div>
          <div className="flex items-center gap-2"><Badge tone="cyan">Slide Breakdown</Badge><span className="text-xs text-slate-500">{slides.length} slides</span></div>
          <h2 className="mt-3 text-lg font-black tracking-tight text-white">Cảnh quay dạng slide</h2>
        </div>
        <ChevronRight className="size-5 text-slate-500" />
      </div>
      <div className="flex gap-3 overflow-x-auto p-4 scrollbar-soft sm:p-5">
        {slides.map((slide, index) => {
          const isActive = activeSlideIndex === index;
          return (
            <button key={slide.id} type="button" onClick={() => onSlideSelect(index)} className={cn("min-w-[210px] cursor-pointer rounded-3xl border p-4 text-left transition active:scale-[0.99]", isActive ? "border-cyanSoft-300/45 bg-cyanSoft-500/12 shadow-glow" : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]")}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.07] text-cyanSoft-300"><Layers3 className="size-5" /></div>
                <span className="rounded-full bg-black/25 px-2.5 py-1 text-xs font-bold text-slate-300">{slide.durationSec ? `${slide.durationSec}s` : slide.duration}</span>
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Slide {index + 1}</p>
              <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-white">{slide.overlayText}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{slide.visualDirection}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

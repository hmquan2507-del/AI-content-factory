import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SlideItem } from "@/lib/types";

type Phase2ScriptPreviewProps = {
  hooks: string[];
  selectedHook: string;
  script: string;
  slides: SlideItem[];
  caption?: string;
  hashtags?: string[];
  cta?: string;
  polishNotes: string[];
  isReady: boolean;
  isPolishing: boolean;
  onPolishScript: () => void;
  onGenerateVoice: () => void;
};

export function Phase2ScriptPreview({
  hooks,
  selectedHook,
  script,
  slides,
  caption,
  hashtags,
  cta,
  polishNotes,
  isReady,
  isPolishing,
  onPolishScript,
  onGenerateVoice,
}: Phase2ScriptPreviewProps) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone={isReady ? "green" : "neutral"}>{isReady ? "Đã tạo kịch bản" : "Chưa tạo"}</Badge>
          <h2 className="mt-3 text-xl font-black tracking-tight text-white">Hook + kịch bản + chia slide</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Phase 2 ưu tiên output từ Gemini. Nếu API lỗi hoặc thiếu key, app tự dùng dữ liệu demo để không bị crash.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:min-w-52">
          <Button
            variant="secondary"
            size="lg"
            icon={<Sparkles className="size-5" />}
            onClick={onPolishScript}
            disabled={!isReady || isPolishing}
          >
            {isPolishing ? "Đang tối ưu..." : "Tối ưu kịch bản"}
          </Button>
          <Button variant="primary" size="lg" icon={<ArrowRight className="size-5" />} onClick={onGenerateVoice} disabled={isPolishing}>
            Tạo giọng đọc demo
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="rounded-3xl border border-aurora-400/20 bg-aurora-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-aurora-300">
            <FileText className="size-4" /> Hook được chọn
          </div>
          <p className="mt-3 text-base font-semibold leading-7 text-white">{selectedHook}</p>
          {hooks.length > 1 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {hooks.map((hook, index) => (
                <span key={`${hook}-${index}`} className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-slate-300">
                  Hook {index + 1}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-bold text-slate-200">Kịch bản voice-over</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-300">{script}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {slides.map((slide) => (
            <article key={slide.id} className="rounded-3xl border border-white/10 bg-ink-900/45 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black text-white">{slide.title}</h3>
                <Badge tone="cyan">{slide.duration}</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-cyanSoft-300">{slide.overlayText}</p>
              {slide.subtitle ? <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">{slide.subtitle}</p> : null}
              <p className="mt-3 text-xs leading-5 text-slate-500">{slide.visualDirection}</p>
            </article>
          ))}
        </div>

        {(caption || hashtags?.length || cta) ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm font-bold text-white">Caption / CTA</p>
            {caption ? <p className="mt-2 text-sm leading-6 text-slate-300">{caption}</p> : null}
            {hashtags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {hashtags.map((hashtag) => (
                  <span key={hashtag} className="rounded-full bg-cyanSoft-500/10 px-3 py-1 text-xs font-bold text-cyanSoft-300">
                    {hashtag}
                  </span>
                ))}
              </div>
            ) : null}
            {cta ? <p className="mt-3 text-sm font-bold text-aurora-300">CTA: {cta}</p> : null}
          </div>
        ) : null}

        {polishNotes.length ? (
          <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-4">
            <p className="text-sm font-bold text-emerald-200">Ghi chú tối ưu</p>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
              {polishNotes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

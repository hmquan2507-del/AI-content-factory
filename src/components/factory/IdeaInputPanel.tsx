import { Lightbulb, Sparkles, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ideaPresets } from "@/lib/demo-data";
import type { IdeaPreset, Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

type IdeaInputPanelProps = {
  title: string;
  rawIdea: string;
  platform: Platform;
  selectedTone: string;
  isBrainstorming: boolean;
  isGeneratingScript: boolean;
  onTitleChange: (value: string) => void;
  onRawIdeaChange: (value: string) => void;
  onPlatformChange: (value: Platform) => void;
  onToneChange: (value: string) => void;
  onPresetSelect: (preset: IdeaPreset) => void;
  onBrainstormIdea: () => void;
  onGenerateScript: () => void;
};

const platforms: Platform[] = ["TikTok", "YouTube Shorts", "Instagram Reels"];
const toneOptions = ["Thân thiện, truyền cảm hứng", "Kịch tính", "Chuyên gia", "Bán hàng mạnh"];

export function IdeaInputPanel({
  title,
  rawIdea,
  platform,
  selectedTone,
  isBrainstorming,
  isGeneratingScript,
  onTitleChange,
  onRawIdeaChange,
  onPlatformChange,
  onToneChange,
  onPresetSelect,
  onBrainstormIdea,
  onGenerateScript,
}: IdeaInputPanelProps) {
  const isBusy = isBrainstorming || isGeneratingScript;
  return (
    <Card className="overflow-hidden border-white/10 bg-[#0D111C]/90 p-0">
      <div className="border-b border-white/10 bg-gradient-to-r from-white/[0.075] to-transparent px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="purple">Bước 1</Badge>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Create Studio</span>
            </div>
            <h2 className="mt-3 text-xl font-black tracking-tight text-white">Nhập ý tưởng thô</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">Ghi nhanh điều bạn muốn nói. Gemini sẽ biến brief này thành hook, script và slide.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" icon={<Lightbulb className="size-4" />} disabled={isBusy} onClick={() => onPresetSelect(ideaPresets[0])}>
              Dùng mẫu
            </Button>
            <Button variant="ghost" icon={<Sparkles className="size-4" />} disabled={isBusy} onClick={onBrainstormIdea}>
              {isBrainstorming ? "Đang gọi Gemini..." : "Gợi ý AI"}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="grid gap-4">
            <Input id="content-title" label="Tiêu đề" placeholder="Ví dụ: 5 cách AI giúp bạn làm nội dung nhanh hơn" value={title} onChange={(event) => onTitleChange(event.target.value)} />
            <Textarea id="raw-idea" label="Ý tưởng / ghi chú thô" placeholder="Nhập vấn đề, sản phẩm, khách hàng mục tiêu, CTA..." value={rawIdea} onChange={(event) => onRawIdeaChange(event.target.value)} rows={7} />
          </div>
          <div className="grid content-start gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-200">Nền tảng</span>
              <select value={platform} disabled={isBusy} onChange={(event) => onPlatformChange(event.target.value as Platform)} className="min-h-12 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyanSoft-300/50 disabled:cursor-not-allowed disabled:opacity-60">
                {platforms.map((item) => <option key={item} value={item} className="bg-slate-950 text-white">{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-200">Tông giọng</span>
              <select value={selectedTone} disabled={isBusy} onChange={(event) => onToneChange(event.target.value)} className="min-h-12 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyanSoft-300/50 disabled:cursor-not-allowed disabled:opacity-60">
                {toneOptions.map((tone) => <option key={tone} value={tone} className="bg-slate-950 text-white">{tone}</option>)}
              </select>
            </label>
            <Button variant="primary" size="lg" className="mt-1 w-full" icon={<WandSparkles className="size-5" />} disabled={isBusy} onClick={onGenerateScript}>
              {isGeneratingScript ? "Đang tạo kịch bản..." : "Tạo kịch bản"}
            </Button>
          </div>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1 scrollbar-soft">
          {ideaPresets.map((preset) => (
            <button key={preset.id} type="button" disabled={isBusy} onClick={() => onPresetSelect(preset)} className={cn("min-w-[230px] cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55", "hover:-translate-y-0.5 hover:border-violet-400/35 hover:bg-violet-500/10")}>
              <Badge tone="neutral">{preset.label}</Badge>
              <h3 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-white">{preset.title}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{preset.rawIdea}</p>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

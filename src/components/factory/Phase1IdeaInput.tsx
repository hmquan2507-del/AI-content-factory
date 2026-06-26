import { Lightbulb, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { ideaPresets } from "@/lib/demo-data";
import type { IdeaPreset, Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase1IdeaInputProps = {
  title: string;
  rawIdea: string;
  platform: Platform;
  isBrainstorming: boolean;
  isGeneratingScript: boolean;
  onTitleChange: (value: string) => void;
  onRawIdeaChange: (value: string) => void;
  onPlatformChange: (value: Platform) => void;
  onPresetSelect: (preset: IdeaPreset) => void;
  onBrainstormIdea: () => void;
  onGenerateScript: () => void;
};

const platforms: Platform[] = ["TikTok", "YouTube Shorts", "Instagram Reels"];

export function Phase1IdeaInput({
  title,
  rawIdea,
  platform,
  isBrainstorming,
  isGeneratingScript,
  onTitleChange,
  onRawIdeaChange,
  onPlatformChange,
  onPresetSelect,
  onBrainstormIdea,
  onGenerateScript,
}: Phase1IdeaInputProps) {
  const isBusy = isBrainstorming || isGeneratingScript;

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="purple">Phase 1</Badge>
          <h2 className="mt-3 text-xl font-black tracking-tight text-white">Nhập ý tưởng thô</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Viết ý tưởng chưa cần hay. Phase 2 có thể gọi Gemini server-side để gợi ý ý tưởng và tạo kịch bản thật.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:min-w-52">
          <Button
            variant="secondary"
            size="lg"
            icon={<Lightbulb className="size-5" />}
            onClick={onBrainstormIdea}
            disabled={isBusy}
          >
            {isBrainstorming ? "Đang gọi Gemini..." : "Gợi ý ý tưởng AI"}
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon={<WandSparkles className="size-5" />}
            onClick={onGenerateScript}
            disabled={isBusy}
          >
            {isGeneratingScript ? "Đang tạo kịch bản..." : "Tạo kịch bản"}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <Input
          id="content-title"
          label="Tiêu đề nội dung"
          placeholder="Ví dụ: 3 cách mở đầu video bán hàng cuốn hơn"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
        <Textarea
          id="raw-idea"
          label="Ý tưởng thô"
          placeholder="Nhập vấn đề, sản phẩm, khách hàng mục tiêu, CTA..."
          value={rawIdea}
          onChange={(event) => onRawIdeaChange(event.target.value)}
          hint="Nếu chưa có API key, app sẽ báo lỗi rõ ràng và vẫn dùng dữ liệu demo fallback."
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-slate-200">Nền tảng đăng</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {platforms.map((item) => (
            <button
              key={item}
              onClick={() => onPlatformChange(item)}
              disabled={isBusy}
              className={cn(
                "min-h-11 cursor-pointer rounded-2xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
                platform === item
                  ? "border-cyanSoft-300/40 bg-cyanSoft-500/12 text-cyanSoft-300"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-slate-200">Preset demo</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {ideaPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset)}
              disabled={isBusy}
              className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-0.5 hover:border-aurora-400/30 hover:bg-aurora-500/10 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Badge tone="neutral">{preset.label}</Badge>
              <h3 className="mt-3 text-sm font-black leading-5 text-white">{preset.title}</h3>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{preset.rawIdea}</p>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

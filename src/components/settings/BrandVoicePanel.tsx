"use client";

import { Mic2, Palette } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { defaultBrandSettings } from "@/lib/demo-data";
import type { BrandSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

type BrandVoicePanelProps = {
  settings: BrandSettings;
  onSettingsChange: (settings: BrandSettings) => void;
  onToast: (message: string) => void;
};

export function BrandVoicePanel({ settings, onSettingsChange, onToast }: BrandVoicePanelProps) {
  const selectedTone = settings.selectedTone ?? defaultBrandSettings.tonePresets[1];

  function updateSettings(partial: Partial<BrandSettings>) {
    onSettingsChange({ ...settings, ...partial });
  }

  function handleMockSave() {
    onToast("Đã mô phỏng lưu Brand Settings. Phase 2 chưa ghi database.");
  }

  function handleReset() {
    onSettingsChange({
      ...defaultBrandSettings,
      selectedTone: defaultBrandSettings.tonePresets[1],
    });
    onToast("Đã khôi phục Brand Settings demo.");
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanSoft-300">Brand Settings</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Cấu hình thương hiệu</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Thiết lập giọng văn, nhóm khách hàng và CTA mặc định. Phase 2 dùng dữ liệu này khi gọi Gemini.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="purple">AI context</Badge>
              <h3 className="mt-3 text-xl font-black text-white">Brand voice</h3>
            </div>
            <Palette className="size-5 text-aurora-300" />
          </div>

          <div className="mt-5 grid gap-4">
            <Textarea
              id="brand-voice"
              label="Brand voice"
              value={settings.brandVoice}
              onChange={(event) => updateSettings({ brandVoice: event.target.value })}
            />
            <Textarea
              id="target-audience"
              label="Target audience"
              value={settings.targetAudience}
              onChange={(event) => updateSettings({ targetAudience: event.target.value })}
            />
            <Input
              id="default-cta"
              label="Default CTA"
              value={settings.defaultCta}
              onChange={(event) => updateSettings({ defaultCta: event.target.value })}
            />
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-slate-200">Tone presets</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {settings.tonePresets.map((tone) => (
                <button
                  key={tone}
                  onClick={() => updateSettings({ selectedTone: tone })}
                  className={cn(
                    "min-h-11 cursor-pointer rounded-2xl border px-4 text-sm font-semibold transition",
                    selectedTone === tone
                      ? "border-cyanSoft-300/40 bg-cyanSoft-500/12 text-cyanSoft-300"
                      : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={handleMockSave}>
              Lưu cấu hình demo
            </Button>
            <Button variant="ghost" size="lg" onClick={handleReset}>
              Khôi phục mặc định
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="cyan">TTS demo</Badge>
              <h3 className="mt-3 text-lg font-black text-white">Giọng đọc mặc định</h3>
            </div>
            <Mic2 className="size-5 text-cyanSoft-300" />
          </div>

          <div className="mt-5 space-y-4">
            <Input
              id="tts-voice"
              label="TTS voice demo"
              value={settings.ttsVoice}
              onChange={(event) => updateSettings({ ttsVoice: event.target.value })}
            />
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">Preview copy</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                “{settings.brandVoice}” — nội dung AI sẽ ưu tiên tone {selectedTone.toLowerCase()} và CTA: {settings.defaultCta}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

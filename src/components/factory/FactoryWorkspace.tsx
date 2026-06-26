"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ActivityLog } from "./ActivityLog";
import { Phase1IdeaInput } from "./Phase1IdeaInput";
import { Phase2ScriptPreview } from "./Phase2ScriptPreview";
import { Phase3VoicePreview } from "./Phase3VoicePreview";
import { Phase4Distribution } from "./Phase4Distribution";
import { PhaseStepper } from "./PhaseStepper";
import { SlideVideoPreview } from "./SlideVideoPreview";
import { Button } from "@/components/ui/Button";
import { demoHook, demoScript, demoSlides, ideaPresets } from "@/lib/demo-data";
import type { GenerateScriptResponse, PolishScriptResponse } from "@/lib/ai/types";
import type { ActivityLogItem, BrandSettings, ContentItem, IdeaPreset, PhaseKey, Platform, SlideItem } from "@/lib/types";
import { createId, getCurrentDateLabel } from "@/lib/utils";

type FactoryWorkspaceProps = {
  activityLogs: ActivityLogItem[];
  brandSettings: BrandSettings;
  onAddLog: (label: string, type?: ActivityLogItem["type"]) => void;
  onSaveContent: (item: ContentItem) => void;
  onToast: (message: string) => void;
};

type ApiErrorPayload = {
  error?: string;
};

const initialPreset = ideaPresets[0];

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallbackMessage;
}

async function postJson<TResponse>(url: string, payload: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as unknown;

  if (!response.ok) {
    const errorPayload = data as ApiErrorPayload;
    const message = errorPayload.error || "Không gọi được Gemini, đang dùng dữ liệu demo.";
    throw new Error(message);
  }

  return data as TResponse;
}

function convertGeneratedSlides(result: GenerateScriptResponse): SlideItem[] {
  let elapsedSeconds = 0;

  return result.slides.map((slide, index) => {
    const durationSec = slide.durationSec ?? Math.max(3, Math.round(30 / result.slides.length));
    const startSec = elapsedSeconds;
    const endSec = elapsedSeconds + durationSec;
    elapsedSeconds = endSec;

    return {
      id: slide.id || `slide-${index + 1}`,
      title: `Slide ${index + 1}`,
      duration: `${startSec}-${endSec}s`,
      overlayText: slide.slideText,
      visualDirection: `Visual keyword: ${slide.visualKeyword}. ${result.visualCues}`,
      narration: slide.subtitle || slide.slideText,
      subtitle: slide.subtitle,
      visualKeyword: slide.visualKeyword,
      bgGradient: slide.bgGradient,
      durationSec,
    };
  });
}

export function FactoryWorkspace({
  activityLogs,
  brandSettings,
  onAddLog,
  onSaveContent,
  onToast,
}: FactoryWorkspaceProps) {
  const [activePhase, setActivePhase] = useState<PhaseKey>("idea");
  const [title, setTitle] = useState(initialPreset.title);
  const [rawIdea, setRawIdea] = useState(initialPreset.rawIdea);
  const [platform, setPlatform] = useState<Platform>(initialPreset.platform);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([initialPreset.platform]);
  const [scriptReady, setScriptReady] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [scriptResult, setScriptResult] = useState<GenerateScriptResponse | null>(null);
  const [demoScriptOverride, setDemoScriptOverride] = useState<string | null>(null);
  const [hookOverride, setHookOverride] = useState<string | null>(null);
  const [polishNotes, setPolishNotes] = useState<string[]>([]);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isPolishingScript, setIsPolishingScript] = useState(false);

  const currentSlides = useMemo(() => (scriptResult ? convertGeneratedSlides(scriptResult) : demoSlides), [scriptResult]);
  const scriptText = scriptResult?.scriptBody ?? demoScriptOverride ?? demoScript;
  const selectedHook = hookOverride ?? scriptResult?.selectedHook ?? demoHook;
  const hooks = scriptResult?.hooks ?? [selectedHook];
  const activeSlideIndex = Math.min(
    activePhase === "idea" ? 0 : activePhase === "script" ? 1 : activePhase === "voice" ? 2 : 3,
    Math.max(currentSlides.length - 1, 0),
  );

  function handlePresetSelect(preset: IdeaPreset) {
    setTitle(preset.title);
    setRawIdea(preset.rawIdea);
    setPlatform(preset.platform);
    setSelectedPlatforms([preset.platform]);
    setScriptResult(null);
    setDemoScriptOverride(null);
    setHookOverride(null);
    setPolishNotes([]);
    onAddLog(`Đã chọn preset: ${preset.label}.`, "info");
    onToast("Đã điền preset demo vào form.");
  }

  async function handleBrainstormIdea() {
    setIsBrainstorming(true);
    onAddLog("Đang gọi Gemini để gợi ý ý tưởng...", "info");

    try {
      const result = await postJson<{ title: string; rawIdea: string; angle: string }>("/api/ai/brainstorm", {
        niche: title.trim() || rawIdea.trim() || "video ngắn bán hàng cho shop nhỏ",
        tone: brandSettings.selectedTone || "Gần gũi",
        targetAudience: brandSettings.targetAudience,
        brandVoice: brandSettings.brandVoice,
      });

      setTitle(result.title);
      setRawIdea(`${result.rawIdea}\n\nGóc tiếp cận: ${result.angle}`);
      setScriptResult(null);
      setDemoScriptOverride(null);
      setHookOverride(null);
      setPolishNotes([]);
      onAddLog("Gemini đã gợi ý ý tưởng mới.", "success");
      onToast("Đã tạo ý tưởng bằng Gemini.");
    } catch (error) {
      const message = getErrorMessage(error, "Không gọi được Gemini, đang dùng dữ liệu demo.");
      if (!title.trim() && !rawIdea.trim()) {
        setTitle(initialPreset.title);
        setRawIdea(initialPreset.rawIdea);
      }
      onAddLog(`Lỗi brainstorm AI: ${message}`, "warning");
      onToast(message);
    } finally {
      setIsBrainstorming(false);
    }
  }

  async function handleGenerateScript() {
    const fallbackTitle = title.trim() || initialPreset.title;
    const fallbackRawIdea = rawIdea.trim() || initialPreset.rawIdea;

    if (!title.trim()) setTitle(fallbackTitle);
    if (!rawIdea.trim()) setRawIdea(fallbackRawIdea);

    setIsGeneratingScript(true);
    onAddLog("Đang gọi Gemini để tạo hook, kịch bản và slide...", "info");

    try {
      const result = await postJson<GenerateScriptResponse>("/api/ai/generate-script", {
        rawTitle: fallbackTitle,
        rawIdea: fallbackRawIdea,
        brandVoice: brandSettings.brandVoice,
        targetAudience: brandSettings.targetAudience,
        durationSeconds: 30,
        platform,
      });

      setScriptResult(result);
      setDemoScriptOverride(null);
      setHookOverride(null);
      setPolishNotes([]);
      setScriptReady(true);
      setActivePhase("script");
      onAddLog("Gemini đã trả về kịch bản và slide thật.", "success");
      onToast("Đã tạo kịch bản bằng Gemini.");
    } catch (error) {
      const message = getErrorMessage(error, "Không gọi được Gemini, đang dùng dữ liệu demo.");
      setScriptResult(null);
      setDemoScriptOverride(null);
      setHookOverride(null);
      setPolishNotes([]);
      setScriptReady(true);
      setActivePhase("script");
      onAddLog(`Lỗi tạo kịch bản AI: ${message}`, "warning");
      onToast(message === "Chưa cấu hình GEMINI_API_KEY trong .env.local" ? message : "Không gọi được Gemini, đang dùng dữ liệu demo.");
    } finally {
      setIsGeneratingScript(false);
    }
  }

  async function handlePolishScript() {
    setIsPolishingScript(true);
    onAddLog("Đang gọi Gemini để tối ưu kịch bản...", "info");

    try {
      const result = await postJson<PolishScriptResponse>("/api/ai/polish-script", {
        scriptBody: scriptText,
        directive: "Tối ưu cho video ngắn: mở đầu mạnh hơn, câu ngắn hơn, dễ đọc voice-over hơn.",
        brandVoice: brandSettings.brandVoice,
        targetAudience: brandSettings.targetAudience,
      });

      setScriptResult((current) =>
        current
          ? {
              ...current,
              selectedHook: result.improvedHook || current.selectedHook,
              scriptBody: result.optimizedScript,
            }
          : current,
      );
      if (!scriptResult) {
        setDemoScriptOverride(result.optimizedScript);
      }
      if (result.improvedHook) {
        setHookOverride(result.improvedHook);
      }
      setPolishNotes(result.notes);
      onAddLog(`Gemini đã tối ưu kịch bản: ${result.notes[0]}`, "success");
      onToast("Đã tối ưu kịch bản bằng Gemini.");
    } catch (error) {
      const message = getErrorMessage(error, "Không gọi được Gemini, đang giữ kịch bản hiện tại.");
      onAddLog(`Lỗi tối ưu kịch bản: ${message}`, "warning");
      onToast(message === "Chưa cấu hình GEMINI_API_KEY trong .env.local" ? message : "Không gọi được Gemini, đang giữ kịch bản hiện tại.");
    } finally {
      setIsPolishingScript(false);
    }
  }

  function handleGenerateVoice() {
    setScriptReady(true);
    setVoiceReady(true);
    setActivePhase("voice");
    onAddLog("Đã tạo voice preview giả lập.", "success");
    onToast("Đã tạo giọng đọc demo.");
  }

  function handlePreparePublish() {
    setVoiceReady(true);
    setActivePhase("publish");
    onAddLog("Đã chuẩn bị gói đăng nội dung demo.", "info");
    onToast("Đã chuyển sang bước chuẩn bị đăng.");
  }

  function handleTogglePlatform(nextPlatform: Platform) {
    setSelectedPlatforms((current) =>
      current.includes(nextPlatform)
        ? current.filter((item) => item !== nextPlatform)
        : [...current, nextPlatform],
    );
  }

  function handleSaveToLibrary() {
    const item: ContentItem = {
      id: createId("content"),
      title: title.trim() || "Nội dung video demo chưa đặt tên",
      hook: selectedHook,
      platform: selectedPlatforms[0] ?? platform,
      status: "Ready",
      createdAt: getCurrentDateLabel(),
      slides: currentSlides,
      caption: scriptResult?.caption,
      hashtags: scriptResult?.hashtags,
      cta: scriptResult?.cta,
    };

    onSaveContent(item);
    onAddLog("Đã lưu nội dung vào Content Library local.", "success");
    onToast("Đã lưu vào kho nội dung.");
  }

  function handleResetFlow() {
    setActivePhase("idea");
    setTitle("");
    setRawIdea("");
    setPlatform("TikTok");
    setSelectedPlatforms(["TikTok"]);
    setScriptReady(false);
    setVoiceReady(false);
    setScriptResult(null);
    setDemoScriptOverride(null);
    setHookOverride(null);
    setPolishNotes([]);
    onAddLog("Đã reset flow tạo nội dung.", "warning");
    onToast("Đã reset flow.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanSoft-300">Factory Flow</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Tạo video ngắn theo từng pha
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Một luồng làm việc gọn cho người mới: nhập ý tưởng, dùng Gemini tạo kịch bản, tạo giọng đọc demo và lưu nội dung.
            </p>
          </div>
          <Button variant="ghost" icon={<RotateCcw className="size-4" />} onClick={handleResetFlow}>
            Reset flow
          </Button>
        </div>

        <PhaseStepper activePhase={activePhase} onPhaseChange={setActivePhase} />

        {activePhase === "idea" ? (
          <Phase1IdeaInput
            title={title}
            rawIdea={rawIdea}
            platform={platform}
            isBrainstorming={isBrainstorming}
            isGeneratingScript={isGeneratingScript}
            onTitleChange={setTitle}
            onRawIdeaChange={setRawIdea}
            onPlatformChange={(nextPlatform) => {
              setPlatform(nextPlatform);
              setSelectedPlatforms([nextPlatform]);
            }}
            onPresetSelect={handlePresetSelect}
            onBrainstormIdea={handleBrainstormIdea}
            onGenerateScript={handleGenerateScript}
          />
        ) : null}

        {activePhase === "script" ? (
          <Phase2ScriptPreview
            hooks={hooks}
            selectedHook={selectedHook}
            script={scriptText}
            slides={currentSlides}
            caption={scriptResult?.caption}
            hashtags={scriptResult?.hashtags}
            cta={scriptResult?.cta}
            polishNotes={polishNotes}
            isReady={scriptReady}
            isPolishing={isPolishingScript}
            onPolishScript={handlePolishScript}
            onGenerateVoice={handleGenerateVoice}
          />
        ) : null}

        {activePhase === "voice" ? <Phase3VoicePreview isReady={voiceReady} onPreparePublish={handlePreparePublish} /> : null}

        {activePhase === "publish" ? (
          <Phase4Distribution
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
            onSaveToLibrary={handleSaveToLibrary}
          />
        ) : null}
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <SlideVideoPreview title={title} slides={currentSlides} activeSlideIndex={activeSlideIndex} />
        <ActivityLog logs={activityLogs} />
      </aside>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { demoHook, demoScript, demoSlides, ideaPresets } from "@/lib/demo-data";
import type { GenerateScriptResponse, PolishScriptResponse } from "@/lib/ai/types";
import type { ActivityLogItem, BrandSettings, IdeaPreset, PhaseKey, Platform, SaveContentInput, SlideItem } from "@/lib/types";
import { ActivityLogPanel } from "./ActivityLogPanel";
import { IdeaInputPanel } from "./IdeaInputPanel";
import { ScriptResultPanel } from "./ScriptResultPanel";
import { SlideBreakdown } from "./SlideBreakdown";
import { StatusPanel } from "./StatusPanel";
import { VideoPreviewPanel } from "./VideoPreviewPanel";
import { WorkflowStepper } from "./WorkflowStepper";

type FactoryWorkspaceProps = {
  activityLogs: ActivityLogItem[];
  brandSettings: BrandSettings;
  onBrandSettingsChange: (settings: BrandSettings) => void;
  onAddLog: (label: string, type?: ActivityLogItem["type"]) => void;
  onSaveContent: (item: SaveContentInput) => Promise<void> | void;
  onToast: (message: string) => void;
};

type ApiErrorPayload = { error?: string };
const initialPreset = ideaPresets[0];
const fallbackHooks = [demoHook, "Nếu bạn vẫn làm content thủ công mỗi ngày, bạn đang mất nhiều thời gian hơn cần thiết.", "Một ý tưởng thô có thể thành video hoàn chỉnh nếu bạn chia đúng quy trình."];
function getErrorMessage(error: unknown, fallbackMessage: string): string { if (error instanceof Error && error.message) return error.message; return fallbackMessage; }
async function postJson<TResponse>(url: string, payload: unknown): Promise<TResponse> {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = (await response.json().catch(() => ({}))) as unknown;
  if (!response.ok) { const errorPayload = data as ApiErrorPayload; throw new Error(errorPayload.error || "Không gọi được Gemini, đang dùng dữ liệu demo."); }
  return data as TResponse;
}
function convertGeneratedSlides(result: GenerateScriptResponse): SlideItem[] {
  let elapsedSeconds = 0;
  return result.slides.map((slide, index) => {
    const durationSec = slide.durationSec ?? Math.max(3, Math.round(30 / result.slides.length));
    const startSec = elapsedSeconds;
    const endSec = elapsedSeconds + durationSec;
    elapsedSeconds = endSec;
    return { id: slide.id || `slide-${index + 1}`, title: `Slide ${index + 1}`, duration: `${startSec}-${endSec}s`, overlayText: slide.slideText, visualDirection: `Visual keyword: ${slide.visualKeyword}. ${result.visualCues}`, narration: slide.subtitle || slide.slideText, subtitle: slide.subtitle, visualKeyword: slide.visualKeyword, bgGradient: slide.bgGradient, durationSec };
  });
}

export function FactoryWorkspace({ activityLogs, brandSettings, onBrandSettingsChange, onAddLog, onSaveContent, onToast }: FactoryWorkspaceProps) {
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
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const currentSlides = useMemo(() => (scriptResult ? convertGeneratedSlides(scriptResult) : demoSlides), [scriptResult]);
  const scriptText = scriptResult?.scriptBody ?? demoScriptOverride ?? demoScript;
  const selectedHook = hookOverride ?? scriptResult?.selectedHook ?? demoHook;
  const hooks = useMemo(() => Array.from(new Set([selectedHook, ...(scriptResult?.hooks?.length ? scriptResult.hooks : fallbackHooks)])).slice(0, 3), [scriptResult, selectedHook]);
  const selectedTone = brandSettings.selectedTone ?? "Thân thiện, truyền cảm hứng";
  const completedPhases = useMemo<PhaseKey[]>(() => { const phases: PhaseKey[] = []; if (title.trim() || rawIdea.trim()) phases.push("idea"); if (scriptReady) phases.push("script"); if (voiceReady) phases.push("voice"); return phases; }, [rawIdea, scriptReady, title, voiceReady]);
  function updateSelectedTone(nextTone: string) { onBrandSettingsChange({ ...brandSettings, selectedTone: nextTone }); }
  function handlePresetSelect(preset: IdeaPreset) { setTitle(preset.title); setRawIdea(preset.rawIdea); setPlatform(preset.platform); setSelectedPlatforms([preset.platform]); setActiveSlideIndex(0); setScriptResult(null); setDemoScriptOverride(null); setHookOverride(null); setPolishNotes([]); setScriptReady(false); setVoiceReady(false); setActivePhase("idea"); onAddLog(`Đã chọn preset: ${preset.label}.`, "info"); onToast("Đã điền preset demo vào form."); }
  async function handleBrainstormIdea() {
    setIsBrainstorming(true); onAddLog("Đang gọi Gemini để gợi ý ý tưởng...", "info");
    try {
      const result = await postJson<{ title: string; rawIdea: string; angle: string }>("/api/ai/brainstorm", { niche: title.trim() || rawIdea.trim() || "video ngắn bán hàng cho shop nhỏ", tone: selectedTone, targetAudience: brandSettings.targetAudience, brandVoice: brandSettings.brandVoice });
      setTitle(result.title); setRawIdea(`${result.rawIdea}\n\nGóc tiếp cận: ${result.angle}`); setScriptResult(null); setDemoScriptOverride(null); setHookOverride(null); setPolishNotes([]); setScriptReady(false); setVoiceReady(false); setActiveSlideIndex(0); onAddLog("Gemini đã gợi ý ý tưởng mới.", "success"); onToast("Đã tạo ý tưởng bằng Gemini.");
    } catch (error) { const message = getErrorMessage(error, "Không gọi được Gemini, đang dùng dữ liệu demo."); if (!title.trim() && !rawIdea.trim()) { setTitle(initialPreset.title); setRawIdea(initialPreset.rawIdea); } onAddLog(`Lỗi brainstorm AI: ${message}`, "warning"); onToast(message); }
    finally { setIsBrainstorming(false); }
  }
  async function handleGenerateScript() {
    const fallbackTitle = title.trim() || initialPreset.title; const fallbackRawIdea = rawIdea.trim() || initialPreset.rawIdea; if (!title.trim()) setTitle(fallbackTitle); if (!rawIdea.trim()) setRawIdea(fallbackRawIdea); setIsGeneratingScript(true); onAddLog("Đang gọi Gemini để tạo hook, kịch bản và slide...", "info");
    try {
      const result = await postJson<GenerateScriptResponse>("/api/ai/generate-script", { rawTitle: fallbackTitle, rawIdea: fallbackRawIdea, brandVoice: `${brandSettings.brandVoice}\nTông giọng ưu tiên: ${selectedTone}`, targetAudience: brandSettings.targetAudience, durationSeconds: 30, platform });
      setScriptResult(result); setDemoScriptOverride(null); setHookOverride(null); setPolishNotes([]); setScriptReady(true); setVoiceReady(false); setActivePhase("script"); setActiveSlideIndex(0); onAddLog("Gemini đã trả về kịch bản và slide thật.", "success"); onToast("Đã tạo kịch bản bằng Gemini.");
    } catch (error) { const message = getErrorMessage(error, "Không gọi được Gemini, đang dùng dữ liệu demo."); setScriptResult(null); setDemoScriptOverride(null); setHookOverride(null); setPolishNotes([]); setScriptReady(true); setVoiceReady(false); setActivePhase("script"); setActiveSlideIndex(0); onAddLog(`Lỗi tạo kịch bản AI: ${message}`, "warning"); onToast(message === "Chưa cấu hình GEMINI_API_KEY trong .env.local" ? message : "Không gọi được Gemini, đang dùng dữ liệu demo."); }
    finally { setIsGeneratingScript(false); }
  }
  async function handlePolishScript() {
    setIsPolishingScript(true); onAddLog("Đang gọi Gemini để tối ưu kịch bản...", "info");
    try {
      const result = await postJson<PolishScriptResponse>("/api/ai/polish-script", { scriptBody: scriptText, directive: "Tối ưu cho video ngắn: mở đầu mạnh hơn, câu ngắn hơn, dễ đọc voice-over hơn.", brandVoice: `${brandSettings.brandVoice}\nTông giọng ưu tiên: ${selectedTone}`, targetAudience: brandSettings.targetAudience });
      setScriptResult((current) => current ? { ...current, selectedHook: result.improvedHook || current.selectedHook, scriptBody: result.optimizedScript } : current); if (!scriptResult) setDemoScriptOverride(result.optimizedScript); if (result.improvedHook) setHookOverride(result.improvedHook); setPolishNotes(result.notes); onAddLog(`Gemini đã tối ưu kịch bản: ${result.notes[0] ?? "đã cải thiện nhịp đọc."}`, "success"); onToast("Đã tối ưu kịch bản bằng Gemini.");
    } catch (error) { const message = getErrorMessage(error, "Không gọi được Gemini, đang giữ kịch bản hiện tại."); onAddLog(`Lỗi tối ưu kịch bản: ${message}`, "warning"); onToast(message === "Chưa cấu hình GEMINI_API_KEY trong .env.local" ? message : "Không gọi được Gemini, đang giữ kịch bản hiện tại."); }
    finally { setIsPolishingScript(false); }
  }
  function handleScriptChange(nextScript: string) { if (scriptResult) { setScriptResult({ ...scriptResult, scriptBody: nextScript }); return; } setDemoScriptOverride(nextScript); }
  function handleSelectHook(nextHook: string) { setHookOverride(nextHook); if (scriptResult) setScriptResult({ ...scriptResult, selectedHook: nextHook }); onAddLog("Đã chọn hook cho video.", "info"); }
  function handleGenerateVoice() { setScriptReady(true); setVoiceReady(true); setActivePhase("voice"); onAddLog("Đã tạo voice preview giả lập.", "success"); onToast("Đã tạo giọng đọc demo."); }
  async function handleSaveToLibrary() { if (isSavingContent) return; const input: SaveContentInput = { title: title.trim() || "Nội dung video chưa đặt tên", rawIdea, selectedHook, scriptBody: scriptText, visualCues: scriptResult?.visualCues, slides: currentSlides, caption: scriptResult?.caption, hashtags: scriptResult?.hashtags, cta: scriptResult?.cta, platforms: selectedPlatforms.length ? selectedPlatforms : [platform], status: "Ready" }; setIsSavingContent(true); try { await onSaveContent(input); setActivePhase("publish"); } finally { setIsSavingContent(false); } }
  function handleResetFlow() { setActivePhase("idea"); setTitle(""); setRawIdea(""); setPlatform("TikTok"); setSelectedPlatforms(["TikTok"]); setScriptReady(false); setVoiceReady(false); setScriptResult(null); setDemoScriptOverride(null); setHookOverride(null); setPolishNotes([]); setActiveSlideIndex(0); onAddLog("Đã reset flow tạo nội dung.", "warning"); onToast("Đã reset flow."); }
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_370px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-300"><Sparkles className="size-3.5" /> Create Studio</div><h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">AI Video Content Studio</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Biến ý tưởng thô thành hook, kịch bản, slide và nội dung sẵn sàng lưu kho trong một workspace rõ ràng.</p></div><Button variant="ghost" icon={<RotateCcw className="size-4" />} onClick={handleResetFlow}>Reset flow</Button></div>
        <WorkflowStepper activePhase={activePhase} completedPhases={completedPhases} onPhaseChange={setActivePhase} />
        <IdeaInputPanel title={title} rawIdea={rawIdea} platform={platform} selectedTone={selectedTone} isBrainstorming={isBrainstorming} isGeneratingScript={isGeneratingScript} onTitleChange={setTitle} onRawIdeaChange={setRawIdea} onPlatformChange={(nextPlatform) => { setPlatform(nextPlatform); setSelectedPlatforms([nextPlatform]); }} onToneChange={updateSelectedTone} onPresetSelect={handlePresetSelect} onBrainstormIdea={handleBrainstormIdea} onGenerateScript={handleGenerateScript} />
        <ScriptResultPanel hooks={hooks} selectedHook={selectedHook} script={scriptText} caption={scriptResult?.caption} hashtags={scriptResult?.hashtags} cta={scriptResult?.cta} polishNotes={polishNotes} isReady={scriptReady} isPolishing={isPolishingScript} isGeneratingScript={isGeneratingScript} isSaving={isSavingContent} onSelectHook={handleSelectHook} onScriptChange={handleScriptChange} onPolishScript={handlePolishScript} onGenerateVoice={handleGenerateVoice} onSaveToLibrary={handleSaveToLibrary} onRegenerateHooks={handleGenerateScript} />
        <SlideBreakdown slides={currentSlides} activeSlideIndex={activeSlideIndex} onSlideSelect={setActiveSlideIndex} />
      </div>
      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start"><VideoPreviewPanel title={title} slides={currentSlides} activeSlideIndex={activeSlideIndex} /><StatusPanel scriptReady={scriptReady} voiceReady={voiceReady} videoReady={false} /><ActivityLogPanel logs={activityLogs} /></aside>
    </div>
  );
}

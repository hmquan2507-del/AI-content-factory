import { Save, Sparkles, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HookSelector } from "./HookSelector";
import { ScriptEditor } from "./ScriptEditor";

type ScriptResultPanelProps = {
  hooks: string[];
  selectedHook: string;
  script: string;
  caption?: string;
  hashtags?: string[];
  cta?: string;
  polishNotes: string[];
  isReady: boolean;
  isPolishing: boolean;
  isGeneratingScript: boolean;
  isSaving: boolean;
  onSelectHook: (hook: string) => void;
  onScriptChange: (value: string) => void;
  onPolishScript: () => void;
  onGenerateVoice: () => void;
  onSaveToLibrary: () => void;
  onRegenerateHooks: () => void;
};

export function ScriptResultPanel({
  hooks,
  selectedHook,
  script,
  caption,
  hashtags,
  cta,
  polishNotes,
  isReady,
  isPolishing,
  isGeneratingScript,
  isSaving,
  onSelectHook,
  onScriptChange,
  onPolishScript,
  onGenerateVoice,
  onSaveToLibrary,
  onRegenerateHooks,
}: ScriptResultPanelProps) {
  const isBusy = isPolishing || isGeneratingScript || isSaving;
  return (
    <Card className="overflow-hidden border-white/10 bg-[#0D111C]/90 p-0">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 via-white/[0.055] to-transparent px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isReady ? "green" : "neutral"}>{isReady ? "Sẵn sàng" : "Chờ tạo"}</Badge>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Bước 2</span>
          </div>
          <h2 className="mt-3 text-xl font-black tracking-tight text-white">Kết quả kịch bản</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">Hook, script, caption và CTA được giữ nguyên logic Gemini Phase 2.</p>
        </div>
      </div>
      <div className="grid gap-5 p-4 sm:p-5 2xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 space-y-5">
          <HookSelector hooks={hooks} selectedHook={selectedHook} isBusy={isBusy} onSelectHook={onSelectHook} onRegenerateHooks={onRegenerateHooks} />
          <ScriptEditor value={script} disabled={isBusy} onChange={onScriptChange} />
          {polishNotes.length ? (
            <div className="rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-4">
              <p className="text-sm font-bold text-emerald-200">Ghi chú tối ưu</p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
                {polishNotes.map((note) => <li key={note}>• {note}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
        <aside className="space-y-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Caption</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{caption || "Caption sẽ hiển thị sau khi tạo kịch bản bằng Gemini."}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Hashtags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(hashtags?.length ? hashtags : ["#AIContent", "#ShortVideo", "#ContentFactory"]).map((hashtag) => (
                <span key={hashtag} className="rounded-full bg-cyanSoft-500/10 px-3 py-1 text-xs font-bold text-cyanSoft-300">{hashtag}</span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-violet-300/15 bg-violet-500/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">CTA</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-white">{cta || "Lưu nội dung này để triển khai video ngay hôm nay."}</p>
          </div>
        </aside>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 bg-black/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
        <Button variant="secondary" icon={<Sparkles className="size-4" />} disabled={!isReady || isBusy} onClick={onPolishScript}>{isPolishing ? "Đang tối ưu..." : "Tối ưu kịch bản"}</Button>
        <Button variant="secondary" icon={<Volume2 className="size-4" />} disabled={!isReady || isBusy} onClick={onGenerateVoice}>Tạo giọng đọc</Button>
        <Button variant="primary" icon={<Save className="size-4" />} disabled={!isReady || isBusy} onClick={onSaveToLibrary}>{isSaving ? "Đang lưu..." : "Lưu vào kho"}</Button>
      </div>
    </Card>
  );
}

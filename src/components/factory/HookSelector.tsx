import { CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type HookSelectorProps = {
  hooks: string[];
  selectedHook: string;
  isBusy?: boolean;
  onSelectHook: (hook: string) => void;
  onRegenerateHooks: () => void;
};

export function HookSelector({ hooks, selectedHook, isBusy, onSelectHook, onRegenerateHooks }: HookSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-200">Hook đề xuất</p>
          <p className="mt-1 text-xs text-slate-500">Chọn một hook làm mở đầu video.</p>
        </div>
        <Button variant="ghost" size="sm" icon={<RefreshCw className="size-4" />} disabled={isBusy} onClick={onRegenerateHooks}>Tạo lại hook</Button>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {hooks.slice(0, 3).map((hook, index) => {
          const isSelected = hook === selectedHook;
          return (
            <button key={`${hook}-${index}`} type="button" disabled={isBusy} onClick={() => onSelectHook(hook)} className={cn("relative cursor-pointer rounded-3xl border p-4 text-left transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60", isSelected ? "border-violet-400/60 bg-violet-500/14 shadow-glow" : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]")}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Hook {index + 1}</span>
                {isSelected ? <CheckCircle2 className="size-5 text-violet-300" /> : null}
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-white">{hook}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

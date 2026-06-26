import { Check, Dot } from "lucide-react";
import type { PhaseKey } from "@/lib/types";
import { cn } from "@/lib/utils";

type WorkflowStepperProps = {
  activePhase: PhaseKey;
  completedPhases: PhaseKey[];
  onPhaseChange: (phase: PhaseKey) => void;
};

const steps: Array<{ key: PhaseKey; label: string; description: string }> = [
  { key: "idea", label: "Ý tưởng", description: "Nhập brief" },
  { key: "script", label: "Kịch bản", description: "Hook + script" },
  { key: "voice", label: "Giọng đọc", description: "Voice demo" },
  { key: "publish", label: "Xuất bản", description: "Lưu kho" },
];

export function WorkflowStepper({ activePhase, completedPhases, onPhaseChange }: WorkflowStepperProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-2 shadow-soft backdrop-blur-xl">
      <div className="grid gap-2 sm:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = activePhase === step.key;
          const isDone = completedPhases.includes(step.key);
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onPhaseChange(step.key)}
              className={cn(
                "group flex min-h-16 cursor-pointer items-center gap-3 rounded-[1.35rem] border px-3 py-3 text-left transition duration-200 active:scale-[0.99]",
                isActive
                  ? "border-violet-400/45 bg-gradient-to-br from-violet-500/20 via-indigo-500/12 to-cyan-500/10 shadow-glow"
                  : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.055]",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-black transition",
                  isDone
                    ? "border-emerald-300/25 bg-emerald-400/12 text-emerald-300"
                    : isActive
                      ? "border-violet-300/35 bg-violet-500/18 text-white"
                      : "border-white/10 bg-white/[0.06] text-slate-400 group-hover:text-white",
                )}
              >
                {isDone ? <Check className="size-4" /> : <span>{index + 1}</span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm font-bold", isActive ? "text-white" : "text-slate-300")}>{step.label}</span>
                <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Dot className="size-3" /> {step.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

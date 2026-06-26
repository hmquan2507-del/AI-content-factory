import { Check, FileText, Megaphone, Mic2, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhaseKey } from "@/lib/types";

const phases: Array<{
  key: PhaseKey;
  label: string;
  description: string;
  icon: typeof PencilLine;
}> = [
  { key: "idea", label: "Idea", description: "Nhập ý tưởng thô", icon: PencilLine },
  { key: "script", label: "Script", description: "Hook + kịch bản", icon: FileText },
  { key: "voice", label: "Voice", description: "Giọng đọc demo", icon: Mic2 },
  { key: "publish", label: "Publish", description: "Chuẩn bị đăng", icon: Megaphone },
];

const phaseIndex: Record<PhaseKey, number> = {
  idea: 0,
  script: 1,
  voice: 2,
  publish: 3,
};

type PhaseStepperProps = {
  activePhase: PhaseKey;
  onPhaseChange: (phase: PhaseKey) => void;
};

export function PhaseStepper({ activePhase, onPhaseChange }: PhaseStepperProps) {
  const activeIndex = phaseIndex[activePhase];

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {phases.map((phase, index) => {
        const Icon = phase.icon;
        const isActive = activePhase === phase.key;
        const isComplete = index < activeIndex;

        return (
          <button
            key={phase.key}
            onClick={() => onPhaseChange(phase.key)}
            className={cn(
              "group flex min-h-20 cursor-pointer items-center gap-3 rounded-3xl border p-3 text-left transition duration-200",
              isActive
                ? "border-cyanSoft-300/35 bg-cyanSoft-500/12 shadow-glow"
                : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.07] active:bg-white/[0.1]",
            )}
          >
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-2xl transition",
                isComplete
                  ? "bg-emerald-400/15 text-emerald-200"
                  : isActive
                    ? "bg-cyanSoft-500/18 text-cyanSoft-300"
                    : "bg-white/[0.06] text-slate-400 group-hover:text-slate-100",
              )}
            >
              {isComplete ? <Check className="size-5" /> : <Icon className="size-5" />}
            </span>
            <span>
              <span className="block text-sm font-black text-white">{index + 1}. {phase.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">{phase.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "purple" | "cyan" | "green" | "yellow";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-white/10 bg-white/[0.07] text-slate-300",
  purple: "border-aurora-400/25 bg-aurora-500/12 text-aurora-300",
  cyan: "border-cyanSoft-300/25 bg-cyanSoft-500/10 text-cyanSoft-300",
  green: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
  yellow: "border-amber-300/25 bg-amber-400/10 text-amber-200",
};

export function Badge({ className, children, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

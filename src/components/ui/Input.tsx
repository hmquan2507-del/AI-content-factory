import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className, id, ...props }: InputProps) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      {label ? <span className="text-sm font-semibold text-slate-200">{label}</span> : null}
      <input
        id={id}
        className={cn(
          "min-h-12 w-full rounded-2xl border border-white/10 bg-ink-900/72 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyanSoft-300/60 focus:bg-ink-850 focus:ring-4 focus:ring-cyanSoft-500/10",
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

export function Textarea({ label, hint, className, id, ...props }: TextareaProps) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      {label ? <span className="text-sm font-semibold text-slate-200">{label}</span> : null}
      <textarea
        id={id}
        className={cn(
          "min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-ink-900/72 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyanSoft-300/60 focus:bg-ink-850 focus:ring-4 focus:ring-cyanSoft-500/10",
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

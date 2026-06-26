import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-aurora-500 to-cyanSoft-500 text-white shadow-glow hover:brightness-110 active:brightness-95",
  secondary:
    "border border-white/10 bg-white/[0.08] text-slate-100 hover:border-white/20 hover:bg-white/[0.12] active:bg-white/[0.16]",
  ghost: "text-slate-300 hover:bg-white/[0.08] hover:text-white active:bg-white/[0.12]",
  danger:
    "border border-rose-400/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/16 active:bg-rose-500/22",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  icon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyanSoft-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

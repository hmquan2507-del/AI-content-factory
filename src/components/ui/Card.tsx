import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padded?: boolean;
};

export function Card({ className, children, padded = true, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "glass-panel rounded-xxl shadow-soft",
        padded && "p-4 sm:p-5",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

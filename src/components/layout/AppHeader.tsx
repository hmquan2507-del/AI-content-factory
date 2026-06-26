import { Bell, Factory, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type AppHeaderProps = {
  activeLabel: string;
};

export function AppHeader({ activeLabel }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-500 to-cyanSoft-500 shadow-glow">
            <Factory className="size-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-black tracking-tight text-white sm:text-lg">
                AI Content Factory
              </h1>
              <Badge tone="purple" className="hidden sm:inline-flex">
                Phase 1 UI
              </Badge>
            </div>
            <p className="truncate text-xs text-slate-400 sm:text-sm">{activeLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="cyan" className="hidden md:inline-flex">
            Mock data only
          </Badge>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" icon={<Sparkles className="size-4" />}>
            Demo mode
          </Button>
          <Button variant="secondary" size="sm" className="size-10 px-0" aria-label="Thông báo">
            <Bell className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

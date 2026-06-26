import { Bell, Factory, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AppHeaderProps = { activeLabel: string; onCreateNew: () => void };
export function AppHeader({ activeLabel, onCreateNew }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070A12]/86 px-3 py-3 backdrop-blur-2xl sm:px-5 lg:px-6">
      <div className="mx-auto flex max-w-[1680px] items-center gap-3">
        <div className="flex min-w-0 shrink-0 items-center gap-3 lg:w-[280px]">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-glow"><Factory className="size-5 text-white" /></div>
          <div className="hidden min-w-0 sm:block"><h1 className="truncate text-base font-black tracking-tight text-white">AI Content Factory</h1><p className="truncate text-xs text-slate-500">{activeLabel}</p></div>
        </div>
        <div className="hidden min-w-0 flex-1 md:block">
          <label className="relative mx-auto block max-w-2xl"><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><input type="search" placeholder="Tìm kiếm dự án, nội dung..." className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-11 pr-4 text-sm font-medium text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyanSoft-300/45 focus:bg-white/[0.08]" /></label>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button type="button" className="flex size-11 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white active:scale-95" aria-label="Thông báo"><Bell className="size-5" /></button>
          <Button variant="primary" className="hidden sm:inline-flex" icon={<Plus className="size-4" />} onClick={onCreateNew}>Tạo nội dung mới</Button>
          <Button variant="primary" className="size-11 px-0 sm:hidden" aria-label="Tạo nội dung mới" onClick={onCreateNew}><Plus className="size-5" /></Button>
        </div>
      </div>
    </header>
  );
}

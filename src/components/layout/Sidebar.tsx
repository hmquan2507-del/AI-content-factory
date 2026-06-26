import { Archive, Factory, MicVocal, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
export type DashboardTab = "factory" | "library" | "brand" | "settings";
export const dashboardTabs: Array<{ key: DashboardTab; label: string; description: string; icon: typeof Factory }> = [
  { key: "factory", label: "Create Studio", description: "Tạo video theo từng bước", icon: Factory },
  { key: "library", label: "Content Library", description: "Kho nội dung đã tạo", icon: Archive },
  { key: "brand", label: "Brand Voice", description: "Giọng thương hiệu", icon: MicVocal },
  { key: "settings", label: "Settings", description: "Cấu hình hệ thống", icon: Settings2 },
];
type SidebarProps = { activeTab: DashboardTab; onTabChange: (tab: DashboardTab) => void };
export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-72 shrink-0 border-r border-white/10 bg-[#080B14]/78 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <nav className="space-y-2" aria-label="Điều hướng chính">
        {dashboardTabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.key; return (
          <button key={tab.key} onClick={() => onTabChange(tab.key)} className={cn("group flex w-full cursor-pointer items-center gap-3 rounded-3xl border px-4 py-4 text-left transition duration-200 active:scale-[0.99]", isActive ? "border-violet-400/35 bg-gradient-to-r from-violet-500/18 to-blue-500/10 text-white shadow-glow" : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-slate-100")}>
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl transition", isActive ? "bg-white/12 text-cyanSoft-300" : "bg-white/[0.06] text-slate-500 group-hover:text-white")}><Icon className="size-5" /></span>
            <span className="min-w-0"><span className="block font-bold">{tab.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{tab.description}</span></span>
          </button>
        ); })}
      </nav>
      <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.075] to-white/[0.035] p-4 shadow-soft">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-white">AI Content Factory</p><p className="mt-1 text-xs text-slate-500">Workspace cá nhân</p></div><Badge tone="purple">Pro</Badge></div>
        <div className="mt-4 space-y-3"><div><div className="flex items-center justify-between text-xs font-semibold text-slate-400"><span>Người dùng</span><span>1/5</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/5 rounded-full bg-gradient-to-r from-violet-500 to-cyanSoft-500" /></div></div><div><div className="flex items-center justify-between text-xs font-semibold text-slate-400"><span>Dung lượng</span><span>2.4GB / 10GB</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[24%] rounded-full bg-gradient-to-r from-blue-500 to-cyanSoft-500" /></div></div></div>
        <Button variant="secondary" className="mt-4 w-full">Nâng cấp gói</Button>
      </div>
    </aside>
  );
}

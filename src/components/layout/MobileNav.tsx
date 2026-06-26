import type { DashboardTab } from "./Sidebar";
import { dashboardTabs } from "./Sidebar";
import { cn } from "@/lib/utils";
type MobileNavProps = { activeTab: DashboardTab; onTabChange: (tab: DashboardTab) => void };
const mobileLabels: Record<DashboardTab, string> = { factory: "Studio", library: "Library", brand: "Brand", settings: "Settings" };
export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070A12]/92 px-3 py-2 backdrop-blur-2xl safe-bottom lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {dashboardTabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.key; return <button key={tab.key} onClick={() => onTabChange(tab.key)} className={cn("flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl px-2 text-xs font-semibold transition active:scale-[0.98]", isActive ? "bg-gradient-to-br from-violet-500/22 to-blue-500/14 text-white" : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-200 active:bg-white/[0.1]")}><Icon className="size-5" /><span className="truncate">{mobileLabels[tab.key]}</span></button>; })}
      </div>
    </nav>
  );
}

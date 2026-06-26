import { Archive, Factory, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardTab = "factory" | "library" | "settings";

export const dashboardTabs: Array<{
  key: DashboardTab;
  label: string;
  description: string;
  icon: typeof Factory;
}> = [
  {
    key: "factory",
    label: "Factory",
    description: "Tạo nội dung theo từng pha",
    icon: Factory,
  },
  {
    key: "library",
    label: "Content Library",
    description: "Kho nội dung đã tạo",
    icon: Archive,
  },
  {
    key: "settings",
    label: "Brand Settings",
    description: "Giọng thương hiệu mặc định",
    icon: Settings2,
  },
];

type SidebarProps = {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
};

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-72 shrink-0 border-r border-white/10 px-4 py-5 lg:block">
      <nav className="space-y-2" aria-label="Điều hướng chính">
        {dashboardTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-3 rounded-3xl border px-4 py-4 text-left transition duration-200",
                isActive
                  ? "border-aurora-400/35 bg-aurora-500/15 text-white shadow-glow"
                  : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-slate-100",
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-2xl transition",
                  isActive ? "bg-white/12 text-cyanSoft-300" : "bg-white/[0.06] text-slate-400 group-hover:text-white",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold">{tab.label}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{tab.description}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 rounded-3xl border border-cyanSoft-300/15 bg-cyanSoft-500/10 p-4">
        <p className="text-sm font-bold text-cyanSoft-300">Phase 1</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Tập trung UI/UX, dữ liệu mock, flow rõ ràng. API Gemini, Supabase và render video sẽ để Phase 2+.
        </p>
      </div>
    </aside>
  );
}

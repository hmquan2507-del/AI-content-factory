import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ActivityLogItem } from "@/lib/types";
const iconMap = { info: Info, success: CheckCircle2, warning: AlertTriangle };
const colorMap = { info: "text-cyanSoft-300 bg-cyanSoft-500/10", success: "text-emerald-200 bg-emerald-400/10", warning: "text-amber-200 bg-amber-400/10" };
type ActivityLogPanelProps = { logs: ActivityLogItem[] };
export function ActivityLogPanel({ logs }: ActivityLogPanelProps) {
  return (
    <Card className="border-white/10 bg-[#0D111C]/90">
      <h2 className="text-lg font-black text-white">Activity Log</h2>
      <p className="mt-1 text-sm text-slate-400">Các thao tác gần nhất trong studio.</p>
      <div className="mt-4 max-h-[330px] space-y-3 overflow-auto pr-1 scrollbar-soft">
        {logs.map((log) => {
          const Icon = iconMap[log.type];
          return <div key={log.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${colorMap[log.type]}`}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold leading-5 text-slate-200">{log.label}</p><p className="mt-1 text-xs text-slate-500">{log.timestamp}</p></div></div>;
        })}
      </div>
    </Card>
  );
}

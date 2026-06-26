import { CheckCircle2, Clock3, Radio } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type StatusPanelProps = { scriptReady: boolean; voiceReady: boolean; videoReady: boolean };
const statusItems = [{ key: "script", label: "Script" }, { key: "voice", label: "Voice" }, { key: "video", label: "Video" }] as const;

export function StatusPanel({ scriptReady, voiceReady, videoReady }: StatusPanelProps) {
  const readyMap = { script: scriptReady, voice: voiceReady, video: videoReady };
  const labelMap = { script: scriptReady ? "Sẵn sàng" : "Chưa tạo", voice: voiceReady ? "Sẵn sàng" : "Chưa tạo", video: videoReady ? "Sẵn sàng" : "Chưa render" };
  return (
    <Card className="border-white/10 bg-[#0D111C]/90">
      <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-black text-white">Trạng thái</h2><Radio className="size-5 text-cyanSoft-300" /></div>
      <div className="mt-4 space-y-3">
        {statusItems.map((item) => {
          const isReady = readyMap[item.key];
          const Icon = isReady ? CheckCircle2 : Clock3;
          return (
            <div key={item.key} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center gap-3"><span className={cn("flex size-9 items-center justify-center rounded-xl", isReady ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300")}><Icon className="size-4" /></span><span className="text-sm font-bold text-slate-200">{item.label}</span></div>
              <span className={cn("text-xs font-bold", isReady ? "text-emerald-300" : "text-slate-500")}>{labelMap[item.key]}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

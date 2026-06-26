import { Mic2, Pause, Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Phase3VoicePreviewProps = {
  isReady: boolean;
  onPreparePublish: () => void;
};

export function Phase3VoicePreview({ isReady, onPreparePublish }: Phase3VoicePreviewProps) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone={isReady ? "green" : "neutral"}>{isReady ? "Voice demo sẵn sàng" : "Chưa có voice"}</Badge>
          <h2 className="mt-3 text-xl font-black tracking-tight text-white">Tạo giọng đọc demo</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Phase 1 chỉ mô phỏng khung nghe thử. File âm thanh thật sẽ được xử lý ở Phase 2/3.
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={onPreparePublish}>
          Chuẩn bị đăng
        </Button>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cyanSoft-500/12 text-cyanSoft-300">
            <Mic2 className="size-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-white">Voice preview giả lập</p>
            <p className="mt-1 text-sm text-slate-400">Nữ miền Nam, rõ chữ, tốc độ vừa phải · 30 giây</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-1/5 rounded-full bg-cyanSoft-300/80" />
              <span className="h-2 w-1/4 rounded-full bg-aurora-400/80" />
              <span className="h-2 w-1/6 rounded-full bg-white/20" />
              <span className="h-2 flex-1 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="size-12 px-0" aria-label="Play demo">
              <Play className="size-5" />
            </Button>
            <Button variant="ghost" className="size-12 px-0" aria-label="Pause demo">
              <Pause className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

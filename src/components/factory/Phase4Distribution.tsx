import { Save } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase4DistributionProps = {
  selectedPlatforms: Platform[];
  onTogglePlatform: (platform: Platform) => void;
  onSaveToLibrary: () => void;
};

const platforms: Array<{ name: Platform; note: string }> = [
  { name: "TikTok", note: "Ưu tiên hook mạnh, nhịp nhanh" },
  { name: "YouTube Shorts", note: "Rõ vấn đề, CTA ngắn" },
  { name: "Instagram Reels", note: "Visual đẹp, caption gọn" },
];

export function Phase4Distribution({ selectedPlatforms, onTogglePlatform, onSaveToLibrary }: Phase4DistributionProps) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="cyan">Phase 4</Badge>
          <h2 className="mt-3 text-xl font-black tracking-tight text-white">Chuẩn bị đăng</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Chọn nền tảng muốn xuất bản. Phase 1 chưa đăng thật, chỉ chuẩn bị dữ liệu demo để lưu vào kho nội dung.
          </p>
        </div>
        <Button variant="primary" size="lg" icon={<Save className="size-5" />} onClick={onSaveToLibrary}>
          Lưu vào kho nội dung
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {platforms.map((platform) => {
          const checked = selectedPlatforms.includes(platform.name);
          return (
            <button
              key={platform.name}
              onClick={() => onTogglePlatform(platform.name)}
              className={cn(
                "cursor-pointer rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 active:translate-y-0",
                checked
                  ? "border-cyanSoft-300/40 bg-cyanSoft-500/12"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black text-white">{platform.name}</h3>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border text-xs",
                    checked ? "border-cyanSoft-300 bg-cyanSoft-500/20 text-cyanSoft-300" : "border-white/15 text-slate-500",
                  )}
                >
                  {checked ? "✓" : "+"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{platform.note}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

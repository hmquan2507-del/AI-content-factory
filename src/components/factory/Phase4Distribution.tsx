import { Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase4DistributionProps = {
  selectedPlatforms: Platform[];
  isSaving: boolean;
  onTogglePlatform: (platform: Platform) => void;
  onSaveToLibrary: () => void;
};

const platforms: Array<{ name: Platform; note: string }> = [
  { name: "TikTok", note: "Ưu tiên hook mạnh, nhịp nhanh" },
  { name: "YouTube Shorts", note: "Rõ vấn đề, CTA ngắn" },
  { name: "Instagram Reels", note: "Visual đẹp, caption gọn" },
];

export function Phase4Distribution({ selectedPlatforms, isSaving, onTogglePlatform, onSaveToLibrary }: Phase4DistributionProps) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="cyan">Phase 4</Badge>
          <h2 className="mt-3 text-xl font-black tracking-tight text-white">Chuẩn bị đăng</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Chọn nền tảng muốn xuất bản. Phase 3 lưu nội dung vào Supabase nếu đã cấu hình, nếu lỗi sẽ lưu tạm local.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
          onClick={onSaveToLibrary}
          disabled={isSaving}
        >
          {isSaving ? "Đang lưu..." : "Lưu vào kho nội dung"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {platforms.map((platform) => {
          const checked = selectedPlatforms.includes(platform.name);
          return (
            <button
              key={platform.name}
              onClick={() => onTogglePlatform(platform.name)}
              disabled={isSaving}
              className={cn(
                "cursor-pointer rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60",
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

import { Bell, Database, KeyRound, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
const settingCards = [
  { title: "API Keys", description: "Gemini và Supabase đang đọc từ biến môi trường, không đưa key vào client.", icon: KeyRound },
  { title: "Database", description: "Content Library dùng Supabase khi đã cấu hình, fallback demo khi lỗi.", icon: Database },
  { title: "Thông báo", description: "Toast và Activity Log giúp người mới hiểu app đang xử lý gì.", icon: Bell },
  { title: "Production guard", description: "Phase sau cần auth/user_id và siết lại RLS policy trước khi bán thật.", icon: ShieldCheck },
];
export function SettingsPanel() {
  return (
    <div className="space-y-5">
      <div><p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanSoft-300">Settings</p><h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Cài đặt hệ thống</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Khu vực này giữ vai trò tổng quan cấu hình. Phase 3.5 chưa thêm logic mới ngoài UI polish.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        {settingCards.map((item) => { const Icon = item.icon; return <Card key={item.title} className="border-white/10 bg-[#0D111C]/90"><div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/12 text-violet-300"><Icon className="size-6" /></span><div><Badge tone="neutral">Phase 3.5</Badge><h3 className="mt-3 text-lg font-black text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p></div></div></Card>; })}
      </div>
    </div>
  );
}

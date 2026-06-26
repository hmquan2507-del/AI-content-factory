import type { ActivityLogItem, BrandSettings, ContentItem, IdeaPreset, SlideItem } from "./types";

export const ideaPresets: IdeaPreset[] = [
  {
    id: "spa-launch",
    label: "Spa / Làm đẹp",
    title: "3 dấu hiệu da đang cần phục hồi gấp",
    rawIdea:
      "Làm video ngắn cho spa, giải thích 3 dấu hiệu da yếu, dễ kích ứng và gợi ý khách đặt lịch soi da miễn phí.",
    platform: "TikTok",
  },
  {
    id: "hotel-weekend",
    label: "Khách sạn / Homestay",
    title: "Cuối tuần đi trốn ở một nơi yên tĩnh",
    rawIdea:
      "Tạo video 30 giây giới thiệu phòng nghỉ yên tĩnh, gần trung tâm, có góc chụp đẹp và lời kêu gọi đặt phòng qua Zalo.",
    platform: "Instagram Reels",
  },
  {
    id: "fashion-drop",
    label: "Shop thời trang",
    title: "Một set đồ đi chơi không cần suy nghĩ nhiều",
    rawIdea:
      "Viết video dạng review nhanh cho shop quần áo nữ, tập trung vào phối đồ dễ mặc, hack dáng và ưu đãi trong hôm nay.",
    platform: "YouTube Shorts",
  },
];

export const demoSlides: SlideItem[] = [
  {
    id: "slide-1",
    title: "Hook mở đầu",
    duration: "0-4s",
    overlayText: "Bạn đang bỏ lỡ khách chỉ vì video chưa đủ cuốn?",
    visualDirection: "Cận cảnh điện thoại đang lướt qua nhiều video, dừng lại ở một video bán hàng nổi bật.",
    narration: "Bạn có sản phẩm tốt, nhưng khách lướt qua quá nhanh vì video mở đầu chưa đủ giữ chân.",
  },
  {
    id: "slide-2",
    title: "Nỗi đau",
    duration: "4-10s",
    overlayText: "Ý tưởng có rồi, nhưng viết kịch bản quá lâu",
    visualDirection: "Bàn làm việc tối giản, chủ shop nhìn màn hình trống với nhiều ghi chú lộn xộn.",
    narration: "Mỗi ngày phải nghĩ hook, viết caption, chia cảnh và sửa nội dung khiến bạn mất rất nhiều thời gian.",
  },
  {
    id: "slide-3",
    title: "Giải pháp",
    duration: "10-20s",
    overlayText: "AI Content Factory chia video thành từng bước rõ ràng",
    visualDirection: "Dashboard hiện đại hiển thị các bước Idea, Script, Voice và Publish.",
    narration: "AI Content Factory giúp bạn biến ý tưởng thô thành kịch bản video ngắn có cấu trúc rõ ràng.",
  },
  {
    id: "slide-4",
    title: "CTA",
    duration: "20-30s",
    overlayText: "Lưu ý tưởng, tạo kịch bản, chuẩn bị đăng trong một nơi",
    visualDirection: "Preview video dọc 9:16, bên cạnh là nút lưu vào kho nội dung.",
    narration: "Chỉ cần nhập ý tưởng, chọn nền tảng và lưu lại để triển khai nội dung nhanh hơn mỗi ngày.",
  },
];

export const demoContentItems: ContentItem[] = [
  {
    id: "content-1",
    title: "5 lỗi khiến video bán hàng bị lướt qua",
    hook: "Khách không bỏ qua sản phẩm của bạn, họ bỏ qua cách bạn mở đầu video.",
    platform: "TikTok",
    status: "Ready",
    createdAt: "24/06/2026",
    slides: demoSlides,
  },
  {
    id: "content-2",
    title: "Một ngày làm nội dung cho shop nhỏ",
    hook: "Nếu mỗi ngày bạn mất 2 tiếng để nghĩ nội dung, hãy thử quy trình này.",
    platform: "YouTube Shorts",
    status: "Draft",
    createdAt: "23/06/2026",
    slides: demoSlides,
  },
  {
    id: "content-3",
    title: "Video review phòng nghỉ cuối tuần",
    hook: "Đây là kiểu video giúp khách hình dung cảm giác ở thật trước khi đặt phòng.",
    platform: "Instagram Reels",
    status: "Published",
    createdAt: "22/06/2026",
    slides: demoSlides,
  },
];

export const defaultBrandSettings: BrandSettings = {
  brandVoice: "Rõ ràng, gần gũi, có cảm giác tư vấn thật như người bán hàng am hiểu sản phẩm.",
  targetAudience: "Chủ shop nhỏ, spa, homestay, khách sạn mini và người mới làm affiliate.",
  defaultCta: "Nhắn Zalo để được tư vấn nhanh và nhận mẫu nội dung phù hợp.",
  tonePresets: ["Chuyên nghiệp", "Gần gũi", "Bán hàng nhẹ nhàng", "Truyền cảm hứng"],
  ttsVoice: "Nữ miền Nam - rõ chữ, tốc độ vừa phải",
};

export const demoActivityLogs: ActivityLogItem[] = [
  {
    id: "log-1",
    label: "Đã nạp dữ liệu demo cho Phase 1 UI.",
    timestamp: "11:20",
    type: "info",
  },
  {
    id: "log-2",
    label: "Kho nội dung sẵn sàng hiển thị các video mẫu.",
    timestamp: "11:21",
    type: "success",
  },
  {
    id: "log-3",
    label: "API, database và render video thật chưa được kết nối ở Phase 1.",
    timestamp: "11:22",
    type: "warning",
  },
];

export const demoHook = "Khách không dừng lại vì video dài, họ dừng lại vì 3 giây đầu đủ đúng vấn đề.";

export const demoScript =
  "Mở đầu bằng một vấn đề thật cụ thể, sau đó đưa ra bối cảnh quen thuộc, giải thích giải pháp ngắn gọn và kết thúc bằng CTA dễ hành động. Video nên giữ nhịp nhanh, mỗi slide chỉ truyền tải một ý chính.";

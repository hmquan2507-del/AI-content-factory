# AI Content Factory

SaaS dashboard demo cho quy trình tạo nội dung video ngắn theo từng pha.

## Phase hiện tại

- Phase 1: UI/UX dashboard hoàn chỉnh.
- Phase 2: API server-side gọi Gemini qua Next.js App Router API routes.

## Cách chạy local

```bash
npm install
npm run dev
```

Mở:

```txt
http://localhost:3000
```

Kiểm tra build:

```bash
npm run build
```

## Cấu hình Gemini API

Tạo file `.env.local` ở thư mục gốc project:

```env
GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-2.5-flash
```

Không dùng `NEXT_PUBLIC_GEMINI_API_KEY` vì Gemini API chỉ được gọi ở server-side API routes.

Nếu thiếu `GEMINI_API_KEY`, API sẽ trả lỗi rõ ràng và frontend fallback về dữ liệu demo.

## API Routes Phase 2

```txt
POST /api/ai/brainstorm
POST /api/ai/generate-script
POST /api/ai/polish-script
```

## Phần vẫn là demo/mock

- Chưa có Supabase/database thật.
- Chưa render video thật.
- Chưa tạo voice/TTS thật.
- Chưa đăng TikTok/YouTube/Reels thật.
- Content Library vẫn lưu bằng local state trong phiên chạy.
# AI-content-factory

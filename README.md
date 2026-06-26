# AI Content Factory

SaaS dashboard demo cho quy trình tạo nội dung video ngắn theo từng pha.

## Phase hiện tại

- Phase 1: UI/UX dashboard hoàn chỉnh.
- Phase 2: API server-side gọi Gemini qua Next.js App Router API routes.
- Phase 3: Supabase Postgres lưu, tải, cập nhật, nhân bản và xoá Content Library.

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

## Cấu hình môi trường

Tạo file `.env.local` ở thư mục gốc project:

```env
GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-2.5-flash

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Không dùng `NEXT_PUBLIC_GEMINI_API_KEY` vì Gemini API chỉ được gọi ở server-side API routes.

Nếu thiếu `GEMINI_API_KEY`, API Gemini sẽ trả lỗi rõ ràng và frontend fallback về dữ liệu demo.
Nếu thiếu Supabase env, Content Library sẽ hiển thị demo data và Save to Library sẽ fallback local.

## Supabase schema

Copy nội dung file sau vào Supabase SQL Editor rồi chạy:

```txt
supabase/schema.sql
```

Phase 3 tạm mở RLS cho `anon` để demo local nhanh. Khi làm production/auth thật cần thêm `user_id` và siết policy theo từng user.

## API Routes

### Gemini

```txt
POST /api/ai/brainstorm
POST /api/ai/generate-script
POST /api/ai/polish-script
```

### Content Library

```txt
GET    /api/content
POST   /api/content
PATCH  /api/content/[id]
DELETE /api/content/[id]
POST   /api/content/[id]/duplicate
```

## Phần vẫn là demo/mock

- Chưa render video thật.
- Chưa tạo voice/TTS thật.
- Chưa đăng TikTok/YouTube/Reels thật.
- Chưa có login/auth nhiều user.
- Chưa dùng Supabase Storage.

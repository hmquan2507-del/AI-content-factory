import type { BrainstormRequest, GenerateScriptRequest, PolishScriptRequest } from "./types";

const jsonRule = `
QUY TẮC BẮT BUỘC:
- Chỉ trả về JSON hợp lệ.
- Không dùng markdown.
- Không bọc trong \`\`\`json.
- Không giải thích ngoài JSON.
- Nội dung tiếng Việt, rõ ràng, dễ hiểu cho người mới.
`;

const gradientRule = `
Trường bgGradient chỉ được chọn một trong các chuỗi sau:
- from-purple-950 via-slate-950 to-black
- from-indigo-950 via-slate-950 to-black
- from-cyan-950 via-slate-950 to-black
- from-rose-950 via-slate-950 to-black
- from-emerald-950 via-slate-950 to-black
`;

const visualKeywordRule = `
Trường visualKeyword chỉ được chọn một trong các giá trị sau:
idea, warning, money, rocket, voice, script, chart, user, brain, calendar, camera
`;

export function createBrainstormPrompt(input: BrainstormRequest): string {
  return `
Bạn là AI Content Strategist cho video ngắn bán hàng, affiliate và dịch vụ nhỏ.

Hãy brainstorm một ý tưởng video ngắn có thể triển khai ngay.

Thông tin đầu vào:
- Ngách/chủ đề: ${input.niche}
- Tone mong muốn: ${input.tone}
- Khách hàng mục tiêu: ${input.targetAudience}
- Brand voice: ${input.brandVoice || "Rõ ràng, gần gũi, tư vấn thật"}

Yêu cầu output JSON đúng schema:
{
  "title": "tiêu đề nội dung ngắn, dễ hiểu",
  "rawIdea": "ý tưởng thô đủ chi tiết để tạo kịch bản video 30 giây",
  "angle": "góc tiếp cận chính của video"
}

${jsonRule}
`;
}

export function createGenerateScriptPrompt(input: GenerateScriptRequest): string {
  const durationSeconds = input.durationSeconds ?? 30;
  const platform = input.platform ?? "TikTok";

  return `
Bạn là Senior Short-form Video Scriptwriter chuyên tạo kịch bản video dọc 9:16 cho ${platform}.

Nhiệm vụ: biến ý tưởng thô thành hook, kịch bản, slide, caption, hashtag và CTA.

Thông tin đầu vào:
- Tiêu đề thô: ${input.rawTitle}
- Ý tưởng thô: ${input.rawIdea}
- Brand voice: ${input.brandVoice}
- Khách hàng mục tiêu: ${input.targetAudience}
- Thời lượng mục tiêu: ${durationSeconds} giây
- Nền tảng: ${platform}

Yêu cầu nội dung:
- Hook mạnh, đi thẳng vào vấn đề, không quá dài.
- Script phù hợp video ngắn, dễ đọc voice-over.
- Slides tối ưu cho video dọc 9:16.
- Mỗi slideText tối đa khoảng 10-14 từ.
- Mỗi slide chỉ truyền tải một ý chính.
- Caption ngắn, có tính bán hàng nhưng không quá gượng ép.
- Hashtags liên quan, không spam.
- CTA rõ ràng, dễ hành động.

${gradientRule}
${visualKeywordRule}

Yêu cầu output JSON đúng schema:
{
  "hooks": ["3-5 hook khác nhau"],
  "selectedHook": "hook tốt nhất được chọn",
  "scriptBody": "kịch bản voice-over hoàn chỉnh",
  "visualCues": "mô tả tổng quan nhịp hình và visual",
  "slides": [
    {
      "id": "slide-1",
      "slideText": "text lớn trên slide, tối đa 10-14 từ",
      "subtitle": "dòng phụ nếu cần",
      "visualKeyword": "idea",
      "bgGradient": "from-purple-950 via-slate-950 to-black",
      "durationSec": 5
    }
  ],
  "caption": "caption đăng bài",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "cta": "lời kêu gọi hành động"
}

${jsonRule}
`;
}

export function createPolishScriptPrompt(input: PolishScriptRequest): string {
  return `
Bạn là Script Editor chuyên tối ưu kịch bản video ngắn bán hàng.

Nhiệm vụ: tối ưu kịch bản hiện tại theo directive nhưng KHÔNG làm mất ý chính ban đầu.

Kịch bản hiện tại:
${input.scriptBody}

Yêu cầu tối ưu:
${input.directive}

Brand voice:
${input.brandVoice}

Khách hàng mục tiêu:
${input.targetAudience}

Yêu cầu:
- Giữ lại thông điệp chính.
- Làm câu chữ gọn, rõ, dễ đọc voice-over hơn.
- Nếu cần, cải thiện hook nhưng không bịa sai sản phẩm/dịch vụ.
- Ghi notes ngắn gọn về những gì đã cải thiện.

Yêu cầu output JSON đúng schema:
{
  "optimizedScript": "kịch bản đã tối ưu",
  "improvedHook": "hook cải thiện nếu có",
  "notes": ["ghi chú cải thiện 1", "ghi chú cải thiện 2"]
}

${jsonRule}
`;
}

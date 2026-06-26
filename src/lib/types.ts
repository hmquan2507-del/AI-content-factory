export type PhaseKey = "idea" | "script" | "voice" | "publish";

export type Platform = "TikTok" | "YouTube Shorts" | "Instagram Reels";

export type ContentStatus = "Draft" | "Ready" | "Published";

export type ActivityLogType = "info" | "success" | "warning";

export type VisualKeyword =
  | "idea"
  | "warning"
  | "money"
  | "rocket"
  | "voice"
  | "script"
  | "chart"
  | "user"
  | "brain"
  | "calendar"
  | "camera";

export type SlideItem = {
  id: string;
  title: string;
  duration: string;
  overlayText: string;
  visualDirection: string;
  narration: string;
  subtitle?: string;
  visualKeyword?: VisualKeyword;
  bgGradient?: string;
  durationSec?: number;
};

export type ContentItem = {
  id: string;
  title: string;
  hook: string;
  platform: Platform;
  status: ContentStatus;
  createdAt: string;
  slides: SlideItem[];
  caption?: string;
  hashtags?: string[];
  cta?: string;
};

export type ActivityLogItem = {
  id: string;
  label: string;
  timestamp: string;
  type: ActivityLogType;
};

export type BrandSettings = {
  brandVoice: string;
  targetAudience: string;
  defaultCta: string;
  tonePresets: string[];
  ttsVoice: string;
  selectedTone?: string;
};

export type IdeaPreset = {
  id: string;
  label: string;
  title: string;
  rawIdea: string;
  platform: Platform;
};

import type { ContentStatus, Platform, SlideItem } from "@/lib/types";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ContentItemRow = {
  id: string;
  title: string;
  raw_idea: string | null;
  selected_hook: string | null;
  script_body: string | null;
  visual_cues: string | null;
  slides: SlideItem[];
  caption: string | null;
  hashtags: string[];
  cta: string | null;
  platforms: string[];
  status: string;
  audio_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentItemInsert = {
  title: string;
  raw_idea?: string | null;
  selected_hook?: string | null;
  script_body?: string | null;
  visual_cues?: string | null;
  slides?: SlideItem[];
  caption?: string | null;
  hashtags?: string[];
  cta?: string | null;
  platforms?: Platform[];
  status?: Lowercase<ContentStatus>;
  audio_url?: string | null;
  video_url?: string | null;
};

export type ContentItemUpdate = Partial<ContentItemInsert>;

export type Database = {
  public: {
    Tables: {
      content_items: {
        Row: ContentItemRow;
        Insert: ContentItemInsert;
        Update: ContentItemUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

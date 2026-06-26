import type { z } from "zod";
import type {
  BrainstormRequestSchema,
  BrainstormResponseSchema,
  GenerateScriptRequestSchema,
  GenerateScriptResponseSchema,
  PolishScriptRequestSchema,
  PolishScriptResponseSchema,
} from "./schemas";

export type BrainstormRequest = z.infer<typeof BrainstormRequestSchema>;
export type BrainstormResponse = z.infer<typeof BrainstormResponseSchema>;

export type GenerateScriptRequest = z.infer<typeof GenerateScriptRequestSchema>;
export type GenerateScriptResponse = z.infer<typeof GenerateScriptResponseSchema>;
export type GeneratedSlide = GenerateScriptResponse["slides"][number];

export type PolishScriptRequest = z.infer<typeof PolishScriptRequestSchema>;
export type PolishScriptResponse = z.infer<typeof PolishScriptResponseSchema>;

export type AiErrorResponse = {
  error: string;
};

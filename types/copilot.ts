import { z } from "zod";

export const CopilotEvidenceSchema = z.object({
  quote: z.string().default(""),
  pageNumber: z.number().nullable().default(null),
  section: z.string().nullable().default(null),
});

export const CopilotResponseSchema = z.object({
  answer: z.string().default(""),
  explanation: z.string().default(""),
  foundInDocument: z.boolean().default(true),
  evidence: CopilotEvidenceSchema.nullable().default(null),
  followUpQuestions: z.array(z.string()).default([]),
});

export type CopilotEvidence = z.infer<typeof CopilotEvidenceSchema>;
export type CopilotResponse = z.infer<typeof CopilotResponseSchema>;

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text: string;
  response?: CopilotResponse;
  error?: string;
}

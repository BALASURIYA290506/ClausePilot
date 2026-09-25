import { z } from "zod";

export const PartySchema = z.object({
  name: z.string().default(""),
  role: z.string().default("Contracting Party"),
  evidence: z.string().default(""),
  sourcePage: z.number().nullable().default(null),
});

export const ImportantDateSchema = z.object({
  label: z.string().default(""),
  dateOrRule: z.string().default(""),
  significance: z.string().default(""),
  evidence: z.string().default(""),
  sourcePage: z.number().nullable().default(null),
});

export const FinancialTermSchema = z.object({
  label: z.string().default(""),
  amountOrValue: z.string().default(""),
  condition: z.string().default(""),
  evidence: z.string().default(""),
  sourcePage: z.number().nullable().default(null),
});

export const ObligationSchema = z.object({
  actor: z.string().default(""),
  obligation: z.string().default(""),
  condition: z.string().nullable().default(null),
  evidence: z.string().default(""),
  sourcePage: z.number().nullable().default(null),
});

export const ClauseInsightSchema = z.object({
  title: z.string().default(""),
  category: z.string().default("Other"),
  summary: z.string().default(""),
  plainEnglishExplanation: z.string().default(""),
  whyItMatters: z.string().default(""),
  evidence: z.string().default(""),
  sourcePage: z.number().nullable().default(null),
  sourceSection: z.string().nullable().default(null),
});

export const AttentionPointSchema = z.object({
  title: z.string().default(""),
  reason: z.string().default(""),
  category: z.string().default("Attention"),
  evidence: z.string().default(""),
  sourcePage: z.number().nullable().default(null),
  sourceSection: z.string().nullable().default(null),
});

export const DocumentAnalysisSchema = z.object({
  documentType: z.string().default("Legal Agreement"),
  title: z.string().nullable().default(null),
  purpose: z.string().default("Legal agreement purpose and operational scope."),
  parties: z.array(PartySchema).default([]),
  importantDates: z.array(ImportantDateSchema).default([]),
  financialTerms: z.array(FinancialTermSchema).default([]),
  obligations: z.array(ObligationSchema).default([]),
  termination: z.array(ClauseInsightSchema).default([]),
  renewal: z.array(ClauseInsightSchema).default([]),
  disputeResolution: z.array(ClauseInsightSchema).default([]),
  governingLaw: z.array(ClauseInsightSchema).default([]),
  importantClauses: z.array(ClauseInsightSchema).default([]),
  attentionPoints: z.array(AttentionPointSchema).default([]),
});

export type Party = z.infer<typeof PartySchema>;
export type ImportantDate = z.infer<typeof ImportantDateSchema>;
export type FinancialTerm = z.infer<typeof FinancialTermSchema>;
export type Obligation = z.infer<typeof ObligationSchema>;
export type ClauseInsight = z.infer<typeof ClauseInsightSchema>;
export type AttentionPoint = z.infer<typeof AttentionPointSchema>;
export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;

export const ExplainClauseResponseSchema = z.object({
  simpleExplanation: z.string().default(""),
  keyTakeaway: z.string().default(""),
});
export type ExplainClauseResponse = z.infer<typeof ExplainClauseResponseSchema>;


import { DocumentData, DocumentPage } from "@/types/document";

/**
 * Prepares and formats DocumentData for future Gemini LLM prompts.
 * Keeps the Gemini ingestion layer decoupled from the PDF extraction engine.
 */
export interface GeminiDocumentPayload {
  documentId: string;
  fileName: string;
  totalPageCount: number;
  totalCharacters: number;
  hasLowTextPages: boolean;
  structuredDocumentContext: string;
  pageReferences: { pageNumber: number; characterCount: number; snippet: string }[];
}

export function prepareDocumentForGemini(data: DocumentData): GeminiDocumentPayload {
  const pageReferences = data.pages.map((p) => ({
    pageNumber: p.pageNumber,
    characterCount: p.characterCount,
    snippet: p.text.substring(0, 160).replace(/\n/g, " ") + (p.text.length > 160 ? "..." : ""),
  }));

  // Clean structured context ensuring page markers remain explicit for grounding
  const structuredDocumentContext = data.fullText;

  return {
    documentId: data.id,
    fileName: data.fileName,
    totalPageCount: data.pageCount,
    totalCharacters: data.extractedCharacterCount,
    hasLowTextPages: data.hasLowTextPages,
    structuredDocumentContext,
    pageReferences,
  };
}

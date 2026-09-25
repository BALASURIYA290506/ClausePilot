import path from "path";
import { pathToFileURL } from "url";
import { DocumentData, DocumentPage } from "@/types/document";

const pdfParse = require("pdf-parse");

/**
 * Extracts structured, page-aware text from a PDF Buffer.
 * Preserves exact page numbers, character counts, and handles low-text/scanned pages gracefully.
 */
export async function extractPdfDocument(
  buffer: Buffer,
  fileName: string
): Promise<DocumentData> {
  if (!buffer || buffer.length === 0) {
    throw new Error("The uploaded PDF file appears to be empty.");
  }

  // Validate PDF magic bytes (%PDF-)
  const isPdf = buffer.slice(0, 5).toString("ascii").startsWith("%PDF");
  if (!isPdf) {
    throw new Error("Please upload a valid PDF document. The file header is missing PDF markers.");
  }

  const extractedPages: DocumentPage[] = [];

  const customPageRender = async (pageData: any) => {
    try {
      const textContent = await pageData.getTextContent({
        normalizeWhitespace: true,
        disableCombineTextItems: false,
      });

      let rawText = "";
      for (const item of textContent.items) {
        if (typeof item.str === "string") {
          rawText += item.str + " ";
        }
      }

      const cleanText = rawText.replace(/\s+/g, " ").trim();
      const pageNumber = (pageData.pageIndex ?? 0) + 1;
      const charCount = cleanText.length;
      const hasText = charCount >= 25;

      extractedPages.push({
        pageNumber,
        text: cleanText,
        characterCount: charCount,
        hasText,
      });

      return cleanText;
    } catch {
      const pageNumber = (pageData?.pageIndex ?? 0) + 1;
      extractedPages.push({
        pageNumber,
        text: "",
        characterCount: 0,
        hasText: false,
      });
      return "";
    }
  };

  try {
    const parseResult = await pdfParse(buffer, {
      pagerender: customPageRender,
    });

    // Ensure pages are sorted in sequential order
    extractedPages.sort((a, b) => a.pageNumber - b.pageNumber);

    if (extractedPages.length === 0) {
      throw new Error("No readable text found in this PDF.");
    }

    // Build structured fullText with explicit page separators
    const fullText = extractedPages
      .map((p) => `--- PAGE ${p.pageNumber} ---\n${p.text || "[No selectable text on this page]"}`)
      .join("\n\n");

    const totalExtractedChars = extractedPages.reduce(
      (sum, p) => sum + p.characterCount,
      0
    );

    const hasLowTextPages = extractedPages.some((p) => !p.hasText);

    return {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName,
      fileSize: buffer.length,
      pageCount: extractedPages.length,
      extractedCharacterCount: totalExtractedChars,
      pages: extractedPages,
      fullText,
      hasLowTextPages,
      extractedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    if (error.message?.includes("password")) {
      throw new Error("We couldn't read this PDF because it is password protected.");
    }
    throw new Error(
      error.message || "We couldn't read this PDF. It may be corrupted or contains unsupported formatting."
    );
  }
}


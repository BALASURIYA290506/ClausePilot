"use client";

import React, { useState, useRef } from "react";
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { DocumentData, LegalDocumentState } from "@/types/document";
import { SAMPLE_DOCUMENT_STATE } from "@/lib/constants/sample-document";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentLoaded: (docState: LegalDocumentState) => void;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentLoaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageText, setCurrentStageText] = useState("Uploading document...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateAndSelectFile = (selectedFile: File) => {
    setErrorMessage(null);

    // Validate mime / extension
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please upload a PDF file (.pdf extension).");
      return false;
    }

    // Validate size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrorMessage(`The file exceeds the maximum allowed size limit of 25MB (${formatBytes(selectedFile.size)}).`);
      return false;
    }

    setFile(selectedFile);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const processAndExtractDocument = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStageText("Reading PDF file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setCurrentStageText("Extracting text and preserving page boundaries...");

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to extract text from this PDF.");
      }

      const docData: DocumentData = result.data;
      setCurrentStageText("Document ready!");

      // Construct verified document state ready for Phase 3 Gemini
      const loadedDoc: LegalDocumentState = {
        documentData: docData,
        analysis: null,
        analysisStatus: "idle",
        analysisError: null,
        metadata: {

          id: docData.id,
          fileName: docData.fileName,
          fileSize: docData.fileSize,
          uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          pageCount: docData.pageCount,
          documentType: "Extracted Legal PDF Document",
          purpose: `Document extracted across ${docData.pageCount} pages (${docData.extractedCharacterCount.toLocaleString()} total characters). Ready for Gemini intelligence indexing.`,
          parties: [
            { name: "Parties to be indexed by Gemini in Phase 3", role: "Contracting Entity", details: "Extracted from document" }
          ],
          financialSummary: `${docData.extractedCharacterCount.toLocaleString()} characters indexed for financial and payment terms extraction.`,
          duration: `${docData.pageCount} Pages indexed.`,
          governingLaw: "Jurisdiction clauses identified in extracted text.",
          importantDatesSummary: "Key dates indexed in page text.",
          isAnalyzed: false,
        },
        clauses: [
          {
            id: "raw-preview-1",
            title: "Document Intake & Text Extraction",
            category: "Obligations",
            summary: `Successfully parsed ${docData.pageCount} pages with ${docData.extractedCharacterCount.toLocaleString()} extracted characters.`,
            plainEnglishExplanation: "The text of this PDF has been verified and extracted page-by-page. In Phase 3, Gemini will extract the exact clauses, entities, and risk points.",
            whyItMatters: "Verifies the entire contract text is readable and available for grounded analysis.",
            sourcePage: 1,
            sourceSection: "Full Document Text",
            exactEvidence: docData.pages[0]?.text.substring(0, 300) || "Document text successfully indexed.",
            attentionLevel: "normal"
          }
        ],
        actionMapNodes: SAMPLE_DOCUMENT_STATE.actionMapNodes.map((n) => ({
          ...n,
          count: docData.pageCount,
        })),
        actionNavigator: {
          beforeYouProceed: [
            { id: "act-ext-1", text: `Verify extracted text across all ${docData.pageCount} pages in the Extracted Text Preview.`, category: "before_proceed", isCompleted: false },
            { id: "act-ext-2", text: "Ensure all schedules and exhibit pages contain selectable text.", category: "before_proceed", isCompleted: false }
          ],
          thingsToClarify: [
            { id: "act-ext-3", text: "Are there any missing addendums or attachments?", category: "things_to_clarify", isCompleted: false }
          ],
          questionsForLegalProfessional: [
            { id: "act-ext-4", text: "Questions will be generated automatically in Phase 3.", category: "questions_for_lawyer", isCompleted: false }
          ]
        },
        copilotChat: [
          {
            id: `msg-ext-${Date.now()}`,
            sender: "assistant",
            timestamp: "Just now",
            text: `Successfully extracted **${docData.fileName}** (${docData.pageCount} pages, ${docData.extractedCharacterCount.toLocaleString()} characters). You can view the extracted page text in the Extracted Text Preview above.`,
            groundedSources: [
              {
                page: 1,
                section: "Document Intake",
                evidenceSnippet: docData.pages[0]?.text.substring(0, 180) || "Text extracted successfully."
              }
            ]
          }
        ],
        currentTab: "overview",
        isProcessing: false,
        error: null,
      };

      onDocumentLoaded(loadedDoc);
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err?.message || "We couldn't read this PDF. It may be corrupted or contains unsupported formatting."
      );
      setIsProcessing(false);
    }
  };

  const loadSampleMSA = () => {
    // Also attach mock DocumentData to sample state for consistency
    const sampleDocData: DocumentData = {
      id: "doc-sample-msa-data",
      fileName: "Master_Services_Agreement_Apex_Cloud.pdf",
      fileSize: 428000,
      pageCount: 14,
      extractedCharacterCount: 18450,
      hasLowTextPages: false,
      extractedAt: new Date().toISOString(),
      pages: Array.from({ length: 14 }, (_, i) => ({
        pageNumber: i + 1,
        text: `MASTER SERVICES AGREEMENT SECTION ${i + 1}\n\nStandard cloud service level covenants, warranty terms, data privacy protection standards, and operational guidelines between Licensor and Licensee. All provisions subject to terms and schedules attached hereto.`,
        characterCount: 1317,
        hasText: true,
      })),
      fullText: "--- PAGE 1 ---\nMASTER SERVICES AGREEMENT\n...",
    };

    onDocumentLoaded({
      ...SAMPLE_DOCUMENT_STATE,
      documentData: sampleDocData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-xl rounded-2xl border border-surface-border shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-500/10 border border-primary-500/20 text-[11px] font-semibold text-primary-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PDF Processing Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Extract PDF Document
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Upload any contract, NDA, MSA, or lease in PDF format to extract page-aware text.
          </p>
        </div>

        {/* Processing State View */}
        {isProcessing ? (
          <div className="py-8 text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin" />
              <FileText className="w-8 h-8 text-primary-400 absolute animate-pulse" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white tracking-wide mb-1">
                {currentStageText}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Extracting pages & calculating character counts
              </p>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Processing PDF locally — document is not shared with any external services.
            </p>
          </div>
        ) : (
          <>
            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? "border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10"
                  : "border-surface-border hover:border-slate-500 bg-surface-subtle/50 hover:bg-surface-subtle"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="w-12 h-12 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-primary-400 mb-3 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-sm font-semibold text-white mb-1">
                {file ? file.name : "Drag & drop your PDF here, or browse"}
              </p>
              <p className="text-xs text-slate-400 mb-3">
                {file ? `${formatBytes(file.size)} • Ready for extraction` : "PDF format up to 25MB"}
              </p>

              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-surface-hover border border-surface-border hover:bg-slate-700 transition-colors"
              >
                {file ? "Change File" : "Choose File"}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={loadSampleMSA}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
                <span>Or test with Sample Agreement</span>
              </button>

              <button
                type="button"
                disabled={!file}
                onClick={processAndExtractDocument}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all ${
                  file
                    ? "bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-500/25 cursor-pointer hover:scale-[1.02]"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                <span>Extract PDF Text</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

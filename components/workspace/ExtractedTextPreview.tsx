"use client";

import React, { useState } from "react";
import { 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { DocumentData } from "@/types/document";
import { formatBytes } from "@/lib/utils";

interface ExtractedTextPreviewProps {
  documentData: DocumentData;
}

export const ExtractedTextPreview: React.FC<ExtractedTextPreviewProps> = ({
  documentData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedPage, setCopiedPage] = useState<number | null>(null);

  const handleCopyPage = (pageNumber: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPage(pageNumber);
    setTimeout(() => setCopiedPage(null), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
      {/* Header Info & Extraction Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {documentData.fileName}
              </h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Text extracted successfully
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{formatBytes(documentData.fileSize)}</span>
              <span>•</span>
              <span>{documentData.pageCount} Pages</span>
              <span>•</span>
              <span className="font-mono">{documentData.extractedCharacterCount.toLocaleString()} Characters</span>
            </div>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-surface-subtle hover:bg-surface-hover border border-surface-border transition-colors self-end sm:self-center"
        >
          <span>{isExpanded ? "Hide Extracted Text Preview" : "View Extracted Text Preview"}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Low-Text / Scanned Notice */}
      {documentData.hasLowTextPages && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Scanned / Text-Light Pages Detected: </span>
            Some pages contain little or no selectable text. Image-based pages may require OCR in a future version.
          </div>
        </div>
      )}

      {/* Expandable Page Accordion */}
      {isExpanded && (
        <div className="pt-3 border-t border-surface-border space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary-400" />
              Page-Aware Extracted Text
            </span>
            <span>{documentData.pages.length} Pages Parsed</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {documentData.pages.map((page) => (
              <div
                key={page.pageNumber}
                className="p-4 rounded-xl bg-black/40 border border-surface-border space-y-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-surface-border/50">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-600/20 text-primary-300 border border-primary-500/30">
                      PAGE {page.pageNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {page.characterCount.toLocaleString()} chars
                    </span>
                    {!page.hasText && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        Low Text
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopyPage(page.pageNumber, page.text)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedPage === page.pageNumber ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedPage === page.pageNumber ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {page.text || (
                    <span className="text-slate-500 italic">
                      [No selectable text extracted on this page]
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

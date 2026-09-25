"use client";

import React from "react";
import { GitCompare, Sparkles, FileText } from "lucide-react";
import { LegalDocumentState } from "@/types/document";

interface DocumentComparisonProps {
  documentState: LegalDocumentState;
}

export const DocumentComparison: React.FC<DocumentComparisonProps> = ({ documentState }) => {
  return (
    <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-surface-border space-y-5 animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
        <GitCompare className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Factual Diff Engine • Coming in Next Phase</span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          Document Comparison
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
          In the upcoming phase, you will be able to upload a second contract version (Document B) to generate side-by-side factual comparisons without subjective recommendations.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border text-xs text-slate-400 flex items-center justify-between">
        <span className="font-semibold text-slate-300">Active Baseline:</span>
        <span className="font-mono text-primary-300">{documentState.metadata?.fileName || "Document A"}</span>
      </div>
    </div>
  );
};

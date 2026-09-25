"use client";

import React from "react";
import { 
  FileText, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  MapPin,
  Eye
} from "lucide-react";
import { ClauseInsight } from "@/types/analysis";

interface ClauseCardProps {
  clause: ClauseInsight;
  onViewEvidence: (clause: ClauseInsight) => void;
  onExplainSimply?: (clause: ClauseInsight) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({
  clause,
  onViewEvidence,
  onExplainSimply,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "financial":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "termination":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "renewal":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      case "obligation":
      case "obligations":
        return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
      case "date":
      case "dates":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "dispute":
      case "disputes":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      default:
        return "bg-slate-700/50 text-slate-300 border-slate-600/50";
    }
  };

  const hasSourcePage = clause.sourcePage !== null && clause.sourcePage !== undefined;

  return (
    <div className="p-5 rounded-2xl bg-surface-subtle hover:bg-surface-hover border border-surface-border hover:border-primary-500/40 transition-all flex flex-col justify-between space-y-4 group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
              clause.category
            )}`}
          >
            {clause.category || "General"}
          </span>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <MapPin className="w-3 h-3 text-primary-400" />
            <span>
              {hasSourcePage ? `Page ${clause.sourcePage}` : "Source page unavailable"}
              {clause.sourceSection ? ` · ${clause.sourceSection}` : ""}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors mb-2">
          {clause.title}
        </h4>

        {/* Short summary */}
        {clause.summary && (
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {clause.summary}
          </p>
        )}

        {/* AI Plain English Explanation */}
        <div className="p-3.5 rounded-xl bg-surface border border-surface-border space-y-1 mb-3">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-300 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-accent-violet" />
            <span>AI Plain-English Explanation</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {clause.plainEnglishExplanation}
          </p>
        </div>

        {/* Why it matters */}
        {clause.whyItMatters && (
          <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-400 shrink-0 mt-0.5" />
            <span><strong className="text-slate-300">Why it matters:</strong> {clause.whyItMatters}</span>
          </div>
        )}
      </div>

      {/* Footer / Action Buttons */}
      <div className="pt-3 border-t border-surface-border/60 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] uppercase font-semibold text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          From your document
        </span>

        <div className="flex items-center gap-2">
          {onExplainSimply && (
            <button
              onClick={() => onExplainSimply(clause)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-accent-purple hover:text-white bg-accent-violet/15 hover:bg-accent-violet/30 border border-accent-violet/30 transition-all hover:scale-[1.02]"
              title="Explain this clause in simple terms"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
              <span>Explain Simply</span>
            </button>
          )}

          <button
            onClick={() => onViewEvidence(clause)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary-300 hover:text-white bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/30 transition-all hover:scale-[1.02]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Evidence</span>
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from "react";
import { X, FileText, Copy, Check, ShieldCheck, Sparkles, MapPin } from "lucide-react";

interface EvidenceItem {
  title: string;
  sourcePage?: number | string | null;
  sourceSection?: string | null;
  evidence: string;
  plainEnglishExplanation?: string;
  whyItMatters?: string;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: EvidenceItem | null;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.evidence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasSourcePage = item.sourcePage !== null && item.sourcePage !== undefined;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-dialog-title"
        aria-describedby="evidence-dialog-desc"
        className="glass-panel w-full max-w-2xl rounded-2xl border border-surface-border shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close evidence modal"
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-primary-500/15 text-primary-300 border border-primary-500/30">
              Source Transparency
            </span>
            <span className="text-slate-500">•</span>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-primary-400" />
              <span>
                {hasSourcePage ? `Page ${item.sourcePage}` : "Source page unavailable"}
                {item.sourceSection ? ` · ${item.sourceSection}` : ""}
              </span>
            </div>
          </div>
          <h3 id="evidence-dialog-title" className="text-lg font-bold text-white tracking-tight">
            {item.title}
          </h3>
        </div>

        <div id="evidence-dialog-desc" className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Exact Verbatim Evidence (From your document) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                From Your Document (Exact Evidence)
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Quote"}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-surface-border text-xs sm:text-sm font-mono text-slate-200 leading-relaxed select-text">
              "{item.evidence || "No exact text snippet available."}"
            </div>
            
            <p className="text-[11px] text-slate-500 italic">
              Verbatim extract preserved from {hasSourcePage ? `Page ${item.sourcePage}` : "the document"}. No words altered.
            </p>
          </div>

          {/* AI Plain English Explanation */}
          {item.plainEnglishExplanation && (
            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-300">
                <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
                <span>AI Explanation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {item.plainEnglishExplanation}
              </p>
            </div>
          )}

          {/* Why It Matters */}
          {item.whyItMatters && (
            <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-300">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
                <span>Why This Matters</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.whyItMatters}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-slate-500">
          <span>ClausePilot Document Intelligence</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover text-slate-300 border border-surface-border text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

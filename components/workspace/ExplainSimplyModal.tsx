"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Lightbulb, FileText, MapPin, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import { ClauseInsight, ExplainClauseResponse } from "@/types/analysis";

interface ExplainSimplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  clause: ClauseInsight | null;
  documentContext?: string;
}

export const ExplainSimplyModal: React.FC<ExplainSimplyModalProps> = ({
  isOpen,
  onClose,
  clause,
  documentContext,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExplainClauseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !clause) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/explain-clause", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clause,
            documentContext,
          }),
        });

        if (!res.ok) {
          throw new Error("Unable to explain clause right now. Please try again.");
        }

        const json = await res.json();
        if (isMounted) {
          if (json.success && json.response) {
            setData(json.response);
          } else {
            setError(json.error || "Unable to explain clause right now.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to generate plain-language explanation.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [isOpen, clause, documentContext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !clause) return null;

  const handleCopy = () => {
    if (data?.simpleExplanation) {
      navigator.clipboard.writeText(
        `Clause: ${clause.title}\n\nExplanation:\n${data.simpleExplanation}\n\nKey Takeaway:\n${data.keyTakeaway}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasSourcePage = clause.sourcePage !== null && clause.sourcePage !== undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="explain-dialog-title"
        aria-describedby="explain-dialog-desc"
        className="glass-panel w-full max-w-2xl rounded-2xl border border-primary-500/30 shadow-2xl p-6 sm:p-7 relative overflow-hidden space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Close explanation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-violet/20 text-accent-purple border border-accent-violet/40 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              EXPLAINED SIMPLY
            </span>
            <span className="text-slate-500">•</span>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-primary-400" />
              <span>
                {hasSourcePage ? `Page ${clause.sourcePage}` : "Page unindexed"}
                {clause.sourceSection ? ` · ${clause.sourceSection}` : ""}
              </span>
            </div>
          </div>
          <h3 id="explain-dialog-title" className="text-lg font-bold text-white tracking-tight">
            {clause.title}
          </h3>
        </div>

        <div id="explain-dialog-desc" className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">

        {/* Original Clause Evidence (Kept Visible) */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Original Document Clause
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">VERBATIM SOURCE</span>
          </div>
          <p className="text-xs font-mono text-slate-300 leading-relaxed max-h-32 overflow-y-auto pr-1">
            "{clause.evidence || clause.summary}"
          </p>
        </div>

        {/* Dynamic Explanation Area */}
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-7 h-7 text-primary-400 animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white">Translating legal language into plain English...</p>
              <p className="text-[11px] text-slate-400">Preserving exact legal boundaries without hallucination</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : data ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Plain English Explanation */}
            <div className="p-4 rounded-xl bg-primary-950/40 border border-primary-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
                <span>What this clause means in plain English</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                {data.simpleExplanation}
              </p>
            </div>

            {/* Key Takeaway Highlight Card */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                <span>Key Takeaway</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                {data.keyTakeaway}
              </p>
            </div>
          </div>
        ) : null}
        </div>

        {/* Footer with Disclaimer & Copy Button */}
        <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-400">
          <p className="italic">
            Based on the wording of your document. This is informational assistance, not legal advice.
          </p>

          {data && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border transition-colors self-end sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Explanation</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

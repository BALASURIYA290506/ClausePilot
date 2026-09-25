"use client";

import React, { useState } from "react";
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  Clock, 
  Scale, 
  FileCheck, 
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight,
  Eye,
  Sparkles,
  Loader2,
  RefreshCw,
  Info,
  CheckCircle2
} from "lucide-react";
import { LegalDocumentState } from "@/types/document";
import { ClauseInsight } from "@/types/analysis";
import { ExtractedTextPreview } from "./ExtractedTextPreview";
import { ClauseCard } from "./ClauseCard";
import { EvidenceModal } from "./EvidenceModal";

interface DocumentOverviewProps {
  documentState: LegalDocumentState;
  onNavigateToClauses?: () => void;
  onTriggerAnalysis?: () => void;
}

export const DocumentOverview: React.FC<DocumentOverviewProps> = ({
  documentState,
  onNavigateToClauses,
  onTriggerAnalysis,
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<{
    title: string;
    sourcePage?: number | string | null;
    sourceSection?: string | null;
    evidence: string;
    plainEnglishExplanation?: string;
    whyItMatters?: string;
  } | null>(null);

  const analysis = documentState.analysis;
  const isAnalyzing = documentState.analysisStatus === "analyzing";
  const analysisError = documentState.analysisError;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Real Extracted Document Info Panel */}
      {documentState.documentData && (
        <ExtractedTextPreview documentData={documentState.documentData} />
      )}

      {/* Analysis Error State with Retry Button */}
      {analysisError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">AI Analysis Notice</h4>
              <p className="text-xs text-rose-200 mt-0.5">{analysisError}</p>
            </div>
          </div>
          {onTriggerAnalysis && (
            <button
              onClick={onTriggerAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-sm shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>Retry Analysis</span>
            </button>
          )}
        </div>
      )}

      {/* Analyzing Loading State Banner */}
      {isAnalyzing && (
        <div className="p-6 rounded-2xl glass-panel border border-primary-500/40 text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-white">
            Gemini Document X-Ray in Progress
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Extracting contracting parties, payment terms, key dates, obligations, and grounding clause evidence from the document...
          </p>
        </div>
      )}

      {/* Main Document X-Ray Content */}
      {analysis ? (
        <>
          {/* Executive Summary & Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="glass-panel p-4 rounded-2xl border border-surface-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Document Type
              </span>
              <p className="text-xs font-bold text-white truncate" title={analysis.documentType}>
                {analysis.documentType || "Contract"}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-surface-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Parties
              </span>
              <p className="text-lg font-bold text-white font-mono">
                {analysis.parties.length}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-surface-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Financial Terms
              </span>
              <p className="text-lg font-bold text-white font-mono">
                {analysis.financialTerms.length}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-surface-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Important Dates
              </span>
              <p className="text-lg font-bold text-white font-mono">
                {analysis.importantDates.length}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-surface-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                Obligations
              </span>
              <p className="text-lg font-bold text-white font-mono">
                {analysis.obligations.length}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-surface-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Attention Points
              </span>
              <p className="text-lg font-bold text-white font-mono">
                {analysis.attentionPoints.length}
              </p>
            </div>
          </div>

          {/* Document Purpose Banner */}
          {analysis.purpose && (
            <div className="glass-panel rounded-2xl p-5 border border-surface-border">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-400 mb-1.5">
                <FileCheck className="w-4 h-4" />
                <span>Document Purpose & Scope</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {analysis.purpose}
              </p>
            </div>
          )}

          {/* Section 1: Identified Parties */}
          <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Contracting Parties ({analysis.parties.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Grounded in source text</span>
            </div>

            {analysis.parties.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific contracting parties established in document text.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.parties.map((party, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-subtle border border-surface-border flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-400">
                          {party.role || "Party"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {party.sourcePage !== null ? `Page ${party.sourcePage}` : "Source page unavailable"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {party.name}
                      </h4>
                    </div>

                    {party.evidence && (
                      <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 truncate max-w-[240px]">
                          "{party.evidence}"
                        </span>
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: `Party: ${party.name} (${party.role})`,
                              sourcePage: party.sourcePage,
                              evidence: party.evidence,
                            })
                          }
                          className="text-[11px] text-primary-400 hover:text-white font-medium shrink-0 ml-2"
                        >
                          View evidence &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Important Dates & Financial Terms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Important Dates */}
            <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Important Dates & Deadlines ({analysis.importantDates.length})
                  </h3>
                </div>
              </div>

              {analysis.importantDates.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No specific dates or deadline rules found in document.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.importantDates.map((dateItem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {dateItem.label}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {dateItem.dateOrRule}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {dateItem.significance}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                        <span>{dateItem.sourcePage !== null ? `Page ${dateItem.sourcePage}` : "Source page unavailable"}</span>
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: dateItem.label,
                              sourcePage: dateItem.sourcePage,
                              evidence: dateItem.evidence,
                              whyItMatters: dateItem.significance,
                            })
                          }
                          className="text-primary-400 hover:text-white font-sans"
                        >
                          View evidence
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Terms */}
            <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Financial Terms & Payments ({analysis.financialTerms.length})
                  </h3>
                </div>
              </div>

              {analysis.financialTerms.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No explicit financial terms or payment conditions detected.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.financialTerms.map((fin, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {fin.label}
                        </span>
                        <span className="text-xs font-bold font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {fin.amountOrValue}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {fin.condition}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                        <span>{fin.sourcePage !== null ? `Page ${fin.sourcePage}` : "Source page unavailable"}</span>
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: fin.label,
                              sourcePage: fin.sourcePage,
                              evidence: fin.evidence,
                              plainEnglishExplanation: fin.condition,
                            })
                          }
                          className="text-primary-400 hover:text-white font-sans"
                        >
                          View evidence
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Core Obligations */}
          <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Contractual Obligations ({analysis.obligations.length})
                </h3>
              </div>
            </div>

            {analysis.obligations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No explicit obligations isolated.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.obligations.map((ob, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {ob.actor}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {ob.sourcePage !== null ? `Page ${ob.sourcePage}` : "Source unavailable"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">
                        {ob.obligation}
                      </h4>
                      {ob.condition && (
                        <p className="text-xs text-slate-300 mt-1">
                          Condition: {ob.condition}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-surface-border/40 flex justify-end">
                      <button
                        onClick={() =>
                          setSelectedEvidence({
                            title: `Obligation: ${ob.actor} - ${ob.obligation}`,
                            sourcePage: ob.sourcePage,
                            evidence: ob.evidence,
                            plainEnglishExplanation: ob.condition || undefined,
                          })
                        }
                        className="text-[11px] text-primary-400 hover:text-white"
                      >
                        View evidence &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Attention Points (Neutral Clarity Flags) */}
          <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Attention Points & Notice Requirements ({analysis.attentionPoints.length})
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Informational • No Legal Conclusion</span>
            </div>

            {analysis.attentionPoints.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No critical attention points flagged.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.attentionPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          {pt.category || "Attention"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {pt.sourcePage !== null ? `Page ${pt.sourcePage}` : "Source unavailable"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">
                        {pt.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        {pt.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-500/20 flex justify-end">
                      <button
                        onClick={() =>
                          setSelectedEvidence({
                            title: pt.title,
                            sourcePage: pt.sourcePage,
                            sourceSection: pt.sourceSection,
                            evidence: pt.evidence,
                            whyItMatters: pt.reason,
                          })
                        }
                        className="text-[11px] text-amber-300 hover:text-white"
                      >
                        View evidence &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Important Clauses Breakdown */}
          <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
              <div>
                <h3 className="text-base font-bold text-white">
                  Important Clauses ({analysis.importantClauses.length + analysis.termination.length + analysis.renewal.length + analysis.disputeResolution.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-impact provisions extracted and structured with original source citations.
                </p>
              </div>

              {onNavigateToClauses && (
                <button
                  onClick={onNavigateToClauses}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-300 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/30 transition-colors"
                >
                  <span>Explore in Clause Explorer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ...analysis.termination,
                ...analysis.renewal,
                ...analysis.disputeResolution,
                ...analysis.importantClauses,
              ].slice(0, 6).map((clause, idx) => (
                <ClauseCard
                  key={idx}
                  clause={clause}
                  onViewEvidence={(c) => setSelectedEvidence(c)}
                />
              ))}
            </div>
          </div>
        </>
      ) : !isAnalyzing && (
        /* Fallback Trigger Banner if analysis not yet executed */
        <div className="glass-panel rounded-2xl p-8 text-center border border-surface-border space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Run Gemini Document X-Ray Analysis
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Extract structured parties, key dates, financial conditions, obligations, and grounded clause intelligence from this document.
          </p>
          {onTriggerAnalysis && (
            <button
              onClick={onTriggerAnalysis}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Gemini Analysis</span>
            </button>
          )}
        </div>
      )}

      {/* Transparent Evidence Modal */}
      <EvidenceModal
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        item={selectedEvidence}
      />
    </div>
  );
};

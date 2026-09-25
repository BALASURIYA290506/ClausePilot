"use client";

import React, { useState, useMemo } from "react";
import { 
  CheckSquare, 
  Sparkles, 
  ClipboardList, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Eye, 
  MapPin, 
  ArrowRight,
  FileCheck2,
  Scale
} from "lucide-react";
import { LegalDocumentState } from "@/types/document";
import { EvidenceModal } from "./EvidenceModal";

interface ActionNavigatorProps {
  documentState: LegalDocumentState;
  onTriggerAnalysis?: () => void;
}

interface ActionItem {
  id: string;
  category: "proceed" | "clarify" | "lawyer";
  title: string;
  description: string;
  sourcePage?: number | null;
  sourceSection?: string | null;
  evidence?: string;
  whyItMatters?: string;
  plainEnglishExplanation?: string;
}

export const ActionNavigator: React.FC<ActionNavigatorProps> = ({
  documentState,
  onTriggerAnalysis,
}) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<"all" | "proceed" | "clarify" | "lawyer">("all");
  const [selectedEvidence, setSelectedEvidence] = useState<{
    title: string;
    sourcePage?: number | string | null;
    sourceSection?: string | null;
    evidence: string;
    plainEnglishExplanation?: string;
    whyItMatters?: string;
  } | null>(null);

  const analysis = documentState.analysis;
  const isAnalyzed = !!analysis;

  // Derive structured action items directly from DocumentAnalysis
  const { beforeYouProceedItems, thingsToClarifyItems, questionsForLawyerItems } = useMemo(() => {
    if (!analysis) {
      return { beforeYouProceedItems: [], thingsToClarifyItems: [], questionsForLawyerItems: [] };
    }

    const proceed: ActionItem[] = [];
    const clarify: ActionItem[] = [];
    const lawyer: ActionItem[] = [];

    // A. BEFORE YOU PROCEED: Financial commitments, deadlines, and core obligations
    analysis.financialTerms.forEach((f, idx) => {
      proceed.push({
        id: `proc-fin-${idx}`,
        category: "proceed",
        title: `Verify ${f.label || "Payment Terms"} (${f.amountOrValue || "Amount specified"})`,
        description: f.condition ? `Condition: ${f.condition}` : "Verify this financial obligation matches your agreed terms.",
        sourcePage: f.sourcePage,
        evidence: f.evidence,
        sourceSection: "Financial Provisions",
      });
    });

    analysis.importantDates.forEach((d, idx) => {
      proceed.push({
        id: `proc-date-${idx}`,
        category: "proceed",
        title: `Calendar ${d.label || "Important Date"}: ${d.dateOrRule}`,
        description: d.significance || "Ensure this milestone date or recurring deadline is calendared.",
        sourcePage: d.sourcePage,
        evidence: d.evidence,
        sourceSection: "Dates & Schedule",
      });
    });

    analysis.termination.forEach((t, idx) => {
      proceed.push({
        id: `proc-term-${idx}`,
        category: "proceed",
        title: `Review Termination & Exit Terms: ${t.title}`,
        description: t.plainEnglishExplanation || t.summary || "Confirm lock-in period and advance written notice rules.",
        sourcePage: t.sourcePage,
        sourceSection: t.sourceSection,
        evidence: t.evidence,
        whyItMatters: t.whyItMatters,
        plainEnglishExplanation: t.plainEnglishExplanation,
      });
    });

    analysis.renewal.forEach((r, idx) => {
      proceed.push({
        id: `proc-renew-${idx}`,
        category: "proceed",
        title: `Check Renewal & Rollover Terms: ${r.title}`,
        description: r.plainEnglishExplanation || r.summary || "Verify auto-renewal mechanisms and opt-out notice deadlines.",
        sourcePage: r.sourcePage,
        sourceSection: r.sourceSection,
        evidence: r.evidence,
        whyItMatters: r.whyItMatters,
        plainEnglishExplanation: r.plainEnglishExplanation,
      });
    });

    analysis.obligations.forEach((o, idx) => {
      proceed.push({
        id: `proc-ob-${idx}`,
        category: "proceed",
        title: `${o.actor || "Party"} Commitment: ${o.obligation.substring(0, 70)}${o.obligation.length > 70 ? "..." : ""}`,
        description: o.condition ? `Under condition: ${o.condition}` : o.obligation,
        sourcePage: o.sourcePage,
        evidence: o.evidence,
        sourceSection: "Party Obligations",
      });
    });

    // B. THINGS TO CLARIFY: Attention Points and critical provisions
    analysis.attentionPoints.forEach((att, idx) => {
      clarify.push({
        id: `clarify-att-${idx}`,
        category: "clarify",
        title: `Clarify with Counterparty: ${att.title}`,
        description: att.reason,
        sourcePage: att.sourcePage,
        sourceSection: att.sourceSection,
        evidence: att.evidence,
      });
    });

    // Additional items to clarify from important clauses if present
    analysis.importantClauses.forEach((c, idx) => {
      if (c.whyItMatters && !proceed.some(p => p.title.includes(c.title))) {
        clarify.push({
          id: `clarify-cl-${idx}`,
          category: "clarify",
          title: `Clarify Scope of: ${c.title}`,
          description: c.whyItMatters,
          sourcePage: c.sourcePage,
          sourceSection: c.sourceSection,
          evidence: c.evidence,
          plainEnglishExplanation: c.plainEnglishExplanation,
        });
      }
    });

    // C. QUESTIONS FOR A LEGAL PROFESSIONAL: Neutral, grounded questions
    if (analysis.termination.length > 0) {
      lawyer.push({
        id: `law-term-1`,
        category: "lawyer",
        title: "Early Termination & Lock-in Enforceability",
        description: "What are the legal implications and potential liabilities if either party terminates prior to the lock-in period?",
        sourcePage: analysis.termination[0]?.sourcePage,
        sourceSection: analysis.termination[0]?.sourceSection,
        evidence: analysis.termination[0]?.evidence,
      });
    }

    if (analysis.financialTerms.some(f => f.label.toLowerCase().includes("deposit") || f.condition.toLowerCase().includes("deposit"))) {
      const dep = analysis.financialTerms.find(f => f.label.toLowerCase().includes("deposit") || f.condition.toLowerCase().includes("deposit"));
      lawyer.push({
        id: `law-dep-1`,
        category: "lawyer",
        title: "Security Deposit Refund Timelines & Permissible Deductions",
        description: "What statutory timelines and standard deduction conditions govern the refund of the security deposit upon lease conclusion?",
        sourcePage: dep?.sourcePage,
        evidence: dep?.evidence,
      });
    }

    if (analysis.disputeResolution.length > 0 || analysis.governingLaw.length > 0) {
      const disp = analysis.disputeResolution[0] || analysis.governingLaw[0];
      lawyer.push({
        id: `law-disp-1`,
        category: "lawyer",
        title: "Jurisdiction, Governing Law & Dispute Resolution Venue",
        description: "Does the specified governing law and court jurisdiction provide practical, enforceable dispute recourse for both parties?",
        sourcePage: disp?.sourcePage,
        sourceSection: disp?.sourceSection,
        evidence: disp?.evidence,
      });
    }

    if (analysis.obligations.some(o => o.obligation.toLowerCase().includes("maintain") || o.obligation.toLowerCase().includes("inspect"))) {
      const ob = analysis.obligations.find(o => o.obligation.toLowerCase().includes("maintain") || o.obligation.toLowerCase().includes("inspect"));
      lawyer.push({
        id: `law-ob-1`,
        category: "lawyer",
        title: "Inspection Notice & Property Maintenance Scope",
        description: "Are the landlord inspection notice requirements and tenant upkeep boundaries standard and balanced under local law?",
        sourcePage: ob?.sourcePage,
        evidence: ob?.evidence,
      });
    }

    // Fallback general question if specific ones are sparse
    if (lawyer.length === 0 && analysis) {
      lawyer.push({
        id: `law-gen-1`,
        category: "lawyer",
        title: "Overall Contract Balance & Standard Notice Terms",
        description: "Are the notice periods, mutual obligations, and default remedies standard for this type of commercial or residential agreement?",
        sourcePage: 1,
      });
    }

    return {
      beforeYouProceedItems: proceed,
      thingsToClarifyItems: clarify,
      questionsForLawyerItems: lawyer,
    };
  }, [analysis]);

  const allItems = useMemo(() => {
    return [...beforeYouProceedItems, ...thingsToClarifyItems, ...questionsForLawyerItems];
  }, [beforeYouProceedItems, thingsToClarifyItems, questionsForLawyerItems]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completedCount = checkedIds.size;
  const totalCount = allItems.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Empty state when document is not analyzed
  if (!isAnalyzed) {
    return (
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-surface-border space-y-5 animate-in fade-in duration-300 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <ClipboardList className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Document Action Navigator</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Analyze a document to build your action checklist.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
            Once analyzed, ClausePilot creates a structured pre-signing review checklist organizing payment obligations, key deadlines, items to clarify, and questions to ask a legal professional.
          </p>
        </div>

        <button
          onClick={onTriggerAnalysis}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Document</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Progress Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Action Navigator
              </h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                CHECKLIST ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Document-grounded checklist for reviewing key provisions before proceeding. Informational assistance only — not legal advice.
            </p>
          </div>

          {/* Review Progress Badge */}
          <div className="flex items-center gap-3 bg-surface-subtle p-3 rounded-xl border border-surface-border self-start sm:self-center">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-300 block">
                {completedCount} of {totalCount} Reviewed
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {progressPct}% Complete
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === "all"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-surface-subtle text-slate-400 hover:text-white hover:bg-surface-hover"
            }`}
          >
            All Action Items ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter("proceed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === "proceed"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-surface-subtle text-slate-400 hover:text-white hover:bg-surface-hover"
            }`}
          >
            A. Before You Proceed ({beforeYouProceedItems.length})
          </button>
          <button
            onClick={() => setActiveFilter("clarify")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === "clarify"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-surface-subtle text-slate-400 hover:text-white hover:bg-surface-hover"
            }`}
          >
            B. Things to Clarify ({thingsToClarifyItems.length})
          </button>
          <button
            onClick={() => setActiveFilter("lawyer")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === "lawyer"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-surface-subtle text-slate-400 hover:text-white hover:bg-surface-hover"
            }`}
          >
            C. Questions for a Legal Professional ({questionsForLawyerItems.length})
          </button>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {/* SECTION A: BEFORE YOU PROCEED */}
        {(activeFilter === "all" || activeFilter === "proceed") && beforeYouProceedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                A. Before You Proceed ({beforeYouProceedItems.length})
              </h3>
              <span className="text-xs text-slate-400 font-normal">
                — Important obligations, dates, payments, and notice rules to verify
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {beforeYouProceedItems.map((item) => {
                const isChecked = checkedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                      isChecked
                        ? "bg-surface-subtle/50 border-surface-border/50 opacity-75"
                        : "bg-surface-subtle hover:bg-surface-hover border-surface-border hover:border-emerald-500/40"
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 p-0.5 rounded transition-colors ${
                        isChecked ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                      aria-label="Toggle item status"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold transition-colors ${
                            isChecked ? "text-slate-400 line-through" : "text-white group-hover:text-emerald-300"
                          }`}
                        >
                          {item.title}
                        </span>

                        {item.sourcePage !== undefined && item.sourcePage !== null && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>
                              Page {item.sourcePage}
                              {item.sourceSection ? ` · ${item.sourceSection}` : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {item.evidence && (
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 italic">
                            Document grounded
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvidence({
                                title: item.title,
                                sourcePage: item.sourcePage,
                                sourceSection: item.sourceSection,
                                evidence: item.evidence!,
                                plainEnglishExplanation: item.plainEnglishExplanation,
                                whyItMatters: item.whyItMatters,
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View evidence</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION B: THINGS TO CLARIFY */}
        {(activeFilter === "all" || activeFilter === "clarify") && thingsToClarifyItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                B. Things to Clarify ({thingsToClarifyItems.length})
              </h3>
              <span className="text-xs text-slate-400 font-normal">
                — Provisions to discuss or clarify with counterparty before finalizing
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {thingsToClarifyItems.map((item) => {
                const isChecked = checkedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                      isChecked
                        ? "bg-surface-subtle/50 border-surface-border/50 opacity-75"
                        : "bg-surface-subtle hover:bg-surface-hover border-surface-border hover:border-amber-500/40"
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 p-0.5 rounded transition-colors ${
                        isChecked ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                      aria-label="Toggle item status"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 fill-amber-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold transition-colors ${
                            isChecked ? "text-slate-400 line-through" : "text-white group-hover:text-amber-300"
                          }`}
                        >
                          {item.title}
                        </span>

                        {item.sourcePage !== undefined && item.sourcePage !== null && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            <span>
                              Page {item.sourcePage}
                              {item.sourceSection ? ` · ${item.sourceSection}` : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {item.evidence && (
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 italic">
                            Document grounded
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvidence({
                                title: item.title,
                                sourcePage: item.sourcePage,
                                sourceSection: item.sourceSection,
                                evidence: item.evidence!,
                                plainEnglishExplanation: item.plainEnglishExplanation,
                                whyItMatters: item.whyItMatters,
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View evidence</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION C: QUESTIONS FOR A LEGAL PROFESSIONAL */}
        {(activeFilter === "all" || activeFilter === "lawyer") && questionsForLawyerItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
                C. Questions for a Legal Professional ({questionsForLawyerItems.length})
              </h3>
              <span className="text-xs text-slate-400 font-normal">
                — Practical document-supported questions to consult with a qualified lawyer
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {questionsForLawyerItems.map((item) => {
                const isChecked = checkedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                      isChecked
                        ? "bg-surface-subtle/50 border-surface-border/50 opacity-75"
                        : "bg-surface-subtle hover:bg-surface-hover border-surface-border hover:border-purple-500/40"
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 p-0.5 rounded transition-colors ${
                        isChecked ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                      aria-label="Toggle item status"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 fill-purple-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold transition-colors ${
                            isChecked ? "text-slate-400 line-through" : "text-white group-hover:text-purple-300"
                          }`}
                        >
                          {item.title}
                        </span>

                        {item.sourcePage !== undefined && item.sourcePage !== null && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                            <MapPin className="w-3 h-3 text-purple-400" />
                            <span>
                              Page {item.sourcePage}
                              {item.sourceSection ? ` · ${item.sourceSection}` : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-purple-200/90 font-medium leading-relaxed">
                        "{item.description}"
                      </p>

                      {item.evidence && (
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 italic">
                            Document grounded
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvidence({
                                title: item.title,
                                sourcePage: item.sourcePage,
                                sourceSection: item.sourceSection,
                                evidence: item.evidence!,
                                plainEnglishExplanation: item.plainEnglishExplanation,
                                whyItMatters: item.whyItMatters,
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View evidence</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        item={selectedEvidence}
      />
    </div>
  );
};

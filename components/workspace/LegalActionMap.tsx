"use client";

import React, { useState } from "react";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  Scale, 
  FileText, 
  Eye, 
  Sparkles, 
  ChevronRight, 
  Info, 
  MapPin, 
  ArrowRight,
  Layers,
  CheckCircle2
} from "lucide-react";
import { LegalDocumentState } from "@/types/document";
import { DocumentAnalysis, Party, ImportantDate, FinancialTerm, Obligation, ClauseInsight, AttentionPoint } from "@/types/analysis";
import { EvidenceModal } from "./EvidenceModal";

interface LegalActionMapProps {
  documentState: LegalDocumentState;
  onTriggerAnalysis?: () => void;
}

type MapCategoryKey = 
  | "PEOPLE"
  | "MONEY"
  | "DATES"
  | "OBLIGATIONS"
  | "TERMINATION"
  | "RENEWAL"
  | "DISPUTES";

interface CategoryDefinition {
  key: MapCategoryKey;
  label: string;
  description: string;
  icon: any;
  color: string;
  badgeColor: string;
  borderActive: string;
  glowColor: string;
}

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    key: "PEOPLE",
    label: "People & Entities",
    description: "Identified contracting parties and assigned legal roles.",
    icon: Users,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    badgeColor: "bg-blue-500/20 text-blue-300",
    borderActive: "border-blue-500 shadow-blue-500/20 ring-blue-500/30",
    glowColor: "rgba(59, 130, 246, 0.15)",
  },
  {
    key: "MONEY",
    label: "Money & Payments",
    description: "Fee schedules, security deposits, and financial penalties.",
    icon: DollarSign,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
    borderActive: "border-emerald-500 shadow-emerald-500/20 ring-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.15)",
  },
  {
    key: "DATES",
    label: "Dates & Deadlines",
    description: "Term dates, payment cycles, and advance notice windows.",
    icon: Calendar,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    badgeColor: "bg-amber-500/20 text-amber-300",
    borderActive: "border-amber-500 shadow-amber-500/20 ring-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.15)",
  },
  {
    key: "OBLIGATIONS",
    label: "Obligations",
    description: "Required affirmative duties and operational covenants by actor.",
    icon: ShieldCheck,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
    badgeColor: "bg-indigo-500/20 text-indigo-300",
    borderActive: "border-indigo-500 shadow-indigo-500/20 ring-indigo-500/30",
    glowColor: "rgba(99, 102, 241, 0.15)",
  },
  {
    key: "TERMINATION",
    label: "Termination",
    description: "Exit clauses, lock-in periods, notice periods, and early penalties.",
    icon: AlertTriangle,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    badgeColor: "bg-rose-500/20 text-rose-300",
    borderActive: "border-rose-500 shadow-rose-500/20 ring-rose-500/30",
    glowColor: "rgba(244, 63, 94, 0.15)",
  },
  {
    key: "RENEWAL",
    label: "Renewal",
    description: "Automatic extension conditions, escalation caps, and non-renewal terms.",
    icon: RotateCcw,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
    badgeColor: "bg-cyan-500/20 text-cyan-300",
    borderActive: "border-cyan-500 shadow-cyan-500/20 ring-cyan-500/30",
    glowColor: "rgba(6, 182, 212, 0.15)",
  },
  {
    key: "DISPUTES",
    label: "Disputes",
    description: "Arbitration rules, jurisdiction, governing law, and legal remedies.",
    icon: Scale,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/25",
    badgeColor: "bg-purple-500/20 text-purple-300",
    borderActive: "border-purple-500 shadow-purple-500/20 ring-purple-500/30",
    glowColor: "rgba(168, 85, 247, 0.15)",
  },
];

/**
 * Synthesize plain-language relationship summaries derived strictly from DocumentAnalysis
 */
function deriveRelationshipSentences(analysis: DocumentAnalysis): string[] {
  const sentences: string[] = [];

  // 1. Parties relationship
  if (analysis.parties.length >= 2) {
    const p1 = analysis.parties[0];
    const p2 = analysis.parties[1];
    sentences.push(
      `Agreement established between ${p1.name} (${p1.role}) and ${p2.name} (${p2.role}).`
    );
  }

  // 2. Financial & Payment Rule
  const rentOrPayment = analysis.financialTerms.find((f) =>
    f.label.toLowerCase().includes("rent") || f.label.toLowerCase().includes("subscription") || f.label.toLowerCase().includes("fee")
  );
  const paymentDate = analysis.importantDates.find((d) =>
    d.label.toLowerCase().includes("due") || d.dateOrRule.toLowerCase().includes("month") || d.label.toLowerCase().includes("payment")
  );

  if (rentOrPayment && paymentDate) {
    sentences.push(
      `${rentOrPayment.label} (${rentOrPayment.amountOrValue}) is payable on ${paymentDate.dateOrRule}.`
    );
  } else if (rentOrPayment) {
    sentences.push(
      `${rentOrPayment.label} is structured at ${rentOrPayment.amountOrValue}${rentOrPayment.condition ? ` (${rentOrPayment.condition})` : ""}.`
    );
  }

  // 3. Deposit term
  const deposit = analysis.financialTerms.find((f) =>
    f.label.toLowerCase().includes("deposit")
  );
  if (deposit) {
    sentences.push(
      `Security Deposit is structured at ${deposit.amountOrValue}${deposit.condition ? ` and governed by ${deposit.condition}` : " subject to agreement refund terms"}.`
    );
  }

  // 4. Term Duration
  const startDate = analysis.importantDates.find((d) =>
    d.label.toLowerCase().includes("start") || d.label.toLowerCase().includes("effective") || d.label.toLowerCase().includes("commence")
  );
  const endDate = analysis.importantDates.find((d) =>
    d.label.toLowerCase().includes("end") || d.label.toLowerCase().includes("expire") || d.label.toLowerCase().includes("expiration")
  );

  if (startDate && endDate) {
    sentences.push(
      `Tenancy commitment commences on ${startDate.dateOrRule} and runs through ${endDate.dateOrRule}.`
    );
  }

  // 5. Termination & Notice
  if (analysis.termination.length > 0) {
    const termClause = analysis.termination[0];
    sentences.push(
      `Early termination terms: ${termClause.summary}`
    );
  }

  // 6. Renewal
  if (analysis.renewal.length > 0) {
    const renClause = analysis.renewal[0];
    sentences.push(
      `Renewal terms: ${renClause.summary}`
    );
  }

  // 7. Dispute / Governing law
  if (analysis.disputeResolution.length > 0) {
    const disp = analysis.disputeResolution[0];
    sentences.push(
      `Dispute resolution: ${disp.summary}`
    );
  } else if (analysis.governingLaw.length > 0) {
    const gov = analysis.governingLaw[0];
    sentences.push(
      `Governing jurisdiction: ${gov.summary}`
    );
  }

  return sentences;
}

export const LegalActionMap: React.FC<LegalActionMapProps> = ({
  documentState,
  onTriggerAnalysis,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MapCategoryKey>("OBLIGATIONS");
  const [selectedEvidence, setSelectedEvidence] = useState<{
    title: string;
    sourcePage?: number | string | null;
    sourceSection?: string | null;
    evidence: string;
    plainEnglishExplanation?: string;
    whyItMatters?: string;
  } | null>(null);

  const analysis = documentState.analysis;

  // Empty state if document is not yet analyzed
  if (!analysis) {
    return (
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-surface-border space-y-5 animate-in fade-in duration-300 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-accent-violet/10 border border-accent-violet/30 flex items-center justify-center text-accent-violet mx-auto shadow-lg shadow-accent-violet/10">
          <Layers className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Analyze a Document to Build Your Legal Action Map
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
            The Legal Action Map dynamically visualizes how people, payments, duties, deadlines, and termination liabilities connect in your specific agreement.
          </p>
        </div>

        {onTriggerAnalysis && (
          <button
            onClick={onTriggerAnalysis}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Document</span>
          </button>
        )}
      </div>
    );
  }

  // Dynamic counts derived purely from DocumentAnalysis
  const counts: Record<MapCategoryKey, number> = {
    PEOPLE: analysis.parties?.length || 0,
    MONEY: analysis.financialTerms?.length || 0,
    DATES: analysis.importantDates?.length || 0,
    OBLIGATIONS: analysis.obligations?.length || 0,
    TERMINATION: analysis.termination?.length || 0,
    RENEWAL: analysis.renewal?.length || 0,
    DISPUTES: (analysis.disputeResolution?.length || 0) + (analysis.governingLaw?.length || 0),
  };

  const activeDef = CATEGORY_DEFINITIONS.find((d) => d.key === selectedCategory) || CATEGORY_DEFINITIONS[0];
  const relationshipSentences = deriveRelationshipSentences(analysis);

  // Group obligations by actor
  const groupedObligations = (analysis.obligations || []).reduce<Record<string, Obligation[]>>(
    (acc, ob) => {
      const actorKey = ob.actor || "General";
      if (!acc[actorKey]) acc[actorKey] = [];
      acc[actorKey].push(ob);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-accent-violet/15 text-accent-violet border border-accent-violet/30 text-xs font-semibold">
              Signature Relationship Canvas
            </span>
            <span className="text-xs text-slate-400">Interconnected Document System</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Legal Action Map
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            See how the important people, money, obligations, dates and clauses in your document connect.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-surface-subtle px-3 py-2 rounded-xl border border-surface-border">
          <Info className="w-4 h-4 text-primary-400 shrink-0" />
          <span>Relationships shown here are derived from information identified in your document.</span>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-surface-border relative overflow-hidden bg-gradient-to-b from-surface/90 via-surface-subtle/50 to-surface/90">
        {/* Subtle background glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-500"
          style={{ background: activeDef.glowColor }}
        />

        {/* Desktop / Tablet Visual Layout */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Top Orbit Nodes (PEOPLE, DATES) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            {CATEGORY_DEFINITIONS.filter((c) => c.key === "PEOPLE" || c.key === "DATES").map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              const count = counts[cat.key];

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex items-center justify-between group focus:outline-none focus:ring-2 ${
                    isSelected
                      ? `bg-surface-active ${cat.borderActive} shadow-lg ring-2`
                      : "bg-surface-subtle hover:bg-surface-hover border-surface-border hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {cat.key}
                      </span>
                      <span className="text-xs font-bold text-white block">
                        {cat.label}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${cat.badgeColor}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Middle Row: MONEY <---> CENTRAL DOCUMENT NODE <---> OBLIGATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mb-6">
            {/* Left Node: MONEY */}
            <div className="lg:col-span-3">
              {(() => {
                const cat = CATEGORY_DEFINITIONS.find((c) => c.key === "MONEY")!;
                const Icon = cat.icon;
                const isSelected = selectedCategory === "MONEY";
                const count = counts.MONEY;

                return (
                  <button
                    onClick={() => setSelectedCategory("MONEY")}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group focus:outline-none focus:ring-2 ${
                      isSelected
                        ? `bg-surface-active ${cat.borderActive} shadow-lg ring-2`
                        : "bg-surface-subtle hover:bg-surface-hover border-surface-border hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          MONEY
                        </span>
                        <span className="text-xs font-bold text-white block">
                          {cat.label}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${cat.badgeColor}`}>
                      {count}
                    </span>
                  </button>
                );
              })()}
            </div>

            {/* Central Document Node */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-surface border-2 border-primary-500/40 shadow-2xl shadow-primary-500/10 text-center space-y-2 relative group hover:border-primary-400 transition-all">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/30 text-[10px] font-bold uppercase tracking-widest">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Legal Document Core</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight line-clamp-1">
                  {analysis.title || documentState.metadata?.fileName || "Analyzed Agreement"}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 max-w-sm mx-auto">
                  {analysis.purpose || "Legal document relationships indexed across 7 core pillars."}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-mono text-slate-400 border-t border-surface-border/60">
                  <span>{documentState.metadata?.pageCount || 1} Pages</span>
                  <span>•</span>
                  <span>{counts.PEOPLE + counts.MONEY + counts.DATES + counts.OBLIGATIONS + counts.TERMINATION + counts.RENEWAL + counts.DISPUTES} Connected Items</span>
                </div>
              </div>
            </div>

            {/* Right Node: OBLIGATIONS */}
            <div className="lg:col-span-3">
              {(() => {
                const cat = CATEGORY_DEFINITIONS.find((c) => c.key === "OBLIGATIONS")!;
                const Icon = cat.icon;
                const isSelected = selectedCategory === "OBLIGATIONS";
                const count = counts.OBLIGATIONS;

                return (
                  <button
                    onClick={() => setSelectedCategory("OBLIGATIONS")}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group focus:outline-none focus:ring-2 ${
                      isSelected
                        ? `bg-surface-active ${cat.borderActive} shadow-lg ring-2`
                        : "bg-surface-subtle hover:bg-surface-hover border-surface-border hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          OBLIGATIONS
                        </span>
                        <span className="text-xs font-bold text-white block">
                          {cat.label}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${cat.badgeColor}`}>
                      {count}
                    </span>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Bottom Orbit Nodes (TERMINATION, RENEWAL, DISPUTES) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {CATEGORY_DEFINITIONS.filter((c) => c.key === "TERMINATION" || c.key === "RENEWAL" || c.key === "DISPUTES").map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              const count = counts[cat.key];

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex items-center justify-between group focus:outline-none focus:ring-2 ${
                    isSelected
                      ? `bg-surface-active ${cat.borderActive} shadow-lg ring-2`
                      : "bg-surface-subtle hover:bg-surface-hover border-surface-border hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {cat.key}
                      </span>
                      <span className="text-xs font-bold text-white block truncate max-w-[110px]">
                        {cat.label}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${cat.badgeColor}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Category Detail Inspector */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-surface-border space-y-6">
        {/* Inspector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${activeDef.color}`}>
              {React.createElement(activeDef.icon, { className: "w-6 h-6" })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">
                  Selected Pillar
                </span>
                <span className="text-slate-500">•</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.2 rounded ${activeDef.badgeColor}`}>
                  {counts[selectedCategory]} Items Indexed
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {activeDef.label}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-sm sm:text-right">
            {activeDef.description}
          </p>
        </div>

        {/* Inspector Body based on Active Category */}
        <div className="space-y-4">
          {/* PEOPLE */}
          {selectedCategory === "PEOPLE" && (
            <div className="space-y-3">
              {analysis.parties.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No specific contracting parties established.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.parties.map((p, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-surface-subtle border border-surface-border flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {p.role || "Party"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {p.sourcePage !== null ? `Page ${p.sourcePage}` : "Source page unavailable"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1.5">{p.name}</h4>
                      </div>

                      {p.evidence && (
                        <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 truncate max-w-[240px]">
                            "{p.evidence}"
                          </span>
                          <button
                            onClick={() =>
                              setSelectedEvidence({
                                title: `Party: ${p.name} (${p.role})`,
                                sourcePage: p.sourcePage,
                                evidence: p.evidence,
                              })
                            }
                            className="inline-flex items-center gap-1 text-[11px] text-primary-400 hover:text-white font-medium shrink-0 ml-2"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View evidence</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MONEY */}
          {selectedCategory === "MONEY" && (
            <div className="space-y-3">
              {analysis.financialTerms.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No financial terms identified.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.financialTerms.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-surface-subtle border border-surface-border flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{f.label}</h4>
                          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                            {f.amountOrValue}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{f.condition}</p>
                      </div>

                      <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{f.sourcePage !== null ? `Page ${f.sourcePage}` : "Source page unavailable"}</span>
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: f.label,
                              sourcePage: f.sourcePage,
                              evidence: f.evidence,
                              plainEnglishExplanation: f.condition,
                            })
                          }
                          className="inline-flex items-center gap-1 text-primary-400 hover:text-white font-sans"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View evidence</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DATES */}
          {selectedCategory === "DATES" && (
            <div className="space-y-3">
              {analysis.importantDates.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No specific dates or deadline rules found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.importantDates.map((d, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-surface-subtle border border-surface-border flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{d.label}</h4>
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                            {d.dateOrRule}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{d.significance}</p>
                      </div>

                      <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{d.sourcePage !== null ? `Page ${d.sourcePage}` : "Source page unavailable"}</span>
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: d.label,
                              sourcePage: d.sourcePage,
                              evidence: d.evidence,
                              whyItMatters: d.significance,
                            })
                          }
                          className="inline-flex items-center gap-1 text-primary-400 hover:text-white font-sans"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View evidence</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* OBLIGATIONS (Grouped by Actor) */}
          {selectedCategory === "OBLIGATIONS" && (
            <div className="space-y-4">
              {Object.keys(groupedObligations).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No obligations isolated in this document.</p>
              ) : (
                Object.entries(groupedObligations).map(([actor, obs]) => (
                  <div key={actor} className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                        {actor} ({obs.length} Obligations)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {obs.map((ob, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-white">• {ob.obligation}</h4>
                            {ob.condition && (
                              <p className="text-xs text-slate-300 mt-1">
                                Condition: {ob.condition}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-surface-border/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>{ob.sourcePage !== null ? `Page ${ob.sourcePage}` : "Source page unavailable"}</span>
                            <button
                              onClick={() =>
                                setSelectedEvidence({
                                  title: `${ob.actor}: ${ob.obligation}`,
                                  sourcePage: ob.sourcePage,
                                  evidence: ob.evidence,
                                  plainEnglishExplanation: ob.condition || undefined,
                                })
                              }
                              className="inline-flex items-center gap-1 text-primary-400 hover:text-white font-sans"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View evidence</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TERMINATION */}
          {selectedCategory === "TERMINATION" && (
            <div className="space-y-3">
              {analysis.termination.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No termination clauses identified in this document.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.termination.map((t, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{t.title}</h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {t.sourcePage !== null ? `Page ${t.sourcePage}` : "Source page unavailable"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{t.plainEnglishExplanation || t.summary}</p>
                        {t.whyItMatters && (
                          <p className="text-[11px] text-rose-300/90 mt-1 font-medium">
                            Why it matters: {t.whyItMatters}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-rose-500/20 flex justify-end">
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: t.title,
                              sourcePage: t.sourcePage,
                              sourceSection: t.sourceSection,
                              evidence: t.evidence,
                              plainEnglishExplanation: t.plainEnglishExplanation,
                              whyItMatters: t.whyItMatters,
                            })
                          }
                          className="inline-flex items-center gap-1 text-[11px] text-rose-300 hover:text-white font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View evidence</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RENEWAL */}
          {selectedCategory === "RENEWAL" && (
            <div className="space-y-3">
              {analysis.renewal.length === 0 ? (
                <div className="p-6 rounded-xl bg-surface-subtle border border-surface-border text-center">
                  <p className="text-xs text-slate-400 italic">
                    No renewal terms were identified in this document.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.renewal.map((r, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{r.title}</h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {r.sourcePage !== null ? `Page ${r.sourcePage}` : "Source page unavailable"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{r.plainEnglishExplanation || r.summary}</p>
                        {r.whyItMatters && (
                          <p className="text-[11px] text-cyan-300/90 mt-1 font-medium">
                            Why it matters: {r.whyItMatters}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-cyan-500/20 flex justify-end">
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: r.title,
                              sourcePage: r.sourcePage,
                              sourceSection: r.sourceSection,
                              evidence: r.evidence,
                              plainEnglishExplanation: r.plainEnglishExplanation,
                              whyItMatters: r.whyItMatters,
                            })
                          }
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View evidence</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DISPUTES */}
          {selectedCategory === "DISPUTES" && (
            <div className="space-y-3">
              {[...analysis.disputeResolution, ...analysis.governingLaw].length === 0 ? (
                <div className="p-6 rounded-xl bg-surface-subtle border border-surface-border text-center">
                  <p className="text-xs text-slate-400 italic">
                    No dispute resolution terms were identified.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...analysis.disputeResolution, ...analysis.governingLaw].map((d, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{d.title}</h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {d.sourcePage !== null ? `Page ${d.sourcePage}` : "Source page unavailable"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{d.plainEnglishExplanation || d.summary}</p>
                      </div>

                      <div className="pt-2 border-t border-purple-500/20 flex justify-end">
                        <button
                          onClick={() =>
                            setSelectedEvidence({
                              title: d.title,
                              sourcePage: d.sourcePage,
                              sourceSection: d.sourceSection,
                              evidence: d.evidence,
                              plainEnglishExplanation: d.plainEnglishExplanation,
                              whyItMatters: d.whyItMatters,
                            })
                          }
                          className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-white font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View evidence</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Section: Attention Points (Neutral Clarity Flags) */}
      {analysis.attentionPoints && analysis.attentionPoints.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-surface-border space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Attention Points ({analysis.attentionPoints.length})
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Provisions to Clarify • Not Legal Advice</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.attentionPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5">
                    <span>⚠</span>
                    <span>{pt.title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{pt.reason}</p>
                </div>

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
                  className="text-[11px] text-amber-300 hover:text-white shrink-0 mt-0.5 font-medium underline underline-offset-2"
                >
                  Evidence
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Section: Document Relationship Summary */}
      {relationshipSentences.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-surface-border space-y-3 bg-gradient-to-b from-surface/80 to-surface-subtle/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-violet" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Document Relationship Summary
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Synthesized document connections derived from the analyzed contract terms:
          </p>

          <div className="space-y-2 pt-1">
            {relationshipSentences.map((sentence, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-start gap-2.5 text-xs text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-primary-600/30 border border-primary-500/40 text-primary-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{sentence}</span>
              </div>
            ))}
          </div>
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

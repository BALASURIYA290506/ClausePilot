"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  BookOpen, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Eye,
  MapPin
} from "lucide-react";
import { LegalDocumentState } from "@/types/document";
import { ClauseInsight } from "@/types/analysis";
import { ClauseCard } from "./ClauseCard";
import { EvidenceModal } from "./EvidenceModal";
import { ExplainSimplyModal } from "./ExplainSimplyModal";

interface ClauseExplorerProps {
  documentState: LegalDocumentState;
}

const CATEGORIES = [
  "All",
  "Financial",
  "Obligations",
  "Dates",
  "Termination",
  "Renewal",
  "Disputes",
  "Other",
];

export const ClauseExplorer: React.FC<ClauseExplorerProps> = ({
  documentState,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<{
    title: string;
    sourcePage?: number | string | null;
    sourceSection?: string | null;
    evidence: string;
    plainEnglishExplanation?: string;
    whyItMatters?: string;
  } | null>(null);
  const [selectedClauseForExplain, setSelectedClauseForExplain] = useState<ClauseInsight | null>(null);

  const analysis = documentState.analysis;

  // Aggregate all extracted clauses
  const allClauses: ClauseInsight[] = analysis
    ? [
        ...analysis.termination,
        ...analysis.renewal,
        ...analysis.disputeResolution,
        ...analysis.governingLaw,
        ...analysis.importantClauses,
      ]
    : [];

  // Filter clauses by category and search term
  const filteredClauses = allClauses.filter((clause) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (clause.category || "Other").toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === "Obligations" && clause.category?.toLowerCase() === "obligation") ||
      (selectedCategory === "Dates" && clause.category?.toLowerCase() === "date") ||
      (selectedCategory === "Disputes" && clause.category?.toLowerCase() === "dispute");

    const matchesSearch =
      clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.plainEnglishExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.evidence.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header & Filter Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Clause Intelligence Explorer
            </h2>
            <p className="text-xs text-slate-400">
              Browse extracted clauses grounded with line-level evidence and plain-English explanations.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono self-start sm:self-center">
            {filteredClauses.length} Clauses Indexed
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses, terms, or section numbers..."
              className="w-full pl-10 pr-4 py-2 bg-surface-subtle border border-surface-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-surface-subtle text-slate-400 hover:text-slate-200 hover:bg-surface-hover"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clauses Grid */}
      {filteredClauses.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-surface-border space-y-2">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
          <p className="text-sm font-semibold text-white">No matching clauses found</p>
          <p className="text-xs text-slate-400">
            {allClauses.length === 0
              ? "Run Gemini analysis on the Overview tab to extract structured clauses."
              : "Try adjusting your category filter or search keywords."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClauses.map((clause, idx) => (
            <ClauseCard
              key={idx}
              clause={clause}
              onViewEvidence={(c) => setSelectedEvidence(c)}
              onExplainSimply={(c) => setSelectedClauseForExplain(c)}
            />
          ))}
        </div>
      )}

      {/* Transparent Evidence Modal */}
      <EvidenceModal
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        item={selectedEvidence}
      />

      {/* Explain Simply Plain Language Modal */}
      <ExplainSimplyModal
        isOpen={!!selectedClauseForExplain}
        onClose={() => setSelectedClauseForExplain(null)}
        clause={selectedClauseForExplain}
        documentContext={analysis?.purpose || ""}
      />
    </div>
  );
};


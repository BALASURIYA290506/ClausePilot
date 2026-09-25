import React from "react";
import { FileText, Cpu, Search, GitCompare, CheckSquare, ArrowRight, ShieldCheck, DollarSign, Calendar, AlertTriangle, RotateCcw, Scale, Users } from "lucide-react";

export const ProcessPipeline: React.FC = () => {
  const steps = [
    {
      title: "DOCUMENT",
      subtitle: "PDF Upload & Parse",
      icon: FileText,
      accent: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    },
    {
      title: "UNDERSTAND",
      subtitle: "Document X-Ray",
      icon: Cpu,
      accent: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
    },
    {
      title: "INSPECT",
      subtitle: "Clause Intelligence",
      icon: Search,
      accent: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
    },
    {
      title: "COMPARE",
      subtitle: "Factual Diff Engine",
      icon: GitCompare,
      accent: "from-purple-500/20 to-sky-500/20 text-sky-400 border-sky-500/30",
    },
    {
      title: "ACT",
      subtitle: "Action Navigator",
      icon: CheckSquare,
      accent: "from-sky-500/20 to-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  ];

  const mapBranches = [
    { label: "PEOPLE", icon: Users, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { label: "MONEY", icon: DollarSign, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { label: "OBLIGATIONS", icon: ShieldCheck, color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
    { label: "DATES", icon: Calendar, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { label: "TERMINATION", icon: AlertTriangle, color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
    { label: "RENEWAL", icon: RotateCcw, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { label: "DISPUTES", icon: Scale, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Experience Flow */}
      <div className="text-center mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
          Structured Intelligence Pipeline
        </h2>
        <p className="text-xl sm:text-2xl font-bold text-white">
          Transforming dense legal text into clear, grounded structure
        </p>
      </div>

      {/* 5-Step Pipeline Strip */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-8 border border-surface-border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative group p-4 rounded-xl bg-surface-subtle/70 border border-surface-border flex flex-col items-center text-center transition-all hover:border-primary-500/40 hover:bg-surface-hover"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${step.accent} border`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm tracking-wider text-white mb-0.5">
                  {step.title}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {step.subtitle}
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-surface-subtle border border-surface-border items-center justify-center text-slate-500">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Map Visual Concept Breakdown */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border bg-gradient-to-b from-surface/80 to-surface-subtle/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5 pb-4 border-b border-surface-border/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-violet">The Legal Action Map</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-accent-violet/10 text-accent-violet border border-accent-violet/20 font-semibold">Core Differentiator</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Every document is categorized into 7 core pillars with exact line-level evidence:
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-surface-subtle px-3 py-1.5 rounded-lg border border-surface-border">
            100% Grounded in Document Source
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {mapBranches.map((branch) => {
            const BranchIcon = branch.icon;
            return (
              <div
                key={branch.label}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all hover:scale-105 ${branch.color}`}
              >
                <BranchIcon className="w-5 h-5 mb-1.5 opacity-90" />
                <span className="text-xs font-bold tracking-tight">{branch.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

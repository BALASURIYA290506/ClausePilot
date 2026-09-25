import React from "react";
import { ArrowRight, Sparkles, UploadCloud, Shield, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onOpenUpload: () => void;
  onLoadSample: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenUpload,
  onLoadSample,
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent-violet/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-subtle border border-surface-border text-xs text-slate-300 font-medium mb-6 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-primary-400 animate-pulse"></span>
          <span>GenAI Document Intelligence for Modern Teams</span>
          <span className="text-slate-500">•</span>
          <span className="text-primary-300">Grounded & Verifiable</span>
        </div>

        {/* Hero headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Legal documents, <br />
          <span className="text-gradient-accent">without the legalese.</span>
        </h1>

        {/* Supporting copy */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
          Understand contracts, uncover important clauses, compare documents, and turn legal language into actionable next steps.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-xl shadow-primary-600/25 border border-primary-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Analyze a document</span>
            <ArrowRight className="w-4 h-4 text-primary-200" />
          </button>

          <button
            onClick={onLoadSample}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-slate-200 bg-surface-subtle hover:bg-surface-hover border border-surface-border transition-all hover:border-slate-600"
          >
            <Sparkles className="w-4 h-4 text-accent-violet" />
            <span>See how it works (Sample MSA)</span>
          </button>
        </div>

        {/* Trust & Safety highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 border-t border-surface-border/60 text-xs text-slate-400">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 shrink-0" />
            <span>Exact Page/Section Quotes</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-violet shrink-0" />
            <span>Visual Legal Action Map</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
            <span>Zero Hallucinated Facts</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Privacy & Client-First</span>
          </div>
        </div>
      </div>
    </section>
  );
};

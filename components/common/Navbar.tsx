import React from "react";
import { FileText, Sparkles, UploadCloud } from "lucide-react";
import { LegalDisclaimer } from "./LegalDisclaimer";

interface NavbarProps {
  onOpenUpload: () => void;
  onLoadSample: () => void;
  hasDocument: boolean;
  onNewDocument?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onLoadSample,
  hasDocument,
  onNewDocument,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-violet flex items-center justify-center shadow-lg shadow-primary-500/20 ring-1 ring-white/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">ClausePilot</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-primary-500/15 text-primary-300 border border-primary-500/20">
                Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Legal Document Intelligence & Action Navigator</p>
          </div>
        </div>

        {/* Center / Disclaimer Pill */}
        <div className="hidden md:flex items-center">
          <LegalDisclaimer variant="pill" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!hasDocument ? (
            <>
              <button
                onClick={onLoadSample}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
                <span>Explore Sample</span>
              </button>
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 shadow-md shadow-primary-500/25 border border-primary-400/30 transition-all hover:scale-[1.02]"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Analyze Document</span>
              </button>
            </>
          ) : (
            <button
              onClick={onNewDocument}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-surface-subtle hover:bg-surface-hover border border-surface-border transition-colors hover:border-slate-600"
            >
              <UploadCloud className="w-4 h-4 text-primary-400" />
              <span>New Document</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

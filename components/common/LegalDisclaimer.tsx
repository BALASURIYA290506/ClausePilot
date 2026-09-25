import React from "react";
import { ShieldAlert } from "lucide-react";

interface LegalDisclaimerProps {
  variant?: "subtle" | "banner" | "pill";
  className?: string;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  variant = "subtle",
  className = "",
}) => {
  if (variant === "pill") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300/90 ${className}`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Informational Legal Intelligence • Not Professional Legal Advice</span>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200/90 ${className}`}
      >
        <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-amber-300">Important Legal Notice: </span>
          ClausePilot provides informational assistance and document intelligence. It does not provide legal advice, make binding legal judgments, or replace a qualified attorney. Always consult a licensed legal professional for critical decisions.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`text-xs text-slate-500 flex items-center justify-center gap-1.5 py-4 ${className}`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
      <span>
        ClausePilot provides informational assistance and is not a substitute for professional legal advice.
      </span>
    </div>
  );
};

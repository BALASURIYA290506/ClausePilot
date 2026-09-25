import React from "react";
import { Cpu, Search, CheckSquare, Sparkles, Layers, ListChecks } from "lucide-react";

export const CapabilityCards: React.FC = () => {
  const cards = [
    {
      title: "Document X-Ray",
      tagline: "Turn dense legal documents into structured insights.",
      description: "Extract parties, financial obligations, contract duration, governing law, and key renewal mechanisms automatically into an intuitive dashboard.",
      icon: Cpu,
      gradient: "from-blue-500/10 via-primary-500/5 to-transparent",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      badge: "Structure & Scope",
      features: ["Entity & Party extraction", "Payment terms & deadlines", "Jurisdiction & Governing law"],
    },
    {
      title: "Clause Intelligence",
      tagline: "Find obligations, deadlines, termination conditions and important clauses.",
      description: "Inspect high-impact clauses side-by-side with original evidence, plain-English translations, and reasons why they matter to your business.",
      icon: Search,
      gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
      iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      badge: "Deep Analysis",
      features: ["Original text verification", "Plain English breakdown", "Severity & Attention flags"],
    },
    {
      title: "Action Navigator",
      tagline: "Generate clarification checklists and questions to discuss with a legal professional.",
      description: "Transform complex clauses into an actionable pre-signing checklist, clarifying ambiguities before negotiations or legal counsel review.",
      icon: CheckSquare,
      gradient: "from-sky-500/10 via-cyan-500/5 to-transparent",
      iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      badge: "Actionable Next Steps",
      features: ["Interactive check items", "Questions for legal counsel", "Things to clarify with counterparty"],
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Subtle gradient corner */}
              <div
                className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${card.gradient} rounded-full blur-2xl pointer-events-none`}
              />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl border ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-primary-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-semibold text-primary-400 mb-3">
                  "{card.tagline}"
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-border/70 space-y-2">
                {card.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400/80" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

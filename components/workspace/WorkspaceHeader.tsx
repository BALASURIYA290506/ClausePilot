"use client";

import React from "react";
import { 
  FileText, 
  LayoutDashboard, 
  Search, 
  Network, 
  MessageSquare, 
  GitCompare, 
  CheckSquare, 
  Plus,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { LegalDocumentState } from "@/types/document";
import { formatBytes } from "@/lib/utils";

interface WorkspaceHeaderProps {
  documentState: LegalDocumentState;
  activeTab: LegalDocumentState["currentTab"];
  onTabChange: (tab: LegalDocumentState["currentTab"]) => void;
  onNewDocument: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  documentState,
  activeTab,
  onTabChange,
  onNewDocument,
}) => {
  const tabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "clauses" as const, label: "Clauses", icon: Search, badge: documentState.clauses.length },
    { id: "action-map" as const, label: "Action Map", icon: Network, highlight: true },
    { id: "copilot" as const, label: "Copilot", icon: MessageSquare },
    { id: "compare" as const, label: "Compare", icon: GitCompare },
    { id: "actions" as const, label: "Actions", icon: CheckSquare, badge: "8 tasks" },
  ];

  const meta = documentState.metadata;

  return (
    <div className="border-b border-surface-border bg-surface/90 backdrop-blur-md sticky top-0 z-30">
      {/* Top File info bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-border/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-white truncate">
                {meta?.fileName || "Untitled Document.pdf"}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Grounded
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{meta?.documentType || "Legal Contract"}</span>
              <span>•</span>
              <span>{meta?.pageCount || 1} Pages</span>
              <span>•</span>
              <span>{meta?.fileSize ? formatBytes(meta.fileSize) : "PDF"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNewDocument}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-surface-subtle hover:bg-surface-hover border border-surface-border transition-colors hover:border-slate-600"
          >
            <Plus className="w-3.5 h-3.5 text-primary-400" />
            <span>New Document</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div 
        role="tablist"
        aria-label="Document Workspace Navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all shrink-0 border relative ${
                isActive
                  ? "text-white bg-surface-subtle border-primary-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-surface-subtle/50"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive
                    ? "text-primary-400"
                    : tab.highlight
                    ? "text-accent-violet"
                    : "text-slate-500"
                }`}
              />
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-primary-500/20 text-primary-300"
                      : "bg-surface-hover text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-violet rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

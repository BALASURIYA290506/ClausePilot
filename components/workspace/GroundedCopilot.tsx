"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  Eye, 
  MapPin, 
  HelpCircle, 
  Loader2, 
  AlertCircle,
  CornerDownLeft,
  ArrowRight,
  ShieldCheck,
  Search
} from "lucide-react";
import { LegalDocumentState } from "@/types/document";
import { ChatMessage, CopilotResponse } from "@/types/copilot";
import { EvidenceModal } from "./EvidenceModal";

interface GroundedCopilotProps {
  documentState: LegalDocumentState;
  onTriggerAnalysis?: () => void;
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  "What are the main payment obligations?",
  "What happens if either party terminates early?",
  "When does this agreement expire?",
  "Who is responsible for maintenance & repairs?",
  "What should I clarify before proceeding?",
];

export const GroundedCopilot: React.FC<GroundedCopilotProps> = ({
  documentState,
  onTriggerAnalysis,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<{
    title: string;
    sourcePage?: number | string | null;
    sourceSection?: string | null;
    evidence: string;
    plainEnglishExplanation?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const analysis = documentState.analysis;
  const documentData = documentState.documentData;

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // If document is not yet analyzed, show empty state
  if (!analysis || !documentData) {
    return (
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-surface-border space-y-5 animate-in fade-in duration-300 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-primary-600/10 border border-primary-500/30 flex items-center justify-center text-primary-400 mx-auto shadow-lg shadow-primary-500/10">
          <Bot className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Document Grounded Copilot</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Analyze a Document to Ask Grounded Questions
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
            Once analyzed, you can query your document in natural language and receive direct answers cited with exact page numbers and verbatim text.
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

  const handleAskQuestion = async (queryText?: string) => {
    const questionToAsk = (queryText || inputQuestion).trim();
    if (!questionToAsk || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: questionToAsk,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionToAsk,
          document: documentData,
          analysis: analysis,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to get grounded answer.");
      }

      const copilotResponse: CopilotResponse = result.response;

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: copilotResponse.answer,
        response: copilotResponse,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "Unable to answer right now. Please try again.",
        error: err?.message || "Error processing question.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-surface-border flex flex-col h-[760px] overflow-hidden animate-in fade-in duration-300">
      {/* Copilot Header */}
      <div className="p-5 border-b border-surface-border bg-surface-subtle/80 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-violet flex items-center justify-center text-white shadow-lg shadow-primary-500/20 ring-1 ring-white/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Grounded Copilot</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Document Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask questions about your document. Answers are grounded in the uploaded text.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Informational assistance only — not legal advice.</span>
        </div>
      </div>

      {/* Suggested Starting Questions Bar */}
      {messages.length === 0 && (
        <div className="p-4 bg-surface/50 border-b border-surface-border space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            <span>Suggested Starter Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q)}
                className="text-xs text-slate-300 bg-surface-subtle hover:bg-surface-hover hover:text-white border border-surface-border px-3 py-1.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-left flex items-center gap-1.5"
              >
                <span>{q}</span>
                <ArrowRight className="w-3 h-3 text-primary-400 opacity-70" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-subtle border border-surface-border flex items-center justify-center text-slate-500">
              <Search className="w-6 h-6 opacity-60" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Ask anything about {documentData.fileName}</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Type a question below or choose a starter inquiry to verify payment schedules, early exit terms, or maintenance responsibilities.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const res = msg.response;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                    : "bg-surface-subtle border border-surface-border text-accent-violet shadow-sm"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Container */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  isUser
                    ? "bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-600/15"
                    : "bg-surface-subtle border border-surface-border text-slate-200 rounded-tl-none"
                }`}
              >
                {/* Text / Direct Answer */}
                <div className="whitespace-pre-wrap font-normal">
                  {msg.text}
                </div>

                {/* Plain-English Explanation if present */}
                {!isUser && res?.explanation && res.explanation !== res.answer && (
                  <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1 text-xs text-slate-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-300 block">
                      Plain-English Explanation:
                    </span>
                    <p>{res.explanation}</p>
                  </div>
                )}

                {/* Not Found Callout */}
                {!isUser && res && !res.foundInDocument && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-xs text-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300">Not Specified in Document: </span>
                      This information was not found in the uploaded text. You may want to clarify this with the counterparty or check for missing schedules.
                    </div>
                  </div>
                )}

                {/* Grounded Evidence Card */}
                {!isUser && res?.evidence && res.evidence.quote && (
                  <div className="pt-3 border-t border-surface-border/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        From Your Document
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <MapPin className="w-3 h-3 text-primary-400" />
                        <span>
                          {res.evidence.pageNumber !== null ? `Page ${res.evidence.pageNumber}` : "Source page unavailable"}
                          {res.evidence.section ? ` · ${res.evidence.section}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-surface-border text-xs font-mono text-slate-300 leading-relaxed select-text">
                      "{res.evidence.quote}"
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          setSelectedEvidence({
                            title: `Evidence for: "${msg.text.substring(0, 45)}..."`,
                            sourcePage: res.evidence?.pageNumber,
                            sourceSection: res.evidence?.section,
                            evidence: res.evidence?.quote || "",
                            plainEnglishExplanation: res.explanation,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs text-primary-300 hover:text-white font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View evidence in modal &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Follow-up Questions Suggestions */}
                {!isUser && res?.followUpQuestions && res.followUpQuestions.length > 0 && (
                  <div className="pt-2 border-t border-surface-border/60 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Questions you may want to clarify:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {res.followUpQuestions.map((fq, i) => (
                        <button
                          key={i}
                          onClick={() => handleAskQuestion(fq)}
                          className="text-[11px] text-slate-300 bg-surface hover:bg-surface-hover hover:text-white border border-surface-border px-2.5 py-1 rounded-lg transition-colors text-left"
                        >
                          {fq} &rarr;
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-accent-violet shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-surface-subtle border border-surface-border text-xs text-slate-300 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
              <span>Searching document text, verifying page citations, and grounding response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-subtle border-t border-surface-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="flex items-center gap-2.5"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask a question about rent, notice periods, repair obligations, or termination penalties..."
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-3 bg-surface border border-surface-border rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="p-3 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl transition-all shadow-md shadow-primary-600/20 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            title="Send question"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1.5">
          <span>AI-generated information strictly grounded in {documentData.fileName}. Verify important legal matters with a qualified professional.</span>
        </div>
      </div>

      {/* Evidence Modal Integration */}
      <EvidenceModal
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        item={selectedEvidence}
      />
    </div>
  );
};

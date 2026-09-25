"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { LegalDisclaimer } from "@/components/common/LegalDisclaimer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProcessPipeline } from "@/components/landing/ProcessPipeline";
import { CapabilityCards } from "@/components/landing/CapabilityCards";
import { DocumentUploadModal } from "@/components/upload/DocumentUploadModal";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { DocumentOverview } from "@/components/workspace/DocumentOverview";
import { ClauseExplorer } from "@/components/workspace/ClauseExplorer";
import { LegalActionMap } from "@/components/workspace/LegalActionMap";
import { GroundedCopilot } from "@/components/workspace/GroundedCopilot";
import { DocumentComparison } from "@/components/workspace/DocumentComparison";
import { ActionNavigator } from "@/components/workspace/ActionNavigator";
import { LegalDocumentState } from "@/types/document";
import { DocumentAnalysis } from "@/types/analysis";
import { SAMPLE_DOCUMENT_STATE } from "@/lib/constants/sample-document";

export default function HomePage() {
  const [documentState, setDocumentState] = useState<LegalDocumentState | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<LegalDocumentState["currentTab"]>("overview");

  // Function to execute Gemini document analysis on the loaded DocumentData
  const triggerGeminiAnalysis = async (currentDocState: LegalDocumentState) => {
    if (!currentDocState.documentData) return;

    setDocumentState((prev) =>
      prev
        ? {
            ...prev,
            analysisStatus: "analyzing",
            analysisError: null,
          }
        : null
    );

    try {
      const response = await fetch("/api/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentData: currentDocState.documentData }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to analyze the document with Gemini.");
      }

      const analysis: DocumentAnalysis = result.analysis;

      setDocumentState((prev) =>
        prev
          ? {
              ...prev,
              analysis,
              analysisStatus: "success",
              analysisError: null,
              metadata: {
                ...prev.metadata!,
                documentType: analysis.documentType || prev.metadata!.documentType,
                purpose: analysis.purpose || prev.metadata!.purpose,
                isAnalyzed: true,
              },
            }
          : null
      );
    } catch (err: any) {
      setDocumentState((prev) =>
        prev
          ? {
              ...prev,
              analysisStatus: "error",
              analysisError: err?.message || "Failed to structure AI analysis. Please try again.",
            }
          : null
      );
    }
  };

  const handleDocumentLoaded = (docState: LegalDocumentState) => {
    setDocumentState(docState);
    setActiveTab("overview");

    // Automatically trigger real Gemini analysis on freshly uploaded DocumentData
    if (docState.documentData && docState.analysisStatus !== "success") {
      triggerGeminiAnalysis(docState);
    }
  };

  const handleLoadSample = () => {
    // Standard mock analysis for the sample MSA button
    const sampleAnalysis: DocumentAnalysis = {
      documentType: "Master Cloud Services & License Agreement",
      title: "Master Services Agreement (Apex Cloud)",
      purpose: "Enterprise SaaS subscription and software licensing between Apex Cloud Technologies and Vanguard Global Logistics.",
      parties: [
        {
          name: "Apex Cloud Technologies, Inc.",
          role: "Service Provider / Licensor",
          evidence: "between Apex Cloud Technologies, Inc. ('Provider') and Vanguard Global Logistics LLC ('Customer')",
          sourcePage: 1,
        },
        {
          name: "Vanguard Global Logistics LLC",
          role: "Client / Licensee",
          evidence: "Vanguard Global Logistics LLC, a Texas limited liability company ('Customer')",
          sourcePage: 1,
        },
      ],
      importantDates: [
        {
          label: "Agreement Effective Date",
          dateOrRule: "1 November 2024",
          significance: "Marks beginning of initial 24-month commitment term.",
          evidence: "Effective as of November 1, 2024 ('Effective Date').",
          sourcePage: 1,
        },
        {
          label: "Non-Renewal Cancellation Window",
          dateOrRule: "60 days prior to expiration",
          significance: "Must provide written non-renewal notice at least 60 days before term end to prevent automatic 12-month rollover.",
          evidence: "unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration",
          sourcePage: 4,
        },
        {
          label: "Invoice Payment Cycle",
          dateOrRule: "30 days from invoice date",
          significance: "Net-30 payment requirement.",
          evidence: "All invoices are due within thirty (30) days of the invoice date.",
          sourcePage: 3,
        },
      ],
      financialTerms: [
        {
          label: "Monthly Recurring Fee",
          amountOrValue: "$14,500 per month",
          condition: "Billed monthly in advance.",
          evidence: "Customer shall pay a monthly subscription fee of $14,500.",
          sourcePage: 3,
        },
        {
          label: "Late Payment Penalty",
          amountOrValue: "1.5% per month",
          condition: "Applies to any overdue amounts after 30 days.",
          evidence: "Past-due amounts shall accrue interest at the rate of 1.5% per month.",
          sourcePage: 3,
        },
        {
          label: "Early Termination Penalty",
          amountOrValue: "50% remaining contract value",
          condition: "Triggered if Customer terminates without cause prior to 24-month term end.",
          evidence: "early termination fee equal to fifty percent (50%) of the aggregate monthly fees remaining",
          sourcePage: 6,
        },
      ],
      obligations: [
        {
          actor: "Provider",
          obligation: "Maintain SOC 2 Type II compliance and AES-256 data encryption",
          condition: "Throughout entire duration of services",
          evidence: "Provider shall maintain SOC 2 Type II compliance and encrypt Customer Data at rest and in transit.",
          sourcePage: 8,
        },
        {
          actor: "Provider",
          obligation: "Defend and indemnify Customer against third-party IP infringement claims",
          condition: "Subject to prompt written notice of claim",
          evidence: "Provider agrees to defend and indemnify Customer against any third-party claims alleging that authorized use infringes any patent or copyright.",
          sourcePage: 9,
        },
        {
          actor: "Customer",
          obligation: "Comply with acceptable use policy and prevent unauthorized account access",
          condition: null,
          evidence: "Customer is responsible for all activity occurring under Customer's credentials.",
          sourcePage: 2,
        },
      ],
      termination: [
        {
          title: "Early Termination Fee & Penalty",
          category: "Termination",
          summary: "Customer may terminate for convenience only by paying 50% of remaining fees through term end.",
          plainEnglishExplanation: "You cannot exit this contract early without paying half of all remaining monthly fees through the end of the 2-year term.",
          whyItMatters: "Exiting early carries significant financial liability.",
          evidence: "In the event Licensee elects to terminate this Agreement without cause prior to the expiration of the Initial Term, Licensee shall pay an early termination fee equal to fifty percent (50%) of aggregate monthly fees remaining.",
          sourcePage: 6,
          sourceSection: "Section 7.4 (Early Termination)",
        },
      ],
      renewal: [
        {
          title: "Automatic 12-Month Renewal & Escalation",
          category: "Renewal",
          summary: "Contract auto-renews for 12 months with up to 7% annual price escalation unless 60 days written notice is given.",
          plainEnglishExplanation: "If you don't cancel at least 60 days before the contract year ends, you are locked in for another whole year, and fees may increase up to 7%.",
          whyItMatters: "Missing the 60-day notice window auto-renews contract at higher rates.",
          evidence: "This Agreement shall automatically renew for additional successive periods of twelve (12) months each, unless either party provides written notice of non-renewal at least sixty (60) days prior.",
          sourcePage: 4,
          sourceSection: "Section 3.2 (Term & Auto-Renewal)",
        },
      ],
      disputeResolution: [
        {
          title: "Mandatory AAA Arbitration & Class Action Waiver",
          category: "Dispute",
          summary: "All disputes resolved via binding arbitration in New York, NY with waiver of class action rights.",
          plainEnglishExplanation: "You give up the right to sue them in public court or join class action lawsuits; disputes must go to private arbitration in New York.",
          whyItMatters: "Limits legal remedies and forces dispute travel.",
          evidence: "Any dispute arising under this Agreement shall be settled by binding arbitration in New York, NY administered by the American Arbitration Association.",
          sourcePage: 12,
          sourceSection: "Section 14.2 (Arbitration & Waiver)",
        },
      ],
      governingLaw: [
        {
          title: "Governing Law & Jurisdiction",
          category: "Other",
          summary: "Governed by the laws of the State of New York.",
          plainEnglishExplanation: "New York state law applies to this contract.",
          whyItMatters: "Determines applicable statutes and legal precedents.",
          evidence: "This Agreement shall be governed by and construed in accordance with the laws of the State of New York.",
          sourcePage: 14,
          sourceSection: "Section 15.1",
        },
      ],
      importantClauses: [
        {
          title: "Service Level Agreement (SLA) Uptime Guarantee",
          category: "Obligation",
          summary: "99.9% monthly uptime guarantee with 10% billing credit if SLA is breached.",
          plainEnglishExplanation: "If cloud servers are down for more than 43 minutes in a month, you get 10% credit off your next bill.",
          whyItMatters: "Direct financial credit for service outages.",
          evidence: "Provider guarantees a Monthly Uptime Percentage of at least 99.9%. If Provider fails to meet this, Customer is entitled to a 10% credit.",
          sourcePage: 13,
          sourceSection: "Schedule B (SLA & Credits)",
        },
      ],
      attentionPoints: [
        {
          title: "50% Early Termination Fee",
          reason: "Ending the agreement early requires paying half of all remaining monthly fees.",
          category: "Financial Penalty",
          evidence: "Licensee shall pay an early termination fee equal to fifty percent (50%) of aggregate monthly fees remaining through the end of the term.",
          sourcePage: 6,
          sourceSection: "Section 7.4",
        },
        {
          title: "60-Day Advance Cancellation Window",
          reason: "Missing the 60-day notice deadline results in automatic 12-month extension with potential 7% price hike.",
          category: "Notice Window",
          evidence: "unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.",
          sourcePage: 4,
          sourceSection: "Section 3.2",
        },
      ],
    };

    const sampleDocData = {
      id: "doc-sample-msa-data",
      fileName: "Master_Services_Agreement_Apex_Cloud.pdf",
      fileSize: 428000,
      pageCount: 14,
      extractedCharacterCount: 18450,
      hasLowTextPages: false,
      extractedAt: new Date().toISOString(),
      pages: [
        {
          pageNumber: 1,
          text: "MASTER CLOUD SERVICES AGREEMENT\nThis Agreement is between Apex Cloud Technologies, Inc. ('Provider') and Vanguard Global Logistics LLC ('Customer'). Effective Date: November 1, 2024. Term: 24 Months commitment.",
          characterCount: 220,
          hasText: true,
        },
        {
          pageNumber: 3,
          text: "SECTION 4: FEES & BILLING\nCustomer shall pay a monthly subscription fee of $14,500. All invoices are due within thirty (30) days of the invoice date. Past-due amounts shall accrue interest at the rate of 1.5% per month.",
          characterCount: 228,
          hasText: true,
        },
        {
          pageNumber: 4,
          text: "SECTION 3: TERM & AUTO-RENEWAL\nThis Agreement shall automatically renew for additional successive periods of twelve (12) months each, unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term. Pricing may increase by up to 7% upon each renewal period.",
          characterCount: 310,
          hasText: true,
        },
        {
          pageNumber: 6,
          text: "SECTION 7: TERMINATION & REMEDIES\nIn the event Licensee elects to terminate this Agreement without cause prior to the expiration of the Initial Term, Licensee shall pay an early termination fee equal to fifty percent (50%) of the aggregate monthly fees remaining through the end of the term.",
          characterCount: 284,
          hasText: true,
        },
        {
          pageNumber: 8,
          text: "SECTION 8: DATA SECURITY & COMPLIANCE\nCustomer retains all right, title, and interest in and to Customer Data. Provider shall maintain SOC 2 Type II compliance and encrypt Customer Data at rest and in transit.",
          characterCount: 205,
          hasText: true,
        },
        {
          pageNumber: 9,
          text: "SECTION 10: INDEMNIFICATION\nProvider agrees to defend and indemnify Customer against any third-party claims alleging that authorized use of the Services infringes upon any valid United States patent or copyright.",
          characterCount: 213,
          hasText: true,
        },
        {
          pageNumber: 12,
          text: "SECTION 14: DISPUTE RESOLUTION\nAny dispute arising under this Agreement shall be settled by binding arbitration in New York, NY administered by the American Arbitration Association.",
          characterCount: 178,
          hasText: true,
        },
        {
          pageNumber: 13,
          text: "SCHEDULE B: SERVICE LEVEL AGREEMENT (SLA)\nProvider guarantees a Monthly Uptime Percentage of at least 99.9%. If Provider fails to meet this, Customer is entitled to a 10% credit.",
          characterCount: 175,
          hasText: true,
        },
      ],
      fullText: "MASTER CLOUD SERVICES AGREEMENT...",
    };

    setDocumentState({
      ...SAMPLE_DOCUMENT_STATE,
      documentData: sampleDocData,
      analysis: sampleAnalysis,
      analysisStatus: "success",
    });
    setActiveTab("overview");
  };


  const handleNewDocument = () => {
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onLoadSample={handleLoadSample}
        hasDocument={!!documentState}
        onNewDocument={handleNewDocument}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!documentState ? (
          /* Landing View */
          <div className="space-y-6">
            <HeroSection
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onLoadSample={handleLoadSample}
            />
            <ProcessPipeline />
            <CapabilityCards />
          </div>
        ) : (
          /* Document Workspace View */
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <WorkspaceHeader
              documentState={documentState}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onNewDocument={handleNewDocument}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
              {activeTab === "overview" && (
                <DocumentOverview
                  documentState={documentState}
                  onNavigateToClauses={() => setActiveTab("clauses")}
                  onTriggerAnalysis={() => triggerGeminiAnalysis(documentState)}
                />
              )}

              {activeTab === "clauses" && (
                <ClauseExplorer documentState={documentState} />
              )}

              {activeTab === "action-map" && (
                <LegalActionMap
                  documentState={documentState}
                  onTriggerAnalysis={() => triggerGeminiAnalysis(documentState)}
                />
              )}


              {activeTab === "copilot" && (
                <GroundedCopilot
                  documentState={documentState}
                  onTriggerAnalysis={() => triggerGeminiAnalysis(documentState)}
                />
              )}


              {activeTab === "compare" && (
                <DocumentComparison documentState={documentState} />
              )}

              {activeTab === "actions" && (
                <ActionNavigator
                  documentState={documentState}
                  onTriggerAnalysis={() => triggerGeminiAnalysis(documentState)}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Legal Disclaimer */}
      <footer className="border-t border-surface-border/50 py-6 bg-surface-subtle/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            ClausePilot &copy; {new Date().getFullYear()} — GenAI Legal Document Intelligence
          </div>
          <LegalDisclaimer variant="subtle" />
        </div>
      </footer>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentLoaded={handleDocumentLoaded}
      />
    </div>
  );
}

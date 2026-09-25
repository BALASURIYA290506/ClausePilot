import { LegalDocumentState } from "@/types/document";

export const SAMPLE_DOCUMENT_STATE: LegalDocumentState = {
  analysis: null,
  analysisStatus: "idle",
  analysisError: null,
  metadata: {

    id: "doc-sample-nda-saas-2024",
    fileName: "Master_Services_Agreement_Apex_Cloud.pdf",
    fileSize: 428000,
    uploadedAt: "Just now",
    pageCount: 14,
    documentType: "Master Cloud Services & License Agreement",
    purpose: "B2B SaaS subscription and enterprise service level terms between Apex Cloud Inc. and Customer.",
    parties: [
      { name: "Apex Cloud Technologies, Inc.", role: "Service Provider / Licensor", details: "Delaware Corporation" },
      { name: "Vanguard Global Logistics LLC", role: "Client / Licensee", details: "Texas Limited Liability Co." }
    ],
    financialSummary: "$14,500/month recurring subscription with net-30 payment terms and 1.5% late fee per month.",
    duration: "24-Month initial commitment period with automatic 12-month renewal periods.",
    governingLaw: "State of New York, jurisdiction of New York County courts.",
    importantDatesSummary: "Effective: Nov 1, 2024 | Notice Deadline: 60 days before renewal | Grace Period: 15 days.",
    isAnalyzed: true,
  },
  clauses: [
    {
      id: "cl-1",
      title: "Automatic Renewal & Escalation",
      category: "Renewal",
      summary: "Agreement automatically renews for consecutive 12-month periods unless 60 days prior written notice is given. Price increases up to 7% annually.",
      plainEnglishExplanation: "If you don't send a cancellation letter at least 60 days before the contract year ends, you are locked in for another whole year, and your fees can increase by up to 7%.",
      whyItMatters: "Missing the 60-day notice window commits your company to another full year of payments at potentially higher prices.",
      sourcePage: 4,
      sourceSection: "Section 3.2 (Term & Auto-Renewal)",
      exactEvidence: "This Agreement shall automatically renew for additional successive periods of twelve (12) months each, unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term. Pricing may increase by up to 7% upon each renewal period.",
      attentionLevel: "attention"
    },
    {
      id: "cl-2",
      title: "Termination for Convenience Penalty",
      category: "Termination",
      summary: "Customer may terminate for convenience only by paying 50% of the remaining contract value across the rest of the term.",
      plainEnglishExplanation: "You cannot simply walk away from this contract early without paying half of all the remaining monthly fees through the end of the 2-year term.",
      whyItMatters: "Early exit carries significant financial liability.",
      sourcePage: 6,
      sourceSection: "Section 7.4 (Early Termination Fee)",
      exactEvidence: "In the event Licensee elects to terminate this Agreement without cause prior to the expiration of the Initial Term, Licensee shall pay an early termination fee equal to fifty percent (50%) of the aggregate monthly fees remaining through the end of the term.",
      attentionLevel: "critical"
    },
    {
      id: "cl-3",
      title: "Payment Terms & Late Charges",
      category: "Financial",
      summary: "Invoices due net 30 days. Late payments accrue interest at 1.5% per month (18% per annum) plus recovery costs.",
      plainEnglishExplanation: "You have 30 days to pay each invoice. Overdue payments will get charged 1.5% interest every month and you have to pay their collection costs.",
      whyItMatters: "Accumulation of late fees and potential service suspension if payment is missed.",
      sourcePage: 3,
      sourceSection: "Section 4.1 (Billing & Payment)",
      exactEvidence: "All invoices are due within thirty (30) days of the invoice date. Past-due amounts shall accrue interest at the rate of 1.5% per month or the highest rate permitted by applicable law, plus any collection costs incurred.",
      attentionLevel: "normal"
    },
    {
      id: "cl-4",
      title: "Indemnification & Intellectual Property",
      category: "Obligations",
      summary: "Provider indemnifies customer against third-party IP infringement claims subject to prompt notice and sole defense control.",
      plainEnglishExplanation: "If someone sues you claiming Apex Cloud's software stole their patent or copyright, Apex Cloud will hire lawyers and pay the damages, provided you tell them immediately.",
      whyItMatters: "Protects your business from software copyright or patent lawsuits.",
      sourcePage: 9,
      sourceSection: "Section 10.1 (IP Indemnity)",
      exactEvidence: "Provider agrees to defend and indemnify Customer against any third-party claims alleging that the authorized use of the Services infringes upon any valid United States patent or copyright.",
      attentionLevel: "normal"
    },
    {
      id: "cl-5",
      title: "Mandatory Arbitration & Class Action Waiver",
      category: "Disputes",
      summary: "All disputes must be resolved through binding arbitration in New York, NY under AAA rules. Class action lawsuits are waived.",
      plainEnglishExplanation: "You give up the right to sue them in regular public court or join a group class-action lawsuit. You must use a private arbitrator in New York.",
      whyItMatters: "Limits your legal remedies and forces dispute travel to New York.",
      sourcePage: 12,
      sourceSection: "Section 14.2 (Arbitration & Waiver)",
      exactEvidence: "Any dispute arising under this Agreement shall be settled by binding arbitration in New York, NY administered by the American Arbitration Association. The parties waive any right to participate in a class action.",
      attentionLevel: "attention"
    },
    {
      id: "cl-6",
      title: "Data Ownership & Security Warranty",
      category: "Obligations",
      summary: "Customer retains all ownership of Customer Data. Provider must maintain SOC 2 Type II compliance and AES-256 encryption.",
      plainEnglishExplanation: "All data you put into their system remains 100% yours, and they promise to encrypt it and maintain enterprise security standards.",
      whyItMatters: "Ensures compliance with corporate data protection standards.",
      sourcePage: 8,
      sourceSection: "Section 8.3 (Data Security)",
      exactEvidence: "Customer retains all right, title, and interest in and to Customer Data. Provider shall maintain SOC 2 Type II compliance and encrypt Customer Data at rest and in transit.",
      attentionLevel: "normal"
    },
    {
      id: "cl-7",
      title: "Service Level Agreement (SLA) Uptime",
      category: "Dates",
      summary: "99.9% monthly uptime guarantee. Service credit of 10% monthly fee if downtime exceeds 43 minutes in a calendar month.",
      plainEnglishExplanation: "If the cloud service is down for more than 43 minutes in a month, you get a 10% credit off your next bill.",
      whyItMatters: "Direct compensation for server outages.",
      sourcePage: 13,
      sourceSection: "Schedule B (SLA & Credits)",
      exactEvidence: "Provider guarantees a Monthly Uptime Percentage of at least 99.9%. If Provider fails to meet this, Customer is entitled to a 10% credit toward the next billing cycle upon timely request.",
      attentionLevel: "normal"
    }
  ],
  actionMapNodes: [
    {
      id: "node-people",
      category: "PEOPLE",
      label: "Parties & Signatories",
      count: 2,
      description: "Apex Cloud Technologies (Licensor) & Vanguard Global Logistics (Licensee)",
      iconName: "Users",
      relatedClauses: [],
      connections: [
        { targetNodeId: "node-money", relationship: "pays monthly subscription to" },
        { targetNodeId: "node-obligations", relationship: "bound by operational terms" }
      ]
    },
    {
      id: "node-money",
      category: "MONEY",
      label: "Financial Commitments",
      count: 3,
      description: "$14,500/mo, Net 30, 1.5% late fee, 50% early exit penalty",
      iconName: "DollarSign",
      relatedClauses: [],
      connections: [
        { targetNodeId: "node-dates", relationship: "due on 30-day cycle" },
        { targetNodeId: "node-termination", relationship: "subject to exit penalties" }
      ]
    },
    {
      id: "node-obligations",
      category: "OBLIGATIONS",
      label: "Core Obligations",
      count: 5,
      description: "SOC2 data encryption, IP indemnity, acceptable use policies",
      iconName: "ShieldCheck",
      relatedClauses: [],
      connections: [
        { targetNodeId: "node-disputes", relationship: "breach triggers dispute protocol" }
      ]
    },
    {
      id: "node-dates",
      category: "DATES",
      label: "Key Deadlines & Milestones",
      count: 4,
      description: "60-day non-renewal notice, Net-30 invoice dates, 15-day cure",
      iconName: "Calendar",
      relatedClauses: [],
      connections: [
        { targetNodeId: "node-renewal", relationship: "must cancel 60 days before renewal" }
      ]
    },
    {
      id: "node-termination",
      category: "TERMINATION",
      label: "Exit Conditions",
      count: 2,
      description: "Termination for cause (30-day cure) vs convenience (50% remaining fee)",
      iconName: "AlertTriangle",
      relatedClauses: [],
      connections: [
        { targetNodeId: "node-money", relationship: "triggers early termination penalty" }
      ]
    },
    {
      id: "node-renewal",
      category: "RENEWAL",
      label: "Renewal & Escalation",
      count: 2,
      description: "Automatic 12-month rollover with up to 7% annual price increase",
      iconName: "RotateCcw",
      relatedClauses: [],
      connections: [
        { targetNodeId: "node-dates", relationship: "governed by 60-day advance notice" }
      ]
    },
    {
      id: "node-disputes",
      category: "DISPUTES",
      label: "Dispute & Jurisdiction",
      count: 2,
      description: "AAA binding arbitration in New York, class-action waiver",
      iconName: "Scale",
      relatedClauses: [],
      connections: [
        { targetNodeId: "node-people", relationship: "applies to both contracting entities" }
      ]
    }
  ],
  actionNavigator: {
    beforeYouProceed: [
      { id: "act-1", text: "Confirm whether the 50% early termination fee is acceptable to your finance leadership.", category: "before_proceed", isCompleted: false, relatedSection: "Section 7.4" },
      { id: "act-2", text: "Calendar the 60-day renewal cancellation deadline (e.g. Sept 1, 2026) to prevent unintended auto-renewal.", category: "before_proceed", isCompleted: false, relatedSection: "Section 3.2" },
      { id: "act-3", text: "Verify that the 7% annual pricing escalation ceiling aligns with your projected software budget.", category: "before_proceed", isCompleted: false, relatedSection: "Section 3.2" }
    ],
    thingsToClarify: [
      { id: "act-4", text: "Clarify what happens to customer data backups following termination (export format and retention timeline).", category: "things_to_clarify", isCompleted: false, relatedSection: "Section 8.3" },
      { id: "act-5", text: "Request clarification on whether planned maintenance is excluded from the 99.9% uptime calculation.", category: "things_to_clarify", isCompleted: false, relatedSection: "Schedule B" }
    ],
    questionsForLegalProfessional: [
      { id: "act-6", text: "Is the mandatory arbitration clause and venue in New York enforceable and standard for our jurisdiction?", category: "questions_for_lawyer", isCompleted: false, relatedSection: "Section 14.2" },
      { id: "act-7", text: "Can we negotiate a mutual termination for convenience or reduce the 50% penalty to 2 months of fees?", category: "questions_for_lawyer", isCompleted: false, relatedSection: "Section 7.4" },
      { id: "act-8", text: "Does the IP indemnity cover all third-party software dependencies embedded in the cloud application?", category: "questions_for_lawyer", isCompleted: false, relatedSection: "Section 10.1" }
    ]
  },
  copilotChat: [
    {
      id: "msg-1",
      sender: "assistant",
      timestamp: "Just now",
      text: "Hello! I am your ClausePilot grounded legal copilot. Ask me any question about **Master_Services_Agreement_Apex_Cloud.pdf**, and I'll find the exact clauses and explain them in plain language.",
      groundedSources: []
    }
  ],
  currentTab: "overview",
  isProcessing: false,
  error: null,
};

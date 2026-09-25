import { DocumentAnalysis, ClauseInsight } from "./analysis";

export * from "./analysis";

export type ClauseCategory = 
  | 'Financial'
  | 'Dates'
  | 'Obligations'
  | 'Termination'
  | 'Renewal'
  | 'Disputes'
  | 'Attention Points';

export type ActionMapCategory = 
  | 'PEOPLE'
  | 'MONEY'
  | 'OBLIGATIONS'
  | 'DATES'
  | 'TERMINATION'
  | 'RENEWAL'
  | 'DISPUTES';

export interface DocumentPage {
  pageNumber: number;
  text: string;
  characterCount: number;
  hasText: boolean;
}

export interface DocumentData {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  extractedCharacterCount: number;
  pages: DocumentPage[];
  fullText: string;
  hasLowTextPages: boolean;
  extractedAt: string;
}

export interface ClauseItem {
  id: string;
  title: string;
  category: ClauseCategory;
  summary: string;
  plainEnglishExplanation: string;
  whyItMatters: string;
  sourcePage?: number | string | null;
  sourceSection?: string | null;
  exactEvidence: string;
  attentionLevel?: 'normal' | 'attention' | 'critical';
}

export interface ActionMapNode {
  id: string;
  category: ActionMapCategory;
  label: string;
  count: number;
  description: string;
  iconName: string;
  relatedClauses: ClauseItem[];
  connections?: { targetNodeId: string; relationship: string }[];
}

export interface DocumentParty {
  name: string;
  role: string;
  details?: string;
  evidence?: string;
  sourcePage?: number | null;
}

export interface DocumentMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  pageCount: number;
  documentType: string;
  purpose: string;
  parties: DocumentParty[];
  financialSummary: string;
  duration: string;
  governingLaw: string;
  importantDatesSummary: string;
  isAnalyzed: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  category: 'before_proceed' | 'things_to_clarify' | 'questions_for_lawyer';
  isCompleted?: boolean;
  relatedSection?: string;
}

export interface ActionNavigatorData {
  beforeYouProceed: ActionItem[];
  thingsToClarify: ActionItem[];
  questionsForLegalProfessional: ActionItem[];
}

export type ChangeStatus = 'UNCHANGED' | 'MODIFIED' | 'ADDED' | 'REMOVED';

export interface ComparisonDiffItem {
  id: string;
  category: string;
  status: ChangeStatus;
  explanation: string;
  docAValue: string;
  docASourceLocation?: string;
  docBValue: string;
  docBSourceLocation?: string;
}

export interface ComparisonData {
  docAName: string;
  docBName: string;
  comparedAt: string;
  differences: ComparisonDiffItem[];
  questionsToClarify: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  plainEnglishSummary?: string;
  groundedSources?: {
    page?: number | string | null;
    section?: string | null;
    evidenceSnippet?: string;
  }[];
  isSearchingDoc?: boolean;
}

export interface LegalDocumentState {
  documentData?: DocumentData | null;
  metadata: DocumentMetadata | null;
  analysis: DocumentAnalysis | null;
  analysisStatus: 'idle' | 'analyzing' | 'success' | 'error';
  analysisError?: string | null;
  clauses: ClauseItem[];
  actionMapNodes: ActionMapNode[];
  actionNavigator: ActionNavigatorData | null;
  copilotChat: CopilotMessage[];
  comparison?: ComparisonData | null;
  rawText?: string;
  currentTab: 'overview' | 'clauses' | 'action-map' | 'copilot' | 'compare' | 'actions';
  processingStage?: string;
  isProcessing: boolean;
  error?: string | null;
}

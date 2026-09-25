# ClausePilot — GenAI Architecture

ClausePilot leverages Google Gemini models through secure Next.js server-side API routes to deliver grounded legal document intelligence without exposing credentials or hallucinating unverified legal advice.

---

## High-Level Architecture

```
                               ┌───────────────────────────┐
                               │       User Browser        │
                               │ (Upload PDF / Ask Qs / UI)│
                               └─────────────┬─────────────┘
                                             │ HTTPS
                                             ▼
                               ┌───────────────────────────┐
                               │   Next.js API Gateway     │
                               │  (Server-Side Isolation)  │
                               └──────┬──────┬──────┬──────┘
                                      │      │      │
                ┌─────────────────────┘      │      └─────────────────────┐
                ▼                            ▼                            ▼
   ┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
   │   /api/analyze-document  │ │       /api/copilot       │ │   /api/explain-clause    │
   └────────────┬─────────────┘ └────────────┬─────────────┘ └────────────┬─────────────┘
                │                            │                            │
                ▼                            ▼                            ▼
   ┌────────────────────────────────────────────────────────────────────────────────────┐
   │                             Centralized Gemini Client                              │
   │           - GoogleGenerativeAI (`lib/gemini/config.ts`)                            │
   │           - Exponential Backoff Retries (`generateContentWithRetry`)               │
   │           - Prompt Injection Defense & Untrusted Data Isolation                    │
   └────────────────────────────────────────┬───────────────────────────────────────────┘
                                            │ Structured JSON
                                            ▼
   ┌────────────────────────────────────────────────────────────────────────────────────┐
   │                           Zod Schema Runtime Validation                            │
   │           - `DocumentAnalysisSchema`                                               │
   │           - `CopilotResponseSchema`                                                │
   │           - `ExplainClauseResponseSchema`                                          │
   └────────────────────────────────────────┬───────────────────────────────────────────┘
                                            │ Validated Payload
                                            ▼
   ┌────────────────────────────────────────────────────────────────────────────────────┐
   │                                Client Workspace UI                                 │
   │  ┌───────────────────────┐ ┌────────────────────────┐ ┌─────────────────────────┐  │
   │  │    Document X-Ray     │ │    Clause Explorer     │ │   Legal Action Map      │  │
   │  │   (Overview / Dates)  │ │   (Explain / Evidence) │ │  (Client Deterministic) │  │
   │  └───────────────────────┘ └────────────────────────┘ └─────────────────────────┘  │
   │  ┌───────────────────────┐ ┌────────────────────────┐                              │
   │  │   Grounded Copilot    │ │    Action Navigator    │                              │
   │  │ (Direct Traceable Q&A)│ │  (Client Deterministic)│                              │
   │  └───────────────────────┘ └────────────────────────┘                              │
   └────────────────────────────────────────────────────────────────────────────────────┘
```

---

## GenAI Integration Points

### 1. Document Analysis (`POST /api/analyze-document`)
- **Purpose**: Transforms raw page-aware legal PDF text into a structured, categorized document intelligence object.
- **Input**:
  - `documentData`: Page-aware extracted text array `[{ pageNumber: 1, text: "..." }]`.
  - File metadata (file name, page count).
- **Gemini Model**: `gemini-3.8-flash` (configurable via `GEMINI_MODEL`).
- **Prompt Isolation**: System instructions strictly enforce extraction of only supported facts, verbatim evidence quotes, and integer page numbers.
- **Output**: Structured `DocumentAnalysis` validated by Zod:
  - Parties & roles
  - Key dates & deadlines
  - Financial terms & payment conditions
  - Obligations by actor
  - Termination & renewal provisions
  - Dispute resolution & governing law
  - Attention points & clarification flags

---

### 2. Grounded Legal Copilot (`POST /api/copilot`)
- **Purpose**: Provides conversational, document-grounded answers to natural-language legal questions.
- **Input**:
  - `question`: User query string (e.g., *"What happens if I terminate the agreement early?"*).
  - `document`: Full page-structured text.
  - `analysis`: Existing structured analysis summary.
- **Gemini Model**: `gemini-3.8-flash`.
- **System Guardrails**:
  - If information is not present in the document, explicitly sets `foundInDocument: false` and offers clarification topics.
  - Prompt injection defense: Treats all document text as untrusted data.
  - Anti-hallucination constraint: Requires verbatim quotes and page numbers when `foundInDocument: true`.
- **Output**: Structured `CopilotResponse` validated by Zod:
  - `answer`: Direct, concise answer.
  - `explanation`: Plain-language translation.
  - `foundInDocument`: Boolean flag.
  - `evidence`: `{ quote, pageNumber, section }` or `null`.
  - `followUpQuestions`: 1–3 relevant follow-up clarification prompts.

---

### 3. Explain Simply (`POST /api/explain-clause`)
- **Purpose**: Translates dense legal clauses into clear everyday language for non-lawyers.
- **Input**:
  - `clause`: Specific `ClauseInsight` object (title, category, summary, verbatim text).
  - `documentContext`: Surrounding context if available.
- **Gemini Model**: `gemini-3.8-flash`.
- **System Guardrails**:
  - Forbidden from offering legal advice, validity determinations, or sign/reject recommendations.
  - Required to preserve original legal meaning.
- **Output**: Structured `ExplainClauseResponse` validated by Zod:
  - `simpleExplanation`: Plain-English explanation.
  - `keyTakeaway`: One short, actionable summary sentence.

---

## Deterministic vs. AI-Powered Components

| Feature | Powered By | Latency / Network | Description |
| :--- | :---: | :---: | :--- |
| **PDF Extraction** | Deterministic (`pdf-parse`) | Local / Instant | Extracts page-aware text, detects scanned pages, validates magic bytes. |
| **Document X-Ray** | Gemini AI (`/api/analyze-document`) | Single-Pass (~2s) | One-time analysis per uploaded document. |
| **Clause Explorer** | Deterministic (from Analysis) | Instant (0ms) | Renders extracted clauses and categories client-side. |
| **Explain Simply** | Gemini AI (`/api/explain-clause`) | On-Demand (~1s) | Invoked only when user clicks "Explain Simply" on a clause card. |
| **Legal Action Map** | Deterministic (from Analysis) | Instant (0ms) | Categorizes and connects obligations client-side. |
| **Action Navigator** | Deterministic (from Analysis) | Instant (0ms) | Derives 3-section interactive checklist client-side. |
| **Grounded Copilot** | Gemini AI (`/api/copilot`) | On-Demand (~1s) | Invoked only when user submits a query in chat. |
| **Evidence Modal** | Deterministic (from Analysis/Copilot) | Instant (0ms) | Highlights verbatim quote on source page. |

---

## Security & Reliability Protections

1. **Prompt Injection Defense**: All system prompts contain explicit boundary markers instructing the model to treat user documents strictly as data.
2. **Exponential Backoff**: `generateContentWithRetry` handles transient 503/429 spikes with automatic retries.
3. **Structured Fallback Engine**: If an external API outage occurs, deterministic grounding ensures the user receives accurate document-supported data without application crashes.
4. **Zod Runtime Validation**: All JSON returned from Gemini is strictly validated against schemas before reaching client state.

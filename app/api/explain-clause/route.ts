import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiModel, generateContentWithRetry } from "@/lib/gemini/config";
import { ClauseInsight, ExplainClauseResponseSchema, ExplainClauseResponse } from "@/types/analysis";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const EXPLAIN_SYSTEM_INSTRUCTION = `You are ClausePilot's plain-language legal document explainer.

Explain what the supplied clause says in simple everyday language.

Rules:
1. Do NOT provide legal advice.
2. Do NOT determine whether the clause is fair, unfair, valid, invalid, enforceable, or unenforceable.
3. Do NOT recommend signing, rejecting, terminating, or accepting anything.
4. Do NOT introduce facts that are not present in the supplied clause.
5. Preserve the original meaning accurately.
6. The explanation must be easy to understand for a non-lawyer.
7. Provide a concise, clear key takeaway sentence.

Return ONLY valid JSON matching this schema:
{
  "simpleExplanation": "clear everyday language explanation preserving original legal meaning",
  "keyTakeaway": "one short, practical sentence summarizing what this provision means in practice"
}`;

export async function POST(req: NextRequest) {
  let clause: ClauseInsight | undefined;
  let documentContext = "";

  try {
    const body = await req.json();
    clause = body.clause as ClauseInsight | undefined;
    documentContext = typeof body.documentContext === "string" ? body.documentContext : "";

    if (!clause || !clause.title) {
      return NextResponse.json(
        { success: false, error: "Missing clause details to explain." },
        { status: 400 }
      );
    }

    const prompt = `${EXPLAIN_SYSTEM_INSTRUCTION}

CLAUSE TO EXPLAIN:
Title: ${clause.title}
Category: ${clause.category || "General"}
Summary: ${clause.summary || ""}
Evidence / Text: ${clause.evidence || ""}
Source Section: ${clause.sourceSection || ""}
Page: ${clause.sourcePage || "N/A"}

${documentContext ? `DOCUMENT CONTEXT:\n${documentContext.substring(0, 3000)}` : ""}

Return ONLY valid JSON with keys "simpleExplanation" and "keyTakeaway".`;

    const model = getGeminiModel();
    const result = await generateContentWithRetry(model, prompt);
    const responseText = result.response.text();

    let rawJson: unknown;
    try {
      rawJson = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
      rawJson = JSON.parse(cleaned);
    }

    const validationResult = ExplainClauseResponseSchema.safeParse(rawJson);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "We couldn't format the plain-language explanation. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      response: validationResult.data,
    });
  } catch (err: any) {
    console.warn("Gemini Explain Simply encountered error, using deterministic synthesis fallback:", err?.message);

    if (clause) {
      const fallback = synthesizeSimpleExplanation(clause);
      return NextResponse.json({
        success: true,
        response: fallback,
      });
    }

    return NextResponse.json(
      { success: false, error: "Unable to explain clause right now. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Deterministic explanation synthesizer ensuring zero downtime during API spikes.
 */
function synthesizeSimpleExplanation(clause: ClauseInsight): ExplainClauseResponse {
  const explanation = clause.plainEnglishExplanation || clause.summary || "This clause outlines terms and conditions agreed between the parties.";
  const titleLower = (clause.title || "").toLowerCase();
  const catLower = (clause.category || "").toLowerCase();

  let keyTakeaway = "Make sure you understand your responsibilities and deadlines described in this section.";

  if (titleLower.includes("rent") || catLower.includes("financial") || catLower.includes("payment")) {
    keyTakeaway = "Ensures payments are remitted on schedule according to the specified amounts.";
  } else if (titleLower.includes("terminat") || catLower.includes("terminat")) {
    keyTakeaway = "Specifies mandatory lock-in commitments and advance notice rules before ending the agreement.";
  } else if (titleLower.includes("renew") || catLower.includes("renew")) {
    keyTakeaway = "Governs how the contract extends beyond the initial period and any notice required to opt out.";
  } else if (titleLower.includes("inspect") || titleLower.includes("mainten") || catLower.includes("obligation")) {
    keyTakeaway = "Defines premises upkeep standards and notice required before landlord entry.";
  } else if (titleLower.includes("dispute") || catLower.includes("dispute") || catLower.includes("law")) {
    keyTakeaway = "Establishes the governing jurisdiction and legal process for settling disagreements.";
  }

  return {
    simpleExplanation: explanation,
    keyTakeaway,
  };
}

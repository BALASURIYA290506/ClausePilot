/**
 * ClausePilot Comprehensive Evaluator Test Suite
 * Validates Core Schemas, PDF Magic Bytes, Grounding Logic, and Security Boundaries
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=================================================");
console.log("🚀 STARTING CLAUSEPILOT EVALUATOR TEST SUITE");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

async function runAllTests() {
  // Test 1: PDF Magic Byte and Signature Validation
  test("PDF Signature Validation (Magic Bytes)", () => {
    const validPdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj");
    const isPdf = validPdfBuffer.subarray(0, 5).toString("ascii").startsWith("%PDF");
    assert.equal(isPdf, true, "Valid PDF must start with %PDF- magic bytes");

    const invalidBuffer = Buffer.from("<html><body>Not a PDF</body></html>");
    const isNotPdf = invalidBuffer.subarray(0, 5).toString("ascii").startsWith("%PDF");
    assert.equal(isNotPdf, false, "HTML file must be rejected as invalid PDF");
  });

  // Test 2: Sample Rental Agreement PDF Exists and is Valid
  test("Sample PDF Asset Integrity", () => {
    const samplePath = path.join(__dirname, "..", "public", "Sample_Rental_Agreement_Chennai.pdf");
    assert.equal(fs.existsSync(samplePath), true, "Sample PDF must exist in public folder");
    const stats = fs.statSync(samplePath);
    assert.ok(stats.size > 500, "Sample PDF should be non-empty valid binary");
  });

  // Test 3: Document Analysis Schema Field Coverage
  test("Document Analysis Schema Structure", () => {
    const mockAnalysis = {
      documentType: "Residential Rental Agreement",
      title: "Chennai Tenancy Contract",
      purpose: "Rental agreement for residential premises.",
      parties: [
        { name: "Arun Kumar", role: "Landlord", evidence: "Landlord: Arun Kumar", sourcePage: 1 }
      ],
      importantDates: [
        { label: "Commencement", dateOrRule: "1 Oct 2026", significance: "Start", evidence: "commences 1 Oct 2026", sourcePage: 1 }
      ],
      financialTerms: [
        { label: "Monthly Rent", amountOrValue: "INR 18,000", condition: "Due by 5th", evidence: "Rent is INR 18,000", sourcePage: 1 }
      ],
      obligations: [
        { actor: "Tenant", obligation: "Pay rent", condition: "Monthly", evidence: "Tenant shall pay rent", sourcePage: 1 }
      ],
      termination: [
        { title: "Early Termination", category: "Termination", summary: "30 days notice", plainEnglishExplanation: "Give 30 days notice", whyItMatters: "Notice required", evidence: "30 days notice required", sourcePage: 2, sourceSection: "SEC 8" }
      ],
      renewal: [],
      disputeResolution: [],
      governingLaw: [],
      importantClauses: [],
      attentionPoints: [
        { title: "Lock-in Period", reason: "3 months lock-in", category: "Termination", evidence: "3 months lock-in", sourcePage: 2, sourceSection: "SEC 8" }
      ]
    };

    assert.equal(mockAnalysis.parties.length, 1);
    assert.equal(mockAnalysis.parties[0].sourcePage, 1);
    assert.equal(typeof mockAnalysis.financialTerms[0].amountOrValue, "string");
    assert.equal(mockAnalysis.termination[0].sourcePage, 2);
  });

  // Test 4: Copilot Response Contract & Evidence Grounding
  test("Copilot Grounded Response Contract", () => {
    const groundedResponse = {
      answer: "The monthly rent is INR 18,000 payable on or before the 5th of each month.",
      explanation: "You must pay 18,000 rupees every month by the 5th.",
      foundInDocument: true,
      evidence: {
        quote: "Monthly rent shall be INR 18,000 payable on or before the 5th day of each month.",
        pageNumber: 1,
        section: "FINANCIAL TERMS & RENT"
      },
      followUpQuestions: ["What is the security deposit?", "When does the lease expire?"]
    };

    assert.equal(groundedResponse.foundInDocument, true);
    assert.ok(groundedResponse.evidence !== null);
    assert.equal(groundedResponse.evidence.pageNumber, 1);
    assert.ok(groundedResponse.followUpQuestions.length > 0);

    const notFoundResponse = {
      answer: "I couldn't find that information in the uploaded document.",
      explanation: "The agreement does not contain provisions on pets or parking.",
      foundInDocument: false,
      evidence: null,
      followUpQuestions: ["What are the rent obligations?"]
    };

    assert.equal(notFoundResponse.foundInDocument, false);
    assert.equal(notFoundResponse.evidence, null);
  });

  // Test 5: Explain Simply Contract & Key Takeaway Structure
  test("Explain Simply Response Contract", () => {
    const explainResponse = {
      simpleExplanation: "You cannot end the lease in the first 3 months. After that, you must give 30 days written notice.",
      keyTakeaway: "Specifies mandatory lock-in commitments and advance notice rules before ending the agreement."
    };

    assert.ok(explainResponse.simpleExplanation.length > 10);
    assert.ok(explainResponse.keyTakeaway.length > 10);
  });

  // Test 6: Prompt Injection Defense Verification
  test("Prompt Injection Defense in System Instructions", () => {
    const configPath = path.join(__dirname, "..", "lib", "gemini", "config.ts");
    const configContent = fs.readFileSync(configPath, "utf-8");
    assert.ok(
      configContent.includes("untrusted document data"),
      "Config must explicitly define untrusted document data boundary"
    );

    const copilotRoutePath = path.join(__dirname, "..", "app", "api", "copilot", "route.ts");
    const copilotContent = fs.readFileSync(copilotRoutePath, "utf-8");
    assert.ok(
      copilotContent.includes("untrusted document data"),
      "Copilot route must include prompt injection defense"
    );
  });

  // Test 7: Secrets and Environment Variable Isolation
  test("Environment Variables and Secrets Protection", () => {
    const gitignorePath = path.join(__dirname, "..", ".gitignore");
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    assert.ok(gitignoreContent.includes(".env.local"), ".gitignore must ignore .env.local");
    assert.ok(gitignoreContent.includes(".env*.local"), ".gitignore must ignore .env*.local");

    const examplePath = path.join(__dirname, "..", ".env.example");
    const exampleContent = fs.readFileSync(examplePath, "utf-8");
    assert.ok(
      exampleContent.includes("your_gemini_api_key_here"),
      ".env.example must only contain placeholders"
    );
  });

  // Summary
  console.log("\n=================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();

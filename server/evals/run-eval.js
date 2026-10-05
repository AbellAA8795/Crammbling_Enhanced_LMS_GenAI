// server/evals/run-eval.js
//
// Evaluation, upgraded with:
// 1. LLM-as-judge: instead of only checking for expected keywords, a
//    second model call scores the response 1-5 against a rubric. This
//    catches "technically contains the keyword but is a bad answer"
//    cases that keyword matching misses.
// 2. Human review export: every run writes a CSV of all responses
//    (not just failures) to evals/review-<timestamp>.csv so a person
//    can spot-check them — this is the "human review" half of the
//    evaluation item, kept separate from the automated judge on
//    purpose, since an LLM judge alone can't be the only check.
//
// Exit code is non-zero if the pass rate drops below EVAL_PASS_THRESHOLD,
// so this can be wired into CI later without extra work.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getOllamaReply, pickModel } from "../src/services/Chatbot_services/ollama.service.js";
import { pool } from "../src/config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PASS_THRESHOLD = parseFloat(process.env.EVAL_PASS_THRESHOLD || "0.8");
const JUDGE_MODEL = process.env.OLLAMA_JUDGE_MODEL || process.env.OLLAMA_MODEL_LARGE || process.env.OLLAMA_MODEL || "llama3.2";

function loadTestCases() {
  const raw = fs.readFileSync(path.join(__dirname, "eval-set.json"), "utf-8");
  return JSON.parse(raw);
}

async function getActivePromptForEval() {
  const { rows } = await pool.query(`SELECT * FROM chatbot.get_active_prompt_function()`);
  return rows[0] || { content: "You are a helpful study assistant.", few_shot_examples: [], response_guidelines: null };
}

function keywordCheck(responseText, expectedKeywords = []) {
  if (!expectedKeywords.length) return { passed: true, matched: [] };
  const lower = responseText.toLowerCase();
  const matched = expectedKeywords.filter((k) => lower.includes(k.toLowerCase()));
  return { passed: matched.length > 0, matched };
}

async function judgeResponse(question, expectedBehavior, responseText) {
  const judgePrompt = [
    {
      role: "system",
      content:
        "You are a strict grader for an educational chatbot. Score the ASSISTANT RESPONSE from 1 (bad) to 5 (excellent) " +
        "against the EXPECTED BEHAVIOR. Reply with ONLY a JSON object: {\"score\": <1-5>, \"reason\": \"<one sentence>\"}. No other text.",
    },
    {
      role: "user",
      content: `QUESTION: ${question}\n\nEXPECTED BEHAVIOR: ${expectedBehavior}\n\nASSISTANT RESPONSE: ${responseText}`,
    },
  ];

  try {
    const { fullText } = await getOllamaReply(judgePrompt, { model: JUDGE_MODEL });
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { score: null, reason: "Judge did not return parseable JSON" };
    const parsed = JSON.parse(jsonMatch[0]);
    return { score: parsed.score ?? null, reason: parsed.reason ?? "" };
  } catch (err) {
    return { score: null, reason: `Judge call failed: ${err.message}` };
  }
}

function escapeCsv(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function main() {
  const testCases = loadTestCases();
  const activePrompt = await getActivePromptForEval();
  const results = [];

  for (const testCase of testCases) {
    const { id, question, expected_keywords = [], expected_behavior = "" } = testCase;

    const messages = [
      { role: "system", content: activePrompt.content },
      ...(activePrompt.few_shot_examples || []),
      { role: "user", content: question },
    ];

    let responseText = "";
    let error = null;
    try {
      const model = pickModel(question, 0);
      const result = await getOllamaReply(messages, { model });
      responseText = result.fullText;
    } catch (err) {
      error = err.message;
    }

    const kwResult = keywordCheck(responseText, expected_keywords);
    const judgeResult = error ? { score: null, reason: "Skipped — generation failed" } : await judgeResponse(question, expected_behavior, responseText);

    const judgePassed = judgeResult.score !== null && judgeResult.score >= 3;
    const passed = !error && kwResult.passed && judgePassed;

    results.push({
      id,
      question,
      response: responseText,
      error,
      keywordPassed: kwResult.passed,
      matchedKeywords: kwResult.matched.join("; "),
      judgeScore: judgeResult.score,
      judgeReason: judgeResult.reason,
      passed,
    });

    console.log(`[${passed ? "PASS" : "FAIL"}] ${id} — keywords: ${kwResult.passed}, judge: ${judgeResult.score ?? "N/A"}`);
  }

  const passCount = results.filter((r) => r.passed).length;
  const passRate = passCount / results.length;

  // Human review export — ALL results, not just failures, so a person
  // can spot-check passing ones too (the judge can be wrong).
  const csvLines = [
    "id,question,response,error,keyword_passed,matched_keywords,judge_score,judge_reason,passed",
    ...results.map((r) =>
      [r.id, r.question, r.response, r.error, r.keywordPassed, r.matchedKeywords, r.judgeScore, r.judgeReason, r.passed]
        .map(escapeCsv)
        .join(",")
    ),
  ];
  const reviewPath = path.join(__dirname, `review-${Date.now()}.csv`);
  fs.writeFileSync(reviewPath, csvLines.join("\n"), "utf-8");

  console.log(`\nPass rate: ${(passRate * 100).toFixed(1)}% (${passCount}/${results.length})`);
  console.log(`Human-review file written to: ${reviewPath}`);

  await pool.end();

  if (passRate < PASS_THRESHOLD) {
    console.error(`Pass rate below threshold (${PASS_THRESHOLD * 100}%) — failing.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Eval run crashed:", err);
  process.exit(1);
});

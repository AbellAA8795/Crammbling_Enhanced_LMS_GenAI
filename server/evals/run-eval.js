import "dotenv/config";
import { readFileSync } from "fs";
import { streamOllamaReply } from "../src/services/Chatbot_services/ollama.service.js";
import { getActivePrompt } from "../src/models/Chatbot_services/prompt.model.js";

const evalSet = JSON.parse(
  readFileSync(new URL("./eval-set.json", import.meta.url)),
);

function checkKeywords(responseText, expectedKeywords) {
  const lower = responseText.toLowerCase();
  return expectedKeywords.some((kw) => lower.includes(kw.toLowerCase()));
}

async function runEvals() {
  const activePrompt = await getActivePrompt();
  console.log(
    `\nRunning eval set against prompt version: ${activePrompt?.version || "none"}\n`,
  );

  let passed = 0;
  let failed = 0;

  for (const testCase of evalSet) {
    let response = "";
    try {
      response = await streamOllamaReply(
        [{ role: "user", content: testCase.prompt }],
        activePrompt?.content,
        () => {}, // no live chunk handling needed for eval — we only care about the final text
      );
    } catch (error) {
      console.log(`[${testCase.id}] ERROR: ${error.message}`);
      failed++;
      continue;
    }

    const pass = checkKeywords(response, testCase.expectedKeywords);

    if (pass) {
      console.log(` [${testCase.id}] PASS`);
      passed++;
    } else {
      console.log(`[${testCase.id}] FAIL`);
      console.log(`   Prompt: "${testCase.prompt}"`);
      console.log(
        `   Expected one of: ${testCase.expectedKeywords.join(", ")}`,
      );
      console.log(`   Got: "${response.slice(0, 150)}..."`);
      failed++;
    }
  }

  console.log(`\n${passed}/${evalSet.length} passed, ${failed} failed.\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runEvals();

// server/src/services/Chatbot_services/ollama.service.js
//
// Updated to cover:
// - Prompt engineering: few-shot examples + response guidelines are
//   assembled into the message list sent to the model.
// - Cost & latency: model routing (small vs large model by query
//   complexity), in-memory caching of the active system prompt
//   (avoids a DB round trip on every single message), and latency +
//   token-count capture from Ollama's own response.
// - Reliability / error handling: every failure mode (timeout,
//   connection refused, bad response body, model not found) is
//   caught, classified, and re-thrown as a typed error the controller
//   can map to the right HTTP status instead of leaking a raw stack
//   trace to the client (ISO 25010 — Reliability, Security: no
//   internal detail leakage).
//
// ISO 25010 mapping for this file:
// - Performance efficiency: model routing + prompt caching reduce
//   average latency and redundant DB/model work.
// - Reliability: typed errors, timeouts, no unhandled rejections.
// - Maintainability: single responsibility (talks to Ollama only),
//   pure functions where possible, no inline SQL.


const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL_SMALL = process.env.OLLAMA_MODEL_SMALL || process.env.OLLAMA_MODEL || "llama3.2";
const MODEL_LARGE = process.env.OLLAMA_MODEL_LARGE || process.env.OLLAMA_MODEL || "llama3.2";
const NUM_CTX = parseInt(process.env.OLLAMA_NUM_CTX || "4096", 10);
const REQUEST_TIMEOUT_MS = parseInt(process.env.OLLAMA_TIMEOUT_MS || "120000", 10);

// Simple heuristic model router. Cheap/short/common questions go to the
// small model; longer or code-like questions go to the large model.
// This is intentionally simple and explainable — swap in a classifier
// later if you need better routing accuracy.
const CODE_HINT_PATTERN = /```|function |class |SELECT |def |import |error|exception|stack trace/i;

export function pickModel(latestUserMessage, historyLength) {
  const isLong = latestUserMessage.length > 400;
  const looksTechnical = CODE_HINT_PATTERN.test(latestUserMessage);
  const isDeepConversation = historyLength > 12;

  if (isLong || looksTechnical || isDeepConversation) {
    return MODEL_LARGE;
  }
  return MODEL_SMALL;
}

// ---------------------------------------------------------------------
// Active-prompt cache: avoids hitting Postgres on every single chat
// message just to re-fetch the (rarely-changing) active system prompt.
// Invalidate with invalidatePromptCache() whenever a prompt is
// activated/created.
// ---------------------------------------------------------------------
const PROMPT_CACHE_TTL_MS = parseInt(process.env.PROMPT_CACHE_TTL_MS || "60000", 10);
let promptCache = { value: null, fetchedAt: 0 };

export function invalidatePromptCache() {
  promptCache = { value: null, fetchedAt: 0 };
}

export async function getCachedActivePrompt(fetchFromDb) {
  const isFresh = promptCache.value && Date.now() - promptCache.fetchedAt < PROMPT_CACHE_TTL_MS;
  if (isFresh) return promptCache.value;

  const value = await fetchFromDb();
  promptCache = { value, fetchedAt: Date.now() };
  return value;
}

// ---------------------------------------------------------------------
// Message assembly: system prompt + guidelines + few-shot examples +
// (optional) conversation summary + recent history + new user message.
// Keeping this as a pure function makes it independently testable.
// ---------------------------------------------------------------------
export function buildMessages({ systemPrompt, conversationSummary, recentHistory, userMessage }) {
  const messages = [];

  let systemContent = systemPrompt?.content || "You are a helpful study assistant.";
  if (systemPrompt?.response_guidelines) {
    systemContent += `\n\nResponse guidelines:\n${systemPrompt.response_guidelines}`;
  }
  messages.push({ role: "system", content: systemContent });

  if (conversationSummary) {
    messages.push({
      role: "system",
      content: `Summary of the earlier part of this conversation (for context only, do not repeat it verbatim):\n${conversationSummary}`,
    });
  }

  const fewShot = Array.isArray(systemPrompt?.few_shot_examples) ? systemPrompt.few_shot_examples : [];
  for (const example of fewShot) {
    if (example?.role && example?.content) {
      messages.push({ role: example.role, content: example.content });
    }
  }

  for (const msg of recentHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: "user", content: userMessage });
  return messages;
}

// ---------------------------------------------------------------------
// Typed errors so controllers can respond with the right status code
// instead of a generic 500 for everything.
// ---------------------------------------------------------------------
export class OllamaUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "OllamaUnavailableError";
    this.statusCode = 503;
  }
}

export class OllamaTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "OllamaTimeoutError";
    this.statusCode = 504;
  }
}

export class OllamaResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = "OllamaResponseError";
    this.statusCode = 502;
  }
}

// ---------------------------------------------------------------------
// Streams a reply from Ollama, calling onChunk(text) as tokens arrive.
// Returns { fullText, promptTokens, completionTokens, latencyMs, model }.
// ---------------------------------------------------------------------
export async function streamOllamaReply(messages, { model, onChunk }) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        keep_alive: "30m",
        options: {
          num_ctx: NUM_CTX,
          temperature: 0.4,
          top_p: 0.9,
        },
      }),
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      throw new OllamaTimeoutError(`Ollama did not respond within ${REQUEST_TIMEOUT_MS}ms`);
    }
    // ECONNREFUSED / ENOTFOUND / network-level failures
    throw new OllamaUnavailableError(`Could not reach Ollama at ${OLLAMA_URL}: ${err.message}`);
  }

  if (!response.ok || !response.body) {
    clearTimeout(timeout);
    throw new OllamaResponseError(`Ollama returned HTTP ${response.status}`);
  }

  let fullText = "";
  let promptTokens = null;
  let completionTokens = null;

  // Global fetch (Node 18+) yields Uint8Array chunks, not Buffers —
  // chunk.toString("utf-8") silently fails to decode those (it ignores
  // the encoding arg on a plain Uint8Array), which was causing every
  // line to fail JSON.parse and get skipped, leaving fullText empty.
  // TextDecoder handles both Uint8Array and Buffer correctly.
  const decoder = new TextDecoder("utf-8");
  let lineBuffer = "";

  try {
    for await (const chunk of response.body) {
      lineBuffer += decoder.decode(chunk, { stream: true });

      // Hold back any trailing partial line until the next chunk
      // completes it, instead of splitting on every \n immediately.
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() ?? "";

      for (const line of lines.filter(Boolean)) {
        let parsed;
        try {
          parsed = JSON.parse(line);
        } catch {
          continue; // skip partial/malformed line rather than crashing the stream
        }

        if (parsed.message?.content) {
          fullText += parsed.message.content;
          onChunk(parsed.message.content);
        }

        if (parsed.done) {
          promptTokens = parsed.prompt_eval_count ?? null;
          completionTokens = parsed.eval_count ?? null;
        }
      }
    }

    // The last chunk (often the `done: true` one) may not end in \n,
    // leaving it stuck in lineBuffer — parse whatever's left over.
    if (lineBuffer.trim()) {
      try {
        const parsed = JSON.parse(lineBuffer);
        if (parsed.message?.content) {
          fullText += parsed.message.content;
          onChunk(parsed.message.content);
        }
        if (parsed.done) {
          promptTokens = parsed.prompt_eval_count ?? null;
          completionTokens = parsed.eval_count ?? null;
        }
      } catch {
        // final fragment wasn't valid JSON either — nothing more to recover
      }
    }
  } catch (err) {
    throw new OllamaResponseError(`Stream interrupted: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }

  if (!fullText.trim()) {
    throw new OllamaResponseError("Ollama returned an empty response");
  }

  return {
    fullText,
    promptTokens,
    completionTokens,
    latencyMs: Date.now() - startedAt,
    model,
  };
}

// ---------------------------------------------------------------------
// Non-streaming helper (used by summarization and eval — no need to
// stream a summary or a batch eval run token-by-token).
// ---------------------------------------------------------------------
export async function getOllamaReply(messages, { model = MODEL_SMALL } = {}) {
  let fullText = "";
  const result = await streamOllamaReply(messages, {
    model,
    onChunk: (text) => {
      fullText += text;
    },
  });
  return result;
}
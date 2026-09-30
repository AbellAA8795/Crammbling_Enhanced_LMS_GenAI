import PQueue from "p-queue";

const CONCURRENCY = parseInt(process.env.OLLAMA_CONCURRENCY) || 2;

export const ollamaQueue = new PQueue({
    concurrency: CONCURRENCY, // how many generations run at once
    timeout: 120000,           // 60s max wait before a queued job is dropped
    throwOnTimeout: true,
});

export function getQueuePosition() {
    return ollamaQueue.size + ollamaQueue.pending; // waiting + currently running
}
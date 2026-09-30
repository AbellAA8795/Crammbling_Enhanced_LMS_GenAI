const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";
const OLLAMA_NUM_CTX = parseInt(process.env.OLLAMA_NUM_CTX);

/**
 * Streams a reply from Ollama, calling onChunk(text) as each piece arrives.
 * Returns the full accumulated text once the stream is done.
 */

export async function streamOllamaReply(messages, systemPromptContent, onChunk) {
    const fullMessages = systemPromptContent
        ? [{ role: "system", content: systemPromptContent }, ...messages]
        : messages;

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages: fullMessages.map((m) => ({ role: m.role, content: m.content })),
            stream: true,
            keep_alive: "30m",
            options: {
                num_predict: 500,
                num_ctx: OLLAMA_NUM_CTX,
                temperature: 0.7,
                top_p: 0.9,
            },
        }),
    });

    if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`Ollama request failed: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
            if (!line.trim()) continue;
            const json = JSON.parse(line);

            if (json.message?.content) {
                fullText += json.message.content;
                onChunk(json.message.content);
            }
            if (json.done) return fullText;
        }
    }

    return fullText;
}
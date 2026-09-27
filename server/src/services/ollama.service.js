const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export async function getOllamaReply(messages) {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: OLLAMA_MODEL,           // fixed — user can never choose a different/heavier model
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            stream: false,
            options: {
                num_predict: 500,          // caps max response length (prevents runaway generations)
                temperature: 0.7,
                top_p: 0.9,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama request failed: ${errorText}`);
    }

    const data = await response.json();
    return data.message.content;
}
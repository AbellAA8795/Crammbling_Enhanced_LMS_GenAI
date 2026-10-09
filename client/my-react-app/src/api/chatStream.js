const API_URL = import.meta.env.VITE_API_URL;

export async function streamChatMessage(chatId, message, callbacks) {
    const token = localStorage.getItem("token");
    const isNewChat = !chatId;

    const url = isNewChat
        ? `${API_URL}/api/chat/new`
        : `${API_URL}/api/chat/${chatId}/message`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();

        for (const event of events) {
            if (!event.startsWith("data: ")) continue;
            let data;
            try {
                data = JSON.parse(event.slice(6));
            } catch {
                continue;
            }

            switch (data.type) {
                case "start": callbacks.onStart?.(data); break;
                case "queued": callbacks.onQueued?.(data.position); break;
                case "chunk": callbacks.onChunk?.(data.content); break;
                case "done": callbacks.onDone?.(); break;
                case "error": callbacks.onError?.(data.message); break;
            }
        }
    }
}
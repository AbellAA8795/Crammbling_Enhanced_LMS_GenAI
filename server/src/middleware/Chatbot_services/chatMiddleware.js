const MAX_MESSAGE_LENGTH = 4000; // characters — prevents someone pasting a massive wall of text
const MAX_HISTORY_MESSAGES = 40; // caps how much context gets sent to Ollama per request

export function validateNewChatMessage(req, res, next) {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message content is required."
        });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({
            success: false,
            message: `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`
        });
    }

    next();
}

export { MAX_HISTORY_MESSAGES };
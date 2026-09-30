import { createPromptVersion, activatePromptVersion, getActivePrompt } from "../../models/Chatbot_services/prompt.model.js";

export async function getActivePromptController(req, res) {
    try {
        const prompt = await getActivePrompt();
        return res.status(200).json({ success: true, data: prompt });
    } catch (error) {
        console.error("Error fetching active prompt:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch active prompt." });
    }
}

export async function createPromptVersionController(req, res) {
    try {
        const { version, content, activate } = req.body;

        if (!version || !content) {
            return res.status(400).json({ success: false, message: "version and content are required." });
        }

        await createPromptVersion(version, content, !!activate);

        return res.status(201).json({ success: true, message: "Prompt version created." });
    } catch (error) {
        console.error("Error creating prompt version:", error);
        if ((error.message || "").includes("PROMPT_VERSION_ALREADY_EXISTS")) {
            return res.status(409).json({ success: false, message: "That version already exists." });
        }
        return res.status(500).json({ success: false, message: "Failed to create prompt version." });
    }
}

export async function activatePromptVersionController(req, res) {
    try {
        const { version } = req.body;
        if (!version) {
            return res.status(400).json({ success: false, message: "version is required." });
        }

        await activatePromptVersion(version);
        return res.status(200).json({ success: true, message: `Prompt version ${version} activated.` });
    } catch (error) {
        console.error("Error activating prompt version:", error);
        if ((error.message || "").includes("PROMPT_VERSION_NOT_FOUND")) {
            return res.status(404).json({ success: false, message: "Prompt version not found." });
        }
        return res.status(500).json({ success: false, message: "Failed to activate prompt version." });
    }
}
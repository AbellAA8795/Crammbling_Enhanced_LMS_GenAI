import { apiRequest } from "./client";

export function listChats() {
    return apiRequest("/api/chat");
}

export function getChatMessages(chatId) {
    return apiRequest(`/api/chat/${chatId}`);
}

export async function uploadChatFile(chatId, file, message) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    if (message) formData.append("message", message);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${chatId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Upload failed.");
    return data;
}
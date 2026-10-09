import * as personalizationModel from "../../models/Personalization_services/personalization.model.js";

const VALID_STATUSES = ["backlog", "in_progress", "done"];

export async function createSprintTaskController(req, res) {
    try {
        const { title, subject } = req.body;
        if (!title || !subject) {
            return res.status(400).json({ success: false, message: "title and subject are required." });
        }

        const taskId = await personalizationModel.createSprintTask({ userId: req.user.id, title, subject });
        return res.status(201).json({ success: true, message: "Sprint task added to Backlog.", data: { taskId } });
    } catch (err) {
        console.error("createSprintTaskController error:", err);
        return res.status(500).json({ success: false, message: "Failed to create sprint task." });
    }
}

export async function getSprintTasksController(req, res) {
    try {
        const tasks = await personalizationModel.getSprintTasks(req.user.id);
        return res.status(200).json({ success: true, data: tasks });
    } catch (err) {
        console.error("getSprintTasksController error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch sprint tasks." });
    }
}

export async function moveSprintTaskController(req, res) {
    try {
        const { newStatus, newPosition } = req.body;
        if (!VALID_STATUSES.includes(newStatus) || typeof newPosition !== "number") {
            return res.status(400).json({ success: false, message: "newStatus must be one of backlog/in_progress/done, and newPosition must be a number." });
        }

        const status = await personalizationModel.moveSprintTask({
            taskId: req.params.taskId, userId: req.user.id, newStatus, newPosition,
        });

        if (status === "not_found") return res.status(404).json({ success: false, message: "Sprint task not found." });
        if (status === "forbidden") return res.status(403).json({ success: false, message: "You do not own this sprint task." });

        return res.status(200).json({ success: true, message: "Sprint task moved." });
    } catch (err) {
        console.error("moveSprintTaskController error:", err);
        return res.status(500).json({ success: false, message: "Failed to move sprint task." });
    }
}

export async function deleteSprintTaskController(req, res) {
    try {
        const status = await personalizationModel.deleteSprintTask(req.params.taskId, req.user.id);

        if (status === "not_found") return res.status(404).json({ success: false, message: "Sprint task not found." });
        if (status === "forbidden") return res.status(403).json({ success: false, message: "You do not own this sprint task." });

        return res.status(200).json({ success: true, message: "Sprint task deleted." });
    } catch (err) {
        console.error("deleteSprintTaskController error:", err);
        return res.status(500).json({ success: false, message: "Failed to delete sprint task." });
    }
}

export async function clearSprintBoardController(req, res) {
    try {
        const deletedCount = await personalizationModel.clearSprintBoard(req.user.id);
        return res.status(200).json({ success: true, message: "Sprint board cleared.", data: { deletedCount } });
    } catch (err) {
        console.error("clearSprintBoardController error:", err);
        return res.status(500).json({ success: false, message: "Failed to clear sprint board." });
    }
}
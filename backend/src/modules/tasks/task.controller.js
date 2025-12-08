import * as taskService from "./task.service.js";

export async function createTask(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const result = await taskService.createTask(userId, workspaceId, projectId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getTasks(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const result = await taskService.getTasks(workspaceId, projectId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateTask(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        const result = await taskService.updateTask(workspaceId, projectId, taskId, userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteTask(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        const result = await taskService.deleteTask(workspaceId, projectId, taskId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


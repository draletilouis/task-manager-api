import * as projectService from './project.service.js';
/**
 * Handle project creation
 */

export async function createProject(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const result = await projectService.createProject(userId, workspaceId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
}

export async function getProjects(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const result = await projectService.getProjects(workspaceId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateProject(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const result = await projectService.updateProject(workspaceId, projectId, userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Handle project deletion
 */
export async function deleteProject(req, res) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const result = await projectService.deleteProject(workspaceId, projectId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

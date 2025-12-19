import { Router } from "express";
import * as ProjectController from "./project.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import {
    createProjectValidation,
    getProjectsValidation,
    updateProjectValidation,
    deleteProjectValidation
} from "./project.validation.js";

const router = Router();

// All project routes require authentication
// Route to create a new project in a workspace
router.post("/:workspaceId/projects", authMiddleware, createProjectValidation, validate, ProjectController.createProject);

// Route to get all projects in a workspace
router.get("/:workspaceId/projects", authMiddleware, getProjectsValidation, validate, ProjectController.getProjects);

// Route to update project details
router.put("/:workspaceId/projects/:projectId", authMiddleware, updateProjectValidation, validate, ProjectController.updateProject);

// Route to delete a project
router.delete("/:workspaceId/projects/:projectId", authMiddleware, deleteProjectValidation, validate, ProjectController.deleteProject);

export default router;

import { Router } from "express";   
import * as ProjectController from "./project.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

// All project routes require authentication
// Route to create a new project in a workspace
router.post("/:workspaceId/projects", authMiddleware, ProjectController.createProject);

// Route to get all projects in a workspace
router.get("/:workspaceId/projects", authMiddleware, ProjectController.getProjects);

// Route to update project details
router.put("/:workspaceId/projects/:projectId", authMiddleware, ProjectController.updateProject);

// Route to delete a project
router.delete("/:workspaceId/projects/:projectId", authMiddleware, ProjectController.deleteProject);

export default router;

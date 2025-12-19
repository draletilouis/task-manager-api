import { Router } from "express";
import * as TaskController from "./task.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

// All task routes require authentication
// Route to create a new task in a project
router.post("/:workspaceId/projects/:projectId/tasks", authMiddleware, TaskController.createTask);
// Route to get all tasks in a project
router.get("/:workspaceId/projects/:projectId/tasks", authMiddleware, TaskController.getTasks);
// Route to get a single task by ID
router.get("/:workspaceId/projects/:projectId/tasks/:taskId", authMiddleware, TaskController.getTask);
// Route to update a task
router.put("/:workspaceId/projects/:projectId/tasks/:taskId", authMiddleware, TaskController.updateTask);
// Route to delete a task
router.delete("/:workspaceId/projects/:projectId/tasks/:taskId", authMiddleware, TaskController.deleteTask);

export default router;

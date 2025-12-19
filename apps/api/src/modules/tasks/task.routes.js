import { Router } from "express";
import * as TaskController from "./task.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import {
    createTaskValidation,
    getTasksValidation,
    getTaskValidation,
    updateTaskValidation,
    deleteTaskValidation
} from "./task.validation.js";

const router = Router();

// All task routes require authentication
// Route to create a new task in a project
router.post("/:workspaceId/projects/:projectId/tasks", authMiddleware, createTaskValidation, validate, TaskController.createTask);
// Route to get all tasks in a project
router.get("/:workspaceId/projects/:projectId/tasks", authMiddleware, getTasksValidation, validate, TaskController.getTasks);
// Route to get a single task by ID
router.get("/:workspaceId/projects/:projectId/tasks/:taskId", authMiddleware, getTaskValidation, validate, TaskController.getTask);
// Route to update a task
router.put("/:workspaceId/projects/:projectId/tasks/:taskId", authMiddleware, updateTaskValidation, validate, TaskController.updateTask);
// Route to delete a task
router.delete("/:workspaceId/projects/:projectId/tasks/:taskId", authMiddleware, deleteTaskValidation, validate, TaskController.deleteTask);

export default router;

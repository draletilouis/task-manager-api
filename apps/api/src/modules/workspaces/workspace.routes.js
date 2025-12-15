import { Router } from "express";
import * as WorkspaceController from "./workspace.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

// All workspace routes require authentication

// Route to create a new workspace
router.post("/", authMiddleware, WorkspaceController.createWorkspace);

// Route to get all workspaces for the authenticated user
router.get("/", authMiddleware, WorkspaceController.getWorkspaces);

// Member routes (more specific, must come before /:workspaceId)
router.get("/:workspaceId/members", authMiddleware, WorkspaceController.getWorkspaceMembers);
router.post("/:workspaceId/members", authMiddleware, WorkspaceController.inviteMember);
router.delete("/:workspaceId/members/:memberId", authMiddleware, WorkspaceController.removeMember);
router.put("/:workspaceId/members/:memberId/role", authMiddleware, WorkspaceController.updateMemberRole);

// Workspace routes (less specific)
router.get("/:workspaceId", authMiddleware, WorkspaceController.getWorkspace);
router.put("/:workspaceId", authMiddleware, WorkspaceController.updateWorkspace);
router.delete("/:workspaceId", authMiddleware, WorkspaceController.deleteWorkspace);

export default router;
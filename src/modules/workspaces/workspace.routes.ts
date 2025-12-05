import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import * as WorkspaceController from "./workspace.controller.js";

const router = Router();

router.post("/", authMiddleware, WorkspaceController.createWorkspace);

export { router as default };

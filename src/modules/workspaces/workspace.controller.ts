import type { Request, Response } from "express";
import * as WorkspaceService from "./workspace.service.js";

export const createWorkspace = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await WorkspaceService.create(req.user.userId, req.body);
  return res.status(201).json(result);
};

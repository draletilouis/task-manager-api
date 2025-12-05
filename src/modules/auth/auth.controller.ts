import type { Request, Response } from "express";
import * as AuthService from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return res.status(400).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return res.status(401).json({ error: message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshAccessToken(refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Token refresh failed";
    return res.status(401).json({ error: message });
  }
};

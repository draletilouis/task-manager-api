import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import workspaceRoutes from "./modules/workspaces/workspace.routes.js";

const app = express();

app.use(express.json());

// register module routes
app.use("/auth", authRoutes);
app.use("/workspaces", workspaceRoutes);

export { app as default };

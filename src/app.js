import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import workspaceRoutes from "./modules/workspaces/workspace.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import commentRoutes from "./modules/comments/comment.routes.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Mount route modules
app.use("/auth", authRoutes);
app.use("/workspaces", projectRoutes);
app.use("/workspaces", workspaceRoutes);
app.use("/workspaces", taskRoutes);
app.use("/workspaces", commentRoutes);

export default app;
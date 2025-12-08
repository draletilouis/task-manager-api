import { Router } from "express";
import * as CommentController from "./comment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/tasks/:taskId/comments", CommentController.createComment);
router.get("/tasks/:taskId/comments", CommentController.getComments);
router.put("/comments/:commentId", CommentController.updateComment);
router.delete("/comments/:commentId", CommentController.deleteComment);

export default router;

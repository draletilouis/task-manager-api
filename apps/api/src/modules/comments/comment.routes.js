import { Router } from "express";
import * as CommentController from "./comment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import {
    createCommentValidation,
    getCommentsValidation,
    updateCommentValidation,
    deleteCommentValidation
} from "./comment.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/tasks/:taskId/comments", createCommentValidation, validate, CommentController.createComment);
router.get("/tasks/:taskId/comments", getCommentsValidation, validate, CommentController.getComments);
router.put("/comments/:commentId", updateCommentValidation, validate, CommentController.updateComment);
router.delete("/comments/:commentId", deleteCommentValidation, validate, CommentController.deleteComment);

export default router;

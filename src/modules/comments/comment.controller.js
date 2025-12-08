 import * as commentService from "./comment.service.js";

// Create comment
export const createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await commentService.createComment(taskId, content, userId);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments for a task
export const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await commentService.getCommentsByTask(taskId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await commentService.updateComment(commentId, content, userId);
    res.json(comment);
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await commentService.deleteComment(commentId, userId, userRole);
    res.json(result);
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
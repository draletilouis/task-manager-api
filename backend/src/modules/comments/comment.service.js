import prisma from "../../database/prisma.js";

export const createComment = async (taskId, content, userId) => {
    return await prisma.comment.create({
        data: {
            taskId,
            content,
            createdBy: userId,
        },
    });
};

export const getCommentsByTask = async (taskId) => {
    return await prisma.comment.findMany({
        where: { taskId },
        orderBy: { createdAt: 'asc' },
    });
};

export const updateComment = async (commentId, content, userId) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
    });

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.createdBy !== userId) {
        throw new Error('Unauthorized: You can only update your own comments');
    }

    return await prisma.comment.update({
        where: { id: commentId },
        data: { content },
    });
};

export const deleteComment = async (commentId, userId, userRole) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
    });

    if (!comment) {
        throw new Error("Comment not found");
    }

    const canDelete =
        comment.createdBy === userId ||
        userRole === 'ADMIN' ||
        userRole === 'OWNER';

    if (!canDelete) {
        throw new Error('Unauthorised to delete this comment');
    }

    await prisma.comment.delete({
        where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
};

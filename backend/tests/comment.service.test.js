import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma at the module level
const mockPrisma = {
    comment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

// Mock the prisma module before importing the service
jest.unstable_mockModule('../src/database/prisma.js', () => ({
    default: mockPrisma,
}));

// Now import the service after mocking
const { createComment, getCommentsByTask, updateComment, deleteComment } = await import('../src/modules/comments/comment.service.js');

describe('Comment Service', () => {
    beforeEach(() => {
        mockPrisma.comment.create.mockClear();
        mockPrisma.comment.findMany.mockClear();
        mockPrisma.comment.findUnique.mockClear();
        mockPrisma.comment.update.mockClear();
        mockPrisma.comment.delete.mockClear();
    });

    describe('createComment', () => {
        const taskId = 'task-123';
        const content = 'This is a test comment';
        const userId = 'user-123';

        it('should create a comment successfully', async () => {
            const mockComment = {
                id: 'comment-123',
                taskId,
                content,
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.comment.create.mockResolvedValue(mockComment);

            const result = await createComment(taskId, content, userId);

            expect(result).toEqual(mockComment);
            expect(mockPrisma.comment.create).toHaveBeenCalledWith({
                data: {
                    taskId,
                    content,
                    createdBy: userId,
                },
            });
        });

        it('should throw error if database operation fails', async () => {
            mockPrisma.comment.create.mockRejectedValue(new Error('Database error'));

            await expect(createComment(taskId, content, userId))
                .rejects.toThrow('Database error');
        });
    });

    describe('getCommentsByTask', () => {
        const taskId = 'task-123';

        it('should return all comments for a task ordered by creation time', async () => {
            const mockComments = [
                {
                    id: 'comment-1',
                    taskId,
                    content: 'First comment',
                    createdBy: 'user-1',
                    createdAt: new Date('2025-01-01'),
                    updatedAt: new Date('2025-01-01'),
                },
                {
                    id: 'comment-2',
                    taskId,
                    content: 'Second comment',
                    createdBy: 'user-2',
                    createdAt: new Date('2025-01-02'),
                    updatedAt: new Date('2025-01-02'),
                },
            ];

            mockPrisma.comment.findMany.mockResolvedValue(mockComments);

            const result = await getCommentsByTask(taskId);

            expect(result).toEqual(mockComments);
            expect(mockPrisma.comment.findMany).toHaveBeenCalledWith({
                where: { taskId },
                orderBy: { createdAt: 'asc' },
            });
        });

        it('should return empty array if no comments exist', async () => {
            mockPrisma.comment.findMany.mockResolvedValue([]);

            const result = await getCommentsByTask(taskId);

            expect(result).toEqual([]);
        });
    });

    describe('updateComment', () => {
        const commentId = 'comment-123';
        const content = 'Updated comment text';
        const userId = 'user-123';

        it('should update a comment successfully when user is the owner', async () => {
            const mockComment = {
                id: commentId,
                content: 'Original comment',
                createdBy: userId,
                taskId: 'task-123',
            };

            const updatedComment = {
                ...mockComment,
                content,
                updatedAt: new Date(),
            };

            mockPrisma.comment.findUnique.mockResolvedValue(mockComment);
            mockPrisma.comment.update.mockResolvedValue(updatedComment);

            const result = await updateComment(commentId, content, userId);

            expect(result).toEqual(updatedComment);
            expect(mockPrisma.comment.update).toHaveBeenCalledWith({
                where: { id: commentId },
                data: { content },
            });
        });

        it('should throw error if comment not found', async () => {
            mockPrisma.comment.findUnique.mockResolvedValue(null);

            await expect(updateComment(commentId, content, userId))
                .rejects.toThrow('Comment not found');
        });

        it('should throw error if user is not the comment owner', async () => {
            const mockComment = {
                id: commentId,
                content: 'Original comment',
                createdBy: 'different-user',
                taskId: 'task-123',
            };

            mockPrisma.comment.findUnique.mockResolvedValue(mockComment);

            await expect(updateComment(commentId, content, userId))
                .rejects.toThrow('Unauthorized: You can only update your own comments');
        });
    });

    describe('deleteComment', () => {
        const commentId = 'comment-123';
        const userId = 'user-123';

        it('should delete a comment successfully when user is the owner', async () => {
            const mockComment = {
                id: commentId,
                content: 'Test comment',
                createdBy: userId,
                taskId: 'task-123',
            };

            mockPrisma.comment.findUnique.mockResolvedValue(mockComment);
            mockPrisma.comment.delete.mockResolvedValue(mockComment);

            const result = await deleteComment(commentId, userId, 'MEMBER');

            expect(result).toEqual({ message: 'Comment deleted successfully' });
            expect(mockPrisma.comment.delete).toHaveBeenCalledWith({
                where: { id: commentId },
            });
        });

        it('should delete a comment when user is ADMIN', async () => {
            const mockComment = {
                id: commentId,
                content: 'Test comment',
                createdBy: 'different-user',
                taskId: 'task-123',
            };

            mockPrisma.comment.findUnique.mockResolvedValue(mockComment);
            mockPrisma.comment.delete.mockResolvedValue(mockComment);

            const result = await deleteComment(commentId, userId, 'ADMIN');

            expect(result).toEqual({ message: 'Comment deleted successfully' });
            expect(mockPrisma.comment.delete).toHaveBeenCalled();
        });

        it('should delete a comment when user is OWNER', async () => {
            const mockComment = {
                id: commentId,
                content: 'Test comment',
                createdBy: 'different-user',
                taskId: 'task-123',
            };

            mockPrisma.comment.findUnique.mockResolvedValue(mockComment);
            mockPrisma.comment.delete.mockResolvedValue(mockComment);

            const result = await deleteComment(commentId, userId, 'OWNER');

            expect(result).toEqual({ message: 'Comment deleted successfully' });
            expect(mockPrisma.comment.delete).toHaveBeenCalled();
        });

        it('should throw error if comment not found', async () => {
            mockPrisma.comment.findUnique.mockResolvedValue(null);

            await expect(deleteComment(commentId, userId, 'MEMBER'))
                .rejects.toThrow('Comment not found');
        });

        it('should throw error if user is not owner and not ADMIN/OWNER role', async () => {
            const mockComment = {
                id: commentId,
                content: 'Test comment',
                createdBy: 'different-user',
                taskId: 'task-123',
            };

            mockPrisma.comment.findUnique.mockResolvedValue(mockComment);

            await expect(deleteComment(commentId, userId, 'MEMBER'))
                .rejects.toThrow('Unauthorised to delete this comment');
        });
    });
});

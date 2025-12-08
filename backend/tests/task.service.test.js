import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma at the module level
const mockPrisma = {
    workspaceMember: {
        findFirst: jest.fn(),
    },
    project: {
        findFirst: jest.fn(),
    },
    task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

// Mock the prisma module before importing the service
jest.unstable_mockModule('../src/database/prisma.js', () => ({
    default: mockPrisma,
}));

// Now import the service after mocking
const { createTask, getTasks, updateTask, deleteTask } = await import('../src/modules/tasks/task.service.js');

describe('Task Service', () => {
    beforeEach(() => {
        mockPrisma.workspaceMember.findFirst.mockClear();
        mockPrisma.project.findFirst.mockClear();
        mockPrisma.task.create.mockClear();
        mockPrisma.task.findMany.mockClear();
        mockPrisma.task.findFirst.mockClear();
        mockPrisma.task.update.mockClear();
        mockPrisma.task.delete.mockClear();
    });

    describe('createTask', () => {
        const userId = 'user-123';
        const workspaceId = 'workspace-123';
        const projectId = 'project-123';
        const taskData = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'TODO',
            priority: 'HIGH',
            dueDate: '2025-12-31',
            assignedTo: 'user-456',
        };

        it('should create a task successfully', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };
            const assigneeMembership = { userId: 'user-456', workspaceId };
            const createdTask = {
                id: 'task-123',
                title: 'Test Task',
                description: 'Test Description',
                status: 'TODO',
                priority: 'HIGH',
                dueDate: new Date('2025-12-31'),
                assignedTo: 'user-456',
                projectId,
                createdBy: userId,
                createdAt: new Date(),
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(assigneeMembership);
            mockPrisma.task.create.mockResolvedValueOnce(createdTask);

            const result = await createTask(userId, workspaceId, projectId, taskData);

            expect(result.message).toBe('Task created successfully');
            expect(result.task.title).toBe('Test Task');
            expect(mockPrisma.task.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    title: 'Test Task',
                    description: 'Test Description',
                    status: 'TODO',
                    priority: 'HIGH',
                    projectId,
                    createdBy: userId,
                }),
            });
        });

        it('should throw error if title is missing', async () => {
            const invalidData = { ...taskData, title: '' };

            await expect(
                createTask(userId, workspaceId, projectId, invalidData)
            ).rejects.toThrow('Task title is required');
        });

        it('should throw error if user is not a workspace member', async () => {
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(null);

            await expect(
                createTask(userId, workspaceId, projectId, taskData)
            ).rejects.toThrow('You do not have permission to create tasks in this workspace');
        });

        it('should throw error if project not found', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(null);

            await expect(
                createTask(userId, workspaceId, projectId, taskData)
            ).rejects.toThrow('Project not found in this workspace');
        });

        it('should throw error if assignee is not a workspace member', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(null);

            await expect(
                createTask(userId, workspaceId, projectId, taskData)
            ).rejects.toThrow('Assigned user is not a member of this workspace');
        });

        it('should create task with default values when optional fields are missing', async () => {
            const minimalData = { title: 'Minimal Task' };
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };
            const createdTask = {
                id: 'task-123',
                title: 'Minimal Task',
                description: null,
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: null,
                assignedTo: null,
                projectId,
                createdBy: userId,
                createdAt: new Date(),
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.create.mockResolvedValueOnce(createdTask);

            const result = await createTask(userId, workspaceId, projectId, minimalData);

            expect(result.task.status).toBe('TODO');
            expect(result.task.priority).toBe('MEDIUM');
            expect(mockPrisma.task.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    status: 'TODO',
                    priority: 'MEDIUM',
                    dueDate: null,
                    assignedTo: null,
                }),
            });
        });
    });

    describe('getTasks', () => {
        const workspaceId = 'workspace-123';
        const projectId = 'project-123';
        const userId = 'user-123';

        it('should get all tasks in a project', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };
            const tasks = [
                { id: 'task-1', title: 'Task 1', projectId },
                { id: 'task-2', title: 'Task 2', projectId },
            ];

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.findMany.mockResolvedValueOnce(tasks);

            const result = await getTasks(workspaceId, projectId, userId);

            expect(result.tasks).toHaveLength(2);
            expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
                where: { projectId },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('should throw error if user is not a workspace member', async () => {
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(null);

            await expect(
                getTasks(workspaceId, projectId, userId)
            ).rejects.toThrow('You do not have permission to view tasks in this workspace');
        });

        it('should throw error if project not found', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(null);

            await expect(
                getTasks(workspaceId, projectId, userId)
            ).rejects.toThrow('Project not found in this workspace');
        });
    });

    describe('updateTask', () => {
        const workspaceId = 'workspace-123';
        const projectId = 'project-123';
        const taskId = 'task-123';
        const userId = 'user-123';
        const updateData = {
            title: 'Updated Task',
            status: 'IN_PROGRESS',
            priority: 'LOW',
        };

        it('should update a task successfully', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };
            const existingTask = { id: taskId, projectId, createdBy: userId };
            const updatedTask = {
                id: taskId,
                title: 'Updated Task',
                status: 'IN_PROGRESS',
                priority: 'LOW',
                projectId,
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.findFirst.mockResolvedValueOnce(existingTask);
            mockPrisma.task.update.mockResolvedValueOnce(updatedTask);

            const result = await updateTask(workspaceId, projectId, taskId, userId, updateData);

            expect(result.message).toBe('Task updated successfully');
            expect(result.task.title).toBe('Updated Task');
            expect(mockPrisma.task.update).toHaveBeenCalledWith({
                where: { id: taskId },
                data: expect.objectContaining({
                    title: 'Updated Task',
                    status: 'IN_PROGRESS',
                    priority: 'LOW',
                }),
            });
        });

        it('should throw error if title is empty string', async () => {
            const invalidData = { title: '   ' };
            const membership = { userId, workspaceId, role: 'MEMBER' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);

            await expect(
                updateTask(workspaceId, projectId, taskId, userId, invalidData)
            ).rejects.toThrow('Task title cannot be empty');
        });

        it('should throw error if task not found', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.findFirst.mockResolvedValueOnce(null);

            await expect(
                updateTask(workspaceId, projectId, taskId, userId, updateData)
            ).rejects.toThrow('Task not found in this project');
        });
    });

    describe('deleteTask', () => {
        const workspaceId = 'workspace-123';
        const projectId = 'project-123';
        const taskId = 'task-123';
        const userId = 'user-123';

        it('should delete a task successfully when user is task creator', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };
            const existingTask = { id: taskId, projectId, createdBy: userId };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.findFirst.mockResolvedValueOnce(existingTask);
            mockPrisma.task.delete.mockResolvedValueOnce(existingTask);

            const result = await deleteTask(workspaceId, projectId, taskId, userId);

            expect(result.message).toBe('Task deleted successfully');
            expect(mockPrisma.task.delete).toHaveBeenCalledWith({
                where: { id: taskId },
            });
        });

        it('should delete a task successfully when user is workspace admin', async () => {
            const membership = { userId, workspaceId, role: 'ADMIN' };
            const project = { id: projectId, workspaceId };
            const existingTask = { id: taskId, projectId, createdBy: 'other-user' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.findFirst.mockResolvedValueOnce(existingTask);
            mockPrisma.task.delete.mockResolvedValueOnce(existingTask);

            const result = await deleteTask(workspaceId, projectId, taskId, userId);

            // Verify mocks were called
            expect(mockPrisma.workspaceMember.findFirst).toHaveBeenCalled();
            expect(result.message).toBe('Task deleted successfully');
        });

        it('should throw error if user is not task creator and not admin/owner', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };
            const existingTask = { id: taskId, projectId, createdBy: 'other-user' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.findFirst.mockResolvedValueOnce(existingTask);

            await expect(
                deleteTask(workspaceId, projectId, taskId, userId)
            ).rejects.toThrow('You do not have permission to delete this task');
        });

        it('should throw error if task not found', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const project = { id: projectId, workspaceId };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(project);
            mockPrisma.task.findFirst.mockResolvedValueOnce(null);

            await expect(
                deleteTask(workspaceId, projectId, taskId, userId)
            ).rejects.toThrow('Task not found in this project');
        });
    });
});

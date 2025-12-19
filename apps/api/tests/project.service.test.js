import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma at the module level
const mockPrisma = {
    workspaceMember: {
        findFirst: jest.fn(),
    },
    project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

// Mock the prisma module
jest.unstable_mockModule('../src/database/prisma.js', () => ({
    default: mockPrisma,
}));

// Now import the service after mocking
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = await import('../src/modules/projects/project.service.js');

describe('Project Service', () => {
    beforeEach(() => {
        mockPrisma.workspaceMember.findFirst.mockReset();
        mockPrisma.project.create.mockReset();
        mockPrisma.project.findMany.mockReset();
        mockPrisma.project.findFirst.mockReset();
        mockPrisma.project.update.mockReset();
        mockPrisma.project.delete.mockReset();
    });

    describe('createProject', () => {
        const userId = 'user-123';
        const workspaceId = 'workspace-123';

        it('should create a project successfully', async () => {
            const projectData = {
                name: 'My Project',
                description: 'Project description'
            };
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const mockProject = {
                id: 'project-123',
                name: 'My Project',
                description: 'Project description',
                workspaceId,
                createdBy: userId,
                createdAt: new Date()
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.create.mockResolvedValueOnce(mockProject);

            const result = await createProject(userId, workspaceId, projectData);

            expect(result.message).toBe('Project created successfully');
            expect(result.project.id).toBe('project-123');
            expect(result.project.name).toBe('My Project');
            expect(mockPrisma.project.create).toHaveBeenCalledWith({
                data: {
                    name: 'My Project',
                    description: 'Project description',
                    workspaceId,
                    createdBy: userId
                }
            });
        });

        it('should create project with null description', async () => {
            const projectData = { name: 'My Project' };
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const mockProject = {
                id: 'project-123',
                name: 'My Project',
                description: null,
                workspaceId,
                createdBy: userId,
                createdAt: new Date()
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.create.mockResolvedValueOnce(mockProject);

            const result = await createProject(userId, workspaceId, projectData);

            expect(result.project.description).toBe(null);
        });

        it('should throw error if project name is empty', async () => {
            await expect(
                createProject(userId, workspaceId, { name: '' })
            ).rejects.toThrow('Project name is required');
        });

        it('should throw error if project name is missing', async () => {
            await expect(
                createProject(userId, workspaceId, {})
            ).rejects.toThrow('Project name is required');
        });

        it('should throw error if project name is not a string', async () => {
            await expect(
                createProject(userId, workspaceId, { name: 123 })
            ).rejects.toThrow('Project name is required');
        });

        it('should throw error if user is not a workspace member', async () => {
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(null);

            await expect(
                createProject(userId, workspaceId, { name: 'My Project' })
            ).rejects.toThrow('You do not have permission to create projects in this workspace');
        });

        it('should trim project name and description', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const mockProject = {
                id: 'project-123',
                name: 'Trimmed Project',
                description: 'Trimmed description',
                workspaceId,
                createdBy: userId,
                createdAt: new Date()
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.create.mockResolvedValueOnce(mockProject);

            await createProject(userId, workspaceId, {
                name: '  Trimmed Project  ',
                description: '  Trimmed description  '
            });

            expect(mockPrisma.project.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: 'Trimmed Project',
                        description: 'Trimmed description'
                    })
                })
            );
        });
    });

    describe('getProjects', () => {
        const userId = 'user-123';
        const workspaceId = 'workspace-123';

        it('should return all projects in workspace', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };
            const mockProjects = [
                {
                    id: 'project-1',
                    name: 'Project 1',
                    description: 'Description 1',
                    workspaceId,
                    createdAt: new Date('2024-01-02')
                },
                {
                    id: 'project-2',
                    name: 'Project 2',
                    description: 'Description 2',
                    workspaceId,
                    createdAt: new Date('2024-01-01')
                }
            ];

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findMany.mockResolvedValueOnce(mockProjects);

            const result = await getProjects(workspaceId, userId);

            expect(result.projects).toHaveLength(2);
            expect(result.projects[0].id).toBe('project-1');
            expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
                where: { workspaceId },
                orderBy: { createdAt: 'desc' }
            });
        });

        it('should return empty array if no projects exist', async () => {
            const membership = { userId, workspaceId, role: 'MEMBER' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findMany.mockResolvedValueOnce([]);

            const result = await getProjects(workspaceId, userId);

            expect(result.projects).toEqual([]);
        });

        it('should throw error if user is not a workspace member', async () => {
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(null);

            await expect(
                getProjects(workspaceId, userId)
            ).rejects.toThrow('You do not have permission to view projects in this workspace');
        });
    });

    describe('updateProject', () => {
        const userId = 'user-123';
        const workspaceId = 'workspace-123';
        const projectId = 'project-123';

        it('should update project when user is owner', async () => {
            const membership = { userId, workspaceId, role: 'OWNER' };
            const existingProject = { id: projectId, workspaceId, name: 'Old Name' };
            const updatedProject = {
                id: projectId,
                name: 'Updated Project',
                description: 'Updated description',
                workspaceId,
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(existingProject);
            mockPrisma.project.update.mockResolvedValueOnce(updatedProject);

            const result = await updateProject(workspaceId, projectId, userId, {
                name: 'Updated Project',
                description: 'Updated description'
            });

            expect(result.message).toBe('Project updated successfully');
            expect(result.project.name).toBe('Updated Project');
        });

        it('should update project when user is admin', async () => {
            const membership = { userId, workspaceId, role: 'ADMIN' };
            const existingProject = { id: projectId, workspaceId, name: 'Old Name' };
            const updatedProject = {
                id: projectId,
                name: 'Updated Project',
                description: null,
                workspaceId,
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(existingProject);
            mockPrisma.project.update.mockResolvedValueOnce(updatedProject);

            const result = await updateProject(workspaceId, projectId, userId, {
                name: 'Updated Project'
            });

            expect(result.message).toBe('Project updated successfully');
        });

        it('should throw error if user is not owner or admin', async () => {
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(null);

            await expect(
                updateProject(workspaceId, projectId, userId, { name: 'Updated Project' })
            ).rejects.toThrow('You do not have permission to update projects in this workspace');
        });

        it('should throw error if project name is empty', async () => {
            await expect(
                updateProject(workspaceId, projectId, userId, { name: '' })
            ).rejects.toThrow('Project name is required');
        });

        it('should throw error if project not found in workspace', async () => {
            const membership = { userId, workspaceId, role: 'OWNER' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(null);

            await expect(
                updateProject(workspaceId, projectId, userId, { name: 'Updated Project' })
            ).rejects.toThrow('Project not found in this workspace');
        });

        it('should trim project name and description', async () => {
            const membership = { userId, workspaceId, role: 'OWNER' };
            const existingProject = { id: projectId, workspaceId, name: 'Old Name' };
            const updatedProject = {
                id: projectId,
                name: 'Trimmed Name',
                description: 'Trimmed Description',
                workspaceId,
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(existingProject);
            mockPrisma.project.update.mockResolvedValueOnce(updatedProject);

            await updateProject(workspaceId, projectId, userId, {
                name: '  Trimmed Name  ',
                description: '  Trimmed Description  '
            });

            expect(mockPrisma.project.update).toHaveBeenCalledWith({
                where: { id: projectId },
                data: {
                    name: 'Trimmed Name',
                    description: 'Trimmed Description'
                }
            });
        });
    });

    describe('deleteProject', () => {
        const userId = 'user-123';
        const workspaceId = 'workspace-123';
        const projectId = 'project-123';

        it('should delete project when user is owner', async () => {
            const membership = { userId, workspaceId, role: 'OWNER' };
            const existingProject = { id: projectId, workspaceId, name: 'Project to Delete' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(existingProject);
            mockPrisma.project.delete.mockResolvedValueOnce(existingProject);

            const result = await deleteProject(workspaceId, projectId, userId);

            expect(result.message).toBe('Project deleted successfully');
            expect(mockPrisma.project.delete).toHaveBeenCalledWith({
                where: { id: projectId }
            });
        });

        it('should delete project when user is admin', async () => {
            const membership = { userId, workspaceId, role: 'ADMIN' };
            const existingProject = { id: projectId, workspaceId, name: 'Project to Delete' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(existingProject);
            mockPrisma.project.delete.mockResolvedValueOnce(existingProject);

            const result = await deleteProject(workspaceId, projectId, userId);

            expect(result.message).toBe('Project deleted successfully');
        });

        it('should throw error if user is not owner or admin', async () => {
            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(null);

            await expect(
                deleteProject(workspaceId, projectId, userId)
            ).rejects.toThrow('You do not have permission to delete projects in this workspace');
        });

        it('should throw error if project not found in workspace', async () => {
            const membership = { userId, workspaceId, role: 'OWNER' };

            mockPrisma.workspaceMember.findFirst.mockResolvedValueOnce(membership);
            mockPrisma.project.findFirst.mockResolvedValueOnce(null);

            await expect(
                deleteProject(workspaceId, projectId, userId)
            ).rejects.toThrow('Project not found in this workspace');
        });
    });
});

import prisma from "../../database/prisma.js";

export async function createProject(userId, workspaceId, data) {
    
    const { name, description } = data;

    //validate project name

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error("Project name is required");
    }

    // Check if user has permission to create projects in the workspace
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
        }
    }); 
    if (!membership) {
        throw new Error("You do not have permission to create projects in this workspace");
    }
    // Create project
    const project = await prisma.project.create({
        data: {
            name: name.trim(),
            description: description ? description.trim() : null,
            workspaceId: workspaceId,
            createdBy: userId,
        },
    });

    return {
        message: "Project created successfully",
        project: {
            id: project.id,
            name: project.name,
            description: project.description,
            workspaceId: project.workspaceId,
            createdBy: project.createdBy,
            createdAt: project.createdAt,
        }
 
    };
}

export async function getProjects(workspaceId, userId) {
    // Check if user is a member of the workspace
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
        }
    }); 
    if (!membership) {
        throw new Error("You do not have permission to view projects in this workspace");
    }
    // Get projects
    const projects = await prisma.project.findMany({
        where: {
            workspaceId: workspaceId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return { projects };
}

export async function updateProject(workspaceId, projectId, userId, data) {
    const { name, description } = data;

    // Validate project name
    if (!name || name.trim().length === 0) {
        throw new Error("Project name is required");
    }

    // Check if user has permission to update projects (ADMIN or OWNER role)
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
            role: { in: ['OWNER', 'ADMIN'] }
        }
    });

    if (!membership) {
        throw new Error("You do not have permission to update projects in this workspace");
    }

    // Check if project exists in workspace
    const existingProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId: workspaceId
        },
    });

    if (!existingProject) {
        throw new Error("Project not found in this workspace");
    }

    // Update project
    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
            name: name.trim(),
            description: description ? description.trim() : null,
        },
    });

    return {
        message: "Project updated successfully",
        project: {
            id: updatedProject.id,
            name: updatedProject.name,
            description: updatedProject.description,
            workspaceId: updatedProject.workspaceId,
            createdBy: updatedProject.createdBy,
            createdAt: updatedProject.createdAt,
            updatedAt: updatedProject.updatedAt
        }
    };
}

export async function deleteProject(workspaceId, projectId, userId) {
    // Check if user has permission (ADMIN or OWNER)
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
            role: { in: ['OWNER', 'ADMIN'] }
        }
    });

    if (!membership) {
        throw new Error("You do not have permission to delete projects in this workspace");
    }

    // Check if project exists in workspace
    const existingProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId: workspaceId
        },
    });

    if (!existingProject) {
        throw new Error("Project not found in this workspace");
    }

    // Delete project
    await prisma.project.delete({
        where: { id: projectId },
    });

    return { message: "Project deleted successfully" };
}
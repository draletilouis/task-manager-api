import prisma from "../../database/prisma.js";

export async function createTask(userId, workspaceId, projectId, data) {
    // 1. Extract data from request body
    const { title, description, status, priority, dueDate, assignedTo } = data;

    // 2. Validate title (required field)
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        throw new Error("Task title is required");
    }

    // 3. Check user is a workspace member
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
        }
    });

    if (!membership) {
        throw new Error("You do not have permission to create tasks in this workspace");
    }

    // 4. Check project exists in workspace
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId: workspaceId
        }
    });

    if (!project) {
        throw new Error("Project not found in this workspace");
    }

    // 5. If assignedTo provided, validate assignee is workspace member
    if (assignedTo) {
        const assigneeMembership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: assignedTo
            }
        });

        if (!assigneeMembership) {
            throw new Error("Assigned user is not a member of this workspace");
        }
    }

    // 6. Create task
    const task = await prisma.task.create({
        data: {
            title: title.trim(),
            description: description ? description.trim() : null,
            status: status || 'TODO',
            priority: priority || 'MEDIUM',
            dueDate: dueDate ? new Date(dueDate) : null,
            assignedTo: assignedTo || null,
            projectId: projectId,
            createdBy: userId,
        },
    });

    // 7. Return success response
    return {
        message: "Task created successfully",
        task: {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            assignedTo: task.assignedTo,
            projectId: task.projectId,
            createdBy: task.createdBy,
            createdAt: task.createdAt,
        }
    };
}

export async function getTasks(workspaceId, projectId, userId) {
    // Check user is a workspace member
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
        }
    });

    if (!membership) {
        throw new Error("You do not have permission to view tasks in this workspace");
    }
    // Check project exists in workspace
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId: workspaceId
        }
    });

    if (!project) {
        throw new Error("Project not found in this workspace");
    }
    // Get tasks
    const tasks = await prisma.task.findMany({
        where: {
            projectId: projectId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return { tasks };
}

export async function updateTask(workspaceId, projectId, taskId, userId, data) {
    // 1. Extract data from request body
    const { title, description, status, priority, dueDate, assignedTo } = data;

    if (title && (typeof title !== 'string' || title.trim().length === 0)) {
        throw new Error("Task title cannot be empty");
    }

    // 2. Check user is a workspace member
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
        }
    });

    if (!membership) {
        throw new Error("You do not have permission to update tasks in this workspace");
    }

    // 3. Check project exists in workspace
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId: workspaceId
        }
    });
    if (!project) {
        throw new Error("Project not found in this workspace");
    }

    // 4. Check task exists in project
    const existingTask = await prisma.task.findFirst({
        where: {
            id: taskId,
            projectId: projectId
        },
    });

    if (!existingTask) {
        throw new Error("Task not found in this project");
    }
    const isOwnerOrAdmin = membership.role === 'OWNER' || membership.role === 'ADMIN';

    // 5. If assignedTo provided, validate assignee is workspace member
    if (assignedTo) {
        const assigneeMembership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: assignedTo
            }
        });

        if (!assigneeMembership) {
            throw new Error("Assigned user is not a member of this workspace");
        }
    }

    // 6. Update task
 const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
    });

    return {
        message: "Task updated successfully",
        task: {id: updatedTask.id,
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
            assignedTo: updatedTask.assignedTo,
            projectId: updatedTask.projectId,
            createdBy: updatedTask.createdBy,
            createdAt: updatedTask.createdAt,
            updatedAt: updatedTask.updatedAt,
        }
    };
}

export async function deleteTask(workspaceId, projectId, taskId, userId) {
    // 1. Check user is a workspace member
    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: userId,
        }
    });

    if (!membership) {
        throw new Error("You do not have permission to delete tasks in this workspace");
    }
    // 2. Check project exists in workspace
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId: workspaceId
        }
    });

    if (!project) {
        throw new Error("Project not found in this workspace");
    }
    // 3. Check task exists in project
    const existingTask = await prisma.task.findFirst({
        where: {
            id: taskId,
            projectId: projectId
        },
    });

    if (!existingTask) {
        throw new Error("Task not found in this project");
    }
    //permission check: only task creator or workspace ADMIN/OWNER can delete
    const isOwnerOrAdmin = membership.role === 'OWNER' || membership.role === 'ADMIN';

    if (existingTask.createdBy !== userId && !isOwnerOrAdmin) {
        throw new Error("You do not have permission to delete this task");
    }

    // 4. Delete task
    await prisma.task.delete({
        where: { id: taskId },
    });

    return { message: "Task deleted successfully" };
}
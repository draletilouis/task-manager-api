import prisma from "../../database/prisma";

export async function checkWorkspaceMember(req, res, next) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;

        const membership = await prisma.workspaceMember.findFirst({
            where: {
                userId: userId,
                workspaceId: workspaceId,
            },
        });

        if (!membership) {
            return res.status(403).json({ error: "You are not a member of this workspace" });
        }

        req.workspaceMember = {
            workspaceId: workspaceId,
            role: workspaceMember.role
        };

        next();
    } catch (error) {
        console.error("Error checking workspace membership:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}    

export async function checkWorkspaceAdmin(req, res, next) {
    try {
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;     

        const membership = await prisma.workspaceMember.findFirst({
            where: {
                userId: userId,
                workspaceId: workspaceId,
        }
        });

        if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
            return res.status(403).json({ error: "You do not have admin privileges in this workspace" });
        }

        req.workspaceMember = {
            workspaceId: workspaceId,
            role: membership.role
        };
        next();
    } catch (error) {
        console.error("Error checking workspace admin privileges:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  
}
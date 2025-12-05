import { Role } from "@prisma/client";
import prisma from "../../database/prisma.js";

export const create = async (userId: string, data: any) => {
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: Role.OWNER
        }
      }
    }
  });

  return workspace;
};

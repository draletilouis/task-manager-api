import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Create a single instance of Prisma Client
const prisma = new PrismaClient();

export default prisma;
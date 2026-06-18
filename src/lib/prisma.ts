import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as typeof globalThis & { prisma?: PrismaClient };

const singletonPrisma = () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || singletonPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
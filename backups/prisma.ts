import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const dbUrl = (process.env.DATABASE_URL && process.env.DATABASE_URL !== "undefined")
    ? process.env.DATABASE_URL
    : "file:./prisma/dev_v7.db";

const adapter = new PrismaLibSql({
    url: dbUrl,
});

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ["query", "info", "warn", "error"],
    });

console.log("Prisma Client initialized with LibSQL adapter");

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

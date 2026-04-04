import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || "file:./prisma/dev_v7.db";
const isLibsql = dbUrl.startsWith("libsql://") || dbUrl.startsWith("wss://") || dbUrl.startsWith("file:");

const getPrismaClient = () => {
    // If we're using PostgreSQL, we should ideally use the direct URL for the adapter
    const connectionUrl = (!isLibsql && process.env.DIRECT_URL) ? process.env.DIRECT_URL : dbUrl;
    console.log(`[Prisma] Starting initialization for Prisma 7 with URL (sanitized): ${connectionUrl.split('@').pop()}`);
    
    try {
        if (isLibsql) {
            console.log(`[Prisma] Initializing for LibSQL/SQLite adapter...`);
            const adapter = new PrismaLibSql({ url: connectionUrl } as any);
            return new PrismaClient({ 
                adapter, 
                log: ["query", "info", "warn", "error"] 
            });
        }
        
        console.log(`[Prisma] Initializing for PostgreSQL (with PrismaPg Adapter) using Direct URL? ${!!process.env.DIRECT_URL}`);
        const pool = new Pool({ 
            connectionString: connectionUrl,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ 
            adapter,
            log: ["query", "info", "warn", "error"] 
        });
    } catch (e: any) {
        console.error("[Prisma] CRITICAL: Failed to initialize Prisma with any adapter!");
        console.error("Error Message:", e.message);
        console.error("Error Stack:", e.stack);
        throw new Error(`[Prisma] Driver adapter initialization failed: ${e.message}`);
    }
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getPrismaClient(): PrismaClient {
    // DIRECT_URL takes priority (bypasses pooler for migrations/long queries)
    // DATABASE_URL is the pooled connection string
    // file: fallback is intentionally removed — schema is PostgreSQL
    const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

    if (!dbUrl) {
        throw new Error(
            "[Prisma] Nenhuma variável de ambiente de banco de dados encontrada.\n" +
            "Configure DATABASE_URL (e opcionalmente DIRECT_URL) nas configurações " +
            "do projeto no Vercel (Settings → Environment Variables).\n" +
            "Exemplo postgresql: postgresql://user:pass@host:5432/dbname"
        );
    }

    // libsql/turso URLs only — file: is NOT a valid production URL
    const isLibsql =
        dbUrl.startsWith("libsql://") ||
        dbUrl.startsWith("wss://");

    try {
        if (isLibsql) {
            console.log("[Prisma] Initializing LibSQL/Turso adapter...");
            const adapter = new PrismaLibSql({ url: dbUrl } as any);
            return new PrismaClient({ adapter });
        }

        // PostgreSQL path (Neon, Supabase, Railway, Vercel Postgres, etc.)
        console.log("[Prisma] Initializing PostgreSQL (pg) adapter...");
        const pool = new Pool({
            connectionString: dbUrl,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    } catch (e: any) {
        console.error("[Prisma] Falha ao inicializar o cliente:", e.message);
        throw new Error(`[Prisma] Driver adapter initialization failed: ${e.message}`);
    }
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

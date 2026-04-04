const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const dbUrl = "postgresql://postgres:aksjdhjkadjka@db.yqvljwgecjvtxzeqwrsp.supabase.co:5432/postgres?pg_bouncer=true";

async function main() {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const users = await prisma.user.findMany({ select: { email: true, isSuperAdmin: true } });
        console.log("Users:", users);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();

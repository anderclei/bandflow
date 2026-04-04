const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const dbUrl = "postgresql://postgres:aksjdhjkadjka@db.yqvljwgecjvtxzeqwrsp.supabase.co:5432/postgres?pg_bouncer=true"; // Using the direct string if env fails

async function main() {
    console.log("Checking DB connection...");
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const bandCount = await prisma.band.count();
        console.log("Total Bands:", bandCount);
        
        const userCount = await prisma.user.count();
        console.log("Total Users:", userCount);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();

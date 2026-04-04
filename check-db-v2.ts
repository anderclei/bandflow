import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Replication of the logic in src/lib/prisma.ts to ensure we use the same connection
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

async function main() {
    if (!dbUrl) {
        console.error("No DATABASE_URL found.");
        return;
    }

    console.log("Connecting to:", dbUrl.split('@').pop());
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const bandCount = await prisma.band.count();
        console.log("Total Bands:", bandCount);
        
        const userCount = await prisma.user.count();
        console.log("Total Users:", userCount);

        if (bandCount > 0) {
            const bands = await prisma.band.findMany({ take: 5 });
            console.log("Bands names:", bands.map(b => b.name));
        } else {
            console.log("Database is EMPTY for bands.");
        }
    } catch (e) {
        console.error("Error connecting to DB:", e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();

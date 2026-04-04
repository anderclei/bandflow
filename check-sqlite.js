const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

async function main() {
    console.log("Checking local dev.db connection...");
    try {
        const client = createClient({ url: "file:dev.db" });
        const adapter = new PrismaLibSql(client);
        const prisma = new PrismaClient({ adapter });

        const bandCount = await prisma.band.count();
        console.log("Total Bands in local SQLite:", bandCount);
        
        if (bandCount > 0) {
            const bands = await prisma.band.findMany({ select: { name: true, slug: true } });
            console.log("Local Bands names:", bands.map(b => b.name));
        }
    } catch (e) {
        console.error("Error reading dev.db:", e.message);
    }
}

main();

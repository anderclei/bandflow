const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
require('dotenv').config();

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Connecting to database...");
        const users = await prisma.user.findMany({
            select: { id: true, email: true, password: true, isSuperAdmin: true }
        });
        console.log("Users in database:");
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Email: ${u.email}, HasPassword: ${!!u.password}, IsSuperAdmin: ${u.isSuperAdmin}`);
        });
    } catch (error) {
        console.error("Database connection error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

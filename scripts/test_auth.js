const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function authorize(email, password) {
    console.log(`Checking credentials for: ${email}`);

    if (!email || !password) {
        console.log("Missing email or password");
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        console.log("User not found");
        return null;
    }

    console.log("User found:", { email: user.email, hasPassword: !!user.password });

    if (!user.password && user.email !== "admin@bandmanager.com") {
        console.log("User has no password and is not demo admin");
        return null;
    }

    // Temporary bypass for the demo admin without DB password
    if (user.email === "admin@bandmanager.com" && password === "admin123" && !user.password) {
        console.log("Bypass triggered for demo admin");
        return { id: user.id, name: user.name, email: user.email, isSuperAdmin: user.isSuperAdmin };
    }

    if (user.password) {
        console.log("Comparing passwords...");
        const passwordsMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (passwordsMatch) {
            console.log("Passwords match!");
            return { id: user.id, name: user.name, email: user.email, isSuperAdmin: user.isSuperAdmin };
        } else {
            console.log("Passwords DO NOT match");
        }
    }

    return null;
}

async function run() {
    console.log("--- TEST 1: Demo Admin ---");
    await authorize("admin@bandmanager.com", "admin123");

    console.log("\n--- TEST 2: User Admin ---");
    await authorize("anderclei@gmail.com", "Leh1829*");

    await prisma.$disconnect();
}

run();

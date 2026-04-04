import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    const hashedPassword = await bcrypt.hash('Leh1829*', 10);

    const user = await prisma.user.upsert({
        where: { email: 'anderclei@gmail.com' },
        update: {
            password: hashedPassword,
            isSuperAdmin: true,
            name: 'Anderclei'
        },
        create: {
            email: 'anderclei@gmail.com',
            password: hashedPassword,
            isSuperAdmin: true,
            name: 'Anderclei',
            licenseStatus: 'ACTIVE',
            maxBands: 10
        }
    });

    console.log('User upserted:', user.email);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

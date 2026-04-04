import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting database seed/update for Mock MP Migration...");

    // Update existing bands to be ACTIVE and PREMIUM by default
    const bands = await prisma.band.updateMany({
        where: {
            // we update all existing bands to not break current user experience
        },
        data: {
            subscriptionStatus: 'ACTIVE',
            subscriptionPlan: 'PREMIUM',
            planExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
            paymentMethod: 'system_migration'
        }
    });

    console.log(`Updated ${bands.count} bands to ACTIVE/PREMIUM status.`);

    // Log the migration in the new table
    const allBands = await prisma.band.findMany({ select: { id: true } });

    for (const b of allBands) {
        await prisma.subscriptionLog.create({
            data: {
                bandId: b.id,
                action: 'UPGRADE',
                oldPlan: 'UNKNOWN',
                newPlan: 'PREMIUM',
                details: 'System migration to new subscription schema'
            }
        });
    }

    console.log(`Created ${allBands.length} subscription logs.`);
    console.log("Migration complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

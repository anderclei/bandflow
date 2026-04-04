const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const bandCount = await prisma.band.count();
    console.log('Total bands in DB:', bandCount);
    
    if (bandCount > 0) {
        const bands = await prisma.band.findMany({ take: 5, select: { name: true, slug: true } });
        console.log('Sample bands:', bands);
    }
  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

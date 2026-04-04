import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log("Usuários encontrados:", users.map(u => ({ email: u.email, isSuperAdmin: u.isSuperAdmin })))

    // Garantindo que todos os usuários existentes (ou ao menos o principal) sejam superadmin para teste
    const result = await prisma.user.updateMany({
        data: {
            isSuperAdmin: true,
            licenseStatus: 'ACTIVE'
        }
    })
    console.log(`Atualizados ${result.count} usuários para SuperAdmin.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

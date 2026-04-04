import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || "file:./prisma/dev_v7.db"
const isLibsql = dbUrl.startsWith("libsql://") || dbUrl.startsWith("wss://") || dbUrl.startsWith("file:")

const getPrisma = () => {
    if (isLibsql) {
        console.log("Using LibSQL/SQLite for creation...")
        const client = createClient({ url: dbUrl })
        const adapter = new PrismaLibSql(client as any)
        return new PrismaClient({ adapter })
    }
    console.log("Using PostgreSQL for creation...")
    return new PrismaClient()
}

const prisma = getPrisma()

async function main() {
    const adminEmail = "admin@bandademo.com"
    const bandName = "Banda Demo"
    const slug = "banda-demo"
    const logoUrl = "/logos/banda-demo.png"
    const hashedPassword = await bcrypt.hash("123456", 10)

    try {
        await prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({ where: { email: adminEmail } })
            if (!user) {
                user = await tx.user.create({
                    data: {
                        email: adminEmail,
                        name: "Admin " + bandName,
                        password: hashedPassword,
                        maxBands: 1,
                        licenseStatus: "ACTIVE",
                        isSuperAdmin: false
                    }
                })
                console.log("User found/created:", user.id)
            }

            const existingBand = await tx.band.findUnique({ where: { slug: slug } })
            if (!existingBand) {
                const band = await tx.band.create({
                    data: {
                        type: "BANDA",
                        name: bandName,
                        slug: slug,
                        imageUrl: logoUrl,
                        primaryColor: "#0a0a0a",
                        secondaryColor: "#000000",
                        respName: "Admin " + bandName,
                        respEmail: adminEmail,
                        subscriptionPlan: "PRO",
                        subscriptionStatus: "ACTIVE",
                        members: {
                            create: {
                                userId: user.id,
                                role: "ADMIN"
                            }
                        }
                    }
                })
                console.log("SUCCESS: Created band:", band.id)
            } else {
                console.log("Band already exists.")
            }
        })
    } catch (err) {
        console.error("FATAL ERROR:", err)
    } finally {
        await prisma.$disconnect()
    }
}

main()

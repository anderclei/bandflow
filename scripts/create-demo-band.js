const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
    const adminEmail = "admin@bandademo.com"
    const bandName = "Banda Demo"
    const slug = "banda-demo"
    const logoUrl = "/logos/banda-demo.png"
    const hashedPassword = await bcrypt.hash("123456", 10)

    console.log("Starting account creation for:", bandName)

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Find or create user
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
                console.log("User created:", user.id)
            }

            // Create band
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
            return band
        })

        console.log("SUCCESS: Created band:", result.id)
        console.log("Access via: /" + result.slug)
    } catch (err) {
        console.error("TRANSACTION FAILED:", err)
    } finally {
        await prisma.$disconnect()
    }
}

main()

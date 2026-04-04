"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            where: { isSuperAdmin: false },
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { memberships: true }
                }
            }
        })
        return { success: true, users }
    } catch (error) {
        console.error("Error fetching users:", error)
        return { success: false, error: "Falha ao buscar usuários" }
    }
}

export async function updateUserLicense(
    userId: string,
    data: { licenseStatus?: string; maxBands?: number; isSuperAdmin?: boolean }
) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                licenseStatus: data.licenseStatus,
                maxBands: data.maxBands,
                isSuperAdmin: data.isSuperAdmin
            }
        })
        revalidatePath("/super-admin/clients")
        return { success: true }
    } catch (error) {
        console.error("Error updating user license:", error)
        return { success: false, error: "Falha ao atualizar licença" }
    }
}

export async function getSystemSettings() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "global" }
        })

        // Return default if not found
        if (!settings) {
            return {
                success: true,
                settings: {
                    id: "global",
                    appName: "BandFlow",
                    logoUrl: null,
                    primaryColor: null,
                    adminEmail: null,
                }
            }
        }

        return { success: true, settings }
    } catch (error) {
        console.error("Error fetching system settings:", error)
        return { success: false, error: "Falha ao buscar configurações globais" }
    }
}

export async function updateSystemSettings(data: {
    appName?: string;
    logoUrl?: string;
    primaryColor?: string;
    adminEmail?: string;
}) {
    try {
        await prisma.systemSettings.upsert({
            where: { id: "global" },
            update: {
                appName: data.appName,
                logoUrl: data.logoUrl,
                primaryColor: data.primaryColor,
                adminEmail: data.adminEmail,
            },
            create: {
                id: "global",
                appName: data.appName || "BandFlow",
                logoUrl: data.logoUrl,
                primaryColor: data.primaryColor,
                adminEmail: data.adminEmail,
            }
        })
        revalidatePath("/super-admin/settings")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error updating system settings:", error)
        return { success: false, error: "Falha ao salvar configurações" }
    }
}

export async function updateSuperAdminPassword(currentPassword: string, newPassword: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const user = await (prisma as any).user.findUnique({
            where: { id: session.user.id },
            select: { id: true, isSuperAdmin: true, email: true, password: true }
        }) as { id: string; isSuperAdmin: boolean; email: string | null; password: string | null } | null;

        if (!user || !user.isSuperAdmin) return { success: false, error: "Usuário não autorizado." };

        // Validate old password
        if (user.password) {
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) return { success: false, error: "Senha atual incorreta." };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await (prisma as any).user.update({
            where: { id: user.id },
            data: { password: hashedNewPassword }
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating password:", error);
        return { success: false, error: "Falha inesperada ao atualizar a senha." };
    }
}

export async function getTenants() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        // @ts-ignore
        const isAdmin = session.user.isSuperAdmin === true || session.user.isSuperAdmin === 1;
        if (!isAdmin) {
            const user = await prisma.user.findUnique({ where: { id: session.user.id } });
            if (!user || !(user.isSuperAdmin === true || (user as any).isSuperAdmin === 1))
                return { success: false, error: "Não autorizado." };
        }

        // Using Prisma Client now that it's updated with all the fields
        const bands = await prisma.band.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                members: {
                    where: { role: "ADMIN" },
                    include: { user: true }
                },
                _count: {
                    select: { members: true }
                }
            }
        });

        return { success: true, bands };
    } catch (error) {
        console.error("Error fetching tenants:", error);
        return { success: false, error: "Falha ao buscar bandas/escritórios." };
    }
}



export async function createTenant(data: {
    type: "BANDA" | "OFFICE";
    name: string;
    slug: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    respName?: string;
    respDocument?: string;
    respPhone?: string;
    respEmail?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressNeighborhood?: string;
    addressZipCode?: string;
    addressCity?: string;
    addressState?: string;
    adminEmail: string;

    firstBandName?: string;
    firstBandLogo?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const superAdmin = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!superAdmin || !superAdmin.isSuperAdmin) return { success: false, error: "Não autorizado." };

        if (!data.name || !data.slug || !data.adminEmail) {
            return { success: false, error: "Nome, Slug e Email do Administrador são obrigatórios." };
        }

        // Check if slug is taken
        const existingSlug = await prisma.band.findUnique({ where: { slug: data.slug } });
        if (existingSlug) {
            return { success: false, error: "A URL (Slug) já está em uso." };
        }

        // Handle user logic in a transaction
        await prisma.$transaction(async (tx) => {
            // Find or create the user
            let user = await tx.user.findUnique({ where: { email: data.adminEmail } });

            if (!user) {
                // Senha padrão 123456
                const hashedPassword = await bcrypt.hash("123456", 10);
                user = await (tx as any).user.create({
                    data: {
                        email: data.adminEmail,
                        name: data.respName || "",
                        password: hashedPassword,
                        maxBands: data.type === "OFFICE" ? 5 : 1,
                        licenseStatus: "ACTIVE"
                    }
                });
            }

            // Create the Band (Tenant)
            const tenant = await (tx as any).band.create({
                data: {
                    type: data.type,
                    name: data.name,
                    slug: data.slug,
                    imageUrl: data.logoUrl || null,
                    primaryColor: "#333333",
                    secondaryColor: data.secondaryColor || "#dc2626",
                    respName: data.respName,
                    respDocument: data.respDocument,
                    respPhone: data.respPhone,
                    respEmail: data.respEmail,
                    addressStreet: data.addressStreet,
                    addressNumber: data.addressNumber,
                    addressNeighborhood: data.addressNeighborhood,
                    addressZipCode: data.addressZipCode,
                    addressCity: data.addressCity,
                    addressState: data.addressState,
                    subscriptionPlan: data.subscriptionPlan || "ESSENTIAL",
                    subscriptionStatus: data.subscriptionStatus || "TRIAL",

                    members: {
                        create: {
                            userId: user!.id,
                            role: "ADMIN"
                        }
                    }
                }
            }) as { id: string; slug: string };

            if (data.type === "OFFICE" && data.firstBandName) {
                const firstBandSlugStr = data.firstBandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                await (tx as any).band.create({
                    data: {
                        type: "BANDA",
                        name: data.firstBandName,
                        slug: `${tenant.slug}-${firstBandSlugStr}`,
                        imageUrl: data.firstBandLogo || null,
                        primaryColor: "#333333",
                        secondaryColor: data.secondaryColor || "#dc2626",
                        officeId: tenant.id,
                        members: {
                            create: {
                                userId: user!.id,
                                role: "ADMIN"
                            }
                        }
                    }
                });
            }
        });

        revalidatePath("/super-admin/tenants");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating tenant:", error);
        return { success: false, error: error.message || "Falha ao criar o escritório/banda." };
    }
}

export async function updateTenant(id: string, data: {
    name?: string;
    slug?: string;
    logoUrl?: string;
    secondaryColor?: string;
    respName?: string;
    respDocument?: string;
    respPhone?: string;
    respEmail?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressNeighborhood?: string;
    addressZipCode?: string;
    addressCity?: string;
    addressState?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    customModules?: string;
    maxMembers?: number;
    maxStorageGB?: number;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        // @ts-ignore
        const isAdmin = session.user.isSuperAdmin === true || session.user.isSuperAdmin === 1;
        if (!isAdmin) {
            const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
            if (!superAdmin || !(superAdmin.isSuperAdmin === true || (superAdmin as any).isSuperAdmin === 1))
                return { success: false, error: "Não autorizado." };
        }

        if (data.slug) {
            const existing = await (prisma as any).band.findFirst({
                where: {
                    slug: data.slug,
                    NOT: { id }
                }
            });
            if (existing) return { success: false, error: "A URL (Slug) já está em uso." };
        }

        // Refactored to use Prisma Client update
        const updateData: any = {};
        const fields = [
            'name', 'slug', 'logoUrl', 'secondaryColor', 'respName', 'respDocument', 
            'respPhone', 'respEmail', 'addressStreet', 'addressNumber', 'addressNeighborhood', 
            'addressZipCode', 'addressCity', 'addressState', 'subscriptionPlan', 
            'subscriptionStatus', 'customModules', 'maxMembers', 'maxStorageGB'
        ];

        fields.forEach(f => {
            if (data[f as keyof typeof data] !== undefined && data[f as keyof typeof data] !== null && data[f as keyof typeof data] !== '') {
                // Map logoUrl to imageUrl since it's the DB field name
                if (f === 'logoUrl') {
                    updateData['imageUrl'] = data.logoUrl;
                } else {
                    updateData[f] = data[f as keyof typeof data];
                }
            }
        });

        if (Object.keys(updateData).length > 0) {
            await (prisma as any).band.update({
                where: { id },
                data: updateData
            });
        }

        // Sincronização bidirecional: invalida tanto o super admin quanto o dashboard da banda
        revalidatePath("/super-admin/tenants");
        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating tenant:", error);
        return { success: false, error: "Falha ao editar a conta." };
    }
}



export async function deleteTenant(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !superAdmin.isSuperAdmin) return { success: false, error: "Não autorizado." };

        // Deleting the tenant will cascade delete members but not users.
        await prisma.band.delete({ where: { id } });

        revalidatePath("/super-admin/tenants");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting tenant:", error);
        return { success: false, error: "Falha ao excluir a conta." };
    }
}

export async function impersonateTenant(tenantId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        // Usar isSuperAdmin da sessão JWT primeiro (mais confiável)
        // @ts-ignore
        const isAdmin = session.user.isSuperAdmin === true || session.user.isSuperAdmin === 1;

        if (!isAdmin) {
            // Fallback: verificar diretamente no banco
            const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
            const isAdminFromDB = superAdmin && (superAdmin.isSuperAdmin === true || (superAdmin as any).isSuperAdmin === 1);
            if (!isAdminFromDB) return { success: false, error: "Não autorizado. Faça login como Super Admin." };
        }

        // Verify tenant exists
        const tenant = await prisma.band.findUnique({
            where: { id: tenantId },
            select: { id: true, name: true }
        });
        if (!tenant) return { success: false, error: "Banda/Escritório não encontrado." };

        const cookieStore = await (await import("next/headers")).cookies();
        cookieStore.set("activeBandId", tenantId, { path: "/" });

        return { success: true };
    } catch (error: any) {
        console.error("Error in impersonation:", error);
        return { success: false, error: `Falha ao acessar o ambiente: ${error.message}` };
    }
}


export async function resetBandData(bandId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !superAdmin.isSuperAdmin) return { success: false, error: "Não autorizado." };

        // Deleções sequenciais independentes: se um modelo não existir no banco,
        // o erro é capturado individualmente sem reverter os outros.
        // Ordem importa: filhos antes dos pais (FK constraints)
        const safeDelete = async (fn: () => Promise<any>, label: string) => {
            try { await fn(); } catch (e: any) {
                console.warn(`[resetBandData] Pulando "${label}":`, e.message);
            }
        };

        // Nível 3: filhos de Gig
        await safeDelete(() => (prisma as any).gigTask.deleteMany({ where: { gig: { bandId } } }), "GigTask");
        await safeDelete(() => (prisma as any).memberGigFee.deleteMany({ where: { gig: { bandId } } }), "MemberGigFee");
        await safeDelete(() => (prisma as any).setlistItem.deleteMany({ where: { setlist: { bandId } } }), "SetlistItem");

        // Nível 3: filhos de Trip (hotelaria)
        await safeDelete(() => (prisma as any).roomAssignment.deleteMany({ where: { room: { trip: { bandId } } } }), "RoomAssignment");
        await safeDelete(() => (prisma as any).room.deleteMany({ where: { trip: { bandId } } }), "Room");

        // Nível 2: entidades da banda
        await safeDelete(() => prisma.gig.deleteMany({ where: { bandId } }), "Gig");
        await safeDelete(() => prisma.song.deleteMany({ where: { bandId } }), "Song");
        await safeDelete(() => prisma.setlist.deleteMany({ where: { bandId } }), "Setlist");
        await safeDelete(() => prisma.document.deleteMany({ where: { bandId } }), "Document");
        await safeDelete(() => prisma.expense.deleteMany({ where: { bandId } }), "Expense");
        await safeDelete(() => prisma.merchItem.deleteMany({ where: { bandId } }), "MerchItem");
        await safeDelete(() => prisma.merchSale.deleteMany({ where: { bandId } }), "MerchSale");
        await safeDelete(() => prisma.notification.deleteMany({ where: { bandId } }), "Notification");
        await safeDelete(() => prisma.activityLog.deleteMany({ where: { bandId } }), "ActivityLog");
        await safeDelete(() => prisma.goal.deleteMany({ where: { bandId } }), "Goal");
        await safeDelete(() => prisma.contractTemplate.deleteMany({ where: { bandId } }), "ContractTemplate");
        await safeDelete(() => prisma.equipment.deleteMany({ where: { bandId } }), "Equipment");
        await safeDelete(() => prisma.trip.deleteMany({ where: { bandId } }), "Trip");
        await safeDelete(() => prisma.contractor.deleteMany({ where: { bandId } }), "Contractor");
        await safeDelete(() => prisma.deal.deleteMany({ where: { bandId } }), "Deal");
        await safeDelete(() => prisma.showFormat.deleteMany({ where: { bandId } }), "ShowFormat");
        await safeDelete(() => (prisma as any).logisticsSupplier.deleteMany({ where: { bandId } }), "LogisticsSupplier");
        await safeDelete(() => prisma.follower.deleteMany({ where: { bandId } }), "Follower");
        // Modelos opcionais (podem não existir no banco atual)
        await safeDelete(() => (prisma as any).gigExpense.deleteMany({ where: { gig: { bandId } } }), "GigExpense");
        await safeDelete(() => (prisma as any).financialTransaction.deleteMany({ where: { bandId } }), "FinancialTransaction");

        revalidatePath("/super-admin/tenants");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Error resetting band data:", error);
        return { success: false, error: "Falha ao resetar dados da conta." };
    }
}

export async function extendTrial(bandId: string, daysToAdd: number) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };
        
        // Verifica se é super admin
        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !(superAdmin.isSuperAdmin === true || (superAdmin as any).isSuperAdmin === 1)) {
            return { success: false, error: "Não autorizado." };
        }

        const band = await prisma.band.findUnique({ where: { id: bandId } });
        if (!band) return { success: false, error: "Banda não encontrada." };

        const currentDate = band.planExpiresAt ? new Date(band.planExpiresAt) : new Date();
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + daysToAdd);

        await prisma.band.update({
            where: { id: bandId },
            data: { planExpiresAt: newDate }
        });

        revalidatePath("/super-admin/billing");
        revalidatePath("/super-admin/tenants");
        return { success: true };
    } catch (error: any) {
        console.error("Error extending trial:", error);
        return { success: false, error: "Falha ao estender trial." };
    }
}

export async function getSystemTemplates() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };
        
        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !(superAdmin.isSuperAdmin === true || (superAdmin as any).isSuperAdmin === 1)) {
            return { success: false, error: "Não autorizado." };
        }

        const templates = await (prisma as any).systemTemplate.findMany({
            orderBy: { createdAt: "desc" }
        });

        return { success: true, templates };
    } catch (error: any) {
        console.error("Error fetching system templates:", error);
        return { success: false, error: "Falha ao buscar templates." };
    }
}

export async function createSystemTemplate(data: { name: string, description?: string, type: string, content: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };
        
        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !(superAdmin.isSuperAdmin === true || (superAdmin as any).isSuperAdmin === 1)) {
            return { success: false, error: "Não autorizado." };
        }

        const template = await (prisma as any).systemTemplate.create({
            data: {
                name: data.name,
                description: data.description,
                type: data.type,
                content: data.content,
                isActive: true
            }
        });

        revalidatePath("/super-admin/settings");
        return { success: true, data: template };
    } catch (error: any) {
        console.error("Error creating system template:", error);
        return { success: false, error: "Falha ao criar template." };
    }
}

export async function updateSystemTemplate(id: string, data: { name?: string, description?: string, type?: string, content?: string, isActive?: boolean }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };
        
        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !(superAdmin.isSuperAdmin === true || (superAdmin as any).isSuperAdmin === 1)) {
            return { success: false, error: "Não autorizado." };
        }

        const template = await (prisma as any).systemTemplate.update({
            where: { id },
            data
        });

        revalidatePath("/super-admin/settings");
        return { success: true, data: template };
    } catch (error: any) {
        console.error("Error updating system template:", error);
        return { success: false, error: "Falha ao atualizar template." };
    }
}

export async function deleteSystemTemplate(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };
        
        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !(superAdmin.isSuperAdmin === true || (superAdmin as any).isSuperAdmin === 1)) {
            return { success: false, error: "Não autorizado." };
        }

        await (prisma as any).systemTemplate.delete({
            where: { id }
        });

        revalidatePath("/super-admin/settings");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting system template:", error);
        return { success: false, error: "Falha ao deletar template." };
    }
}

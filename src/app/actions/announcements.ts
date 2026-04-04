"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getActiveAnnouncements() {
    try {
        const announcements = await prisma.systemAnnouncement.findMany({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, announcements };
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return { success: false, announcements: [] };
    }
}

export async function createAnnouncement(data: { message: string, type?: string, expiresInDays?: number }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !superAdmin.isSuperAdmin) {
            return { success: false, error: "Não autorizado." };
        }

        const expiresAt = data.expiresInDays 
            ? new Date(Date.now() + (data.expiresInDays * 24 * 60 * 60 * 1000))
            : null;

        await prisma.systemAnnouncement.create({
            data: {
                message: data.message,
                type: data.type || "INFO",
                isActive: true,
                expiresAt
            }
        });

        revalidatePath("/super-admin", "layout");
        revalidatePath("/dashboard", "layout");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Falha ao criar o comunicado." };
    }
}

export async function deactivateAnnouncement(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !superAdmin.isSuperAdmin) {
            return { success: false, error: "Não autorizado." };
        }

        await prisma.systemAnnouncement.update({
            where: { id },
            data: { isActive: false }
        });

        revalidatePath("/super-admin", "layout");
        revalidatePath("/dashboard", "layout");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Falha ao inativar o comunicado." };
    }
}

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function generateSmartNotifications(bandId: string) {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // 1. Upcoming gigs in 7 days
    const upcomingGigs = await prisma.gig.findMany({
        where: {
            bandId,
            date: { gte: now, lte: sevenDaysFromNow },
        },
    });

    for (const gig of upcomingGigs) {
        const exists = await (prisma as any).notification.findFirst({
            where: { bandId, type: "GIG_UPCOMING", link: `/dashboard/gigs/${gig.id}` },
        });
        if (!exists) {
            await (prisma as any).notification.create({
                data: {
                    type: "GIG_UPCOMING",
                    message: `Show "${gig.title}" em ${gig.date.toLocaleDateString('pt-BR')}!`,
                    link: `/dashboard/gigs/${gig.id}`,
                    bandId,
                },
            });
        }
    }

    // 2. Expiring documents (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    const expiringDocs = await prisma.document.findMany({
        where: {
            bandId,
            expiryDate: { gte: now, lte: thirtyDaysFromNow },
        },
    });

    for (const doc of expiringDocs) {
        const exists = await (prisma as any).notification.findFirst({
            where: { bandId, type: "DOC_EXPIRING", link: `/dashboard/documents` },
        });
        if (!exists) {
            await (prisma as any).notification.create({
                data: {
                    type: "DOC_EXPIRING",
                    message: `Documento "${doc.title}" vence em ${doc.expiryDate!.toLocaleDateString('pt-BR')}.`,
                    link: `/dashboard/documents`,
                    bandId,
                },
            });
        }
    }

    // 3. Zero stock merch items
    const zeroStockItems = await prisma.merchItem.findMany({
        where: { bandId, stock: 0 },
    });

    for (const item of zeroStockItems) {
        const exists = await (prisma as any).notification.findFirst({
            where: { bandId, type: "STOCK_ZERO", message: { contains: item.name } },
        });
        if (!exists) {
            await (prisma as any).notification.create({
                data: {
                    type: "STOCK_ZERO",
                    message: `"${item.name}" está sem estoque!`,
                    link: `/dashboard/merch`,
                    bandId,
                },
            });
        }
    }
}

export async function markNotificationAsRead(id: string) {
    await (prisma as any).notification.update({
        where: { id },
        data: { isRead: true },
    });
    revalidatePath("/dashboard");
}

export async function markAllNotificationsAsRead(bandId: string) {
    await (prisma as any).notification.updateMany({
        where: { bandId, isRead: false },
        data: { isRead: true },
    });
    revalidatePath("/dashboard");
}

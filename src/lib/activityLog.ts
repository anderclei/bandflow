"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function logActivity(
    action: string,
    entity: string,
    details: string,
    bandId: string,
    entityId?: string
) {
    const session = await auth();
    if (!session?.user?.id) return;

    await (prisma as any).activityLog.create({
        data: {
            action,
            entity,
            entityId,
            details,
            userId: session.user.id,
            bandId,
        },
    });
}

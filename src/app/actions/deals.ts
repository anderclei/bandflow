"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createDeal(bandId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const valueStr = formData.get("value") as string;
    const value = valueStr ? parseFloat(valueStr) : null;
    const status = formData.get("status") as string || "LEAD";
    const contractorIdStr = formData.get("contractorId") as string;
    const contractorId = contractorIdStr === "none" ? null : contractorIdStr;

    if (!title || !bandId) return;

    await prisma.deal.create({
        data: {
            title,
            value,
            status,
            bandId,
            contractorId,
        },
    });

    revalidatePath(`/dashboard/crm/deals`);
}

export async function updateDealStatus(dealId: string, newStatus: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.deal.update({
        where: { id: dealId },
        data: { status: newStatus }
    });

    revalidatePath(`/dashboard/crm/deals`);
}

export async function deleteDeal(dealId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.deal.delete({
        where: { id: dealId },
    });

    revalidatePath(`/dashboard/crm/deals`);
}

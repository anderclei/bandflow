"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getActiveBandId() {
    const cookieStore = await cookies();
    return cookieStore.get("activeBandId")?.value;
}

export async function getLogisticsSuppliers() {
    const bandId = await getActiveBandId();
    if (!bandId) return [];

    return await prisma.logisticsSupplier.findMany({
        where: { bandId },
        orderBy: { createdAt: "desc" }
    });
}

export async function createLogisticsSupplier(data: { name: string; contact?: string; kmValue: number }) {
    const bandId = await getActiveBandId();
    if (!bandId) throw new Error("No active band selected");

    const supplier = await prisma.logisticsSupplier.create({
        data: {
            name: data.name,
            contact: data.contact || null,
            kmValue: data.kmValue,
            bandId
        }
    });

    revalidatePath("/dashboard/logistics/suppliers");
    return { success: true, supplier };
}

export async function updateLogisticsSupplier(id: string, data: { name?: string; contact?: string; kmValue?: number }) {
    const bandId = await getActiveBandId();
    if (!bandId) throw new Error("No active band selected");

    const supplier = await prisma.logisticsSupplier.updateMany({
        where: { id, bandId },
        data
    });

    revalidatePath("/dashboard/logistics/suppliers");
    return { success: true };
}

export async function deleteLogisticsSupplier(id: string) {
    const bandId = await getActiveBandId();
    if (!bandId) throw new Error("No active band selected");

    await prisma.logisticsSupplier.deleteMany({
        where: { id, bandId }
    });

    revalidatePath("/dashboard/logistics/suppliers");
    return { success: true };
}

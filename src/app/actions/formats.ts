"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createShowFormat(bandId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const basePriceStr = formData.get("basePrice") as string;
    const basePrice = basePriceStr ? parseFloat(basePriceStr) : null;

    if (!name || !bandId) return;

    await prisma.showFormat.create({
        data: {
            name,
            description,
            basePrice,
            bandId,
        },
    });

    revalidatePath(`/dashboard/settings/formats`);
    revalidatePath(`/dashboard/settings`);
}

export async function deleteShowFormat(formatId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.showFormat.delete({
        where: { id: formatId },
    });

    revalidatePath(`/dashboard/settings/formats`);
    revalidatePath(`/dashboard/settings`);
}

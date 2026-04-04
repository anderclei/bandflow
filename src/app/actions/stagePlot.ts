"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateStagePlot(formatId: string, plotJson: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.showFormat.update({
        where: { id: formatId },
        data: { stagePlot: plotJson }
    });

    revalidatePath(`/dashboard/settings/formats/${formatId}/stage-plot`);
    revalidatePath("/dashboard/settings/formats");
    revalidatePath("/dashboard/inventory"); // Since Rider Technical PDF uses this

    return { success: true };
}

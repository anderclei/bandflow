"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateContractStatus(contractId: string, status: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.generatedContract.update({
        where: { id: contractId },
        data: { status }
    });

    revalidatePath("/dashboard/contracts");
    return { success: true };
}

export async function deleteContract(contractId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.generatedContract.delete({
        where: { id: contractId }
    });

    revalidatePath("/dashboard/contracts");
    return { success: true };
}

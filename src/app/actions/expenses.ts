"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activityLog";

export async function createExpense(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const date = new Date(formData.get("date") as string);
    const category = formData.get("category") as string;

    const membership = await prisma.member.findFirst({
        where: { userId: session.user.id },
    });

    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Only administrators can manage group finances");
    }

    await (prisma as any).expense.create({
        data: {
            description,
            amount,
            date,
            category,
            bandId: membership.bandId,
        },
    });

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");
    await logActivity("CREATED", "EXPENSE", `Despesa "${description}" de R$${amount}`, membership.bandId);
}

export async function deleteExpense(expenseId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await (prisma as any).expense.delete({
        where: { id: expenseId },
    });

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");
    const membership = await prisma.member.findFirst({ where: { userId: session.user.id } });
    if (membership) await logActivity("DELETED", "EXPENSE", `Despesa removida`, membership.bandId);
}

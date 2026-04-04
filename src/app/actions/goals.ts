"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const targetValue = parseFloat(formData.get("targetValue") as string);
    const unit = (formData.get("unit") as string) || "BRL";
    const deadlineStr = formData.get("deadline") as string;
    const deadline = deadlineStr ? new Date(deadlineStr) : null;
    const bandId = formData.get("bandId") as string;

    await (prisma as any).goal.create({
        data: { title, targetValue, unit, deadline, bandId },
    });

    revalidatePath("/dashboard");
}

export async function updateGoalProgress(formData: FormData) {
    const id = formData.get("id") as string;
    const currentValue = parseFloat(formData.get("currentValue") as string);

    await (prisma as any).goal.update({
        where: { id },
        data: { currentValue },
    });

    revalidatePath("/dashboard");
}

export async function deleteGoal(id: string) {
    await (prisma as any).goal.delete({ where: { id } });
    revalidatePath("/dashboard");
}

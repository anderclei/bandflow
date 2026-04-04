"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateMemberFees(gigId: string, feesData: { memberId: string, amount: number, isPaid: boolean }[]) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Process all fees inside a transaction for safety
    await prisma.$transaction(async (tx) => {
        for (const data of feesData) {
            await tx.memberGigFee.upsert({
                where: {
                    gigId_memberId: {
                        gigId,
                        memberId: data.memberId
                    }
                },
                update: {
                    amount: data.amount,
                    isPaid: data.isPaid
                },
                create: {
                    gigId,
                    memberId: data.memberId,
                    amount: data.amount,
                    isPaid: data.isPaid
                }
            });
        }
    });

    revalidatePath(`/dashboard/gigs/${gigId}`);
    revalidatePath("/dashboard/finance");
}

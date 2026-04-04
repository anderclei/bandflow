"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveBand } from "@/lib/getActiveBand";

export async function updateSongPublishing(formData: FormData) {
    const songId = formData.get("songId") as string;
    const isrc = formData.get("isrc") as string;
    const iswc = formData.get("iswc") as string;

    await prisma.song.update({
        where: { id: songId },
        data: { isrc, iswc },
    });

    revalidatePath("/dashboard/publishing");
    revalidatePath("/dashboard/songs");
}

export async function createRoyaltySplit(formData: FormData) {
    const songId = formData.get("songId") as string;
    const memberId = formData.get("memberId") as string;
    const percentage = parseFloat(formData.get("percentage") as string);
    const role = formData.get("role") as string;

    await prisma.royaltySplit.create({
        data: {
            songId,
            memberId,
            percentage,
            role,
        },
    });

    revalidatePath("/dashboard/publishing");
}

export async function deleteRoyaltySplit(id: string) {
    await prisma.royaltySplit.delete({
        where: { id },
    });

    revalidatePath("/dashboard/publishing");
}

export async function recordRoyaltyPayment(formData: FormData) {
    const songId = formData.get("songId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const date = new Date(formData.get("date") as string);
    const source = formData.get("source") as string;

    await prisma.royaltyPayment.create({
        data: {
            songId,
            amount,
            date,
            source,
        },
    });

    revalidatePath("/dashboard/publishing");
}

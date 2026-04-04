"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createSong(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const durationStr = formData.get("duration") as string;
    const duration = durationStr ? parseInt(durationStr) : null;
    const fileUrl = formData.get("fileUrl") as string;
    const key = formData.get("key") as string;
    const status = formData.get("status") as string || "READY";
    const bpmStr = formData.get("bpm") as string;
    const bpm = bpmStr ? parseInt(bpmStr) : null;
    const iswc = formData.get("iswc") as string;
    const workId = formData.get("workId") as string;

    // Find the user's band
    const membership = await prisma.member.findFirst({
        where: { userId: session.user.id },
    });

    if (!membership) throw new Error("No band found for this user");

    await prisma.song.create({
        data: {
            title,
            artist,
            duration,
            bpm,
            key,
            status,
            iswc,
            workId,
            bandId: membership.bandId,
            ...(fileUrl ? { fileUrl } : {}),
        },
    });

    revalidatePath("/dashboard/songs");
}

export async function deleteSong(songId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.song.delete({
        where: { id: songId },
    });

    revalidatePath("/dashboard/songs");
}

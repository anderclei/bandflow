"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createSetlist(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;

    const membership = await prisma.member.findFirst({
        where: { userId: session.user.id },
    });

    if (!membership) throw new Error("No band found");

    await prisma.setlist.create({
        data: {
            title,
            bandId: membership.bandId,
        },
    });

    revalidatePath("/dashboard/setlists");
}

export async function updateSetlistItems(setlistId: string, items: { songId: string; position: number }[]) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.$transaction([
        prisma.setlistItem.deleteMany({ where: { setlistId } }),
        prisma.setlistItem.createMany({
            data: items.map(item => ({
                setlistId,
                songId: item.songId,
                position: item.position,
            })),
        }),
    ]);

    revalidatePath("/dashboard/setlists");
}

export async function deleteSetlist(setlistId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.setlist.delete({
        where: { id: setlistId },
    });

    revalidatePath("/dashboard/setlists");
}

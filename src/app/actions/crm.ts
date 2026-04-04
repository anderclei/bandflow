"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createContractor(bandId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const document = formData.get("document") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const notes = formData.get("notes") as string;

    if (!name || !bandId) return;

    await prisma.contractor.create({
        data: {
            name,
            document,
            email,
            phone,
            city,
            state,
            notes,
            bandId,
        },
    });

    revalidatePath(`/dashboard/crm/contractors`);
}

export async function deleteContractor(contractorId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.contractor.delete({
        where: { id: contractorId },
    });

    revalidatePath(`/dashboard/crm/contractors`);
}

export async function getRehiringRecommendations(bandId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

    const contractors = await prisma.contractor.findMany({
        where: { bandId },
        include: {
            gigs: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    });

    const recommendations = contractors.filter(contractor => {
        const lastGig = contractor.gigs[0];
        if (!lastGig) return false; // NUNCA contrataram, talvez marketing? Mas foquemos em RE-contratação

        const lastGigDate = new Date(lastGig.date);
        return lastGigDate < sixMonthsAgo;
    }).map(c => ({
        id: c.id,
        name: c.name,
        lastGigDate: c.gigs[0].date,
        email: c.email,
        phone: c.phone
    }));

    return recommendations;
}

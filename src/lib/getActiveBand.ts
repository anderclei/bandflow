import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { trackActivity } from "@/lib/telemetry";

export async function getActiveBand(include?: any) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const memberships = await prisma.member.findMany({
        where: { userId: session.user.id },
        include: {
            band: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    imageUrl: true,
                    primaryColor: true,
                    secondaryColor: true,
                    type: true,
                    subscriptionPlan: true,
                } as any

            }
        },
    });


    const cookieStore = await cookies();
    const activeBandId = cookieStore.get("activeBandId")?.value;

    // Core logic for regular users or members
    let activeMembership: any = memberships.find((m) => m.bandId === activeBandId) || memberships[0];

    // Super Admin Impersonation Logic
    // If user is super admin and has a cookie for a band, allow access even if not a member
    // @ts-ignore - isSuperAdmin is added to session in auth.ts
    if (session.user.isSuperAdmin && activeBandId && !memberships.some(m => m.bandId === activeBandId)) {
        const targetBand = await prisma.band.findUnique({
            where: { id: activeBandId },
            select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                primaryColor: true,
                secondaryColor: true,
                type: true,
                subscriptionPlan: true,
            } as any

        });



        if (targetBand) {
            // Create a virtual membership for the super admin
            const virtualMembership = {
                id: "sa-virtual",
                userId: session.user.id,
                bandId: activeBandId,
                role: "ADMIN" as const,
                band: targetBand,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            activeMembership = virtualMembership as any;
        }
    }

    if (!activeMembership) {
        return { memberships: [], band: null, membership: null };
    }

    let fullBand = activeMembership.band;
    if (include && fullBand?.id) {
        fullBand = await prisma.band.findUnique({
            where: { id: fullBand.id },
            include: typeof include === 'object' ? include : undefined
        }) as any;
    }

    // Telemetria: Rastrear atividade se for um acesso real (membro)
    if (activeMembership && activeMembership.id !== "sa-virtual") {
        // Run in background (don't await to avoid blocking render)
        trackActivity(activeMembership.bandId).catch(console.error);
    }

    return {
        memberships,
        band: fullBand,
        activeBandId: activeMembership.bandId,
        membership: activeMembership,
        session
    };
}

// Rebuild trigger for Prisma Client V7 sync

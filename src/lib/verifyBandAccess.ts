import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function verifyBandAccess(requiredRole?: "ADMIN" | "MEMBER") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const cookieStore = await cookies();
    const activeBandId = cookieStore.get("activeBandId")?.value;

    if (!activeBandId) throw new Error("Nenhuma banda ativa selecionada");

    const membership = await prisma.member.findUnique({
        where: {
            userId_bandId: {
                userId: session.user.id,
                bandId: activeBandId,
            }
        }
    });

    // @ts-ignore - Super Admin check
    if (session.user.isSuperAdmin === true || session.user.isSuperAdmin === 1) {
        return { bandId: activeBandId, membership: { role: "ADMIN" } as any, session };
    }

    if (!membership) {
        throw new Error("Acesso negado: Você não é membro desta banda");
    }

    if (requiredRole === "ADMIN" && membership.role !== "ADMIN") {
        throw new Error("Acesso restrito a administradores");
    }

    const band = await prisma.band.findUnique({
        where: { id: activeBandId },
        select: { subscriptionPlan: true }
    });

    return { bandId: activeBandId, membership, session, plan: band?.subscriptionPlan || "ESSENTIAL" };
}

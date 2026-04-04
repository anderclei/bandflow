"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getGlobalAuditLogs() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado" };

        const selfUser = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!selfUser?.isSuperAdmin && (selfUser as any).isSuperAdmin !== 1) {
            return { success: false, error: "Sem permissão global" };
        }

        // Buscando todos os logs e trazendo infos formatadas com raw SQL ou prisma relations
        // Como AuditLog atual não tem relation definida c/ User e Band (tem userId/targetId genérico), 
        // Vamos formatar na mão pegando infos auxiliares.
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50 // Limitando p/ performance
        });

        // Mapping auxiliares:
        const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))] as string[];
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true }
        });
        const userMap = Object.fromEntries(users.map(u => [u.id, u.name || u.email]));

        const bandIds = [...new Set(logs.map(l => l.targetId).filter(id => id && logs.find(log => log.targetId === id && log.targetType === 'BAND')))] as string[];
        const bands = await prisma.band.findMany({
            where: { id: { in: bandIds } },
            select: { id: true, name: true }
        });
        const bandMap = Object.fromEntries(bands.map(b => [b.id, b.name]));

        const formattedLogs = logs.map(log => ({
            ...log,
            userName: log.userId ? userMap[log.userId] || "Sistema/Desconhecido" : "Sistema Automático",
            targetName: log.targetId && log.targetType === 'BAND' ? bandMap[log.targetId] || log.targetId : log.targetId
        }));

        return { success: true, logs: formattedLogs };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao buscar logs de auditoria" };
    }
}

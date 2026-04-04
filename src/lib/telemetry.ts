import { prisma } from "./prisma";

export type EngagementStatus = 'GREEN' | 'YELLOW' | 'RED';

/**
 * Atualiza o timestamp de atividade da banda e recalcula a pontuação de saúde.
 * Deve ser chamado em ações chave do dashboard.
 */
export async function trackActivity(bandId: string) {
    try {
        const now = new Date();

        // Atualiza a data da última atividade
        await (prisma as any).band.update({
            where: { id: bandId },
            data: { lastActivityAt: now }
        });

        // Recalcula a saúde (score de 0 a 100)
        // Lógica simples: 
        // - Inatividade > 7 dias: RED
        // - Inatividade > 3 dias: YELLOW
        // - Uso frequente: GREEN
        await refreshBandHealth(bandId);

    } catch (error) {
        console.error("Telemetry Error:", error);
    }
}

/**
 * Calcula a saúde da banda baseada em logs de atividade e volume de dados.
 */
export async function refreshBandHealth(bandId: string) {
    const band = await prisma.band.findUnique({
        where: { id: bandId },
        select: {
            lastActivityAt: true,
            _count: {
                select: {
                    gigs: true,
                    expenses: true,
                    members: true,
                    activityLogs: true
                }
            }
        }
    });

    if (!band) return;

    let score = 100;
    let status: EngagementStatus = 'GREEN';

    const lastActivity = band.lastActivityAt ? new Date(band.lastActivityAt) : new Date(0);
    const daysInactive = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 3600 * 24));

    // Dedução por inatividade
    if (daysInactive > 14) {
        score -= 60;
        status = 'RED';
    } else if (daysInactive > 7) {
        score -= 40;
        status = 'RED';
    } else if (daysInactive > 3) {
        score -= 20;
        status = 'YELLOW';
    }

    // Bônus/Penalidade por volume de dados (Uso real)
    if (band._count.gigs === 0) score -= 10;
    if (band._count.activityLogs < 5) score -= 10;

    // Garantir limites
    score = Math.max(0, Math.min(100, score));

    // Refinar status pelo score final
    if (score < 40) status = 'RED';
    else if (score < 75) status = 'YELLOW';
    else status = 'GREEN';

    await (prisma as any).band.update({
        where: { id: bandId },
        data: { usageScore: score, usageStatus: status }
    });
}

/**
 * Retorna um sumário de telemetria para o SuperAdmin
 */
export async function getBandTelemetry(bandId: string) {
    const band = await prisma.band.findUnique({
        where: { id: bandId },
        include: {
            _count: true
        }
    });

    if (!band) return null;

    return {
        score: band.usageScore,
        status: band.usageStatus,
        lastActivity: band.lastActivityAt,
        counts: band._count
    };
}

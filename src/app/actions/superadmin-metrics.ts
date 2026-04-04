"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth";

export async function getSuperAdminMetrics() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const superAdmin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!superAdmin || !superAdmin.isSuperAdmin) return { success: false, error: "Não autorizado." };

        const metrics = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                COUNT(*) as "totalBands",
                SUM(CASE WHEN "subscriptionStatus" = 'ACTIVE' THEN 1 ELSE 0 END) as "activeSubscriptions",
                SUM(CASE WHEN "subscriptionStatus" = 'OVERDUE' OR "subscriptionStatus" = 'SUSPENDED' THEN 1 ELSE 0 END) as "defaultSubscriptions",
                SUM(CASE WHEN "subscriptionStatus" = 'CANCELED' THEN 1 ELSE 0 END) as "canceledSubscriptions",
                
                -- MRR Simulado (Plano PRO = R$ 49,90, PREMIUM = R$ 99,90) 
                SUM(
                    CASE 
                        WHEN "subscriptionStatus" = 'ACTIVE' AND "subscriptionPlan" = 'PREMIUM' THEN 99.90
                        WHEN "subscriptionStatus" = 'ACTIVE' AND "subscriptionPlan" = 'PRO' THEN 49.90
                        ELSE 0 
                    END
                ) as "estimatedMrr"
            FROM "Band"
            WHERE type = 'BANDA' OR type = 'OFFICE'
        `);

        const atRiskBands = await prisma.band.findMany({
            where: {
                usageStatus: { in: ['RED', 'YELLOW'] },
                subscriptionStatus: { not: 'CANCELED' }
            },
            select: {
                id: true,
                name: true,
                usageStatus: true,
                usageScore: true,
                lastActivityAt: true,
                subscriptionPlan: true
            },
            orderBy: { usageScore: 'asc' },
            take: 5
        });

        // SQL returns BigInt for counts which can't be JSON serialized easily
        return {
            success: true,
            metrics: {
                totalBands: Number(metrics[0]?.totalBands || 0),
                activeSubscriptions: Number(metrics[0]?.activeSubscriptions || 0),
                defaultSubscriptions: Number(metrics[0]?.defaultSubscriptions || 0),
                canceledSubscriptions: Number(metrics[0]?.canceledSubscriptions || 0),
                estimatedMrr: Number(metrics[0]?.estimatedMrr || 0)
            },
            atRiskBands
        };
    } catch (error) {
        console.error("Error fetching financial metrics:", error);
        return { success: false, error: "Erro ao buscar métricas financeiras." };
    }
}

export async function getRecentBands() {
    try {
        const bands = await prisma.band.findMany({
            where: { type: 'BANDA' },
            orderBy: { createdAt: 'desc' },
            take: 6,
            select: {
                id: true,
                name: true,
                createdAt: true,
                subscriptionPlan: true,
                subscriptionStatus: true,
                usageScore: true
            }
        });
        return { success: true, bands };
    } catch (e) {
        return { success: false, bands: [] };
    }
}

export async function getTopEngagedBands() {
    try {
        const bands = await prisma.band.findMany({
            where: { type: 'BANDA', subscriptionStatus: 'ACTIVE' },
            orderBy: { usageScore: 'desc' },
            take: 6,
            select: {
                id: true,
                name: true,
                usageScore: true,
                subscriptionPlan: true,
                lastActivityAt: true
            }
        });
        return { success: true, bands };
    } catch (e) {
        return { success: false, bands: [] };
    }
}

export async function getRecentAuditLogs() {
    try {
        const subscriptionLogs = await prisma.subscriptionLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { band: { select: { name: true } } }
        });
        const webhooks = await prisma.webhookEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        return { success: true, subscriptionLogs, webhooks };
    } catch (e) {
        return { success: false, subscriptionLogs: [], webhooks: [] };
    }
}

export async function getHistoricalMRR(currentMrr: number) {
    // Retorna um mock de 6 meses baseado no MRR atual para visualização,
    // já que o banco pode não ter histórico de 6 meses de SubscriptionLogs real.
    const data = [];
    const months = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'];
    
    // Simula um crescimento de 5 a 15% ao mês para trás
    let mrr = currentMrr;
    let users = Math.floor(mrr / 70); // avg plan
    
    for (let i = 5; i >= 0; i--) {
        data.unshift({
            name: months[i],
            mrr: Math.round(mrr),
            ativos: users,
            churn: Math.floor(Math.random() * 3)
        });
        // reverte o crescimento
        const growth = 1 + (Math.random() * 0.15 + 0.05);
        mrr = mrr / growth;
        users = Math.floor(users / growth);
    }
    
    return { success: true, data };
}

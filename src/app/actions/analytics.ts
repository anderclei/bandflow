"use server";

import { prisma } from "@/lib/prisma";

export async function getBIAnalytics(bandId: string) {
    try {
        const gigs = await prisma.gig.findMany({
            where: { bandId },
            include: {
                expenses: true,
                memberFees: true,
                format: true,
                contractor: true,
            }
        });

        const cityStats: Record<string, { revenue: number, netProfit: number, count: number }> = {};
        const formatStats: Record<string, { revenue: number, netProfit: number, count: number }> = {};
        const contractorStats: Record<string, { revenue: number, netProfit: number, count: number, name: string }> = {};

        gigs.forEach((gig: any) => {
            const fee = gig.fee || 0;
            const taxes = gig.taxAmount || (fee * (gig.taxRate || 0) / 100);
            const expenses = (gig.expenses || []).reduce((sum: number, e: any) => sum + e.amount, 0);
            const commission = (fee * (gig.commissionRate || 0) / 100);
            const memberFees = (gig.memberFees || []).reduce((sum: number, f: any) => sum + f.amount, 0);

            const netProfit = fee - taxes - expenses - commission - memberFees;

            // City Stats
            const city = gig.location?.split(',')?.pop()?.trim() || "Desconhecido";
            if (!cityStats[city]) cityStats[city] = { revenue: 0, netProfit: 0, count: 0 };
            cityStats[city].revenue += fee;
            cityStats[city].netProfit += netProfit;
            cityStats[city].count += 1;

            // Format Stats
            const format = gig.format?.name || "Padrão";
            if (!formatStats[format]) formatStats[format] = { revenue: 0, netProfit: 0, count: 0 };
            formatStats[format].revenue += fee;
            formatStats[format].netProfit += netProfit;
            formatStats[format].count += 1;

            // Contractor Stats
            const contractorId = gig.contractorId || "Avulso";
            const contractorName = gig.contractor?.name || "Avulso";
            if (!contractorStats[contractorId]) contractorStats[contractorId] = { revenue: 0, netProfit: 0, count: 0, name: contractorName };
            contractorStats[contractorId].revenue += fee;
            contractorStats[contractorId].netProfit += netProfit;
            contractorStats[contractorId].count += 1;
        });

        // Convert to sorted arrays (Top 5)
        const topCities = Object.entries(cityStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.netProfit - a.netProfit)
            .slice(0, 5);

        const topFormats = Object.entries(formatStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.netProfit - a.netProfit)
            .slice(0, 5);

        const topContractors = Object.values(contractorStats)
            .sort((a, b) => b.netProfit - a.netProfit)
            .slice(0, 5);

        return {
            success: true,
            data: {
                topCities,
                topFormats,
                topContractors
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getCommercialFunnel(bandId: string) {
    try {
        const deals = await prisma.deal.findMany({
            where: { bandId }
        });

        const stats = {
            LEAD: 0,
            NEGOTIATING: 0,
            WON: 0,
            LOST: 0,
            totalValue: 0,
            wonValue: 0,
            count: deals.length
        };

        deals.forEach(deal => {
            const status = deal.status as keyof typeof stats;
            if (stats[status] !== undefined) {
                (stats as any)[status] += 1;
            }
            if (deal.value) {
                stats.totalValue += deal.value;
                if (deal.status === 'WON') {
                    stats.wonValue += deal.value;
                }
            }
        });

        const conversionRate = deals.length > 0 ? (stats.WON / deals.length) * 100 : 0;
        const averageTicket = stats.WON > 0 ? stats.wonValue / stats.WON : 0;

        return {
            success: true,
            data: {
                ...stats,
                conversionRate,
                averageTicket
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getGeographicDistribution(bandId: string) {
    try {
        const gigs = await prisma.gig.findMany({
            where: { bandId },
            select: { location: true, fee: true }
        });

        const stateDistribution: Record<string, number> = {};

        gigs.forEach(gig => {
            const parts = gig.location?.split(',') || [];
            if (parts.length >= 2) {
                const state = parts[parts.length - 1].trim().toUpperCase();
                if (state.length === 2) { // Logic for Brazilian States like SP, RJ, etc.
                    stateDistribution[state] = (stateDistribution[state] || 0) + 1;
                }
            }
        });

        return { success: true, data: stateDistribution };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

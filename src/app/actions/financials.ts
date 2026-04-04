"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { financeRepository } from "@/lib/repositories/finance";
import { TransactionSchema, GigExpensesSchema } from "./schemas";
import { getDistanceBetweenCities } from "@/lib/distance";
import { z } from "zod";

/**
 * Updates Gig Expenses (Syncing)
 */
export const updateGigExpenses = createSafeAction(
  GigExpensesSchema,
  async ({ gigId, expenses }) => {
    await financeRepository.syncGigExpenses(gigId, expenses);
    revalidatePath(`/dashboard/gigs/${gigId}`);
    return { success: true };
  }
);

/**
 * Calculates Freight and adds as a Gig Expense
 */
export const calculateFreight = createSafeAction(
  z.object({ gigId: z.string(), supplierId: z.string() }),
  async ({ gigId, supplierId }) => {
    const supplier = await financeRepository.findSupplierById(supplierId);
    if (!supplier) throw new Error("Fornecedor não encontrado.");

    // This logic relies on specific band/gig details being fetched inside the repo or here
    // In this V2 refactor, we still keep some logic here for safety
    const gig = await (financeRepository as any).prisma.gig.findUnique({
      where: { id: gigId },
      include: { band: true }
    });

    if (!gig || !gig.band) throw new Error("Gig ou Banda não encontrada.");

    const bandCity = (gig.band as any).addressCity;
    const gigLocation = gig.location;

    if (!bandCity || !gigLocation) throw new Error("Cidade da banda ou local do show não definidos.");

    const distanceKm = await getDistanceBetweenCities(bandCity, gigLocation);
    if (distanceKm === null) throw new Error("Não foi possível calcular a distância.");

    const amount = distanceKm * supplier.kmValue;
    const description = `Frete: ${supplier.name} (${distanceKm.toFixed(0)}km)`;

    await financeRepository.updateOrCreateFreight(gigId, { description, amount });

    revalidatePath(`/dashboard/gigs/${gigId}`);
    return { distanceKm, amount, supplierName: supplier.name };
  }
);

/**
 * Manages Financial Transactions (Cash Flow)
 */
export const manageTransaction = createSafeAction(
  TransactionSchema,
  async (data, { bandId }) => {
    await financeRepository.upsertTransaction(data, bandId);
    revalidatePath('/dashboard/finance');
    return { success: true };
  }
);

/**
 * DRE & Analytics Fetching & Calculation
 */
export const getDREAnalytics = createSafeAction(
  z.object({ startDate: z.date(), endDate: z.date() }),
  async ({ startDate, endDate }, { bandId }) => {
    const gigs = await financeRepository.getGigsForAnalytics(bandId, startDate, endDate);

    // Migration of legacy aggregation logic
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalTaxes = 0;
    let totalCommissions = 0;
    let totalMemberFees = 0;

    const cityStats: Record<string, number> = {};
    const formatStats: Record<string, number> = {};

    gigs.forEach((gig: any) => {
      const fee = gig.fee || 0;
      totalRevenue += fee;

      const gigExpenseTotal = (gig.expenses || []).reduce((sum: number, e: any) => sum + e.amount, 0);
      totalExpenses += gigExpenseTotal;

      const tax = gig.taxAmount || (fee * (gig.taxRate || 0) / 100);
      totalTaxes += tax;

      const commission = (fee * (gig.commissionRate || 0) / 100);
      totalCommissions += commission;

      const membersTotal = (gig.memberFees || []).reduce((sum: number, f: any) => sum + f.amount, 0);
      totalMemberFees += membersTotal;

      const city = gig.location?.split(',')?.pop()?.trim() || "Desconhecido";
      cityStats[city] = (cityStats[city] || 0) + (fee - tax - gigExpenseTotal - commission);

      const format = gig.format?.name || "Padrão";
      formatStats[format] = (formatStats[format] || 0) + (fee - tax - gigExpenseTotal - commission);
    });

    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      taxes: totalTaxes,
      commissions: totalCommissions,
      memberFees: totalMemberFees,
      netProfit: totalRevenue - totalExpenses - totalTaxes - totalCommissions - totalMemberFees,
      cityStats,
      formatStats,
      gigCount: gigs.length
    };
  }
);

/**
 * Fetch Cash Flow transactions
 */
export async function getCashFlow(bandId: string) {
  const transactions = await financeRepository.findTransactions(bandId);
  return { transactions };
}



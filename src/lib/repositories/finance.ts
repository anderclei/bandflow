import { prisma } from "@/lib/prisma";

export class FinanceRepository {
  /**
   * Sync Gig Expenses (Delete all and recreate - V1 Strategy)
   */
  async syncGigExpenses(gigId: string, expenses: any[]) {
    return prisma.$transaction([
      (prisma as any).gigExpense.deleteMany({ where: { gigId } }),
      (prisma as any).gigExpense.createMany({
        data: expenses.map(e => ({
          description: e.description,
          amount: e.amount,
          category: e.category,
          gigId
        }))
      })
    ]);
  }

  /**
   * Manage Logistics Supplier (for freight calculation)
   */
  async findSupplierById(supplierId: string) {
    return (prisma as any).logisticsSupplier.findUnique({
      where: { id: supplierId }
    });
  }

  /**
   * Find or Create Freight Expense
   */
  async updateOrCreateFreight(gigId: string, details: { description: string, amount: number }) {
    const existing = await (prisma as any).gigExpense.findFirst({
      where: {
        gigId,
        description: { contains: "Frete" }
      }
    });

    if (existing) {
      return (prisma as any).gigExpense.update({
        where: { id: existing.id },
        data: {
          amount: details.amount,
          description: details.description
        }
      });
    } else {
      return (prisma as any).gigExpense.create({
        data: {
          gigId,
          description: details.description,
          amount: details.amount,
          category: "TRANSPORT"
        }
      });
    }
  }

  /**
   * Financial Transactions (Cash Flow)
   */
  async upsertTransaction(data: any, bandId: string) {
    if (data.id) {
      const { id, ...updateData } = data;
      return prisma.financialTransaction.update({
        where: { id },
        data: updateData
      });
    } else {
      return (prisma as any).financialTransaction.create({
        data: { ...data, bandId }
      });
    }
  }

  async findTransactions(bandId: string) {
    return (prisma as any).financialTransaction.findMany({
      where: { bandId },
      orderBy: { dueDate: 'asc' }
    });
  }

  /**
   * Fetch data for DRE Analytics
   */
  async getGigsForAnalytics(bandId: string, startDate: Date, endDate: Date) {
    return prisma.gig.findMany({
      where: {
        bandId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        expenses: true,
        memberFees: true,
        format: true
      }
    });
  }
}

export const financeRepository = new FinanceRepository();

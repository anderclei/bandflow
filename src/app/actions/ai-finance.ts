"use server"

import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// Schema para a resposta estruturada da IA
const FinanceAnalysisSchema = z.object({
    summary: z.string().describe("Um resumo executivo da saúde financeira da banda"),
    kpis: z.array(z.object({
        label: z.string(),
        value: z.string(),
        trend: z.enum(["up", "down", "stable"]),
        description: z.string()
    })).describe("Principais indicadores de performance financeira"),
    insights: z.array(z.string()).describe("Dicas estratégicas e observações sobre os dados"),
    chartData: z.array(z.object({
        name: z.string(),
        receita: z.number(),
        despesa: z.number(),
        lucro: z.number()
    })).describe("Dados formatados para um gráfico de barras Comparativo"),
    recommendations: z.array(z.object({
        title: z.string(),
        priority: z.enum(["high", "medium", "low"]),
        action: z.string()
    })).describe("Ações recomendadas para melhorar o lucro")
});

export async function getAIFinanceAnalysis() {
    const { band } = await getActiveBand();
    if (!band) throw new Error("Banda não encontrada");

    // 1. Buscar Dados dos últimos 90 dias
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    const [gigs, expenses, merchSales] = await Promise.all([
        prisma.gig.findMany({
            where: { bandId: band.id, date: { gte: threeMonthsAgo } },
            select: { fee: true, taxRate: true, taxAmount: true, date: true, title: true }
        }),
        prisma.expense.findMany({
            where: { bandId: band.id, date: { gte: threeMonthsAgo } },
            select: { amount: true, category: true, date: true, description: true }
        }),
        prisma.merchSale.findMany({
            where: { bandId: band.id, date: { gte: threeMonthsAgo } },
            include: { items: { include: { item: true } } }
        })
    ]);

    // 2. Preparar contexto para a IA
    const context = {
        bandName: band.name,
        period: "Últimos 90 dias",
        gigs: gigs.map(g => ({
            title: g.title,
            date: g.date.toISOString().split('T')[0],
            bruto: g.fee || 0,
            imposto: (g.fee || 0) * ((g.taxRate || 0) / 100) + (g.taxAmount || 0)
        })),
        expenses: expenses.map(e => ({
            desc: e.description,
            amount: e.amount,
            cat: e.category,
            date: e.date.toISOString().split('T')[0]
        })),
        merch: merchSales.map(s => ({
            total: s.totalAmount,
            items: s.items.map(i => ({ name: i.item.name, qty: i.quantity, unitPrice: i.unitPrice }))
        }))
    };

    try {
        // 3. Chamar a IA (Usando gpt-4o-mini para eficiência ou gpt-4o para precisão)
        const { object } = await generateObject({
            model: openai("gpt-4o-mini"),
            schema: FinanceAnalysisSchema,
            system: `Você é um Analista de BI especializado no Mercado Musical (Music Business). 
            Analise os dados financeiros da banda e forneça um relatório estratégico.
            Seja crítico, identifique onde a banda está perdendo dinheiro e onde pode escalar.
            Considere que 'Lucro' é (Receita de shows + Vendas Merch) - (Impostos + Despesas).`,
            prompt: `Analise os seguintes dados financeiros dos últimos 90 dias da banda ${band.name}: ${JSON.stringify(context)}`,
        });

        return { success: true, analysis: object };
    } catch (error) {
        console.error("Erro na análise financeira IA:", error);
        return { success: false, error: "Não foi possível gerar a análise no momento." };
    }
}

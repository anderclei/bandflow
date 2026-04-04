import { NextRequest, NextResponse } from "next/server";
import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bandId } = await context.params;

        // Security check
        const { band } = await getActiveBand();
        if (!band || band.id !== bandId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch data
        const [gigs, expenses] = await Promise.all([
            prisma.gig.findMany({
                where: { bandId },
                include: { memberFees: { include: { member: { include: { user: true } } } } },
                orderBy: { date: 'asc' }
            }),
            prisma.expense.findMany({
                where: { bandId },
                orderBy: { date: 'asc' }
            })
        ]);

        let csv = "Data,Tipo,Descricao,Categoria,Valor Bruto,Pago/Recebido\n";

        // Gigs (Income)
        gigs.forEach(gig => {
            const dateStr = new Date(gig.date).toLocaleDateString('pt-BR');
            const type = "Entrada (Show)";
            const desc = `"${gig.title} - ${gig.location || 'Sem local'}"`;
            const value = gig.fee || 0;
            csv += `${dateStr},${type},${desc},Cachê,${value.toFixed(2)},Sim\n`;

            // Member Fees (Sub-expenses)
            // @ts-ignore
            gig.memberFees.forEach((fee: any) => {
                const userName = fee.member.user.name || fee.member.user.email || "Membro";
                csv += `${dateStr},Saída (Rateio),Rateio: ${userName} (${gig.title}),Pessoal,-${fee.amount.toFixed(2)},${fee.isPaid ? 'Sim' : 'Não'}\n`;
            });
        });

        // Expenses
        expenses.forEach(exp => {
            const dateStr = new Date(exp.date).toLocaleDateString('pt-BR');
            const type = "Saída (Despesa)";
            const desc = `"${exp.description}"`;
            const cat = exp.category || "Geral";
            const value = exp.amount;
            csv += `${dateStr},${type},${desc},${cat},-${value.toFixed(2)},Sim\n`;
        });

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="relatorio-financeiro-${band.slug}.csv"`
            }
        });
    } catch (error) {
        console.error("Erro exportando CSV", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

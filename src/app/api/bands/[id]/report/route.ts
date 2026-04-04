import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import jsPDF from "jspdf";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bandId } = await params;

    const band = await prisma.band.findUnique({
        where: { id: bandId },
        include: {
            gigs: { orderBy: { date: 'desc' }, take: 50 },
            expenses: { orderBy: { date: 'desc' }, take: 50 },
            merchSales: true,
            songs: { include: { payments: true } },
            equipment: true,
        },
    });

    if (!band) {
        return NextResponse.json({ error: "Band not found" }, { status: 404 });
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`Relatório Mensal - ${band.name}`, 14, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 33);

    doc.setDrawColor(200);
    doc.line(14, 37, pageWidth - 14, 37);

    let yPos = 45;

    // Section 1: KPIs
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo Executivo", 14, yPos);
    yPos += 10;

    const grossIncome = band.gigs.reduce((acc, g) => acc + (g.fee || 0), 0);
    const totalTaxes = band.gigs.reduce((acc, g) => {
        const rateTax = g.fee && g.taxRate ? g.fee * (g.taxRate / 100) : 0;
        return acc + rateTax + (g.taxAmount || 0);
    }, 0);
    const netIncome = grossIncome - totalTaxes;
    const totalExpenses = band.expenses.reduce((acc, e) => acc + e.amount, 0);
    const merchRevenue = band.merchSales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalRoyalties = band.songs.reduce((acc, s) => acc + s.payments.reduce((p, r) => p + r.amount, 0), 0);
    const equipmentValue = band.equipment.reduce((acc, e) => acc + (e.value || 0), 0);

    const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const kpis = [
        `Cachês Brutos: ${fmt(grossIncome)}`,
        `Impostos/Retenções: ${fmt(totalTaxes)}`,
        `Cachê Líquido: ${fmt(netIncome)}`,
        `Despesas: ${fmt(totalExpenses)}`,
        `Lucro Real: ${fmt(netIncome - totalExpenses)}`,
        `Receita Merch: ${fmt(merchRevenue)}`,
        `Royalties: ${fmt(totalRoyalties)}`,
        `Patrimônio (Equipamentos): ${fmt(equipmentValue)}`,
    ];

    kpis.forEach((kpi) => {
        doc.text(`• ${kpi}`, 18, yPos);
        yPos += 7;
    });

    yPos += 5;

    // Section 2: Gigs
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Shows Recentes", 14, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Data", 14, yPos);
    doc.text("Título", 45, yPos);
    doc.text("Local", 110, yPos);
    doc.text("Cachê", 165, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    band.gigs.slice(0, 15).forEach((gig) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(new Date(gig.date).toLocaleDateString('pt-BR'), 14, yPos);
        doc.text((gig.title || "").substring(0, 30), 45, yPos);
        doc.text((gig.location || "-").substring(0, 25), 110, yPos);
        doc.text(gig.fee ? fmt(gig.fee) : "-", 165, yPos);
        yPos += 6;
    });

    yPos += 8;

    // Section 3: Expenses
    if (yPos > 240) { doc.addPage(); yPos = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Despesas Recentes", 14, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Data", 14, yPos);
    doc.text("Descrição", 45, yPos);
    doc.text("Categoria", 120, yPos);
    doc.text("Valor", 168, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    band.expenses.slice(0, 15).forEach((exp) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.text(new Date(exp.date).toLocaleDateString('pt-BR'), 14, yPos);
        doc.text((exp.description || "").substring(0, 35), 45, yPos);
        doc.text((exp.category || "-").substring(0, 20), 120, yPos);
        doc.text(fmt(exp.amount), 168, yPos);
        yPos += 6;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("BandFlow ERP — Relatório Automatizado", 14, 290);

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=Relatorio_${band.name.replace(/\s+/g, '_')}.pdf`,
        },
    });
}

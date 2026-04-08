import { getActiveBand } from "@/lib/getActiveBand";
import { createExpense, deleteExpense } from "@/app/actions/expenses";
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown, PiggyBank, Calendar as CalendarIcon, BarChart3, Download, ListTodo, Wallet, Calculator } from "lucide-react";
import { redirect } from "next/navigation";
import { FinanceChart } from "@/components/dashboard/FinanceChart";
import { getDREAnalytics, getCashFlow } from "@/app/actions/financials";
import { DREDashboard } from "@/components/dashboard/financial/DREDashboard";
import { TransactionList } from "@/components/dashboard/financial/TransactionList";
import { SplitCalculator } from "@/components/dashboard/financial/SplitCalculator";
import { AccountsDashboard } from "@/components/dashboard/financial/AccountsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureGuard } from "@/components/ui/feature-guard";
import { AIInsights } from "@/components/dashboard/financial/AIInsights";
import { Sparkles } from "lucide-react";

export default async function FinancePage() {
    const { band } = await getActiveBand({
        gigs: true,
        expenses: { orderBy: { date: 'desc' } }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const gigs = band?.gigs || [];
    const expenses = (band as any)?.expenses || [];

    // --- Analytics for DRE ---
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dreRes = await getDREAnalytics({ startDate: firstDayOfMonth, endDate: lastDayOfMonth });
    const cashFlowRes = await getCashFlow(band.id);

    const grossIncome = gigs.reduce((acc: number, gig: any) => acc + (gig.fee || 0), 0);
    const totalTaxes = gigs.reduce((acc: number, gig: any) => {
        const rateTax = gig.fee && gig.taxRate ? gig.fee * (gig.taxRate / 100) : 0;
        const fixedTax = gig.taxAmount || 0;
        return acc + rateTax + fixedTax;
    }, 0);
    const netIncome = grossIncome - totalTaxes;
    const totalExpenses = expenses.reduce((acc: number, expense: any) => acc + expense.amount, 0);

    const balance = netIncome - totalExpenses;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Prepare chart data (group by Month)
    const monthlyData: Record<string, { Entradas: number; Saídas: number }> = {};

    // Process Gigs (Income)
    gigs.forEach((gig: any) => {
        if (!gig.fee) return;
        const month = new Date(gig.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = { Entradas: 0, Saídas: 0 };
        const rateTax = gig.fee && gig.taxRate ? gig.fee * (gig.taxRate / 100) : 0;
        const fixedTax = gig.taxAmount || 0;
        monthlyData[month].Entradas += (gig.fee - rateTax - fixedTax);
    });

    // Process Expenses
    expenses.forEach((expense: any) => {
        const month = new Date(expense.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = { Entradas: 0, Saídas: 0 };
        monthlyData[month].Saídas += expense.amount;
    });

    const chartData = Object.entries(monthlyData)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => new Date(`1 ${a.name}`).getTime() - new Date(`1 ${b.name}`).getTime());


    return (
        <FeatureGuard
            plan={band.subscriptionPlan as any}
            feature="finance_advanced"
            fallbackTitle="Financeiro Avançado"
            fallbackDescription="Desbloqueie o fluxo de caixa, DRE Gerencial, contas a pagar/receber e a calculadora automática de Splits. Funcionalidade Exclusiva do Plano PROFISSIONAL."
        >
        <div className="space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                        Gestão <span className="text-zinc-600"> Financeira</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        CONTROLE DE FLUXO CAIXA E DEMONSTRATIVO DE RESULTADOS
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href={`/api/bands/${band.id}/finance/report`}
                        className="h-12 px-8 bg-[#ccff00] text-black border border-[#ccff00] flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-[#ccff00] transition-all shadow-[0 0 30px rgba(204,255,0,0.1)]"
                    >
                        <Download className="h-4 w-4 mr-2" /> EXPORTAR RELATÓRIO
                    </a>
                </div>
            </div>

                <div className="flex bg-[#ccff00]/5 border border-[#ccff00]/10 p-4 w-fit self-center sm:self-start rounded-none">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ccff00]">SINCRONIZADO</p>
                </div>

                <Tabs defaultValue="overview" className="space-y-12">
                    <TabsList className="bg-black/40 border border-white/5 p-1 h-auto gap-1 flex-wrap rounded-none w-full sm:w-fit">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-none px-8 py-4 transition-all flex-1 sm:flex-none">
                            RESUMO GERAL
                        </TabsTrigger>
                        <TabsTrigger value="dre" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-none px-8 py-4 transition-all flex-1 sm:flex-none">
                            DRE COMPLETO
                        </TabsTrigger>
                        <TabsTrigger value="accounts" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-none px-8 py-4 transition-all flex-1 sm:flex-none">
                            FLUXO DE CAIXA
                        </TabsTrigger>
                        <TabsTrigger value="expenses" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-none px-8 py-4 transition-all flex-1 sm:flex-none">
                            LANÇAMENTOS
                        </TabsTrigger>
                        <TabsTrigger value="splits" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-none px-8 py-4 transition-all flex-1 sm:flex-none">
                            CÁLCULO DE CACHÊ
                        </TabsTrigger>
                        <TabsTrigger value="ai-insights" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-none px-8 py-4 transition-all flex-1 sm:flex-none flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            INTELIGÊNCIA
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-12">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group rounded-none">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20" />
                                <div className="flex items-center gap-x-4 mb-6">
                                    <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-emerald-500 rounded-none">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">FATURAMENTO TOTAL</p>
                                </div>
                                <p className="text-3xl font-black text-white">{formatCurrency(grossIncome)}</p>
                                <p className="text-[8px] text-zinc-700 mt-2 uppercase font-black tracking-widest italic opacity-60">HISTÓRICO DE TRANSMISSÃO</p>
                            </div>

                            <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group rounded-none">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20" />
                                <div className="flex items-center gap-x-4 mb-6">
                                    <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-red-500 rounded-none">
                                        <TrendingDown className="h-5 w-5" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">GERAL TAXAS</p>
                                </div>
                                <p className="text-3xl font-black text-white">{formatCurrency(totalTaxes + totalExpenses)}</p>
                                <p className="text-[8px] text-zinc-700 mt-2 uppercase font-black tracking-widest italic opacity-60">BURN RATE LOGÍSTICA</p>
                            </div>

                            <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 p-8 relative overflow-hidden group rounded-none">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]" />
                                <div className="flex items-center gap-x-4 mb-6 text-[#ccff00]">
                                    <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center rounded-none">
                                        <PiggyBank className="h-5 w-5" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">NET PROFIT</p>
                                </div>
                                <p className="text-3xl font-black text-white">{formatCurrency(balance)}</p>
                                <p className="text-[8px] text-[#ccff00]/60 mt-2 uppercase font-black tracking-widest text-[8px] sm:text-[10px]">EFFICIENCY INDEX: {((balance / (grossIncome || 1)) * 100).toFixed(1)}%</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/20 border border-white/5 p-10 backdrop-blur-sm rounded-none">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <BarChart3 className="h-5 w-5 text-[#ccff00]" />
                                    <h2 className="text-2xl font-black font-heading uppercase tracking-tighter text-white">
                                        Performance Matrix <span className="text-zinc-600">[ SALDO LÍQUIDO]</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="h-[400px] w-full">
                                <FinanceChart data={chartData} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="dre" className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-black font-heading tracking-tighter uppercase text-white flex items-center gap-4">
                                    <BarChart3 className="h-8 w-8 text-[#ccff00]" />
                                    DRE Estratégico
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">LUCRATIVIDADE REAL BASEADA EM CUSTOS E COMISSÕES.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Mês Atual</p>
                                <p className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest">{now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        {dreRes.data && <DREDashboard data={dreRes.data} />}
                    </TabsContent>

                    <TabsContent value="accounts" className="space-y-8 animate-in fade-in duration-500">
                        {cashFlowRes.transactions && (
                            <AccountsDashboard transactions={cashFlowRes.transactions as any[]} bandId={band.id} />
                        )}
                    </TabsContent>

                    <TabsContent value="expenses" className="space-y-12 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <div className="sticky top-8 bg-zinc-900/40 p-10 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden rounded-none">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-black border border-white/5 flex items-center justify-center text-red-500 rounded-none">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-black font-heading uppercase tracking-tighter text-white">
                                            REGISTRAR SAÍDA
                                        </h2>
                                    </div>
                                    <form action={createExpense} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">DESCRIÇÃO DO DÉBITO</label>
                                            <input
                                                name="description"
                                                required
                                                className="w-full bg-black border border-white/5 h-16 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-800 rounded-none"
                                                placeholder="EX: COMBUSTÍVEL TRANSPORTE / ALIMENTAÇÃO"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">MONTANTE FINANCEIRO (BRL)</label>
                                            <input
                                                name="amount"
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full bg-black border border-white/5 h-16 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-800 rounded-none text-red-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">DATA DA OCORRÊNCIA</label>
                                            <input
                                                name="date"
                                                type="date"
                                                title="DATA DA DESPESA"
                                                required
                                                className="w-full bg-black border border-white/5 h-16 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-500/50 transition-all text-white rounded-none"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">TAG CATEGORIA (OPCIONAL)</label>
                                            <input
                                                name="category"
                                                className="w-full bg-black border border-white/5 h-16 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-800 rounded-none"
                                                placeholder="EX: LOGÍSTICA / INFRA"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-red-600 h-20 text-[12px] font-black uppercase tracking-[0.5em] text-white hover:bg-white hover:text-black transition-all shadow-[0 0 40px rgba(220,38,38,0.1)] active:scale-95 rounded-none"
                                        >
                                            CONFIRMAR SAÍDA
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">HISTÓRICO DE MOVIMENTAÇÕES</h2>
                                {expenses.length > 0 ? (
                                    <div className="border border-white/5 bg-zinc-900/20 overflow-hidden backdrop-blur-sm rounded-none">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-black/40 border-b border-white/5">
                                                <tr>
                                                    <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">DESCRIÇÃO REGISTRO</th>
                                                    <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">REFERÊNCIA</th>
                                                    <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">VALOR DÉBITO</th>
                                                    <th className="px-8 py-8 w-[80px]"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {expenses.map((expense: any) => (
                                                    <tr key={expense.id} className="group hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-8 py-8">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-white">{expense.description}</span>
                                                                {expense.category && <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700 italic">[{expense.category}]</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">
                                                            {new Date(expense.date).toLocaleDateString('pt-BR')}
                                                        </td>
                                                        <td className="px-8 py-8 text-red-500 text-[11px] font-black uppercase tracking-widest text-right">
                                                            -{formatCurrency(expense.amount)}
                                                        </td>
                                                        <td className="px-8 py-8 text-right">
                                                            <form action={async () => {
                                                                "use server";
                                                                await deleteExpense(expense.id);
                                                            }}>
                                                                <button 
                                                                    title="DELETAR REGISTRO"
                                                                    className="w-12 h-12 flex items-center justify-center text-zinc-800 border border-white/5 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </form>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900/40 p-24 text-center border border-dashed border-white/10 opacity-40 rounded-none">
                                        <div className="inline-flex p-10 bg-black border border-white/5 text-zinc-800 mb-10 scale-150">
                                            <DollarSign className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-3xl font-black font-heading uppercase tracking-widest text-zinc-700 leading-none">FLUXO ESTÁTICO ZERO</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="splits" className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Calculator className="h-6 w-6 text-secondary" />
                                    Calculadora de Splits
                                </h2>
                                <p className="text-sm text-zinc-500">Simule a divisão de cachês e lucro entre a equipe.</p>
                            </div>
                        </div>
                        <SplitCalculator />
                    </TabsContent>

                    <TabsContent value="ai-insights" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <AIInsights />
                    </TabsContent>
                </Tabs>
            </div>
        </FeatureGuard>
    );
}

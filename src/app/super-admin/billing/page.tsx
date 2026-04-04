import { getTenants } from "@/app/actions/super-admin";
import { DollarSign, AlertCircle, Clock, CheckCircle2, TrendingUp, CreditCard, Package, BarChart3, Activity, Shield, Zap } from "lucide-react";
import { ExtendTrialButton } from "@/components/super-admin/ExtendTrialButton";
import { BillingCharts } from "@/components/super-admin/BillingCharts";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

export default async function BillingDashboard() {
    const res = await getTenants();
    const bands = res.success && res.bands ? res.bands : [];

    const PLAN_PRICES = {
        ESSENTIAL: 147,
        PRO: 297,
        PREMIUM: 497
    };
    
    type BandType = any;

    const activeMRR = bands
        .filter((b: BandType) => b.subscriptionStatus === "ACTIVE")
        .reduce((acc: number, band: BandType) => acc + (PLAN_PRICES[band.subscriptionPlan as keyof typeof PLAN_PRICES] || PLAN_PRICES.ESSENTIAL), 0);

    const overdueAmount = bands
        .filter((b: BandType) => b.subscriptionStatus === "OVERDUE")
        .reduce((acc: number, band: BandType) => acc + (PLAN_PRICES[band.subscriptionPlan as keyof typeof PLAN_PRICES] || PLAN_PRICES.ESSENTIAL), 0);

    const trialsCounter = bands.filter((b: BandType) => b.subscriptionStatus === "TRIAL").length;
    const canceledCounter = bands.filter((b: BandType) => b.subscriptionStatus === "CANCELED" || b.subscriptionStatus === "SUSPENDED").length;

    const overdueBands = bands.filter((b: BandType) => b.subscriptionStatus === "OVERDUE");

    const mrrData = [
        { name: 'Out', mrr: activeMRR * 0.4 },
        { name: 'Nov', mrr: activeMRR * 0.6 },
        { name: 'Dez', mrr: activeMRR * 0.8 },
        { name: 'Jan', mrr: activeMRR * 0.9 },
        { name: 'Fev', mrr: activeMRR * 0.95 },
        { name: 'Mar', mrr: activeMRR },
    ];
    
    const conversionData = [
        { name: 'Out', trials: 10, conversao: 2 },
        { name: 'Nov', trials: 15, conversao: 4 },
        { name: 'Dez', trials: 20, conversao: 8 },
        { name: 'Jan', trials: 25, conversao: 12 },
        { name: 'Fev', trials: 30, conversao: 15 },
        { name: 'Mar', trials: 40, conversao: 22 },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#ccff00] flex items-center justify-center text-black">
                            <CreditCard className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">Núcleo <span className="text-[#ccff00]">Financeiro</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Central de Cobrança</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Processamento Ativo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-8 bg-zinc-900 shadow-none border border-white/5 border-l-4 border-l-[#ccff00]">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-4">MRR Atual</span>
                    <div className="text-3xl font-black text-[#ccff00] font-heading uppercase">
                        {formatCurrency(activeMRR)}
                    </div>
                </div>

                <div className="p-8 bg-zinc-900 shadow-none border border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-4">Perda de Inadimplência</span>
                    <div className="text-3xl font-black text-white font-heading uppercase">
                        {formatCurrency(overdueAmount)}
                    </div>
                </div>

                <div className="p-8 bg-zinc-900 shadow-none border border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-4">Pacotes Trial</span>
                    <div className="text-3xl font-black text-white font-heading uppercase">
                        {trialsCounter}
                    </div>
                </div>

                <div className="p-8 bg-zinc-900 shadow-none border border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-4">Churn Histórico</span>
                    <div className="text-3xl font-black text-zinc-800 font-heading uppercase">
                        {canceledCounter}
                    </div>
                </div>
            </div>

            <BillingCharts mrrData={mrrData} conversionData={conversionData} />

            {/* Bottom Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                <div className="bg-zinc-900 border border-white/5 p-8 flex flex-col h-full group">
                    <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                                <Activity className="w-5 h-5 text-zinc-600" /> 
                                Cobrança Crítica
                            </h3>
                            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-2 leading-none">Intervenção necessária em unidades inadimplentes</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                        {overdueBands.length > 0 ? (
                            overdueBands.map((band: BandType) => (
                                <div key={band.id} className="flex justify-between items-center p-4 bg-black/40 border border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-white tracking-widest">{band.name}</p>
                                        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{band.respEmail || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white">
                                            {formatCurrency(PLAN_PRICES[band.subscriptionPlan as keyof typeof PLAN_PRICES] || PLAN_PRICES.ESSENTIAL)}
                                        </p>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 border border-white/5 px-2 py-1 mt-1 inline-block">
                                            {band.subscriptionPlan}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800">
                                <CheckCircle2 className="w-8 h-8 text-[#ccff00] mb-4 opacity-30" />
                                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800">Nenhum Débito Detectado</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900 border border-white/5 p-8 flex flex-col h-full group">
                    <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                                <Zap className="w-5 h-5 text-[#ccff00]" /> 
                                Conversões Trial
                            </h3>
                            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-2 leading-none">Novas instâncias em modo de avaliação</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                        {bands.filter((b: BandType) => b.subscriptionStatus === "TRIAL").length > 0 ? (
                            bands.filter((b: BandType) => b.subscriptionStatus === "TRIAL").map((band: BandType) => (
                                <div key={band.id} className="flex justify-between items-center p-4 bg-black/40 border border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-white tracking-widest">{band.name}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="w-20 h-1 bg-zinc-800 relative">
                                                <div 
                                                    className="absolute inset-0 bg-[#ccff00]" 
                                                    style={{ width: `${band.usageScore}%` }}
                                                />
                                            </div>
                                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                                                Carga: {band.usageScore}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <ExtendTrialButton bandId={band.id} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                                            {band.planExpiresAt ? `Exp: ${new Date(band.planExpiresAt).toLocaleDateString()}` : 'Sincronização Indefinida'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800">
                                <Package className="w-8 h-8 text-zinc-800 mb-4 opacity-30" />
                                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-700">Cluster Inativo (Sem Leads)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

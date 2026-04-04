import { prisma } from "@/lib/prisma";
import { Users, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, TrendingDown, Clock3, Activity, Zap, Play, ArrowRight, Shield } from "lucide-react";
import { getSuperAdminMetrics, getHistoricalMRR, getRecentBands, getTopEngagedBands, getRecentAuditLogs } from "@/app/actions/superadmin-metrics";
import { DashboardCharts } from "@/components/super-admin/DashboardCharts";
import { RecentBandsTable, TopEngagementBands, QuickAdminActions, AuditLogsWidget } from "@/components/super-admin/DashboardWidgets";

export default async function SuperAdminDashboard() {
    const [metricsRes, recentBandsRes, topBandsRes, auditLogsRes] = await Promise.all([
        getSuperAdminMetrics(),
        getRecentBands(),
        getTopEngagedBands(),
        getRecentAuditLogs()
    ]);

    const metrics = metricsRes.success && metricsRes.metrics
        ? metricsRes.metrics
        : {
            totalBands: 0,
            activeSubscriptions: 0,
            defaultSubscriptions: 0,
            canceledSubscriptions: 0,
            estimatedMrr: 0
        };

    const historicalMrrRes = await getHistoricalMRR(metrics.estimatedMrr);

    const formatBRL = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000">
            {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#ccff00] flex items-center justify-center text-black">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none">Centro de <span className="text-[#ccff00]">Comando</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Core Engine V3.0</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Sistema Online</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 border border-white/5 min-w-[160px]">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-2">Total de Instâncias</span>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-black">{metrics.totalBands}</span>
                            <Users className="w-4 h-4 text-zinc-700" />
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-white/5 min-w-[160px]">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-2">Licenças Ativas</span>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-black text-[#ccff00]">{metrics.activeSubscriptions}</span>
                            <Shield className="w-4 h-4 text-[#ccff00]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN MRR METRICS - High Impact */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2 p-10 bg-[#ccff00] text-black relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-40 h-40 -rotate-12" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">Fluxo de Receita Mensal</span>
                    <h2 className="text-6xl font-black font-heading tracking-tighter uppercase mb-4 leading-none">
                        {formatBRL(metrics.estimatedMrr)}
                    </h2>
                    <div className="flex items-center gap-4 border-t border-black/10 pt-6">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest leading-none">Previsão Recorrente (MRR)</span>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-zinc-900 border border-white/5 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6 block">Inadimplência</span>
                        <h2 className="text-4xl font-black font-heading uppercase leading-none mb-2">
                            {metrics.defaultSubscriptions}
                        </h2>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Ação Requerida</span>
                        <ArrowRight className="w-4 h-4 text-zinc-700" />
                    </div>
                </div>

                <div className="p-10 bg-zinc-900 border border-white/5 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6 block">Churn / Cancelados</span>
                        <h2 className="text-4xl font-black font-heading uppercase leading-none mb-2 text-zinc-500">
                            {metrics.canceledSubscriptions}
                        </h2>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Perda Histórica</span>
                        <Activity className="w-4 h-4 text-zinc-800" />
                    </div>
                </div>
            </div>

            {/* CHARTS */}
            <div className="p-10 bg-zinc-900/30 border border-white/5">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em]">Terminal de Análise Data-Stream</h3>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ccff00]" />
                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    </div>
                </div>
                {historicalMrrRes.success && historicalMrrRes.data && (
                    <DashboardCharts historicalData={historicalMrrRes.data} />
                )}
            </div>

            {/* THREE COLUMNS */}
            <div className="grid lg:grid-cols-3 gap-8">
                <RecentBandsTable bands={recentBandsRes.success ? recentBandsRes.bands || [] : []} />
                <TopEngagementBands bands={topBandsRes.success ? topBandsRes.bands || [] : []} />
                <AuditLogsWidget 
                    subscriptionLogs={auditLogsRes.success ? auditLogsRes.subscriptionLogs || [] : []} 
                    webhooks={auditLogsRes.success ? auditLogsRes.webhooks || [] : []} 
                />
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-2 p-10 border border-white/5 bg-zinc-900/20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-sm font-black font-heading uppercase tracking-widest text-white">Avaliação de Risco do Sistema</h3>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black mt-2">Clusters de Baixo Engajamento Detectados</p>
                        </div>
                        <span className="px-4 py-2 bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest border border-white/5">
                            {metricsRes.atRiskBands?.length || 0} Alertas
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {metricsRes.atRiskBands && metricsRes.atRiskBands.length > 0 ? (
                            metricsRes.atRiskBands.map((band: any) => (
                                <div key={band.id} className="p-6 bg-zinc-900/50 border border-white/5 flex items-center justify-between group hover:border-[#ccff00] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-1.5 rounded-full ${band.usageStatus === 'RED' ? 'bg-[#ccff00] shadow-[0_0_10px_#ccff00]' : 'bg-zinc-600 opacity-50'}`} />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white">{band.name}</p>
                                            <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1 tracking-widest leading-none">Ultima Op: {band.lastActivityAt ? new Date(band.lastActivityAt).toLocaleDateString('pt-BR') : 'Sem dados'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-white">
                                            {band.usageScore}%
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-12 text-center border-2 border-dashed border-zinc-900">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Protocolo de Estabilidade Permanente (Sem Risco)</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-950 p-10 border border-white/5">
                    <QuickAdminActions />
                </div>
            </div>
        </div>
    );
}

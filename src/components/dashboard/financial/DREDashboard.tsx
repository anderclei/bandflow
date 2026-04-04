"use client";

import { BarChart3, TrendingUp, TrendingDown, MapPin, LayoutTemplate, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface DREData {
    revenue: number;
    expenses: number;
    taxes: number;
    commissions: number;
    memberFees: number;
    netProfit: number;
    cityStats: Record<string, number>;
    formatStats: Record<string, number>;
    gigCount: number;
}

export function DREDashboard({ data }: { data: DREData }) {
    const formatCurrency = (val: number) =>
        val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const sortedCities = Object.entries(data.cityStats).sort((a, b) => b[1] - a[1]);
    const sortedFormats = Object.entries(data.formatStats).sort((a, b) => b[1] - a[1]);

    return (
        <div className="space-y-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-none group hover:border-white/20 transition-all">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">FATURAMENTO BRUTO</p>
                    <p className="text-3xl font-black text-white">{formatCurrency(data.revenue)}</p>
                    <p className="text-[8px] text-zinc-800 font-bold mt-4 uppercase tracking-widest">{data.gigCount} OPERAÇÕES CONCLUÍDAS</p>
                </div>
                <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-none group hover:border-white/20 transition-all">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">IMPOSTOS E COMISSÕES</p>
                    <p className="text-3xl font-black text-amber-600">{formatCurrency(data.taxes + data.commissions)}</p>
                    <p className="text-[8px] text-zinc-800 font-bold mt-4 uppercase tracking-widest">DEDUÇÕES PROTOCOLADAS</p>
                </div>
                <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-none group hover:border-white/20 transition-all">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">CUSTOS OPERACIONAIS</p>
                    <p className="text-3xl font-black text-red-500">{formatCurrency(data.expenses + data.memberFees)}</p>
                    <p className="text-[8px] text-zinc-800 font-bold mt-4 uppercase tracking-widest">LOGÍSTICA E CACHÊS</p>
                </div>
                <div className="p-8 bg-[#ccff00] rounded-none shadow-[0 0 50px rgba(204,255,0,0.15)] text-black">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">LUCRO LÍQUIDO REAL</p>
                    <p className="text-4xl font-black tracking-tighter">{formatCurrency(data.netProfit)}</p>
                    <div className="mt-4 text-[10px] font-black flex items-center gap-2 uppercase tracking-widest">
                        <TrendingUp className="h-4 w-4" />
                        {data.revenue > 0 ? ((data.netProfit / data.revenue) * 100).toFixed(1) : 0}% MARGEM DE EFICIÊNCIA
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* City Ranking */}
                <div className="bg-black border border-white/5 p-10 rounded-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl pointer-events-none" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                        <MapPin className="h-6 w-6 text-[#ccff00]" />
                        LUCRATIVIDADE POR GEOGRAFIA
                    </h3>
                    <div className="space-y-8">
                        {sortedCities.map(([city, profit], index) => (
                            <div key={city} className="flex items-center gap-6 group">
                                <span className="w-8 text-[10px] font-black text-zinc-800 group-hover:text-white transition-colors">#{index + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{city}</span>
                                        <span className="text-sm font-black text-[#ccff00] tracking-tighter">{formatCurrency(profit)}</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-900 rounded-none overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-[#ccff00] rounded-none transition-all duration-1000 group-hover:bg-white"
                                            style={{ width: `${Math.min(100, (profit / (sortedCities[0][1] || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {sortedCities.length === 0 && <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 py-10 text-center border border-dashed border-white/5">SEM DADOS GEOGRÁFICOS DISPONÍVEIS</p>}
                    </div>
                </div>

                {/* Format Ranking */}
                <div className="bg-black border border-white/5 p-10 rounded-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl pointer-events-none" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                        <LayoutTemplate className="h-6 w-6 text-[#ccff00]" />
                        PERFORMANCE POR FORMATO
                    </h3>
                    <div className="space-y-8">
                        {sortedFormats.map(([format, profit], index) => (
                            <div key={format} className="flex items-center gap-6 group">
                                <span className="w-8 text-[10px] font-black text-zinc-800 group-hover:text-white transition-colors">#{index + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{format}</span>
                                        <span className="text-sm font-black text-[#ccff00] tracking-tighter">{formatCurrency(profit)}</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-900 rounded-none overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-[#ccff00] rounded-none transition-all duration-1000 group-hover:bg-white"
                                            style={{ width: `${Math.min(100, (profit / (sortedFormats[0][1] || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {sortedFormats.length === 0 && <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 py-10 text-center border border-dashed border-white/5">SEM DADOS DE FORMATO DISPONÍVEIS</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client"

import { useState } from "react"
import { Sparkles, TrendingUp, TrendingDown, Minus, Lightbulb, CheckCircle2, BarChart3, RefreshCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAIFinanceAnalysis } from "@/app/actions/ai-finance"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function AIInsights() {
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)

    async function generateAnalysis() {
        setLoading(true)
        const result = await getAIFinanceAnalysis()
        if (result.success) {
            setAnalysis(result.analysis)
        }
        setLoading(false)
    }

    if (!analysis && !loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 text-center bg-black border-[3px] border-dashed border-[#ccff00]/20 rounded-none relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#ccff00]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="p-8 bg-[#ccff00]/10 text-[#ccff00] mb-10 border border-[#ccff00]/20 rounded-none">
                    <Sparkles className="h-12 w-12 animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">INTELIGÊNCIA : ANÁLISE ESTRATÉGICA</h3>
                <p className="max-w-xl text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 leading-relaxed">
                    DECODIFICAÇÃO DE FLUXO DE CAIXA DOS ÚLTIMOS 90 DIAS. IDENTIFICAÇÃO DE GAPS OPERACIONAIS E PROJEÇÃO DE ESCALABILIDADE LÍQUIDA.
                </p>
                <Button 
                    onClick={generateAnalysis}
                    className="mt-12 bg-[#ccff00] text-black rounded-none px-12 h-20 text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(204,255,0,0.2)] hover:scale-105 hover:bg-white transition-all border-none"
                >
                    GERAR ANÁLISE NEURAL
                </Button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-32 text-center bg-black border border-white/5 rounded-none">
                <Loader2 className="h-16 w-16 text-[#ccff00] animate-spin mb-8" />
                <h3 className="text-xl font-black text-white animate-pulse uppercase tracking-[0.4em]">PROCESSANDO DADOS FINANCEIROS...</h3>
                <p className="text-[10px] font-black text-zinc-700 mt-4 uppercase tracking-widest text-[#ccff00]">CRUZAMENTO DE CACHÊS VS LOGÍSTICA</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/5 pb-10 gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">RELATÓRIO <span className="text-zinc-700">ESTRATÉGICO</span></h2>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">PARÂMETROS BASEADOS NO DESEMPENHO RECENTE</p>
                </div>
                <Button onClick={generateAnalysis} className="h-14 bg-black border border-white/5 text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-none px-8 hover:text-white hover:border-white/20 transition-all">
                    <RefreshCcw className="h-4 w-4 mr-3" />
                    RECALCULAR DADOS
                </Button>
            </div>

            {/* Sumário Executivo */}
            <div className="p-10 bg-zinc-900/40 border-l-[8px] border-[#ccff00] border-y border-r border-white/5 shadow-2xl backdrop-blur-md rounded-none">
                <div className="flex items-start gap-8">
                    <div className="p-4 bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 shrink-0">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.5em]">EXECUTIVE_DECODER_RESUMO</h4>
                        <p className="text-xl font-black text-white/90 leading-tight tracking-tight capitalize-first">
                            {analysis.summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* KPIs Gerados pela IA */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.kpis.map((kpi: any, idx: number) => (
                    <div key={idx} className="p-8 bg-black border border-white/5 group hover:border-[#ccff00]/30 transition-all rounded-none relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{kpi.label}</span>
                            {kpi.trend === "up" && <TrendingUp className="h-4 w-4 text-[#ccff00]" />}
                            {kpi.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                            {kpi.trend === "stable" && <Minus className="h-4 w-4 text-zinc-800" />}
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter group-hover:text-[#ccff00] transition-colors">{kpi.value}</div>
                        <p className="text-[8px] text-zinc-800 font-black mt-4 uppercase tracking-widest group-hover:text-zinc-600 transition-colors">{kpi.description}</p>
                    </div>
                ))}
            </div>

            {/* Gráfico Comparativo IA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-zinc-900/20 border border-white/5 p-10 rounded-none backdrop-blur-sm">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-4">
                        <BarChart3 className="h-6 w-6 text-[#ccff00]" />
                        PROJEÇÃO_DE_PERFORMANCE
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysis.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                                <XAxis dataKey="name" fontSize={10} stroke="#444" tickLine={false} axisLine={false} tick={{ fontWeight: '900' }} />
                                <YAxis fontSize={10} stroke="#444" tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} tick={{ fontWeight: '900' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '0', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#000', fontSize: '10px', color: '#fff' }}
                                    itemStyle={{ color: '#fff', fontWeight: '900' }}
                                />
                                <Bar dataKey="receita" fill="#ccff00" radius={0} name="INFLOW" />
                                <Bar dataKey="despesa" fill="#333" radius={0} name="OUTFLOW" />
                                <Bar dataKey="lucro" fill="#fff" radius={0} name="NET" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-black border border-white/5 p-10 rounded-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-4">
                        <Lightbulb className="h-6 w-6 text-amber-500" />
                        VETORES_ESTRATÉGICOS
                    </h3>
                    <div className="space-y-6">
                        {analysis.insights.map((insight: string, i: number) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="mt-1.5 shrink-0">
                                    <div className="h-2 w-2 bg-[#ccff00] group-hover:scale-150 transition-transform" />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 leading-relaxed group-hover:text-white transition-colors">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recomendações Prioritárias */}
            <div className="bg-white p-12 rounded-none text-black relative shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                <div className="absolute top-0 left-0 w-full h-[5px] bg-[#ccff00]" />
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                    <CheckCircle2 className="h-8 w-8 text-[#ccff00]" />
                    ACTION_PLAN_RECOMMENDED
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {analysis.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="space-y-4 border-l-2 border-black/10 pl-6 group">
                            <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 inline-block ${
                                rec.priority === "high" ? "bg-red-600 text-white" : 
                                rec.priority === "medium" ? "bg-amber-500 text-black" : "bg-zinc-200 text-black"
                            }`}>
                                PRIORITY_{rec.priority}
                            </div>
                            <h4 className="font-black text-xl tracking-tighter group-hover:text-[#ccff00] transition-colors uppercase">{rec.title}</h4>
                            <p className="text-[10px] font-black opacity-60 leading-relaxed uppercase tracking-widest">{rec.action}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

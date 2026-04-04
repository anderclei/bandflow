import { getActiveBand } from "@/lib/getActiveBand";
import { getBIAnalytics, getCommercialFunnel, getGeographicDistribution } from "@/app/actions/analytics";
import { getRehiringRecommendations } from "@/app/actions/crm";
import { BarChart3, TrendingUp, Users, MapPin, Target, ArrowUpRight, Award, Briefcase, Globe, MessageSquare, Sparkles, FileSearch, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureGuard } from "@/components/ui/feature-guard";

export default async function IntelligencePage() {
    const { band } = await getActiveBand();

    if (!band) return null;

    const biRes = await getBIAnalytics(band.id);
    const funnelRes = await getCommercialFunnel(band.id);
    const geoRes = await getGeographicDistribution(band.id);
    const recommendations = await getRehiringRecommendations(band.id);


    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <FeatureGuard
            plan={band.subscriptionPlan}
            feature="intelligence"
            fallbackTitle="Inteligência Artificial"
            fallbackDescription="Desvende seus dados, descubra cidades mais rentáveis e deixe a IA analisar os contratos suspeitos. Funcionalidade Exclusiva do Plano PREMIUM."
        >
            <div className="space-y-12 pb-20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Target className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                    Inteligência <span className="text-zinc-600"> Comercial</span>
                                </h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">ANÁLISE DE MERCADO</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">SISTEMA ONLINE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/20" />
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">CACHÊ MÉDIO</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tighter">{formatCurrency(funnelRes.data?.averageTicket || 0)}</p>
                        <div className="mt-6 flex items-center gap-2 text-[8px] font-black text-[#ccff00] uppercase tracking-widest bg-[#ccff00]/5 border border-[#ccff00]/10 px-3 py-1 w-fit">
                            <TrendingUp className="h-3 w-3" />
                            DESEMPENHO ALTO
                        </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group focus-within:border-[#ccff00]/50 transition-all">
                        <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800" />
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">TAXA DE SUCESSO</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tighter">{(funnelRes.data?.conversionRate || 0).toFixed(1)}%</p>
                        <p className="text-[8px] text-zinc-800 mt-4 uppercase font-black tracking-widest">RESULTADO POSITIVO</p>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800" />
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">NOVOS CONTATOS</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tighter">{funnelRes.data?.LEAD || 0}</p>
                        <p className="text-[8px] text-zinc-800 mt-4 uppercase font-black tracking-widest">OPORTUNIDADES DE SHOW</p>
                    </div>

                    <div className="bg-[#ccff00] border border-white/5 p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(204,255,0,0.1)]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 blur-3xl pointer-events-none" />
                        <p className="text-[8px] font-black text-black/40 uppercase tracking-[0.4em] mb-4">POTENCIAL DE VENDA</p>
                        <p className="text-3xl font-black text-black leading-none tracking-tighter">{formatCurrency(funnelRes.data?.totalValue || 0)}</p>
                        <p className="text-[8px] text-black/40 mt-4 uppercase font-black tracking-widest">TOTAL EM NEGOCIAÇÃO</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Ranking de Cidades */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group shadow-2xl">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl pointer-events-none" />
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-10 border-b border-white/5 pb-6">CIDADES LUCRATIVAS</h2>
                        <div className="space-y-4">
                            {biRes.data?.topCities.map((city, index) => (
                                <div key={`${city.name}-${index}`} className="flex items-center justify-between p-6 bg-black border border-white/5 hover:border-[#ccff00]/30 transition-all">
                                    <div className="flex items-center gap-6">
                                        <span className="flex h-10 w-10 items-center justify-center bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-black">
                                            0{index + 1}
                                        </span>
                                        <div>
                                            <p className="text-[12px] font-black text-white uppercase tracking-widest">{city.name.toUpperCase()}</p>
                                            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1">{city.count} SHOWS REALIZADOS</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] font-black text-[#ccff00] tracking-widest">{formatCurrency(city.netProfit)}</p>
                                        <p className="text-[8px] uppercase font-black text-zinc-800 tracking-widest mt-1">LUCRO LÍQUIDO</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ranking de Formatos */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-10 border-b border-white/5 pb-6">FORMATOS RENTÁVEIS</h2>
                        <div className="space-y-4">
                            {biRes.data?.topFormats.map((format, index) => (
                                <div key={`${format.name}-${index}`} className="flex items-center justify-between p-6 bg-black border border-white/5 hover:border-amber-500/30 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/5 text-amber-500/50">
                                            <BarChart3 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-black text-white uppercase tracking-widest">{format.name.toUpperCase()}</p>
                                            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1">MÉDIA {formatCurrency(format.netProfit / format.count)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] font-black text-white tracking-widest">{formatCurrency(format.netProfit)}</p>
                                        <p className="text-[8px] uppercase font-black text-zinc-800 tracking-widest mt-1">LUCRO TOTAL</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ranking de Contratantes */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-10 border-b border-white/5 pb-6">MELHORES CLIENTES</h2>
                        <div className="space-y-4">
                            {biRes.data?.topContractors.map((contractor, index) => (
                                <div key={`${contractor.name}-${index}`} className="flex items-center justify-between p-6 bg-black border border-white/5 hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/5 text-indigo-500/50">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-black text-white uppercase tracking-widest truncate max-w-[120px]">{contractor.name.toUpperCase()}</p>
                                            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1">{contractor.count} CONTRATOS</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] font-black text-indigo-400 tracking-widest">{formatCurrency(contractor.revenue)}</p>
                                        <p className="text-[8px] uppercase font-black text-zinc-800 tracking-widest mt-1">FATURAMENTO</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Heatmap/Geo Simplified */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-10 border-b border-white/5 pb-6">ESTADOS MAIS ATIVOS</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {Object.entries(geoRes.data || {}).sort((a, b) => (b[1] as any) - (a[1] as any)).map(([state, count]) => (
                                <div key={state} className="p-6 bg-black border border-white/5 text-center group-hover:border-[#ccff00]/10 transition-all">
                                    <p className="text-3xl font-black text-[#ccff00] tracking-tighter leading-none mb-4">{state.toUpperCase()}</p>
                                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{count as any} SHOWS</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Funil Visual (Brutalist) */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group shadow-3xl">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-10 border-b border-white/5 pb-6 text-center">FUNIL DE VENDAS</h2>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full bg-black border border-white/10 p-6 flex items-center justify-between group hover:border-zinc-500 transition-all shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">INTERESSADOS (LEADS)</span>
                                <span className="text-2xl font-black text-white">{funnelRes.data?.LEAD}</span>
                            </div>
                            <div className="w-[85%] bg-black border border-white/20 p-6 flex items-center justify-between group hover:border-[#ccff00]/50 transition-all shadow-2xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">EM NEGOCIAÇÃO</span>
                                <span className="text-2xl font-black text-white">{funnelRes.data?.NEGOTIATING}</span>
                            </div>
                            <div className="w-[70%] bg-[#ccff00] p-8 flex items-center justify-between shadow-[0_0_80px_rgba(204,255,0,0.15)] active:scale-[0.98] transition-all">
                                <span className="text-[12px] font-black uppercase tracking-[0.5em] text-black">CONTRATOS FECHADOS</span>
                                <span className="text-4xl font-black text-black leading-none">{funnelRes.data?.WON}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CRM Proativo / IA Section */}
                <div className="bg-black border border-[#ccff00]/20 p-12 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Sparkles className="h-48 w-48 text-[#ccff00]" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[#ccff00]">
                                    <Sparkles className="h-6 w-6" />
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.6em]">AGENDA INTELIGENTE</h2>
                                </div>
                                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter text-white">RECONQUISTA DE CLIENTES</h3>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest max-w-sm">Identificando clientes que não contratam há mais de 6 meses.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {recommendations.length === 0 ? (
                                <div className="col-span-full p-20 text-center bg-zinc-900/40 border border-dashed border-white/10 opacity-30">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">NENHUMA RECOMENDAÇÃO NO MOMENTO</p>
                                </div>
                            ) : (
                                recommendations.map((rec: any) => (
                                    <div key={rec.id} className="p-8 bg-black border border-white/5 hover:border-[#ccff00]/30 transition-all flex flex-col group/item shadow-2xl">
                                        <div className="mb-8">
                                            <h3 className="text-[14px] font-black text-white uppercase tracking-widest mb-2">{rec.name.toUpperCase()}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                                <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">INATIVO HÁ {Math.floor((new Date().getTime() - new Date(rec.lastGigDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} MESES</span>
                                            </div>
                                        </div>

                                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-10 leading-relaxed">
                                            ÚLTIMO SHOW: {new Date(rec.lastGigDate).toLocaleDateString('pt-BR')}
                                        </p>

                                        <div className="flex gap-4 mt-auto">
                                            <a
                                                href={`https://wa.me/${rec.phone?.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 h-14 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] font-heading"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                ENTRAR EM CONTATO
                                            </a>
                                            <button 
                                                title="Visualizar Perfil Completo"
                                                className="w-14 h-14 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <ArrowUpRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* IA de Análise de Contratos Section */}
                <div className="bg-zinc-900/40 border border-white/5 p-12 relative overflow-hidden group shadow-2xl">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
                                <div className="w-14 h-14 bg-black border border-white/5 flex items-center justify-center text-zinc-400 shadow-3xl">
                                    <FileSearch className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black font-heading uppercase tracking-tighter text-white">ANÁLISE JURÍDICA COM IA</h2>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Envie o contrato para identificar riscos e vetores jurídicos.</p>
                                </div>
                            </div>

                            <div className="p-16 border-2 border-dashed border-white/5 bg-black/40 flex flex-col items-center justify-center text-center group-hover:border-[#ccff00]/20 transition-all cursor-pointer">
                                <FileSearch className="h-16 w-16 text-zinc-900 mb-8" />
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">ARRASTE O CONTRATO AQUI  ::  <span className="text-[#ccff00]"> SELECIONAR ARQUIVO </span></p>
                                <p className="text-[8px] text-zinc-800 mt-6 uppercase font-black tracking-widest">FORMATOS ACEITOS: PDF / DOCX / IMAGEM</p>
                            </div>
                        </div>

                        <div className="w-full lg:w-[450px]">
                            <div className="p-10 bg-black border border-white/5 relative overflow-hidden h-full shadow-3xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ccff00] mb-10 flex items-center gap-3">
                                    <ShieldAlert className="h-4 w-4" />
                                    ALERTAS JURÍDICOS (IA)
                                </h3>
                                <div className="space-y-6">
                                    <div className="p-6 bg-zinc-900/40 border border-white/5 hover:border-red-600/30 transition-all group/item">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Cláusula de Rescisão</p>
                                        <p className="text-[8px] font-black text-red-600 uppercase tracking-widest">CRÍTICO: MULTA ABUSIVA ACIMA DE 30%</p>
                                    </div>
                                    <div className="p-6 bg-zinc-900/40 border border-white/5 hover:border-amber-500/30 transition-all">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Responsabilidade Civil</p>
                                        <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">AVISO: AUSÊNCIA DE LIMITE PARA DANOS</p>
                                    </div>
                                    <div className="p-6 bg-zinc-900/40 border border-white/5 hover:border-amber-500/30 transition-all">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Direitos de Imagem</p>
                                        <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">DETECTADO: LICENÇA PERPÉTUA E IRRESTRITA</p>
                                    </div>
                                </div>

                                <button className="w-full h-16 mt-12 bg-zinc-900 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.5em] hover:bg-[#ccff00] hover:text-black transition-all flex items-center justify-center gap-4 shadow-2xl font-heading">
                                    <Sparkles className="h-4 w-4" />
                                    EXECUTAR ANÁLISE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FeatureGuard>
    );
}

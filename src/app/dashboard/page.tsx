import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import Calendar from "@/components/dashboard/Calendar";
import Link from "next/link";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { Trash2, Target, Plus, LayoutDashboard, TrendingUp, CalendarCheck, DollarSign, Package, Car, Wrench, Lock, ArrowRight } from "lucide-react";
import { createGoal, deleteGoal, updateGoalProgress } from "@/app/actions/goals";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardStatCard } from "@/components/dashboard/stat-card";
import { UpcomingEventsList, UpcomingEvent } from "@/components/dashboard/upcoming-events";
import { RecentActivityFeed, ActivityItem } from "@/components/dashboard/recent-activity";
import { hasFeature, SubscriptionPlan } from "@/lib/feature-flags";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string }>;
}) {
    const params = await searchParams;
    const { band, session } = await getActiveBand({
        gigs: {
            include: { contractor: true },
            orderBy: { date: 'asc' }
        },
        equipment: true,
        expenses: true,
        contractors: {
            include: { gigs: true }
        },
        goals: { orderBy: { createdAt: 'desc' } },
        activityLogs: {
            orderBy: { createdAt: 'desc' },
            take: 6
        },
        trips: {
            include: { rooms: { include: { assignments: true } } },
            orderBy: { createdAt: 'desc' },
            take: 1
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const plan = (band.subscriptionPlan as SubscriptionPlan) || 'PREMIUM';
    const canViewFinance = hasFeature(plan, 'finance_advanced');
    const canViewLogistics = hasFeature(plan, 'logistics_advanced');
    const canViewCRM = hasFeature(plan, 'crm');

    // Date range filter
    const fromDate = params.from ? new Date(params.from) : null;
    const toDate = params.to ? new Date(params.to) : null;

    const gigs = (band as any).gigs || [];
    const equipment = (band as any).equipment || [];
    const expenses = (band as any).expenses || [];
    const goals = (band as any).goals || [];
    const activityLogs = (band as any).activityLogs || [];
    const recentTrip = (band as any).trips?.[0] || null;

    // Filter by date range if provided
    const filteredGigs = fromDate || toDate
        ? gigs.filter((g: any) => {
            const d = new Date(g.date);
            if (fromDate && d < fromDate) return false;
            if (toDate && d > toDate) return false;
            return true;
        })
        : gigs;

    // Calculate shows this month
    const now = new Date();
    const showsThisMonth = gigs.filter((g: any) => {
        const d = new Date(g.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    // 1. Technical Equity
    const technicalEquity = equipment.reduce((acc: number, item: any) => acc + (item.value || 0), 0);

    // 2. Net Fee
    const netFee = filteredGigs.reduce((acc: number, gig: any) => {
        const fee = gig.fee || 0;
        const tax = (fee * ((gig.taxRate || 0) / 100)) + (gig.taxAmount || 0);
        return acc + (fee - tax);
    }, 0);

    // 3. Ranking Contratantes
    const contractorRanking = ((band as any).contractors || [])
        .map((c: any) => ({
            name: c.name,
            total: (c.gigs || []).reduce((acc: number, g: any) => acc + (g.fee || 0), 0)
        }))
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 3);

    // Activity icons
    const activityIcons: Record<string, string> = {
        CREATED: "Novo", UPDATED: "Atualizou", DELETED: "Removeu",
    };

    const upcomingEventsData: UpcomingEvent[] = gigs
        .filter((g: any) => new Date(g.date) >= new Date())
        .map((g: any) => {
            const d = new Date(g.date);
            const dateStr = `${d.getDate().toString().padStart(2, '0')}/${d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}`;
            return {
                id: g.id,
                title: g.title,
                date: dateStr,
                location: g.location || 'A definir',
                status: g.contractUrl ? 'confirmed' : 'pending' as any,
                originalDate: d
            };
        });

    const nextGigDays = upcomingEventsData.length > 0
        ? Math.ceil((upcomingEventsData[0].originalDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        : null;

    let greetingContext = "Aqui está o que está acontecendo hoje.";
    if (nextGigDays !== null) {
        if (nextGigDays <= 0) greetingContext = "Hoje tem show! Prepare-se.";
        else if (nextGigDays === 1) greetingContext = "Amanhã temos show! Confira a logística.";
        else greetingContext = `Próximo show em ${nextGigDays} dias.`;
    }

    const recentActivityData: ActivityItem[] = activityLogs.map((log: any) => ({
        id: log.id,
        user: "Equipe",
        action: activityIcons[log.action] || log.action,
        target: log.details || "Ação no sistema",
        date: new Date(log.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    }));

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                            <LayoutDashboard className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                TUDO <span className="text-[#ccff00]">OK!</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">DADOS SINCRONIZADOS</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">TERMINAL ATIVO</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <Suspense fallback={null}>
                        <DateRangePicker />
                    </Suspense>
                    <a
                        href={`/api/bands/${band.id}/calendar`}
                        className="h-12 px-8 bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-[#ccff00] hover:bg-[#ccff00] hover:text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(204,255,0,0.05)] rounded-none"
                        title="Sincronizar Agenda"
                    >
                        <CalendarCheck className="h-4 w-4 mr-4" />
                        SINCRONIZAR CALENDÁRIO
                    </a>
                </div>
            </div>

            <QuickActions bandId={band.id} plan={plan} />

            {(fromDate || toDate) && (
                <div className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]/60 border-l border-[#ccff00]/30 pl-6 py-2 bg-[#ccff00]/2 rounded-none">
                    PERÍODO: {fromDate ? fromDate.toLocaleDateString('pt-BR') : 'INÍCIO'} ATÉ {toDate ? toDate.toLocaleDateString('pt-BR') : 'HOJE'}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard
                    title="PRÓXIMOS EVENTOS"
                    value={upcomingEventsData.length.toString()}
                    description="TOTAL NA AGENDA"
                    icon={<CalendarCheck className="h-4 w-4" />}
                    trend="up"
                />

                {canViewFinance ? (
                    <DashboardStatCard
                        title="MEU CAIXA"
                        value={netFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        description="VALOR EM CONTA"
                        icon={<DollarSign className="h-4 w-4" />}
                        trend="up"
                    />
                ) : (
                    <div className="bg-zinc-900/40 border border-white/5 p-8 flex flex-col items-center justify-center text-center group border-dashed relative overflow-hidden rounded-none">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 blur-2xl rounded-none" />
                        <Lock className="h-6 w-6 text-zinc-900 group-hover:text-red-500/50 transition-colors mb-4" />
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-800">FINANCEIRO</h3>
                            <p className="text-[8px] font-black text-zinc-900 uppercase tracking-tighter">MÓDULO BLOQUEADO</p>
                        </div>
                    </div>
                )}

                {canViewLogistics ? (
                    <DashboardStatCard
                        title="EQUIPAMENTOS"
                        value={technicalEquity.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        description={`${equipment.length} ITENS MARCADOS`}
                        icon={<Package className="h-4 w-4" />}
                    />
                ) : (
                    <div className="bg-zinc-900/40 border border-white/5 p-8 flex flex-col items-center justify-center text-center group border-dashed relative overflow-hidden rounded-none">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 blur-2xl rounded-none" />
                        <Lock className="h-6 w-6 text-zinc-900 group-hover:text-red-500/50 transition-colors mb-4" />
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-800">MEUS EQUIPOS</h3>
                            <p className="text-[8px] font-black text-zinc-900 uppercase tracking-tighter">MÓDULO BLOQUEADO</p>
                        </div>
                    </div>
                )}

                <DashboardStatCard
                    title="EVENTOS NO MÊS"
                    value={showsThisMonth.toString()}
                    description="TOTAL ESTE MÊS"
                    icon={<TrendingUp className="h-4 w-4" />}
                    trend="up"
                />
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-zinc-900/20 border border-white/5 p-8 shadow-xl rounded-none">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">PRÓXIMOS SHOWS</h2>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">CONFIRA OS PRÓXIMOS COMPROMISSOS AGENDADOS.</p>
                            </div>
                            <Link href="/dashboard/gigs">
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] hover:bg-[#ccff00] hover:text-black rounded-none font-heading">VER TUDO</Button>
                            </Link>
                        </div>
                        {upcomingEventsData.length > 0 ? (
                            <UpcomingEventsList data={upcomingEventsData.slice(0, 4)} />
                        ) : (
                            <div className="text-center py-20 border border-dashed border-white/5 rounded-none">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-800">NENHUM EVENTO AGENDADO PARA OS PRÓXIMOS DIAS</p>
                            </div>
                        )}
                    </div>

                    <Calendar gigs={gigs} bandId={band.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-zinc-900/40 border border-white/5 p-8 border-l-2 border-l-[#ccff00]/50 shadow-xl">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6 flex items-center gap-3">
                                <Car className="h-4 w-4 text-[#ccff00]" />
                                TRANSPORTE E VIAGEM
                            </h2>
                            {canViewLogistics ? (
                                recentTrip ? (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-black border border-white/5 shadow-2xl">
                                            <p className="text-xs font-black uppercase tracking-widest text-white leading-none">{recentTrip.eventName.toUpperCase()}</p>
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">{recentTrip.city.toUpperCase()} • {recentTrip.date}</p>
                                            <div className="mt-6">
                                                <span className="text-[8px] font-black px-3 py-1 bg-[#ccff00] text-black uppercase tracking-widest">
                                                    Hospedagem: {recentTrip.hotel?.toUpperCase() || "A DEFINIR"}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href="/dashboard/logistics/schedule" className="block w-full">
                                            <Button className="w-full bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black rounded-none h-12 transition-all font-heading">Ver Detalhes</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-800 italic">Nenhuma viagem ativa detectada.</p>
                                    </div>
                                )
                            ) : (
                                <div className="py-12 bg-black/40 border border-dashed border-white/10 flex flex-col items-center gap-4 opacity-40">
                                    <Lock className="h-6 w-6 text-zinc-800" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-800">Módulo Bloqueado</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-zinc-900/40 border border-white/5 p-8 border-l-2 border-l-white/10 shadow-xl">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6 flex items-center gap-3">
                                <Target className="h-4 w-4 text-[#ccff00]" />
                                ACESSOS RÁPIDOS
                            </h2>
                            <div className="space-y-2">
                                {[
                                    { name: "Equipamentos & Rider", href: canViewLogistics ? "/dashboard/rider" : "/dashboard", locked: !canViewLogistics },
                                    { name: "Contratos de Show", href: canViewCRM ? "/dashboard/contracts" : "/dashboard", locked: !canViewCRM },
                                    { name: "Gestão de Integrantes", href: "/dashboard/members", locked: false }
                                ].map((act, idx) => (
                                    <Link key={idx} href={act.href} className="flex items-center justify-between p-4 bg-black border border-white/5 hover:border-[#ccff00]/30 transition-all group shadow-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">{act.name}</span>
                                        {act.locked ? <Lock className="h-3 w-3 text-zinc-900" /> : <ArrowRight className="h-3 w-3 text-zinc-900 group-hover:text-[#ccff00]" />}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {canViewCRM && (
                        <div className="bg-zinc-900/20 border border-white/5 p-8 relative overflow-hidden group shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl -z-10 group-hover:bg-[#ccff00]/10 transition-all" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8">RANKING DE FATURAMENTO</h2>
                            {contractorRanking.length > 0 ? (
                                <div className="space-y-6">
                                    {contractorRanking.map((c: any, i: number) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{c.name.toUpperCase()}</span>
                                                <span className="text-[10px] font-black text-[#ccff00]">
                                                    {c.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                                </span>
                                            </div>
                                            <div className="h-1 bg-black border border-white/5 overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#ccff00] shadow-[0_0_10px_#ccff00] transition-all duration-1000" 
                                                    style={{ width: `${(c.total / contractorRanking[0].total) * 100}%` }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-800 italic">Nenhum contratante registrado...</p>
                            )}
                            <Link href="/dashboard/contractors" className="mt-10 block text-center text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-[#ccff00] transition-all">
                                [ABRIR GESTÃO DE CLIENTES]
                            </Link>
                        </div>
                    )}

                    <div className="bg-zinc-900/20 border border-white/5 p-8 shadow-xl">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-1">ÚLTIMAS ATIVIDADES</h2>
                        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mb-8">Acompanhe as mudanças recentes feitas pela equipe.</p>
                        <RecentActivityFeed data={recentActivityData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

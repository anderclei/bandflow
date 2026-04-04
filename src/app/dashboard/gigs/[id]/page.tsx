import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { Calendar as CalendarIcon, MapPin, Clock, DollarSign, FileText, ArrowLeft, Music, Maximize2, TrendingDown, TrendingUp } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { GigContract } from "@/components/dashboard/GigContract";
import { GigTaskList } from "@/components/dashboard/GigTaskList";
import { GigFinancePanel } from "@/components/dashboard/GigFinancePanel";
import { GigFinancialsEditor } from "@/components/dashboard/financial/GigFinancialsEditor";


export default async function GigDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    const { band } = await getActiveBand();

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const gig = await prisma.gig.findUnique({
        where: { id, bandId: band.id },
        include: {
            setlist: {
                include: {
                    items: {
                        include: {
                            song: true
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                }
            },
            // @ts-ignore
            tasks: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            // @ts-ignore
            memberFees: true,
            contractor: true,
            expenses: true,
            format: true
        }
    });

    if (!gig) {
        notFound();
    }

    const bandMembersRes = await prisma.member.findMany({
        where: { bandId: band.id },
        include: { user: true }
    });

    const suppliersRes = await prisma.logisticsSupplier.findMany({
        where: { bandId: band.id }
    });

    const formattedMembers = bandMembersRes.map(m => ({
        id: m.id,
        userName: m.user?.name || m.user?.email || "Usuário",
        role: m.role
    }));

    const gigTasks = (gig as any).tasks || [];
    const gigSetlist = (gig as any).setlist;
    const gigMemberFees = (gig as any).memberFees || [];

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/gigs"
                    className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:text-secondary hover:border-secondary/30 transition-all dark:bg-zinc-900 dark:border-zinc-800"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{gig.title}</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {new Date(gig.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Information Column */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 space-y-6">
                        <h2 className="text-xl font-bold text-foreground">Informações Gerais</h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Horário Principal</p>
                                    <p className="text-lg font-semibold">{new Date(gig.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Localização</p>
                                    <p className="text-zinc-700 dark:text-zinc-300 break-words">{gig.location || "Não definido"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                                    <DollarSign className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Cachê Bruto</p>
                                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                                        {gig.fee ? `R$ ${gig.fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Não definido"}
                                    </p>
                                </div>
                            </div>

                            {(gig.taxRate || gig.taxAmount) && (
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="p-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30">
                                        <TrendingDown className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Impostos & Deduções</p>
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                            -{((gig.fee || 0) * ((gig.taxRate || 0) / 100) + (gig.taxAmount || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            {gig.taxRate && <span className="text-[10px] ml-1">({gig.taxRate}%)</span>}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3 text-sm">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Cachê Líquido (Real)</p>
                                    <p className="text-lg font-bold text-secondary">
                                        {gig.fee
                                            ? (gig.fee - ((gig.fee * ((gig.taxRate || 0) / 100)) + (gig.taxAmount || 0)) - (gig.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0) - (gig.fee * (gig.commissionRate || 0) / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                            : "Não definido"
                                        }
                                    </p>
                                    <p className="text-[10px] text-zinc-400">Descontando gastos e comissão</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <GigContract gig={gig} bandName={band?.name as string} />
                        </div>
                    </div>

                    {/* Itinerary */}
                    {(gig.loadIn || gig.soundcheck || gig.showtime) && (
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                            <h2 className="text-xl font-bold text-foreground mb-6">Itinerário</h2>
                            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100 dark:before:bg-zinc-800">
                                {gig.loadIn && (
                                    <div className="relative pl-10">
                                        <div className="absolute left-3 top-2 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-zinc-900" />
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Load-in</p>
                                        <p className="font-semibold text-lg">{new Date(gig.loadIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                )}
                                {gig.soundcheck && (
                                    <div className="relative pl-10">
                                        <div className="absolute left-3 top-2 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-zinc-900" />
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Passagem de Som</p>
                                        <p className="font-semibold text-lg">{new Date(gig.soundcheck).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                )}
                                {gig.showtime && (
                                    <div className="relative pl-10">
                                        <div className="absolute left-3 top-2 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-white dark:ring-zinc-900" />
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Showtime</p>
                                        <p className="font-semibold text-lg">{new Date(gig.showtime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Advanced Finance Panel */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <h2 className="text-xl font-bold text-foreground mb-4">Controladoria do Show</h2>
                        <GigFinancialsEditor
                            gigId={gig.id}
                            initialFee={gig.fee}
                            initialTaxRate={gig.taxRate}
                            initialTaxAmount={gig.taxAmount}
                            initialExpenses={(gig as any).expenses || []}
                            initialCommissionRate={(gig as any).commissionRate}
                            initialStatus={(gig as any).status}
                            suppliers={suppliersRes}
                        />

                        <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-foreground mb-4">Rateio (Cachês Equipe)</h2>
                            <GigFinancePanel
                                gigId={gig.id}
                                totalFee={gig.fee}
                                members={formattedMembers}
                                initialFees={gigMemberFees}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tasks Checklist */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <h2 className="text-xl font-bold text-foreground mb-4">Checklist Logístico</h2>
                        <GigTaskList gigId={gig.id} initialTasks={gigTasks} />
                    </div>

                    {/* Notes */}
                    {gig.notes && (
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                            <h2 className="text-xl font-bold text-foreground mb-4">Notas do Evento</h2>
                            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {gig.notes}
                            </div>
                        </div>
                    )}

                    {/* Setlist */}
                    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 overflow-hidden">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                                    <Music className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {gigSetlist ? `Setlist: ${gigSetlist.title}` : "Sem Setlist"}
                                </h2>
                            </div>
                            {gigSetlist && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase">
                                        {/* @ts-ignore */}
                                        {gigSetlist.items?.length || 0} Músicas
                                    </span>
                                    <Link
                                        href={`/dashboard/setlists/${gigSetlist.id}/stage`}
                                        className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    >
                                        <Maximize2 className="h-3 w-3" />
                                        Abrir no Palco
                                    </Link>
                                </div>
                            )}
                        </div>

                        {gigSetlist ? (
                            <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {/* @ts-ignore */}
                                {gigSetlist.items?.map((item: any, index: number) => (
                                    <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <span className="w-6 text-sm font-black text-zinc-300 dark:text-zinc-700">{index + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-foreground truncate">{item.song.title}</p>
                                            <p className="text-xs text-zinc-500 truncate">{item.song.artist || "---"}</p>
                                        </div>
                                        <span className="text-xs font-mono text-zinc-400">
                                            {formatDuration(item.song.duration)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-zinc-500">Nenhum setlist foi vinculado a este show.</p>
                                <Link
                                    href={`/dashboard/gigs`}
                                    className="mt-4 inline-flex text-sm font-bold text-secondary hover:underline"
                                >
                                    Vincular agora no menu de edição
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

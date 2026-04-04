import { getActiveBand } from "@/lib/getActiveBand";
import { createGig, deleteGig } from "@/app/actions/gigs";
import { Calendar as CalendarIcon, MapPin, Plus, Trash2, Clock, DollarSign, FileText, Beaker, Users } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GigContract } from "@/components/dashboard/GigContract";
import { FreightCalculator } from "@/components/dashboard/FreightCalculator";
import { prisma } from "@/lib/prisma";

export default async function GigsPage() {
    const { band } = await getActiveBand({
        gigs: { include: { contractor: true }, orderBy: { date: 'asc' } },
        setlists: { orderBy: { title: 'asc' } },
        contractors: { orderBy: { name: 'asc' } }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const gigs = (band as any).gigs || [];
    const setlists = (band as any).setlists || [];
    const contractors = (band as any).contractors || [];

    // Buscar fornecedores de logística e cidade base da banda
    const suppliers = await (prisma as any).logisticsSupplier.findMany({
        where: { bandId: band.id },
        orderBy: { name: 'asc' },
    });
    const bandRaw = await (prisma as any).band.findUnique({
        where: { id: band.id },
        select: { addressCity: true }
    });
    const bandCity: string = (bandRaw as any)?.addressCity || "";

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] shadow-[0 0 40px rgba(204,255,0,0.1)]">
                        <CalendarIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                            Agenda <span className="text-zinc-600"> Shows</span>
                        </h1>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-4">
                            CRONOGRAMA GERAL // REGISTRO DE EXECUÇÃO
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Form to add gig */}
                <div className="lg:col-span-1 space-y-12">
                    <div className="sticky top-8 bg-zinc-900/40 p-10 border border-white/5 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                            <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">
                                AGENDAR NOVO SHOW
                            </h2>
                        </div>
                        <form action={createGig} className="space-y-8">
                            <div className="space-y-3">
                                <label htmlFor="gig-title" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">NOME DO SHOW</label>
                                        <input
                                            id="gig-title"
                                            name="title"
                                            required
                                            title="Título do Evento"
                                            className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-white placeholder:text-zinc-900 rounded-none"
                                            placeholder="EX: SHOW NO SESC"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="gig-date" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">DATA E HORA</label>
                                        <input
                                            id="gig-date"
                                            name="date"
                                            type="datetime-local"
                                            required
                                            title="Data e hora do show"
                                            className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-[#ccff00] cursor-pointer rounded-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="gig-location" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">LOCAL DO SHOW</label>
                                        <input
                                            id="gig-location"
                                            name="location"
                                            title="Localização do Evento"
                                            className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-white placeholder:text-zinc-900 rounded-none"
                                            placeholder="EX: RUA FLORES 123"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label htmlFor="gig-fee" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">VALOR DO CACHÊ</label>
                                            <input
                                                id="gig-fee"
                                                name="fee"
                                                type="number"
                                                step="0.01"
                                                title="Cachê Bruto"
                                                className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-[#ccff00] placeholder:text-zinc-900 rounded-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label htmlFor="gig-tax-rate" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">IMPOSTO %</label>
                                            <input
                                                id="gig-tax-rate"
                                                name="taxRate"
                                                type="number"
                                                step="0.1"
                                                title="Taxa de Imposto"
                                                className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-red-600 placeholder:text-zinc-900 rounded-none"
                                                placeholder="6.0"
                                            />
                                        </div>
                                    </div>
        
                                    <div className="space-y-8 pt-8 border-t border-white/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">CRONOGRAMA DO DIA</h4>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <label htmlFor="gig-load-in" className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">HORÁRIO CHEGADA</label>
                                        <input
                                            id="gig-load-in"
                                            name="loadIn"
                                            type="datetime-local"
                                            title="Horário de Chegada"
                                            className="w-full bg-black border border-white/10 py-4 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 rounded-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="gig-soundcheck" className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">PASSAGEM DE SOM</label>
                                        <input
                                            id="gig-soundcheck"
                                            name="soundcheck"
                                            type="datetime-local"
                                            title="Passagem de Som"
                                            className="w-full bg-black border border-white/10 py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 rounded-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="gig-showtime" className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">INÍCIO DO SHOW</label>
                                        <input
                                            id="gig-showtime"
                                            name="showtime"
                                            type="datetime-local"
                                            title="Início do Show"
                                            className="w-full bg-black border border-white/10 py-4 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 rounded-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-8 border-t border-white/5">
                                <div className="space-y-3">
                                    <label htmlFor="gig-setlist" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">QUAL SETLIST?</label>
                                    <select
                                        id="gig-setlist"
                                        name="setlistId"
                                        title="Selecione um setlist"
                                        className="w-full bg-black border border-white/10 py-5 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 appearance-none cursor-pointer rounded-none"
                                    >
                                        <option value="">NENHUM</option>
                                        {setlists.map((s: any) => (
                                            <option key={s.id} value={s.id}>{s.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="gig-contractor" className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">QUEM CONTRATOU?</label>
                                    <select
                                        id="gig-contractor"
                                        name="contractorId"
                                        title="Selecione o contratante"
                                        className="w-full bg-black border border-white/10 py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 appearance-none cursor-pointer rounded-none"
                                    >
                                        <option value="">VENDA DIRETA</option>
                                        {contractors.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#ccff00] py-8 text-[12px] font-black uppercase tracking-[0.5em] text-black hover:bg-white transition-all shadow-[0 0 40px rgba(204,255,0,0.15)] active:scale-95 mt-8 rounded-none"
                            >
                                AGENDAR SHOW
                            </button>
                        </form>
                    </div>

                    {/* Calculadora de Frete */}
                    <FreightCalculator
                        suppliers={suppliers as any}
                        bandCity={bandCity}
                    />
                </div>

                {/* List of gigs */}
                <div className="lg:col-span-2 space-y-8">
                    {gigs.length > 0 ? (
                        <div className="grid gap-8">
                            {gigs.map((gig: any) => (
                                <div key={gig.id} className="group relative bg-zinc-900/40 border border-white/5 p-10 hover:border-[#ccff00]/30 transition-all overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/2 blur-3xl pointer-events-none" />
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="flex flex-col items-center justify-center w-24 h-24 bg-black border border-white/5 text-[#ccff00] group-hover:border-[#ccff00]/40 transition-all shrink-0">
                                            <span className="text-3xl font-black tracking-tighter leading-none">{new Date(gig.date).getDate()}</span>
                                            <span className="text-[10px] uppercase font-black tracking-widest mt-2">{new Date(gig.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                        </div>
                                        <div className="flex-1 space-y-8">
                                            <div className="flex items-start justify-between border-b border-white/5 pb-8">
                                                <div>
                                                    <Link href={`/dashboard/gigs/${gig.id}`} className="block group/title">
                                                        <h3 className="text-2xl font-black font-heading uppercase tracking-tighter text-white group-hover:text-[#ccff00] transition-colors leading-none">{gig.title}</h3>
                                                    </Link>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-white/5 px-3 py-1">ID: {gig.id.slice(0,8)}</span>
                                                        {gig.contractor && (
                                                            <span className="text-[9px] font-black text-[#ccff00] uppercase tracking-widest">{gig.contractor.name}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <GigContract gig={gig} bandName={band?.name as string} />
                                                    <form action={async () => {
                                                        "use server";
                                                        await deleteGig(gig.id);
                                                    }}>
                                                        <button 
                                                            title="Excluir show"
                                                            className="w-12 h-12 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 text-zinc-500">
                                                        <Clock className="h-4 w-4 text-[#ccff00]" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest">{new Date(gig.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} SYNC</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-zinc-500">
                                                        <MapPin className="h-4 w-4 text-zinc-700" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest truncate">{gig.location || "NULL LOCATION"}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <DollarSign className="h-4 w-4 text-[#ccff00]" />
                                                        <span className="text-[11px] font-black text-white tracking-widest">
                                                            {gig.fee ? `R$ ${gig.fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "FEE PENDING"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-zinc-700">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest">
                                                            {gig.setlistId ? "SETLIST LOCKED" : "NULL SETLIST"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Itinerary Section */}
                                            {(gig.loadIn || gig.soundcheck || gig.showtime || gig.notes) && (
                                                <div className="pt-8 border-t border-white/5">
                                                    <h4 className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-6">LOCALS TEMPO & NOTAS</h4>
                                                    <div className="flex flex-wrap gap-8">
                                                        {gig.loadIn && (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 bg-blue-600 shadow-[0 0 10px rgba(37,99,235,0.5)]" />
                                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">LOAD-IN:</span>
                                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{new Date(gig.loadIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        )}
                                                        {gig.soundcheck && (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 bg-purple-600 shadow-[0 0 10px rgba(147,51,234,0.5)]" />
                                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">SYNC:</span>
                                                                <span className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest">{new Date(gig.soundcheck).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        )}
                                                        {gig.showtime && (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 bg-[#ccff00] shadow-[0 0 10px rgba(204,255,0,0.5)]" />
                                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">LIVE:</span>
                                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{new Date(gig.showtime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {gig.notes && (
                                                        <div className="mt-6 p-6 bg-black border border-white/5 text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                                                            {gig.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-black border border-dashed border-white/5 p-32 text-center flex flex-col items-center justify-center grayscale opacity-10">
                            <CalendarIcon className="h-16 w-16 text-zinc-900 mb-12" />
                            <h3 className="text-3xl font-black font-heading uppercase tracking-widest text-zinc-700 leading-none mb-6">Agenda Vazia</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-900">SISTEMA EM ESPERA AGUARDANDO REGISTRO DE EVENTO.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

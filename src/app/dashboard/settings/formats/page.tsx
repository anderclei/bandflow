import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { AudioLines, Plus, Trash2, ArrowLeft, DollarSign } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createShowFormat, deleteShowFormat } from "@/app/actions/formats";

export default async function ShowFormatsPage() {
    const { band } = await getActiveBand({
        formats: {
            orderBy: { createdAt: 'asc' }
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const formats = band.formats || [];

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/settings"
                            className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
                            title="Voltar"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <AudioLines className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                FORMATOS DE <span className="text-zinc-600"> SHOW</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">VARIEDADES DE EXIBIÇÃO</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">LIVE ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Form to add new format */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl relative overflow-hidden group rounded-none">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ccff00]/5 blur-[60px] rounded-none pointer-events-none" />
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] rounded-none">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">NOVO FORMATO</h2>
                        </div>

                        <form action={createShowFormat.bind(null, band.id)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">NOME DO FORMATO</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900 rounded-none"
                                    placeholder="EX: SHOW COMPLETO / ACÚSTICO..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">CACHÊ BASE (R$)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <DollarSign className="h-4 w-4 text-zinc-800" />
                                    </div>
                                    <input
                                        name="basePrice"
                                        type="number"
                                        step="0.01"
                                        className="w-full h-14 bg-black border border-white/10 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900 rounded-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">DETALHES DO SHOW</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    className="w-full bg-black border border-white/10 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900 resize-none rounded-none"
                                    placeholder="ESPECIFICAÇÕES DO FORMATO..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 w-full rounded-none"
                            >
                                SALVAR FORMATO
                            </button>
                        </form>
                    </div>
                </div>

                {/* List of formats */}
                <div className="lg:col-span-2">
                    {formats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formats.map((format: any) => (
                                <div key={format.id} className="group bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden transition-all hover:border-[#ccff00]/30 shadow-xl flex flex-col rounded-none">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] group-hover:bg-[#ccff00] group-hover:text-black transition-all rounded-none">
                                                <AudioLines className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-[14px] font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors">{format.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="w-1.5 h-1.5 rounded-none bg-[#ccff00] animate-pulse" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">ATIVO</span>
                                                </div>
                                            </div>
                                        </div>

                                        <form action={async () => {
                                            "use server";
                                            await deleteShowFormat(format.id);
                                        }}>
                                            <button
                                                type="submit"
                                                className="w-10 h-10 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 rounded-none"
                                                title="Excluir Formato"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>

                                    {format.description && (
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-8 leading-relaxed flex-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            {format.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-[11px] font-black text-[#ccff00] uppercase tracking-widest bg-black border border-white/5 px-4 py-2 rounded-none">
                                            CACHE: {format.basePrice
                                                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(format.basePrice)
                                                : "A COMBINAR"}
                                        </div>
                                        <Link
                                            href={`/dashboard/settings/formats/${format.id}/stage-plot`}
                                            className="text-[9px] font-black uppercase tracking-[0.4em] bg-white text-black px-6 py-3 hover:bg-[#ccff00] transition-all rounded-none"
                                        >
                                            MAPA DE PALCO
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 bg-zinc-900/20 border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-40 rounded-none">
                            <div className="w-20 h-20 bg-black border border-white/5 flex items-center justify-center text-zinc-900 mb-8 scale-150 rounded-none">
                                <AudioLines className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black font-heading uppercase tracking-widest text-zinc-700">SEM FORMATOS</h3>
                            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 max-w-sm">VOCÊ AINDA NÃO CADASTROU NENHUM FORMATO DE SHOW.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

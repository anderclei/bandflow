import { getActiveBand } from "@/lib/getActiveBand";
import { createSetlist, deleteSetlist } from "@/app/actions/setlists";
import SetlistManager from "@/components/dashboard/SetlistManager";
import { Music, Plus, Trash2, Calendar as CalendarIcon, Maximize2 } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SetlistsPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const selectedId = (await searchParams).id;

    const { band } = await getActiveBand({
        setlists: {
            orderBy: { updatedAt: 'desc' },
            include: { items: { include: { song: true }, orderBy: { position: 'asc' } } }
        },
        songs: { orderBy: { title: 'asc' } }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const setlists = (band as any).setlists || [];
    const availableSongs = (band as any).songs || [];

    const selectedSetlist = setlists.find((s: any) => s.id === selectedId) || setlists[0];

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Music className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                Setlists <span className="text-zinc-600">& Programação</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Audio_Sequence_Buffer</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                {/* Setlist List */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ccff00]/5 blur-[40px] rounded-full pointer-events-none" />
                        
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 mb-8 ml-1">Setlist_Repository</h2>
                        <div className="space-y-3">
                            {setlists.map((setlist: any) => (
                                <div key={setlist.id} className="group relative">
                                    <a
                                        href={`/dashboard/setlists?id=${setlist.id}`}
                                        className={`block w-full text-left p-4 transition-all border ${selectedId === setlist.id || (!selectedId && setlist.id === setlists[0]?.id)
                                            ? "bg-[#ccff00] text-black border-[#ccff00] font-black shadow-[0_0_20px_rgba(204,255,0,0.1)]"
                                            : "bg-black border-white/5 text-zinc-500 hover:text-white hover:border-white/20"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="h-3.5 w-3.5" />
                                            <span className="text-[10px] uppercase font-black tracking-widest truncate">{setlist.title}</span>
                                        </div>
                                    </a>
                                    <form action={async () => {
                                        "use server";
                                        await deleteSetlist(setlist.id);
                                    }} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-zinc-400 hover:text-red-500" title="Eliminate Setlist">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/5">
                            <form action={createSetlist} className="space-y-4">
                                <input
                                    name="title"
                                    required
                                    placeholder="NOME_DO_SETLIST..."
                                    className="w-full h-12 bg-black border border-white/10 px-4 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 placeholder:text-zinc-800 rounded-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black text-[10px] font-black uppercase tracking-[.4em] hover:bg-[#ccff00] transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] active:scale-95 rounded-none"
                                >
                                    <Plus className="h-4 w-4" />
                                    NEW_SEQUENCE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Manager Area */}
                <div className="lg:col-span-3">
                    {selectedSetlist ? (
                        <div className="space-y-10">
                            <div className="flex flex-col sm:flex-row items-center gap-8 p-10 bg-zinc-900 border border-white/5 backdrop-blur-md relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-[60px] rounded-full pointer-events-none" />
                                
                                <div className="w-20 h-20 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] shrink-0">
                                    <Music className="h-10 w-10" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h2 className="text-3xl font-black font-heading uppercase tracking-tighter text-white group-hover:text-[#ccff00] transition-colors">{selectedSetlist.title}</h2>
                                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">{selectedSetlist.items.length}_UNITS_LOADED</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Sequence_Locked</span>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full sm:w-auto">
                                    <Link
                                        href={`/dashboard/setlists/${selectedSetlist.id}/stage`}
                                        className="flex items-center justify-center gap-4 h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[.4em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 rounded-none"
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                        ON_STAGE_MODE
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-zinc-900/40 border border-white/5 p-1">
                                <SetlistManager
                                    setlist={selectedSetlist}
                                    availableSongs={availableSongs}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-white/5 bg-zinc-900/20 p-20 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.02)_0%,transparent_70%)]" />
                            <Music className="h-20 w-20 mb-8 text-zinc-800" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-4 ml-1">No_Active_Sequence</h3>
                            <p className="max-w-xs mx-auto text-[10px] font-black uppercase tracking-[0.2em] text-zinc-800 leading-relaxed">Selecione ou inicialize um novo buffer de setlist no painel lateral para prosseguir.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { getActiveBand } from "@/lib/getActiveBand";
import { createSong, deleteSong } from "@/app/actions/songs";
import { Music, Plus, Trash2, Clock, Paperclip, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { SongFileUpload } from "@/components/dashboard/SongFileUpload";

export default async function SongsPage() {
    const { band } = await getActiveBand({ songs: { orderBy: { createdAt: 'desc' } } });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const songs = (band as any).songs || [];

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")} `;
    };

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] shadow-[0_0_40px_rgba(204,255,0,0.1)]">
                        <Music className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                            MEU <span className="text-zinc-600"> REPERTÓRIO</span>
                        </h1>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-4">
                            BIBLIOTECA GERAL // GESTÃO DE OBRAS
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Form to add song */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-zinc-900/40 p-10 border border-white/5 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                            <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">
                                NOVA MÚSICA
                            </h2>
                        </div>
                        <form action={createSong} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">NOME DA MÚSICA</label>
                                <input
                                    name="title"
                                    required
                                    title="Título da Obra"
                                    className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-white placeholder:text-zinc-900 rounded-none"
                                    placeholder="EX: PARANOID"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">ARTISTA</label>
                                <input
                                    name="artist"
                                    title="Entidade Artista"
                                    className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-white placeholder:text-zinc-900 rounded-none"
                                    placeholder="EX: BLACK SABBATH"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">TEMPO (SEG)</label>
                                    <input
                                        name="duration"
                                        type="number"
                                        title="Duração em Segundos"
                                        className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-[#ccff00] placeholder:text-zinc-900 rounded-none"
                                        placeholder="170"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">BPM</label>
                                    <input
                                        name="bpm"
                                        type="number"
                                        title="Batidas por Minuto"
                                        className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-[#ccff00] placeholder:text-zinc-900 rounded-none"
                                        placeholder="120"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">TOM / ESCALA</label>
                                    <input
                                        name="key"
                                        title="Escala / Tom"
                                        className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-white placeholder:text-zinc-900 rounded-none"
                                        placeholder="AM"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">SITUAÇÃO</label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            title="Status da Música"
                                            className="w-full bg-black border border-white/10 py-5 px-6 text-[9px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 appearance-none text-[#ccff00] cursor-pointer rounded-none"
                                        >
                                            <option value="READY">PRONTA</option>
                                            <option value="IN_PROGRESS">EM ENSAIO</option>
                                            <option value="ARCHIVED">ARQUIVADA</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-800">
                                            <ChevronRight className="h-4 w-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">ISWC</label>
                                    <input
                                        name="iswc"
                                        title="Código ISWC"
                                        className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-zinc-500 placeholder:text-zinc-900 rounded-none"
                                        placeholder="T-034..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">ECAD ID</label>
                                    <input
                                        name="workId"
                                        title="Código ECAD"
                                        className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-zinc-500 placeholder:text-zinc-900 rounded-none"
                                        placeholder="1234..."
                                    />
                                </div>
                            </div>

                            <SongFileUpload />

                            <button
                                type="submit"
                                className="w-full bg-[#ccff00] py-8 text-[12px] font-black uppercase tracking-[0.5em] text-black hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.15)] active:scale-95 mt-6 rounded-none"
                            >
                                SALVAR MÚSICA
                            </button>
                        </form>
                    </div>
                </div>

                {/* List of songs */}
                <div className="lg:col-span-2 space-y-6">
                    {songs.length > 0 ? (
                        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-md relative overflow-hidden rounded-none">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ccff00]/20 via-transparent to-transparent" />
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-black/60 border-b border-white/5">
                                    <tr>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">NOME</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">ARTISTA</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">TOM</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">BPM</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">STATUS</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">TEMPO</th>
                                        <th className="px-10 py-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {songs.map((song: any) => (
                                        <tr key={song.id} className="group hover:bg-white/[0.03] transition-all">
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-10 h-10 flex items-center justify-center bg-black border border-white/5 text-[#ccff00] shadow-2xl group-hover:border-[#ccff00]/40 transition-all rounded-none">
                                                            <Music className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[13px] font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors">{song.title}</span>
                                                    </div>
                                                    {song.fileUrl && (
                                                        <a
                                                            href={song.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-16 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-[#ccff00] transition-colors"
                                                        >
                                                            <Paperclip className="h-3.5 w-3.5" />
                                                            VER ARQUIVO ANEXO
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                                                {song.artist || "---"}
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                {song.key ? (
                                                    <span className="inline-flex items-center bg-black border border-white/5 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest rounded-none">
                                                        {song.key}
                                                    </span>
                                                ) : "---"}
                                            </td>
                                            <td className="px-10 py-8 text-center text-[11px] font-black text-zinc-700 uppercase tracking-widest">
                                                {song.bpm || "---"}
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-none",
                                                    song.status === "READY" ? "border-[#ccff00]/40 text-[#ccff00] bg-[#ccff00]/5" : "border-white/5 text-zinc-800 bg-black"
                                                )}>
                                                    {song.status === "READY" ? "PRONTA" : song.status === "IN_PROGRESS" ? "ENSAIO" : "OFF"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-[11px] font-black text-zinc-500 uppercase tracking-widest text-right">
                                                {formatDuration(song.duration)}
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <form action={async () => {
                                                    "use server";
                                                    await deleteSong(song.id);
                                                }}>
                                                    <button 
                                                        title="Excluir Música"
                                                        className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-800 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 rounded-none"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-black border border-dashed border-white/5 p-32 text-center flex flex-col items-center justify-center grayscale opacity-10 rounded-none">
                            <Music className="h-16 w-16 text-zinc-900 mb-12" />
                            <h3 className="text-3xl font-black font-heading uppercase tracking-widest text-zinc-700 leading-none mb-6">BIBLIOTECA VAZIA</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-900">VOCÊ AINDA NÃO CADASTROU NENHUMA MÚSICA.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

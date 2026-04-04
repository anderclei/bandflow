import { getActiveBand } from "@/lib/getActiveBand";
import { ChevronLeft, ChevronRight, Music, AlertCircle, Clock, Maximize, Printer } from "lucide-react";
import { StageMetronome } from "@/components/dashboard/StageMetronome";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function StageViewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    const { band } = await getActiveBand({
        setlists: {
            where: { id },
            include: {
                items: {
                    include: { song: true },
                    orderBy: { position: 'asc' }
                }
            }
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const setlist = (band as any).setlists[0];

    if (!setlist) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-secondary/30">
            {/* Header / Controls */}
            <div className="flex items-center justify-between mb-12 no-print print:hidden">
                <Link
                    href={`/dashboard/setlists?id=${id}`}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="font-medium">Sair do Palco</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <h1 className="text-xl font-black tracking-tighter uppercase text-secondary">{setlist.title}</h1>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{band.name}</p>
                    </div>
                </div>
            </div>

            {/* Setlist Content */}
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4">
                    {setlist.items.map((item: any, index: number) => (
                        <div
                            key={item.id}
                            className="flex items-baseline gap-6 p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-all group"
                        >
                            <span className="text-2xl md:text-4xl font-black text-zinc-700 group-hover:text-secondary/50 transition-colors tabular-nums">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <div className="flex-1 flex items-baseline justify-between gap-4">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight truncate">
                                    {item.song.title}
                                </h2>
                                {/* Right Side - Metronome & Status */}
                                <div className="flex flex-col items-end gap-4 min-w-[200px]">
                                    {item.song.bpm && (
                                        <div className="print:hidden">
                                            <StageMetronome bpm={item.song.bpm} />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        {item.song.key && (
                                            <span className="text-2xl md:text-4xl font-black text-secondary bg-secondary/10 px-3 py-1 rounded-xl ring-1 ring-secondary/20">
                                                {item.song.key}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {setlist.items.length === 0 && (
                    <div className="text-center py-24">
                        <Music className="h-12 w-12 mx-auto mb-4 text-zinc-700" />
                        <h3 className="text-2xl font-bold text-zinc-500">Setlist Vazio</h3>
                        <p className="text-zinc-600 mt-2">Adicione músicas ao setlist antes de subir no palco.</p>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-24 pt-12 border-t border-white/5 text-center text-zinc-600 uppercase tracking-[0.2em] text-[10px] font-black">
                BandFlow Performance Mode &bull; Otimizado para Palco
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .bg-zinc-900\\/50 { background: transparent !important; border: 1px solid #ccc !important; }
                    .text-zinc-700 { color: #666 !important; }
                    .text-emerald-500 { color: black !important; border: 2px solid black !important; }
                }
                `
            }} />
        </div>
    );
}

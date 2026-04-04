import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { Copyright, Music, Plus, TrendingUp, DollarSign, Info } from "lucide-react";
import { redirect } from "next/navigation";
import { SongPublishingDetails } from "@/components/dashboard/SongPublishingDetails";
import Link from "next/link";
import { FeatureGuard } from "@/components/ui/feature-guard";

export default async function PublishingPage({
    searchParams,
}: {
    searchParams: Promise<{ songId?: string }>;
}) {
    const selectedSongId = (await searchParams).songId;

    const { band } = await getActiveBand({
        songs: {
            include: {
                splits: {
                    include: { member: { include: { user: true } } }
                },
                payments: true
            },
            orderBy: { title: 'asc' }
        },
        members: {
            include: { user: true }
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const songs = (band as any).songs || [];
    const members = (band as any).members || [];
    const selectedSong = songs.find((s: any) => s.id === selectedSongId);

    const totalRoyalties = songs.reduce((acc: number, song: any) => {
        return acc + song.payments.reduce((pAcc: number, p: any) => pAcc + p.amount, 0);
    }, 0);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <FeatureGuard
            plan={(band as any).subscriptionPlan}
            feature="publishing"
            fallbackTitle="Publishing & Direitos Autorais"
            fallbackDescription="Faça a gestão dos seus repasses, códigos ISRC e gere relatórios de streaming e UBC/Ecad. Funcionalidade Exclusiva do Plano PREMIUM."
        >
            <div className="space-y-12 pb-20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Copyright className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                    Rights <span className="text-zinc-600">_Publishing</span>
                                </h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">IP_Registry</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Royalties_Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/20" />
                        <p className="text-[8px] font-black text-[#ccff00]/60 uppercase tracking-[0.4em] mb-4">Total_Royalties_Gross</p>
                        <p className="text-3xl font-black text-[#ccff00] leading-none tracking-tighter">{formatCurrency(totalRoyalties)}</p>
                        <p className="text-[8px] text-zinc-800 mt-4 uppercase font-black tracking-widest leading-relaxed">Soma_Total_Relatórios</p>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800" />
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">Catalog_Entity_Count</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tighter">{songs.length}</p>
                        <p className="text-[8px] text-zinc-800 mt-4 uppercase font-black tracking-widest leading-relaxed">Music_Metadata_Nodes</p>
                    </div>

                    <div className="bg-black border border-[#ccff00]/20 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ccff00]/5 blur-3xl rounded-full" />
                        <p className="text-[8px] font-black text-[#ccff00] uppercase tracking-[0.4em] mb-4">Priority_Action</p>
                        <p className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-2">ISRC_Link_Protocol</p>
                        <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest leading-relaxed">Vincule_ISRCS_para_Rateio_Auto</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
                    <div className="xl:col-span-2 bg-zinc-900/40 border border-white/5 relative overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 text-zinc-700 text-[8px] uppercase font-black tracking-[0.5em] border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-6">WORK_TITLE</th>
                                    <th className="px-8 py-6">ISRC_ADDR</th>
                                    <th className="px-8 py-6">SPLIT_NODES</th>
                                    <th className="px-8 py-6 text-right">TOTAL_SHARE</th>
                                    <th className="px-8 py-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {songs.map((song: any) => (
                                    <tr key={song.id} className={`group hover:bg-white/5 transition-all ${selectedSongId === song.id ? 'bg-[#ccff00]/5 border-l-2 border-l-[#ccff00]' : ''}`}>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-white group-hover:text-[#ccff00] transition-colors shadow-2xl">
                                                    <Music className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <span className="text-[14px] font-black text-white uppercase tracking-widest block mb-1 group-hover:text-[#ccff00] transition-colors">{song.title}</span>
                                                    <span className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">{song.artist || "---"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-[10px] font-black font-mono text-zinc-500 tracking-widest">
                                            {song.isrc || "NULL_HEX"}
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex -space-x-3 overflow-hidden">
                                                {song.splits.map((split: any) => (
                                                    <div
                                                        key={split.id}
                                                        className="inline-block h-8 w-8 bg-zinc-900 border border-white/10 text-[#ccff00] flex items-center justify-center text-[10px] font-black hover:z-10 hover:scale-110 transition-all cursor-crosshair"
                                                        title={`${split.member.user.name}: ${split.percentage}%`}
                                                    >
                                                        {split.member.user.name?.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right font-black text-[#ccff00] text-[12px] tracking-widest">
                                            {formatCurrency(song.payments.reduce((acc: number, p: any) => acc + p.amount, 0))}
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <Link
                                                href={`/dashboard/publishing?songId=${song.id}`}
                                                className={`text-[8px] font-black uppercase tracking-[0.4em] transition-all px-4 py-2 border ${selectedSongId === song.id ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'text-zinc-700 border-zinc-900 hover:border-[#ccff00] hover:text-[#ccff00]'}`}
                                            >
                                                {selectedSongId === song.id ? 'ACTIVE' : 'MANAGE'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="xl:col-span-1">
                        {selectedSong ? (
                            <div className="sticky top-8 bg-zinc-900 border border-white/10 p-10 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                                <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                                    <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">{selectedSong.title}</h2>
                                    <Link href="/dashboard/publishing" className="text-[10px] font-black text-zinc-700 hover:text-white uppercase tracking-widest transition-colors underline underline-offset-4">CLOSE_X</Link>
                                </div>
                                <SongPublishingDetails song={selectedSong} members={members} />
                            </div>
                        ) : (
                            <div className="bg-black border border-dashed border-white/5 p-20 text-center flex flex-col items-center justify-center grayscale opacity-30">
                                <Music className="h-12 w-12 text-zinc-900 mb-8" />
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">NULL_SELECTION_POOL</h3>
                                <p className="mt-4 text-[8px] text-zinc-800 uppercase font-black tracking-widest leading-relaxed">Select_a_work_node_to_access_IP_protocol</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FeatureGuard>
    );
}

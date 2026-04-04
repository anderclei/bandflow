import { PlusCircle, Music2, ListMusic } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SongList } from "@/components/dashboard/repertoire/SongList"
import { SetlistBuilder } from "@/components/dashboard/repertoire/SetlistBuilder"
import { getActiveBand } from "@/lib/getActiveBand"
import { redirect } from "next/navigation"
import { AddSongDialog } from "@/components/dashboard/repertoire/AddSongDialog"

export default async function RepertoirePage() {
    const { band } = await getActiveBand({
        songs: {
            orderBy: { createdAt: 'desc' }
        },
        setlists: {
            include: { items: { include: { song: true } } },
            orderBy: { createdAt: 'desc' }
        }
    });

    if (!band) {
        redirect("/dashboard");
    }

    const songs = (band as any).songs || [];

    return (
        <div className="flex-1 space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.05)]">
                            <Music2 className="h-6 w-6" />
                        </div>
                        <h1 className="text-5xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                            MEU <span className="text-[#ccff00]">REPERTÓRIO</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        Gestão completa de músicas e organização do show.
                    </p>
                </div>
                <AddSongDialog />
            </div>

            <Tabs defaultValue="songs" className="space-y-10">
                <TabsList className="bg-black border border-white/5 p-1 h-16 rounded-none w-full sm:w-fit backdrop-blur-xl">
                    <TabsTrigger value="songs" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] rounded-none px-10 h-full transition-all border border-transparent data-[state=active]:border-[#ccff00]/40">
                        LISTA DE MÚSICAS
                    </TabsTrigger>
                    <TabsTrigger value="setlists" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] rounded-none px-10 h-full transition-all border border-transparent data-[state=active]:border-[#ccff00]/40">
                        MONTAR SHOW
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="songs" className="space-y-0 animate-in fade-in slide-in-from-bottom-2 duration-700 outline-none">
                    <div className="border border-white/5 bg-zinc-900/20 backdrop-blur-3xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 blur-3xl rounded-full -z-10 group-hover:bg-[#ccff00]/10 transition-all duration-1000" />
                        
                        <div className="border-b border-white/5 p-10 flex items-center justify-between bg-black/40">
                            <div className="space-y-2">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-white">BIBLIOTECA DE MÚSICAS</h3>
                                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">LISTA DE TODAS AS OBRAS CADASTRADAS</p>
                            </div>
                        </div>
                        <div className="p-10">
                            <SongList initialSongs={songs} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="setlists" className="space-y-0 outline-none animate-in fade-in duration-500">
                    <SetlistBuilder songs={songs} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

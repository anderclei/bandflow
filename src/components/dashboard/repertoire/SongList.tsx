"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Search, Music2, Clock, Paperclip } from "lucide-react"

export type Song = {
    id: string
    title: string
    artist?: string | null
    key?: string | null
    bpm?: number | null
    duration?: number | null
    status: string
    iswc?: string | null
    workId?: string | null
    fileUrl?: string | null
}

interface SongListProps {
    initialSongs: Song[]
}

export function SongList({ initialSongs }: SongListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [songs, setSongs] = useState(initialSongs)

    useEffect(() => {
        setSongs(initialSongs)
    }, [initialSongs])

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.artist?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getStatusColor = (status: Song['status']) => {
        switch (status) {
            case 'ready': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'rehearsing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            default: return 'bg-gray-500/10 text-gray-500'
        }
    }

    return (
        <div className="space-y-4">
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-800" />
                <Input
                    placeholder="PESQUISAR_ATIVOS_MUSICAIS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 bg-black/40 border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-[#ccff00] placeholder:text-zinc-900"
                />
            </div>

            <div className="rounded-none border border-white/5 overflow-hidden bg-zinc-900/10">
                <Table>
                    <TableHeader className="bg-black/60 border-b border-white/5">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-black text-zinc-600 text-[9px] uppercase tracking-[0.3em] h-14 px-6">Nome da Música</TableHead>
                            <TableHead className="font-black text-zinc-600 text-[9px] uppercase tracking-[0.3em] h-14">Artista</TableHead>
                            <TableHead className="text-center font-black text-zinc-600 text-[9px] uppercase tracking-[0.3em] h-14">Tonalidade</TableHead>
                            <TableHead className="text-center font-black text-zinc-600 text-[9px] uppercase tracking-[0.3em] h-14">BPM</TableHead>
                            <TableHead className="text-center font-black text-zinc-600 text-[9px] uppercase tracking-[0.3em] h-14">Duração</TableHead>
                            <TableHead className="text-center font-black text-zinc-600 text-[9px] uppercase tracking-[0.3em] h-14">Direitos Autorais</TableHead>
                            <TableHead className="text-right font-black text-zinc-600 text-[9px] uppercase tracking-[0.3em] h-14 px-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSongs.map((song) => (
                            <TableRow key={song.id} className="hover:bg-white/5 transition-colors border-white/5">
                                <TableCell className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-none bg-zinc-900 border border-white/5 text-[#ccff00]">
                                                <Music2 className="h-4 w-4" />
                                            </div>
                                            <span className="font-black text-[11px] uppercase tracking-widest text-white">{song.title}</span>
                                        </div>
                                        {song.fileUrl && (
                                            <a
                                                href={song.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-14 flex items-center gap-2 text-[8px] uppercase font-black tracking-widest text-[#ccff00]/60 hover:text-[#ccff00] transition-colors mt-2"
                                            >
                                                <Paperclip className="h-2.5 w-2.5" />
                                                [VER ANEXO]
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{song.artist || "---"}</TableCell>
                                <TableCell className="text-center">
                                    {song.key ? (
                                        <span className="inline-flex items-center rounded-none bg-zinc-900 border border-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#ccff00]">
                                            {song.key}
                                        </span>
                                    ) : "---"}
                                </TableCell>
                                <TableCell className="text-center font-black text-[10px] text-zinc-700 uppercase tracking-widest">{song.bpm || "---"}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        <Clock className="h-3 w-3 text-[#ccff00]" />
                                        {formatDuration(song.duration ?? null)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {(song.iswc || song.workId) ? (
                                        <div className="flex flex-col gap-1">
                                            {song.iswc && <span className="text-[9px] font-black text-[#ccff00] uppercase tracking-widest">{song.iswc}</span>}
                                            {song.workId && <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">ID {song.workId.slice(0,6)}</span>}
                                        </div>
                                    ) : "---"}
                                </TableCell>
                                <TableCell className="text-right px-6">
                                    <Badge variant="outline" className={cn(
                                        "text-[8px] font-black uppercase tracking-[0.2em] border px-3 py-1 rounded-none",
                                        song.status === "READY" && "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/30",
                                        song.status === "IN_PROGRESS" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                        song.status === "ARCHIVED" && "bg-zinc-900 text-zinc-600 border-white/5"
                                    )}>
                                        {song.status === 'READY' ? 'CONCLUÍDA' : song.status === 'IN_PROGRESS' ? 'EM ENSAIO' : 'ARQUIVADA'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

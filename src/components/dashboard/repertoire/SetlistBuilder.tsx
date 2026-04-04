"use client"

import { useState } from "react"
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Plus, Trash2, Save, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type Song = {
    id: string
    title: string
    artist: string | null
    key: string | null
    bpm: number | null
    duration: number | null
}

interface SetlistBuilderProps {
    songs: Song[]
}

export function SetlistBuilder({ songs }: SetlistBuilderProps) {
    const [setlistSongs, setSetlistSongs] = useState<Song[]>([])
    const sensors = useSensors(useSensor(PointerSensor))

    const totalDurationSeconds = setlistSongs.reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalMinutes = Math.floor(totalDurationSeconds / 60);
    const remainingSeconds = totalDurationSeconds % 60;

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    function SortableSongItem({ song, onDelete }: { song: Song, onDelete: (id: string) => void }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: song.id })
        const style = { 
            transform: CSS.Transform.toString(transform), 
            transition 
        }

        return (
            <div 
                ref={setNodeRef} 
                style={style} 
                className={cn(
                    "flex items-center gap-3 p-4 bg-black border border-white/5 rounded-none mb-3 shadow-none group hover:border-[#ccff00]/30 transition-all",
                    isDragging ? "opacity-50 z-50 ring-1 ring-[#ccff00]/20" : "opacity-100"
                )}
            >
                <div {...attributes} {...listeners} className="cursor-grab text-zinc-700 hover:text-[#ccff00] transition-colors">
                    <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-black text-[11px] uppercase tracking-widest text-white truncate">{song.title}</div>
                    <div className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] truncate mt-1">
                        {song.key || "NULL KEY"} • {song.bpm || "---"} BPM
                    </div>
                </div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {typeof song.duration === 'number' ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, "0")}` : song.duration}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(song.id)}
                    className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setSetlistSongs((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const addToSetlist = (song: Song) => {
        if (setlistSongs.find(s => s.id === song.id)) return
        setSetlistSongs([...setlistSongs, song])
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[650px]">
            <Card className="flex flex-col h-full border-white/5 bg-black/40 rounded-none">
                <CardHeader>
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em]">BIBLIOTECA</CardTitle>
                    <CardDescription className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">SELECIONE AS MÚSICAS PARA O SHOW</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full px-4">
                        <div className="space-y-1 pb-4">
                            {songs.map(song => (
                                <div key={song.id} className="flex items-center justify-between p-3 text-sm border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 rounded-lg transition-colors group">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold tracking-tight">{song.title}</div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase">{song.artist || "---"}</div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-secondary hover:bg-secondary/10" onClick={() => addToSetlist(song)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="flex flex-col h-full border-[#ccff00]/10 bg-zinc-900/20 rounded-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/2 blur-3xl pointer-events-none" />
                <CardHeader className="pb-3 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-white">RELAÇÃO DO SHOW</CardTitle>
                            <CardDescription className="text-[8px] font-bold uppercase tracking-widest text-[#ccff00]/40 mt-1">ARRASIE PARA ORGANIZAR A ORDEM</CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-[#ccff00]/5 border-[#ccff00]/20 text-[#ccff00] rounded-none px-3">
                            <Clock className="h-3 w-3" />
                            {totalMinutes}M {remainingSeconds > 0 ? `${remainingSeconds}S` : ""} ESTIMADO
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-2">
                    <ScrollArea className="h-full p-2">
                        {setlistSongs.length === 0 ? (
                            <div className="h-[300px] flex flex-col items-center justify-center text-zinc-800 text-[10px] border-2 border-dashed border-white/5 rounded-none uppercase font-black tracking-[0.3em] p-10 text-center">
                                <Plus className="h-8 w-8 mb-4 opacity-10" />
                                <p>ADICIONE AS MÚSICAS DA BIBLIOTECA AO LADO</p>
                            </div>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={setlistSongs} strategy={verticalListSortingStrategy}>
                                    {setlistSongs.map(song => (
                                        <SortableSongItem key={song.id} song={song} onDelete={(id) => setSetlistSongs(s => s.filter(x => x.id !== id))} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </ScrollArea>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button className="w-full gap-4 h-16 font-black uppercase tracking-[0.5em] text-[11px] shadow-none bg-[#ccff00] text-black hover:bg-white rounded-none border-0 transition-all active:scale-95">
                        <Save className="h-4 w-4" />
                        SALVAR REPERTÓRIO
                    </Button>
                </div>
            </Card>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Clock, Plus, Share2, Trash2, MapPin, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ScheduleItem {
    id: string
    time: string
    activity: string
    location?: string
    type: "LOGISTICS" | "SOUNDCHECK" | "SHOW" | "OTHER"
}

const itemTypeStyles = {
    LOGISTICS: "bg-blue-600/10 text-blue-500 border-blue-500/20",
    SOUNDCHECK: "bg-orange-600/10 text-orange-500 border-orange-500/20",
    SHOW: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
    OTHER: "bg-zinc-800 text-zinc-500 border-white/5",
}

const itemTypeLabels = {
    LOGISTICS: "LOGÍSTICA",
    SOUNDCHECK: "PASSAGEM SOM",
    SHOW: "EXECUÇÃO SHOW",
    OTHER: "OUTROS",
}

export function ScheduleClient({ bandName }: { bandName: string }) {
    const [items, setItems] = useState<ScheduleItem[]>([
        { id: "1", time: "14:00", activity: "Saída da Sede", type: "LOGISTICS", location: "Base da Banda" },
        { id: "2", time: "16:00", activity: "Chegada no Local e Montagem", type: "LOGISTICS" },
        { id: "3", time: "17:30", activity: "Passagem de Som", type: "SOUNDCHECK" },
        { id: "4", time: "21:00", activity: "Início do Show", type: "SHOW" },
        { id: "5", time: "23:00", activity: "Desmontagem e Retorno", type: "LOGISTICS" },
    ])

    const shareOnWhatsApp = () => {
        const header = `*CRONOGRAMA GERAL - ${bandName.toUpperCase()}*\n\n`
        const body = items
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(item => `[${item.time}] - ${item.activity.toUpperCase()}${item.location ? ` (@ ${item.location})` : ""}`)
            .join("\n")

        const footer = "\n\nRELATÓRIO GERADO VIA BANDFLOW"
        const text = encodeURIComponent(header + body + footer)
        window.open(`https://wa.me/?text=${text}`, " blank")
        toast.success("REGISTRO WHATSAPP INICIADO");
    }

    return (
        <div className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                            Cronograma <span className="text-zinc-600"> Operacional</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                            SEQUENCIAMENTO DE ATIVOS E EVENTOS TEMPORAIS
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={shareOnWhatsApp} className="h-14 px-8 border-white/10 rounded-none font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00]">
                            <Share2 className="h-4 w-4 mr-3" /> DISTRIBUIR VIA WHATSAPP
                        </Button>
                        <Button className="h-14 px-10 bg-[#ccff00] text-black hover:bg-white rounded-none border-none font-black uppercase tracking-widest text-[10px] shadow-[0 0 30px rgba(204,255,0,0.1)]">
                            <Plus className="h-4 w-4 mr-3" /> ADICIONAR MARCO
                        </Button>
                    </div>
                </div>

            <div className="relative space-y-0 pb-12 mt-12">
                {/* Linha vertical da timeline */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />

                <div className="space-y-12">
                    {items.sort((a, b) => a.time.localeCompare(b.time)).map((item, index) => (
                        <div key={item.id} className="relative pl-16 group">
                            {/* Ponto na timeline */}
                            <div className={cn(
                                "absolute left-[21px] top-1.5 h-3 w-3 rounded-none border-2 border-black z-10 transition-all group-hover:scale-150 group-hover:bg-[#ccff00]",
                                item.type === "SHOW" ? "bg-[#ccff00] shadow-[0 0 15px #ccff00]" : "bg-zinc-800"
                            )} />

                            <div className="bg-zinc-900/40 rounded-none p-8 border border-white/5 transition-all hover:border-[#ccff00]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ccff00]/2 blur-2xl pointer-events-none" />
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-6">
                                            <span className="text-3xl font-black text-white tracking-widest">{item.time}</span>
                                            <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-none", itemTypeStyles[item.type])}>
                                                {itemTypeLabels[item.type]}
                                            </Badge>
                                        </div>
                                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 leading-tight">{item.activity}</h3>
                                        {item.location && (
                                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-zinc-700">
                                                <MapPin className="h-3 w-3" />
                                                {item.location}
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-zinc-800 hover:text-red-500 hover:bg-red-500/5 transition-all">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

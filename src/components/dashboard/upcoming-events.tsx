"use client"

import { MapPin } from "lucide-react"

export interface UpcomingEvent {
    id: string
    title: string
    date: string // DD/MMM like "25/ABR"
    location: string
    status: "confirmed" | "pending"
    originalDate: Date
}

interface UpcomingEventsListProps {
    data: UpcomingEvent[]
}

export function UpcomingEventsList({ data }: UpcomingEventsListProps) {
    if (data.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-sm text-zinc-500">Nenhum evento próximo.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((event) => (
                        <div key={event.id} className="group flex items-center justify-between p-4 bg-black border border-white/5 hover:border-[#ccff00]/30 transition-all relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/10 group-hover:bg-[#ccff00]/40 transition-all" />
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center justify-center w-14 h-14 bg-zinc-900 border border-white/5 text-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{event.date.split('/')[1]}</span>
                                    <span className="text-xl font-black leading-none">{event.date.split('/')[0]}</span>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white truncate">{event.title}</h4>
                                    <div className="flex items-center text-[9px] font-bold text-zinc-600 mt-1 uppercase tracking-widest truncate">
                                        <MapPin className="mr-2 h-3 w-3 shrink-0 text-[#ccff00]/60" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-4 shrink-0">
                                <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${event.status === 'confirmed'
                                    ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]'
                                    : 'bg-zinc-900 border-white/5 text-zinc-500'
                                    }`}>
                                    {event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                </div>
                            </div>
                        </div>
            ))}
        </div>
    )
}

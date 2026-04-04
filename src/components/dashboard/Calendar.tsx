"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Gig {
    id: string;
    title: string;
    date: Date;
    location?: string | null;
}

interface CalendarProps {
    gigs?: Gig[];
    bandId?: string;
}

export default function Calendar({ gigs = [], bandId }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
    const startDay = firstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    const getGigsForDay = (day: number) => {
        return gigs.filter(gig => {
            const gigDate = new Date(gig.date);
            return gigDate.getDate() === day && gigDate.getMonth() === month && gigDate.getFullYear() === year;
        });
    };

    return (
        <div className="bg-black border border-white/5 p-8 rounded-none shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/2 blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 border-b border-white/5 pb-8 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center text-[#ccff00]">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black font-heading uppercase tracking-tighter text-white leading-none">
                            {monthNames[month]} <span className="text-zinc-700">{year}</span>
                        </h2>
                        {bandId && (
                            <div className="mt-2 flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">AGENDA ATIVA</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <a
                                    href={`/api/bands/${bandId}/calendar`}
                                    className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00] hover:text-white transition-colors flex items-center gap-2"
                                    title="Exportar Calendário"
                                >
                                    SINCRONIZAR AGENDA .ICS <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-zinc-950 border border-white/5 p-1 rounded-none">
                    <button 
                        onClick={prevMonth}
                        className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-[#ccff00] hover:bg-zinc-900 transition-all border border-transparent hover:border-white/5 rounded-none"
                        title="Mês Anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="w-px h-6 bg-white/5" />
                    <button 
                        onClick={nextMonth}
                        className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-[#ccff00] hover:bg-zinc-900 transition-all border border-transparent hover:border-white/5 rounded-none"
                        title="Próximo Mês"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px mb-6 relative z-10">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 py-4 border-b border-white/5 rounded-none">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 relative z-10">
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-32 bg-zinc-900/5 border border-transparent opacity-10 rounded-none" />
                ))}
                {days.map(day => {
                    const dayGigs = getGigsForDay(day);
                    const today = isToday(day);
                    return (
                        <div
                            key={day}
                            className={`h-32 p-4 border transition-all rounded-none relative group cursor-pointer ${today
                                ? "bg-[#ccff00]/5 border-[#ccff00]/30 shadow-[0_0_30px_rgba(204,255,0,0.05)]"
                                : "bg-black border-white/5 hover:bg-zinc-900 hover:border-white/10"
                                }`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-widest ${today ? "text-[#ccff00]" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                                {day.toString().padStart(2, '0')}
                            </span>
                            <div className="mt-4 space-y-2 overflow-y-auto max-h-[70px] scrollbar-hide rounded-none">
                                {dayGigs.map(gig => (
                                    <div
                                        key={gig.id}
                                        className="text-[9px] p-2 bg-zinc-950 border border-white/5 text-white font-bold uppercase tracking-tight group-hover:border-[#ccff00]/20 transition-colors rounded-none"
                                        title={gig.title}
                                    >
                                        <div className="truncate text-[#ccff00]">
                                            {gig.title}
                                        </div>
                                        {gig.location && (
                                            <div className="flex items-center gap-1.5 text-zinc-500 mt-1">
                                                <MapPin className="h-2 w-2" />
                                                <span className="truncate">{gig.location}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {today && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-none bg-[#ccff00] animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

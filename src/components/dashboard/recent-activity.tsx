"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface ActivityItem {
    id: string
    user: string
    avatar?: string
    action: string
    target: string
    date: string
}

interface RecentActivityFeedProps {
    data: ActivityItem[]
}

export function RecentActivityFeed({ data }: RecentActivityFeedProps) {
    if (data.length === 0) {
        return (
            <p className="text-xs text-zinc-400 italic py-4 text-center">Nenhuma atividade recente encontrada.</p>
        );
    }

    return (
        <div className="space-y-6">
            {data.map((item) => (
                <div key={item.id} className="flex items-start group">
                    <div className="relative">
                        <div className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                            {item.avatar ? (
                                <img src={item.avatar} alt={item.user} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-[10px] font-black text-zinc-600">{item.user.substring(0, 2).toUpperCase()}</div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ccff00] border border-black" />
                    </div>
                    <div className="ml-5 flex-1 min-w-0">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] leading-none group-hover:text-white transition-colors">{item.user}</span>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight leading-normal">
                                {item.action} <span className="text-white">{item.target}</span>
                            </p>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="h-px bg-white/5 flex-1" />
                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest whitespace-nowrap">
                                {item.date}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

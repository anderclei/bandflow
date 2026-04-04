"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DashboardStatCardProps {
    title: string
    value: string
    description: string
    icon: React.ReactNode
    trend?: "up" | "down" | "neutral"
    trendValue?: string
}

export function DashboardStatCard({ title, value, description, icon: Icon, trend, trendValue }: DashboardStatCardProps) {
    return (
        <Card className="rounded-none bg-zinc-900 border border-white/5 hover:border-[#ccff00]/50 transition-all shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    {title}
                </CardTitle>
                <div className="p-2 bg-black border border-white/5 text-[#ccff00]">
                    {Icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black font-heading tracking-tighter text-white uppercase">{value}</div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">{description}</p>
                    {trend === "up" && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#ccff00] text-black text-[8px] font-black uppercase tracking-tighter">
                            Tudo Certo
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

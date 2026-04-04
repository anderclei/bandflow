"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Clock, Hotel, Plane, Coffee, Truck } from "lucide-react"

const logisticsTabs = [
    { name: "HORÁRIOS", href: "/dashboard/logistics/schedule", icon: Clock },
    { name: "HOTEL", href: "/dashboard/logistics/hotel", icon: Hotel },
    { name: "TRANSPORTE", href: "/dashboard/logistics/travel", icon: Plane },
    { name: "CAMARIM", href: "/dashboard/logistics/camarim", icon: Coffee },
    { name: "FORNECEDORES", href: "/dashboard/logistics/suppliers", icon: Truck },
]

export default function LogisticsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="flex-1 space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00] shadow-[0 0 30px rgba(204,255,0,0.05)]">
                            <Truck className="h-6 w-6" />
                        </div>
                        <h1 className="text-5xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                            LOGÍSTICA <span className="text-[#ccff00]"> DO SHOW</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        GESTAO COMPLETA DE TRANSPORTE, EQUIPE E INFRAESTRUTURA.
                    </p>
                </div>
            </div>

            <div className="bg-black border border-white/5 p-1 h-16 w-full sm:w-fit backdrop-blur-xl flex items-center gap-1">
                {logisticsTabs.map((tab) => {
                    const isActive = pathname === tab.href
                    const Icon = tab.icon

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "group inline-flex items-center px-10 h-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-transparent whitespace-nowrap",
                                isActive
                                    ? "bg-[#ccff00] text-black border-[#ccff00]/40"
                                    : "text-zinc-600 hover:text-zinc-300"
                            )}
                        >
                            <Icon className={cn("mr-3 h-4 w-4", isActive ? "text-black" : "text-zinc-600")} />
                            {tab.name}
                        </Link>
                    )
                })}
            </div>

            {/* Injeta a página selecionada */}
            <div className="pt-4">
                {children}
            </div>
        </div>
    )
}

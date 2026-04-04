"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    CalendarPlus,
    FileText,
    PlusCircle,
    ArrowRight,
    Globe,
    Briefcase
} from "lucide-react";

interface QuickActionsProps {
    bandId: string;
    plan?: string;
}

export function QuickActions({ bandId, plan }: QuickActionsProps) {
    const isPro = plan === 'PRO' || plan === 'PREMIUM';
    const isPremium = plan === 'PREMIUM';

    const actions = [
        {
            title: "MARCAR SHOW",
            description: "Adicionar data no calendário",
            href: "/dashboard/gigs",
            icon: CalendarPlus,
            show: true
        },
        {
            title: "VENDAS",
            description: "Gerenciar novos contratos",
            href: "/dashboard/contractors",
            icon: Briefcase,
            show: isPro
        },
        {
            title: "PALCO E SOM",
            description: "Configs de rider e mapa",
            href: "/dashboard/rider",
            icon: FileText,
            show: isPro
        },
        {
            title: "DIVULGAÇÃO (EPK)",
            description: "Site para contratantes",
            href: "/dashboard/epk",
            icon: Globe,
            show: isPremium
        },
        {
            title: "FINANCEIRO",
            description: "Ver entradas e saídas",
            href: "/dashboard/finance",
            icon: PlusCircle,
            show: isPro
        },
    ];

    const visibleActions = actions.filter(a => a.show).slice(0, 4);

    if (!isPro && visibleActions.length < 4) {
        visibleActions.push({
            title: "ARQUIVOS",
            description: "Documentos e recibos",
            href: "/dashboard/documents",
            icon: FileText,
            show: true
        });
        visibleActions.push({
            title: "REPERTÓRIO",
            description: "Lista de músicas",
            href: "/dashboard/repertoire",
            icon: FileText,
            show: true
        });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleActions.slice(0, 4).map((action) => (
                <Link
                    key={action.title}
                    href={action.href}
                    className="group relative overflow-hidden bg-zinc-900/40 border border-white/5 p-8 shadow-2xl backdrop-blur-md transition-all hover:border-[#ccff00]/30 active:scale-95 rounded-none"
                    title={action.title}
                >
                    <div className="flex items-center gap-6">
                        <div className="flex h-12 w-12 items-center justify-center bg-black border border-white/5 text-[#ccff00] transition-all group-hover:scale-110 group-hover:bg-[#ccff00] group-hover:text-black">
                            <action.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors truncate">{action.title}</h3>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter truncate mt-1">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-800 transition-transform group-hover:translate-x-1 group-hover:text-[#ccff00]" />
                    </div>
                </Link>
            ))}
        </div>
    );
}

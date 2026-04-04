"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    FileText,
    Music,
    Map,
    Camera,
    LayoutTemplate,
    Clock,
    Hotel,
    DollarSign,
    Users,
    Package,
    MessageCircle,
    Settings,
    LogOut,
    ChevronLeft,
    PanelLeft,
    AudioLines,
    ChevronRight,
    Plus,
    User,
    Hammer,
    Shield,
    ShoppingBag,
    Briefcase,
    FolderOpen,
    Share2,
    BarChart3,
    Sparkles,
    Globe,
    Lock,
    LifeBuoy
} from "lucide-react";
import { signOut } from "next-auth/react";
import { BandSelector } from "./BandSelector";
import { useRoleStore, UserRole } from "@/store/useRoleStore";

interface SidebarProps {
    memberships: any[];
    activeBandId: string;
    activeBand?: any;
    isSuperAdmin?: boolean;
}

// Plan validation helper mapped directly for the Sidebar view
const hasAccessTo = (bandPlan: string, requiredPlan: "ESSENTIAL" | "PRO" | "PREMIUM", moduleId?: string, customModules: string[] = []) => {
    // Check feature flag override first
    if (moduleId && customModules.includes(moduleId)) {
        return true;
    }

    const plans = {
        ESSENTIAL: 1,
        PRO: 2,
        PREMIUM: 3
    };

    // Fallback if no plan is set yet (e.g legacy bands) we assume PREMIUM to avoid breaking
    const currentLevel = plans[bandPlan as keyof typeof plans] || 3;
    const requiredLevel = plans[requiredPlan];

    return currentLevel >= requiredLevel;
};

export function Sidebar({ memberships, activeBandId, activeBand, isSuperAdmin = false }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const { currentRole } = useRoleStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    let bands = memberships.map((m) => m.band);
    if (isSuperAdmin && activeBand && !bands.find(b => b.id === activeBand.id)) {
        bands = [activeBand, ...bands];
    }

    // Branding colors
    const primaryColor = activeBand?.primaryColor || "#0a0a0a";
    const secondaryColor = activeBand?.secondaryColor || "#ccff00";
    const currentPlan = activeBand?.subscriptionPlan || "PREMIUM";

    // Parse customModules safely
    let customModulesOverride: string[] = [];
    try {
        if (activeBand?.customModules) {
            customModulesOverride = typeof activeBand.customModules === 'string'
                ? JSON.parse(activeBand.customModules)
                : activeBand.customModules;
        }
    } catch (e) {
        console.error("Error parsing custom modules:", e);
    }

    const navigationGroups = [
        {
            name: "MENU",
            plan: "ESSENTIAL",
            items: [
                { name: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard, plan: "ESSENTIAL" },
                { name: "AGENDA SHOWS", href: "/dashboard/gigs", icon: Calendar, plan: "ESSENTIAL" },
            ]
        },
        {
            name: "VENDAS",
            plan: "PRO",
            items: [
                { name: "CONTRATANTES", href: "/dashboard/contractors", icon: Briefcase, plan: "PRO", moduleId: "COMMERCIAL" },
                { name: "CONTRATOS", href: "/dashboard/contracts", icon: FileText, plan: "PRO", moduleId: "GIG_CONTRACTS" },
            ]
        },
        {
            name: "ESTRUTURA LATERAL",
            plan: "ESSENTIAL",
            items: [
                { name: "LOGÍSTICA", href: "/dashboard/logistics/schedule", icon: Map, plan: "PRO", moduleId: "LOGISTICS" },
                { name: "RIDER & MAPA", href: "/dashboard/rider", icon: AudioLines, plan: "PRO" }, 
                { name: "REPERTÓRIO", href: "/dashboard/repertoire", icon: Music, plan: "ESSENTIAL" },
                { name: "EQUIPAMENTOS", href: "/dashboard/inventory", icon: Package, plan: "PRO" },
            ]
        },
        {
            name: "FINANCEIRO",
            plan: "ESSENTIAL",
            items: [
                { name: "GESTÃO FINANCEIRA", href: "/dashboard/finance", icon: DollarSign, plan: "PRO", moduleId: "FINANCE" },
                { name: "EQUIPE DA BANDA", href: "/dashboard/members", icon: Users, plan: "ESSENTIAL" },
                { name: "ARQUIVOS & DOCS", href: "/dashboard/documents", icon: FolderOpen, plan: "ESSENTIAL" },
                { name: "GALERIA DE MÍDIA", href: "/dashboard/media", icon: Camera, plan: "ESSENTIAL" },
                { name: "SUPORTE", href: "/dashboard/support", icon: LifeBuoy, plan: "ESSENTIAL" },
            ]
        },
        {
            name: "ONLINE",
            plan: "PREMIUM",
            items: [
                { name: "PRESS KIT (EPK)", href: "/dashboard/epk", icon: Globe, plan: "PREMIUM", moduleId: "EPK" },
                { name: "PRODUTOS & ESTOQUE", href: "/dashboard/merch", icon: ShoppingBag, plan: "PREMIUM" },
                { name: "INTELIGÊNCIA ARTIFICIAL", href: "/dashboard/intelligence", icon: Sparkles, plan: "PREMIUM" },
            ]
        }
    ];

    const filteredGroups = navigationGroups.filter(group => {
        // We show all groups, but lock items based on the plan. We keep the group visible so the user knows what they are missing (upsell)
        return true;
    }).map(group => {
        return { ...group, items: group.items };
    }).filter(group => group.items.length > 0);

    // Prevent hydration mismatch by rendering a structural match until client-side state is active
    if (!isMounted) {
        return (
            <aside
                className={cn(
                    "relative flex flex-col border-r border-white/5 transition-all duration-300 ease-in-out shrink-0 bg-[#0a0a0a] rounded-none",
                    isCollapsed ? "w-[64px]" : "w-60"
                )}
            />
        );
    }

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r border-white/5 transition-all duration-300 ease-in-out shrink-0 bg-[#0a0a0a] rounded-none",
                isCollapsed ? "w-[64px]" : "w-60"
            )}
        >
            <div className="flex h-16 items-center border-b border-white/5 px-6 shrink-0 bg-black/80 rounded-none">
                <div className="flex-1 flex items-center justify-center">
                    {!isCollapsed && (
                        isSuperAdmin ? (
                            <Link href="/super-admin" className="hover:opacity-80 transition-opacity">
                                <span className="text-[1.8rem] font-black uppercase tracking-tighter leading-none select-none">
                                    <span className="text-white">Band</span>
                                    <span className="text-[#ccff00]">Flow</span>
                                </span>
                            </Link>
                        ) : (
                            <span className="text-[1.8rem] font-black uppercase tracking-tighter leading-none select-none">
                                <span className="text-white">Band</span>
                                <span className="text-[#ccff00]">Flow</span>
                            </span>
                        )
                    )}
                </div>
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="ml-auto w-8 h-8 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-all rounded-none"
                        title="Recolher barra lateral"
                        aria-label="Recolher"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isCollapsed && (
                <div className="flex h-12 items-center justify-center border-b border-white/5 bg-black/10 rounded-none">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="rounded-none p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                        title="Expandir barra lateral"
                        aria-label="Expandir"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {(bands.length > 0 || isSuperAdmin) && (
                <>
                    <div className={cn("my-4 mb-5 transition-all shrink-0", isCollapsed ? "px-1" : "px-3")}>
                        <BandSelector
                            bands={bands}
                            activeBandId={activeBandId}
                            isCollapsed={isCollapsed}
                            primaryColor={primaryColor}
                            secondaryColor={activeBand?.secondaryColor}
                        />
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-1.5 custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-none">
                        {filteredGroups.map((group) => (
                            <div key={group.name} className="space-y-0.5 relative">
                                {!isCollapsed && (
                                    <div className="px-2 pb-0.5 pt-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-600/80">
                                        {group.name}
                                    </div>
                                )}
                                
                                <div className="space-y-0">
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        const Icon = item.icon;
                                        const isLocked = !hasAccessTo(currentPlan, item.plan as "ESSENTIAL" | "PRO" | "PREMIUM", (item as any).moduleId, customModulesOverride);

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "group flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-l-2 rounded-none",
                                                    isActive
                                                        ? "bg-[#ccff00]/5 border-l-[#ccff00] text-white"
                                                        : "text-zinc-600 border-l-transparent hover:bg-white/5 hover:text-white",
                                                    isCollapsed && "justify-center px-0 py-2.5 w-10 mx-auto",
                                                    isLocked && "opacity-40 hover:opacity-100"
                                                )}
                                                title={isCollapsed ? `${item.name} ${isLocked ? '(Bloqueado)' : ''}` : ""}
                                            >
                                                <div className="flex items-center">
                                                    <Icon
                                                        className={cn(
                                                            "h-4 w-4 transition-transform group-hover:scale-110 mr-4",
                                                            isCollapsed && "mr-0",
                                                            isActive && "text-[#ccff00]",
                                                            isLocked && "text-zinc-800"
                                                        )}
                                                    />
                                                    {!isCollapsed && <span className={cn(isLocked && "text-zinc-700")}>{item.name}</span>}
                                                </div>

                                                {!isCollapsed && isLocked && (
                                                    <Lock className="h-3 w-3 text-zinc-800 group-hover:text-[#ccff00] shrink-0 ml-2 transition-colors" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </>
            )}

            <div className={cn("border-t border-white/5 p-4 space-y-1 shrink-0 bg-black/40 rounded-none", isCollapsed && "p-2")}>
                <a
                    href="https://wa.me/550000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isCollapsed ? "Ajuda no WhatsApp" : ""}
                    className={cn(
                        "group flex w-full items-center px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 rounded-none",
                        isCollapsed && "justify-center px-0 py-3",
                        "text-[#ccff00]"
                    )}
                >
                    <MessageCircle className={cn("h-4 w-4", !isCollapsed && "mr-4")} />
                    {!isCollapsed && <span>SUPORTE TÉCNICO</span>}
                </a>

                <Link
                    href="/dashboard/settings"
                    title={isCollapsed ? "Configurações" : ""}
                    className={cn(
                        "group flex w-full items-center px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-white/5 hover:text-white transition-all rounded-none",
                        isCollapsed && "justify-center px-0 py-3"
                    )}
                >
                    <Settings className={cn("h-4 w-4", !isCollapsed && "mr-4")} />
                    {!isCollapsed && <span>CONFIGURAÇÕES</span>}
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    title={isCollapsed ? "Sair" : ""}
                    className={cn(
                        "group flex w-full items-center px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-none",
                        isCollapsed && "justify-center px-0 py-3"
                    )}
                >
                    <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-4")} />
                    {!isCollapsed && <span>SAIR DO TERMINAL</span>}
                </button>
            </div>
        </aside>
    );
}

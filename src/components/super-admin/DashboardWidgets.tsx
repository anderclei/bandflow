"use client";

import { impersonateTenant } from "@/app/actions/super-admin";
import { LogIn, Zap, UserPlus, Megaphone, Activity, AlertCircle, TrendingUp, Music, ArrowRight, Shield, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AnnouncementModal } from "./AnnouncementModal";

export function RecentBandsTable({ bands }: { bands: any[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleImpersonate = async (bandId: string) => {
        setIsLoading(bandId);
        const res = await impersonateTenant(bandId);
        if (res.success) {
            toast.success("Acessando painel operacional...");
            router.push("/dashboard");
        } else {
            toast.error(res.error || "Falha na conexão.");
            setIsLoading(null);
        }
    };

    return (
        <div className="border border-white/5 bg-zinc-900/20 p-8 flex flex-col h-full group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-[#ccff00]" />
                        Instâncias Recentes
                    </h3>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-2">Novas entidades no cluster core</p>
                </div>
            </div>
            <div className="space-y-2 flex-1">
                {bands.length > 0 ? bands.map(band => (
                    <div key={band.id} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-white/5 hover:border-[#ccff00]/30 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">{band.name}</span>
                            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{band.subscriptionPlan} • {band.subscriptionStatus}</span>
                        </div>
                        <button 
                            onClick={() => handleImpersonate(band.id)}
                            disabled={isLoading === band.id}
                            className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-white hover:bg-[#ccff00] hover:text-black transition-all disabled:opacity-50"
                        >
                            {isLoading === band.id ? (
                                <Activity className="w-4 h-4 animate-spin" />
                            ) : (
                                <LogIn className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                )) : (
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 text-center py-10 border border-dashed border-zinc-900">Nenhum pacote de dados recente</p>
                )}
            </div>
        </div>
    );
}

export function TopEngagementBands({ bands }: { bands: any[] }) {
    return (
        <div className="border border-white/5 bg-zinc-900/20 p-8 flex flex-col h-full group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                        <Zap className="w-4 h-4 text-[#ccff00]" />
                        Módulos de Potência
                    </h3>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-2">Métricas de alto engajamento</p>
                </div>
            </div>
            <div className="space-y-2 flex-1">
                {bands.length > 0 ? bands.map(band => (
                    <div key={band.id} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">{band.name}</span>
                            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Atividade: {band.lastActivityAt ? new Date(band.lastActivityAt).toLocaleDateString("pt-BR") : "N/A"}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-[12px] font-black text-[#ccff00]">
                                {band.usageScore}%
                            </div>
                            <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-tighter">Carga</p>
                        </div>
                    </div>
                )) : (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-900">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Analytics Offline</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function QuickAdminActions() {
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-8 block">Comandos Globais</span>
            <div className="grid grid-cols-1 gap-2">
                <button 
                    onClick={() => setIsAnnouncementModalOpen(true)}
                    className="flex items-center justify-between p-6 bg-zinc-900 border border-white/5 hover:bg-white hover:text-black transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <Megaphone className="w-4 h-4 text-[#ccff00] group-hover:text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Broadcast Global</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <a 
                    href="/super-admin/tenants"
                    className="flex items-center justify-between p-6 bg-zinc-900 border border-white/5 hover:bg-[#ccff00] hover:text-black transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <UserPlus className="w-4 h-4 text-white group-hover:text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Deploy de Instância</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
            </div>
            
            <AnnouncementModal 
                isOpen={isAnnouncementModalOpen} 
                onClose={() => setIsAnnouncementModalOpen(false)} 
            />
        </div>
    );
}

export function AuditLogsWidget({ subscriptionLogs, webhooks }: { subscriptionLogs: any[], webhooks: any[] }) {
    const allLogs = [
        ...subscriptionLogs.map(l => ({ id: "sub_"+l.id, date: new Date(l.createdAt), type: "SUB", label: l.action, extra: l.band?.name })),
        ...webhooks.map(w => ({ id: "wh_"+w.id, date: new Date(w.createdAt), type: "WEBHOOK", label: w.type, extra: w.status }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    return (
        <div className="border border-white/5 bg-zinc-900/20 p-8 flex flex-col h-full group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                        <Shield className="w-4 h-4 text-[#ccff00]" />
                        Fluxo de Auditoria
                    </h3>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-2">Segurança & Eventos Webhook</p>
                </div>
            </div>
            <div className="space-y-4 flex-1">
                {allLogs.length > 0 ? allLogs.map(log => (
                    <div key={log.id} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                             <div className="w-2 h-2 rounded-full bg-zinc-800 border border-white/10 group-first:bg-[#ccff00]" />
                             <div className="flex-1 w-px bg-zinc-800" />
                        </div>
                        <div className="pb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white block">
                                {log.type === "SUB" ? "Sistema" : "Gateway"}: {log.label}
                            </span>
                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1 block">
                                {log.extra} • {log.date.toLocaleTimeString('pt-BR')}
                            </span>
                        </div>
                    </div>
                )) : (
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 text-center py-10">Stream Vazio</p>
                )}
            </div>
        </div>
    );
}

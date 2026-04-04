"use client";

import { useState, useEffect } from "react";
import { getGlobalAuditLogs } from "@/app/actions/audit";
import { toast } from "sonner";
import { Search, Activity, User, Building2, Clock, Filter, Shield, Terminal, Zap } from "lucide-react";

export default function GlobalAuditPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        const res = await getGlobalAuditLogs();
        if (res.success && res.logs) {
            setLogs(res.logs);
        } else {
            toast.error(res.error || "Erro ao carregar logs");
        }
        setLoading(false);
    };

    const filteredLogs = logs.filter(log => 
        log.action?.toLowerCase().includes(search.toLowerCase()) || 
        log.details?.toLowerCase().includes(search.toLowerCase()) ||
        log.userName?.toLowerCase().includes(search.toLowerCase()) ||
        log.targetName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Shield className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">HISTÓRICO DO <span className="text-zinc-600">SISTEMA</span></h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">REGISTRO DE TODAS AS ATIVIDADES</span>
                                <span className="w-1.5 h-1.5 bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">CONEXÃO SEGURA</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                    <input 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="BUSCAR NO HISTÓRICO..."
                        className="w-full bg-black/50 border border-white/5 py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest placeholder:text-zinc-800 outline-none focus:border-[#ccff00]/50 transition-all rounded-none"
                    />
                </div>
            </div>

            <div className="border border-white/5 bg-[#0a0a0a] relative overflow-hidden rounded-none">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-900 border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">QUANDO</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">QUEM FEZ</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">O QUE FEZ</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">ONDE</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">DETALHES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Activity className="w-10 h-10 animate-pulse text-[#ccff00]" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">ATUALIZANDO LISTA...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                        {search ? "NADA ENCONTRADO." : "NENHUM REGISTRO RECENTE."}
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                    {new Date(log.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 bg-zinc-950 border border-white/5 flex items-center justify-center rounded-none">
                                                    <User className="w-4 h-4 text-zinc-800" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{log.userName || "SISTEMA"}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] border border-white/5 bg-zinc-900 group-hover:border-[#ccff00]/50 transition-colors rounded-none">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {log.targetName ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 bg-zinc-800 group-hover:bg-[#ccff00] transition-colors rounded-none" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{log.targetName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">GERAL</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-xs truncate text-[9px] font-bold uppercase text-zinc-600 font-mono bg-zinc-900 border border-white/5 p-3 group-hover:text-zinc-400 transition-colors rounded-none">
                                                {log.details || "-"}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

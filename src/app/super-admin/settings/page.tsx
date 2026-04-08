"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, RotateCcw, Search, ShieldAlert, Shield, Terminal, Zap, Activity } from "lucide-react";
import { updateSuperAdminPassword, getTenants, resetBandData } from "@/app/actions/super-admin";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SuperAdminSettingsPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [bands, setBands] = useState<any[]>([]);
    const [searchReset, setSearchReset] = useState("");
    const [loadingBands, setLoadingBands] = useState(false);

    useEffect(() => {
        const fetchBands = async () => {
            setLoadingBands(true);
            const result = await getTenants();
            if (result.success) setBands(result.bands || []);
            setLoadingBands(false);
        };
        fetchBands();
    }, []);

    const handleResetAction = async (id: string, name: string) => {
        if (confirm(`AVISO CRÍTICO: Tem certeza que deseja RESETAR todos os dados de ${name}? \n\nEsta ação é irreversível e irá purgar todos os nodes, faixas, documentos e logs.`)) {
            setSaving(true);
            try {
                const result = await resetBandData(id);
                if (result.success) {
                    toast.success("Purgue de dados concluído.");
                } else {
                    toast.error(result.error);
                }
            } catch {
                toast.error("Erro ao resetar os dados.");
            } finally {
                setSaving(false);
            }
        }
    };

    const filteredForReset = bands.filter(b =>
        searchReset.length > 2 && (
            b.name.toLowerCase().includes(searchReset.toLowerCase()) ||
            b.slug.toLowerCase().includes(searchReset.toLowerCase())
        )
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("As chaves de acesso não coincidem.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("A chave de acesso deve ter pelo menos 6 segmentos.");
            return;
        }
        setSaving(true);
        try {
            const result = await updateSuperAdminPassword(currentPassword, newPassword);
            if (result.success) {
                toast.success("Chaves de segurança rotacionadas com sucesso.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Erro inesperado na rotação de chaves.");
        } finally {
            setSaving(false);
        }
    };

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
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">Config do <span className="text-zinc-600">Sistema</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Controle de Acesso Root</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Camada de Segurança Ativa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl">
                {/* Security Section */}
                <div className="bg-zinc-900 border border-white/10 p-10 relative overflow-hidden group">
                    <div className="flex items-center gap-6 pb-8 border-b border-white/5 mb-10">
                        <div className="w-14 h-14 border border-white/5 flex items-center justify-center bg-zinc-950">
                            <Lock className="w-6 h-6 text-[#ccff00]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black font-heading uppercase tracking-widest text-white">Rotação de Chaves</h2>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Modificar credenciais de acesso do comandante root</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Chave de Acesso Atual</label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50"
                                    placeholder="••••••••"
                                    required
                                    title="Chave de Acesso Atual"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors"
                                    title={showCurrent ? "Ocultar Senha" : "Mostrar Senha"}
                                >
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Nova Chave de Acesso</label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50"
                                    placeholder="••••••••"
                                    required
                                    title="Nova Chave de Acesso"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors"
                                    title={showNew ? "Ocultar Senha" : "Mostrar Senha"}
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Confirmar Sinal de Acesso</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50"
                                placeholder="••••••••"
                                required
                                title="Confirmar Sinal de Acesso"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                            className="w-full py-6 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all disabled:opacity-30"
                        >
                            {saving ? "TRANSMITINDO..." : "EXECUTAR ROTAÇÃO"}
                        </button>
                    </form>
                </div>

                {/* Maintenance Section */}
                <div className="bg-zinc-900 border border-white/10 p-10 relative overflow-hidden group">
                    <div className="flex items-center gap-6 pb-8 border-b border-white/5 mb-10">
                        <div className="w-14 h-14 border border-white/5 flex items-center justify-center bg-zinc-950">
                            <ShieldAlert className="w-6 h-6 text-zinc-700 group-hover:text-[#ccff00] transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black font-heading uppercase tracking-widest text-white">Manutenção do Sistema</h2>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Protocolos de purgue de dados e limpeza de instâncias</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Localizar Cluster para Purgue</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-800" />
                                <input
                                    placeholder="BUSCAR NO REGISTRO (MÍNIMO 3 CARACTERES)..."
                                    value={searchReset}
                                    onChange={(e) => setSearchReset(e.target.value)}
                                    className="w-full bg-black border border-white/5 py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50"
                                    title="Localizar Cluster para Purgue"
                                />
                            </div>
                        </div>

                        {searchReset.length > 2 && (
                            <div className="bg-black border border-white/5 divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {loadingBands ? (
                                    <div className="p-8 text-center text-[8px] font-black uppercase tracking-widest text-zinc-700 animate-pulse">Escaneando Grid...</div>
                                ) : filteredForReset.length === 0 ? (
                                    <div className="p-8 text-center text-[8px] font-black uppercase tracking-widest text-zinc-800">Nenhum node encontrado com este sinal.</div>
                                ) : (
                                    filteredForReset.map(band => (
                                        <div key={band.id} className="p-6 flex items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white">{band.name}</div>
                                                <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1 italic">/{band.slug}</div>
                                            </div>
                                            <button
                                                className="px-6 py-2 bg-zinc-900 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white hover:bg-zinc-100 hover:text-black transition-all"
                                                onClick={() => handleResetAction(band.id, band.name)}
                                                disabled={saving}
                                            >
                                                PURGAR_DADOS
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        <div className="pt-6 border-t border-white/5 text-center">
                            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] leading-relaxed">
                                Nota: Opções de reset adicionais disponíveis no <a href="/super-admin/tenants" className="text-[#ccff00] hover:underline decoration-white/20 underline-offset-4">Gerenciador de Instâncias</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

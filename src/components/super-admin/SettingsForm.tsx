"use client";

import { useState } from "react";
import { updateSystemSettings } from "@/app/actions/super-admin";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Terminal, Shield, Zap } from "lucide-react";

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        appName: initialSettings?.appName || "BandFlow",
        logoUrl: initialSettings?.logoUrl || "",
        primaryColor: initialSettings?.primaryColor || "",
        adminEmail: initialSettings?.adminEmail || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateSystemSettings(formData);
            if (result.success) {
                toast.success("System configuration established.");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to transmit system settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-zinc-900/40 border border-white/5 p-12 relative overflow-hidden group">
            <div className="space-y-16">
                <div className="flex items-center gap-6 pb-10 border-b border-white/5">
                    <div className="w-16 h-16 border border-white/5 flex items-center justify-center bg-black text-[#ccff00]">
                        <Terminal className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black font-heading uppercase tracking-widest text-white">Identidade & Branding</h2>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mt-2 leading-none">Parâmetros globais de aparência do cluster</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">ID da Aplicação</label>
                            <input
                                name="appName"
                                value={formData.appName}
                                onChange={handleChange}
                                placeholder="EX: BANDFLOW_CORE"
                                className="w-full bg-black/50 border border-white/5 py-5 px-8 text-[12px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 placeholder:text-zinc-800"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Sincronização de Logo (URL)</label>
                            <input
                                name="logoUrl"
                                value={formData.logoUrl}
                                onChange={handleChange}
                                placeholder="HTTPS://STORAGE.BANDFLOW.IO..."
                                className="w-full bg-black/50 border border-white/5 py-5 px-8 text-[12px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 placeholder:text-zinc-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Tom Primário do Sistema (HEX)</label>
                            <div className="flex gap-4">
                                <div className="relative group/color">
                                    <input
                                        type="color"
                                        value={formData.primaryColor || "#ccff00"}
                                        onChange={(e) => setFormData(old => ({ ...old, primaryColor: e.target.value }))}
                                        className="w-20 h-16 bg-black border border-white/5 p-1 cursor-crosshair"
                                    />
                                    <div className="absolute inset-0 border border-[#ccff00]/20 pointer-events-none group-hover/color:border-[#ccff00]/50" />
                                </div>
                                <input
                                    name="primaryColor"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                    placeholder="#CCFF00"
                                    className="flex-1 bg-black/50 border border-white/5 py-5 px-8 text-[12px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 placeholder:text-zinc-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 border-t border-white/5">
                    <div className="flex items-center gap-6 pb-10">
                         <div className="w-12 h-12 border border-white/5 flex items-center justify-center bg-black text-zinc-700">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black font-heading uppercase tracking-widest text-white">Link de Suporte Root</h2>
                            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] mt-1 leading-none">Assinatura oficial de contato operacional SaaS</p>
                        </div>
                    </div>

                    <div className="max-w-2xl space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Pacote de Email Administrativo</label>
                        <input
                            type="email"
                            name="adminEmail"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            placeholder="ROOT@BANDFLOW.IO"
                            className="w-full bg-black/50 border border-white/5 py-5 px-8 text-[12px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 placeholder:text-zinc-800"
                        />
                    </div>
                </div>

                <div className="pt-10">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto px-16 py-6 bg-[#ccff00] text-black text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-10" />
                        {saving ? "TRANSMITINDO..." : (
                            <>
                                <Save className="h-5 w-5" />
                                SALVAR CONFIGURAÇÕES
                            </>
                        )}
                    </button>
                    <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest mt-4">Protocolo de Segurança: Sessão Criptografada 128-bit</p>
                </div>
            </div>
        </div>
    );
}

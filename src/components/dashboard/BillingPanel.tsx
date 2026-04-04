"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

interface BillingPanelProps {
    bandId: string;
    currentPlan: string;
    status: string;
    expiresAt: Date | null;
}

export function BillingPanel({ bandId, currentPlan, status, expiresAt }: BillingPanelProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (planId: string) => {
        setLoading(planId);
        try {
            const res = await fetch("/api/checkout/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bandId, planId })
            });

            const data = await res.json();

            if (res.ok && data.init_point) {
                // Redireciona o usuário para o Mercado Pago
                window.location.href = data.init_point;
            } else {
                toast.error(data.error || "Erro ao gerar checkout");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        } finally {
            setLoading(null);
        }
    };

    const isPremium = currentPlan === "PREMIUM";
    const isPro = currentPlan === "PRO";
    return (
        <div className="space-y-10">
            <div className="bg-zinc-900/40 border border-white/5 p-12 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ccff00]/5 blur-[60px] rounded-full pointer-events-none" />
                
                {/* Status Bar */}
                <div className="p-10 bg-black border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative overflow-hidden mb-12">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]" />
                    <div className="relative z-10 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Sua Assinatura Atual</p>
                        <div className="flex items-center gap-6">
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{currentPlan}</h3>
                            <div className="flex flex-col gap-1">
                                {status === 'ACTIVE' && <span className="text-[8px] font-black tracking-widest text-[#ccff00] border border-[#ccff00]/20 px-2 py-0.5 bg-[#ccff00]/5"> ATIVO</span>}
                                {status === 'TRIAL' && <span className="text-[8px] font-black tracking-widest text-blue-500 border border-blue-500/20 px-2 py-0.5 bg-blue-500/5"> TESTE</span>}
                                {status === 'OVERDUE' && <span className="text-[8px] font-black tracking-widest text-red-500 border border-red-500/20 px-2 py-0.5 bg-red-500/5"> ATRASADO</span>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:text-right space-y-2">
                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Próxima Renovação</p>
                        <p className="text-xl font-black text-white tracking-widest uppercase">
                            {expiresAt ? new Date(expiresAt).toLocaleDateString('pt-BR') : 'RENOVAÇÃO MANUAL'}
                        </p>
                    </div>
                </div>

                {/* Plans Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* PRO TIER */}
                    <div className={`p-10 border relative transition-all ${isPro ? 'bg-black border-[#ccff00]/40' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                        {isPro && <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#ccff00] text-black text-[8px] font-black px-4 py-1 tracking-widest">PLANO ATUAL</div>}
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-6 font-heading">PLANO PRO</h4>
                        <div className="mb-10">
                            <span className="text-4xl font-black text-white tracking-tighter">R$ 49,90</span>
                            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2">/MÊS</span>
                        </div>
                        <ul className="space-y-4 mb-12">
                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <div className="w-1.5 h-1.5 bg-[#ccff00]/40" /> Shows Finanças Ilimitados
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <div className="w-1.5 h-1.5 bg-[#ccff00]/40" /> Gerador Rider Técnico
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <div className="w-1.5 h-1.5 bg-[#ccff00]/40" /> Acesso Histórico CRM
                            </li>
                        </ul>
                        {isPro ? (
                            <button disabled className="w-full h-14 bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-700 cursor-not-allowed">
                                SELECIONADO
                            </button>
                        ) : (
                            <button
                                onClick={() => handleCheckout("pro")}
                                disabled={loading === "pro"}
                                className={`w-full h-14 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ccff00] transition-all flex items-center justify-center gap-4`}
                            >
                                {loading === "pro" ? "PROCESSANDO..." : isPremium ? "REALIZAR DOWNGRADE" : "ASSINAR PLANO PRO"}
                            </button>
                        )}
                    </div>

                    {/* PREMIUM TIER */}
                    <div className={`p-10 border relative transition-all ${isPremium ? 'bg-black border-[#ccff00]/40' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                        {isPremium && <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#ccff00] text-black text-[8px] font-black px-4 py-1 tracking-widest">PLANO ATUAL</div>}
                        {!isPremium && <div className="absolute top-0 right-10 -translate-y-1/2 bg-white text-black text-[8px] font-black px-4 py-1 tracking-widest">RECOMENDADO</div>}

                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ccff00] mb-6 font-heading">PLANO PREMIUM</h4>
                        <div className="mb-10">
                            <span className="text-4xl font-black text-white tracking-tighter">R$ 99,90</span>
                            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2">/MÊS</span>
                        </div>
                        <ul className="space-y-4 mb-12">
                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                                <Zap className="w-3 h-3 text-[#ccff00]" /> ACESSO TOTAL NÍVEL 01
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <div className="w-1.5 h-1.5 bg-[#ccff00]/40" /> Interface Mapa Palco
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <div className="w-1.5 h-1.5 bg-[#ccff00]/40" /> Sistema Sincronia Logística
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <div className="w-1.5 h-1.5 bg-[#ccff00]/40" /> Geração EPK Público
                            </li>
                        </ul>
                        {isPremium ? (
                            <button disabled className="w-full h-14 bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-700 cursor-not-allowed">
                                SELECIONADO E AUTENTICADO
                            </button>
                        ) : (
                            <button
                                onClick={() => handleCheckout("premium")}
                                disabled={loading === "premium"}
                                className="w-full h-14 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0 0 40px rgba(204,255,0,0.15)] flex items-center justify-center gap-4"
                            >
                                {loading === "premium" ? "PROCESSANDO..." : "UPGRADE PARA PREMIUM"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-12 p-8 bg-black/40 border border-white/5 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 text-center flex items-center justify-center gap-4">
                    <ShieldCheck className="w-4 h-4 text-[#ccff00]/40" />
                    Pagamento Seguro Via MercadoPago
                </div>
            </div>
        </div>
    )
}

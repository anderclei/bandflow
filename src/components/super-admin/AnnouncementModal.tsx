"use client";

import { useState } from "react";
import { createAnnouncement } from "@/app/actions/announcements";
import { toast } from "sonner";
import { X, Send, Megaphone, Loader2, Terminal, Zap, Shield } from "lucide-react";

export function AnnouncementModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [message, setMessage] = useState("");
    const [type, setType] = useState("INFO");
    const [days, setDays] = useState("7");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        const res = await createAnnouncement({
            message,
            type,
            expiresInDays: parseInt(days)
        });

        setIsLoading(false);
        if (res.success) {
            toast.success("Broadcast global transmitido.");
            setMessage("");
            onClose();
        } else {
            toast.error(res.error || "Falha no broadcast.");
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[#ccff00]/5 pointer-events-none" />

            <div className="w-full max-w-xl bg-zinc-950 border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Visual Identity Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#ccff00]" />

                <div className="flex items-center justify-between p-10 border-b border-white/5 bg-zinc-900/50">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Megaphone className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black font-heading uppercase tracking-widest text-white">Broadcast Global</h3>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Transmitir aviso para todas as instâncias ativas</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-white transition-colors p-4"
                    >
                        [FECHAR]
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="space-y-4">
                        <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Conteúdo do Payload (Mensagem)</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="INSERIR CONTEÚDO CRÍTICO DA MENSAGEM..."
                            className="w-full p-8 bg-black border border-white/5 text-[11px] font-medium uppercase tracking-widest resize-none focus:outline-none focus:border-[#ccff00] transition-all min-h-[160px] placeholder:text-zinc-900"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Tipo de Protocolo</label>
                             <select 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-4 bg-black border border-white/5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#ccff00] transition-colors"
                            >
                                <option value="INFO">MODO_INFO</option>
                                <option value="SUCCESS">MODO_SUCESSO</option>
                                <option value="WARNING">MODO_AVISO</option>
                                <option value="CRITICAL">MODO_CRÍTICO</option>
                            </select>
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Retenção no Node (Dias)</label>
                            <select 
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className="w-full p-4 bg-black border border-white/5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#ccff00] transition-colors"
                            >
                                <option value="1">24 HORAS</option>
                                <option value="3">72 HORAS</option>
                                <option value="7">168 HORAS</option>
                                <option value="15">360 HORAS</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="pt-6">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-4 py-8 bg-[#ccff00] hover:bg-white text-black font-black text-[12px] uppercase tracking-[0.5em] transition-all disabled:opacity-30"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            Executar Disparo Global
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

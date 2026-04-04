"use client";

import { createDeal } from "@/app/actions/deals";
import { Plus, X } from "lucide-react";
import { useTransition } from "react";

interface DealModalProps {
    isOpen: boolean;
    onClose: () => void;
    contractors: any[];
    bandId: string;
}

export function DealModal({ isOpen, onClose, contractors, bandId }: DealModalProps) {
    const [isPending, startTransition] = useTransition();

    if (!isOpen) return null;

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            createDeal(bandId, formData);
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-zinc-900/90 border border-white/5 p-10 w-full max-w-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                
                <button
                    onClick={onClose}
                    title="Fechar modal"
                    className="absolute right-8 top-8 text-zinc-700 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                    <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] rounded-none">
                        <Plus className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">
                        NOVA NEGOCIAÇÃO
                    </h2>
                </div>

                <form action={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">
                            TÍTULO DO NEGÓCIO
                        </label>
                        <input
                            name="title"
                            required
                            title="Título do Negócio"
                            className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900 rounded-none"
                            placeholder="EX: SHOW BAILE DO HAWAII"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">
                            CONTRATANTE / STAKEHOLDER
                        </label>
                        <select
                            name="contractorId"
                            title="Selecione o contratante"
                            className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all appearance-none cursor-pointer rounded-none"
                            defaultValue="none"
                        >
                            <option value="none">NÃO REGISTRADO (VENDA DIRETA)</option>
                            {contractors.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name.toUpperCase()} {c.city ? `[${c.city.toUpperCase()}]` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">
                                VALOR ESTIMADO (R$)
                            </label>
                            <input
                                name="value"
                                type="number"
                                step="0.01"
                                title="Valor Estimado"
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900 rounded-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">
                                STATUS INICIAL
                            </label>
                            <select
                                name="status"
                                title="Status Inicial"
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all appearance-none cursor-pointer rounded-none"
                                defaultValue="LEAD"
                            >
                                <option value="LEAD">PROSPECÇÃO INICIAL</option>
                                <option value="NEGOTIATING">EM NEGOCIAÇÃO</option>
                                <option value="CONTRACT_SENT">CONTRATO ENVIADO</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-16 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                        >
                            {isPending ? "PROCESSANDO..." : "REGISTRAR NEGOCIAÇÃO"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

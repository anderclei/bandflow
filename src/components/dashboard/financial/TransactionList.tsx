"use client";

import { Check, Clock, DollarSign, ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";
import { manageTransaction } from "@/app/actions/financials";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    category?: string | null;
    dueDate?: Date | null;
    paymentDate?: Date | null;
}

export function TransactionList({ transactions, bandId }: { transactions: any[], bandId: string }) {
    const [localTransactions, setLocalTransactions] = useState(transactions);

    const handleMarkAsPaid = async (t: any) => {
        const res = await manageTransaction({
            ...t,
            status: 'PAID',
            paymentDate: new Date(),
            bandId
        });

        if (res.success) {
            toast.success("Pagamento registrado!");
            setLocalTransactions(prev => prev.map(item => item.id === t.id ? { ...item, status: 'PAID', paymentDate: new Date() } : item));
        } else {
            toast.error("Erro ao registrar pagamento.");
        }
    };

    const formatCurrency = (val: number) =>
        val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="bg-black border border-white/5 shadow-2xl rounded-none overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-900/80 border-b border-white/10">
                    <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">REGISTRO LANCAMENTO</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">VECTO DEADLINE</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 text-right">MONTANTE BRL</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 text-center">SISTEMICO</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {localTransactions.map((t) => (
                        <tr key={t.id} className="group hover:bg-white/[0.02] transition-all">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "h-12 w-12 flex items-center justify-center border transition-all",
                                        t.type === 'INCOME' ? "bg-[#ccff00]/10 border-[#ccff00]/20 text-[#ccff00]" : "bg-red-500/10 border-red-500/20 text-red-500"
                                    )}>
                                        {t.type === 'INCOME' ? (
                                            <ArrowUpCircle className="h-6 w-6" />
                                        ) : (
                                            <ArrowDownCircle className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-lg uppercase tracking-tighter group-hover:text-[#ccff00] transition-colors">{t.description}</span>
                                        <span className="text-[9px] uppercase font-black tracking-widest text-zinc-700">{t.category || "GERAL DIVERSOS"}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-zinc-500 font-black text-xs uppercase tracking-widest">
                                {t.dueDate ? new Date(t.dueDate).toLocaleDateString('pt-BR') : "---"}
                            </td>
                            <td className={cn(
                                "px-8 py-6 text-xl text-right font-black tracking-tighter tabular-nums",
                                t.type === 'INCOME' ? "text-[#ccff00]" : "text-white"
                            )}>
                                {t.type === 'INCOME' ? "+" : "-"}{formatCurrency(t.amount)}
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex justify-center">
                                    <span className={cn(
                                        "px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all",
                                        t.status === 'PAID' 
                                            ? "bg-[#ccff00]/5 border-[#ccff00]/20 text-[#ccff00]" 
                                            : "bg-amber-500/5 border-amber-500/20 text-amber-500 animate-pulse"
                                    )}>
                                        {t.status === 'PAID' ? "LIQUIDADO" : "PENDENTE AUT"}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                {t.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleMarkAsPaid(t)}
                                        className="h-12 w-12 flex items-center justify-center bg-[#ccff00] text-black hover:bg-white hover:scale-105 transition-all shadow-[0 0 20px rgba(204,255,0,0.1)] border-none rounded-none"
                                        title="Baixar Pagamento"
                                    >
                                        <Check className="h-5 w-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {localTransactions.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-24 text-center border border-dashed border-white/5 opacity-30">
                                <div className="flex flex-col items-center gap-4">
                                    <DollarSign className="h-12 w-12 text-zinc-800" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                                        MODO ESTÁTICO : SEM LANÇAMENTOS PROJETADOS.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

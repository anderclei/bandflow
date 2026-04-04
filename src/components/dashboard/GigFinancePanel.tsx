"use client";

import { useState } from "react";
import { Check, DollarSign, Loader2, Save } from "lucide-react";
import { updateMemberFees } from "@/app/actions/finance";

interface Member {
    id: string;
    userName: string;
    role: string;
}

interface MemberFee {
    id?: string;
    memberId: string;
    amount: number;
    isPaid: boolean;
}

interface GigFinancePanelProps {
    gigId: string;
    totalFee: number | null;
    members: Member[];
    initialFees: MemberFee[];
}

export function GigFinancePanel({ gigId, totalFee, members, initialFees }: GigFinancePanelProps) {
    const [fees, setFees] = useState<Record<string, { amount: number; isPaid: boolean }>>(() => {
        const result: Record<string, { amount: number; isPaid: boolean }> = {};
        members.forEach(m => {
            const existing = initialFees.find(f => f.memberId === m.id);
            result[m.id] = {
                amount: existing?.amount || 0,
                isPaid: existing?.isPaid || false
            };
        });
        return result;
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleAmountChange = (memberId: string, value: string) => {
        const amount = parseFloat(value) || 0;
        setFees(prev => ({ ...prev, [memberId]: { ...prev[memberId], amount } }));
    };

    const handleTogglePaid = (memberId: string) => {
        setFees(prev => ({ ...prev, [memberId]: { ...prev[memberId], isPaid: !prev[memberId].isPaid } }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const dataToSave = Object.entries(fees).map(([memberId, data]) => ({
            memberId,
            amount: data.amount,
            isPaid: data.isPaid
        }));

        await updateMemberFees(gigId, dataToSave);
        setIsSaving(false);
    };

    const totalCalculated = Object.values(fees).reduce((acc, curr) => acc + curr.amount, 0);
    const balance = (totalFee || 0) - totalCalculated;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                <div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Cachê do Show</p>
                    <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                        R$ {totalFee ? totalFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Saldo Restante</p>
                    <p className={`text-xl font-black ${balance < 0 ? 'text-red-500' : 'text-emerald-700 dark:text-emerald-300'}`}>
                        R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {members.map(member => (
                    <div key={member.id} className="flex items-center gap-4 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-foreground truncate">{member.userName}</p>
                            <p className="text-xs text-zinc-500 uppercase">{member.role}</p>
                        </div>

                        <div className="relative w-32">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-zinc-500 sm:text-sm">R$</span>
                            </div>
                            <input
                                type="number"
                                value={fees[member.id]?.amount || ""}
                                onChange={(e) => handleAmountChange(member.id, e.target.value)}
                                className="w-full rounded-lg bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 pl-8 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="0.00"
                            />
                        </div>

                        <button
                            onClick={() => handleTogglePaid(member.id)}
                            className={`p-2 rounded-lg transition-colors border ${fees[member.id]?.isPaid
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "bg-white border-zinc-200 text-zinc-400 hover:border-emerald-200 dark:bg-zinc-900 dark:border-zinc-700"
                                }`}
                            title={fees[member.id]?.isPaid ? "Marcado como Pago" : "Pendente"}
                        >
                            <Check className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
            >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar Rateio
            </button>
        </div>
    );
}

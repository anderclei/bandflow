"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Loader2, DollarSign, TrendingDown, TrendingUp, AlertCircle, PieChart, Truck, MapPin } from "lucide-react";
import { updateGigExpenses, updateGigFinancials, calculateFreight } from "@/app/actions/financials";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Expense {
    id?: string;
    description: string;
    amount: number;
    category: string;
}

interface GigFinancialsEditorProps {
    gigId: string;
    initialFee: number | null;
    initialTaxRate: number | null;
    initialTaxAmount: number | null;
    initialExpenses: Expense[];
    initialCommissionRate: number | null;
    initialStatus: string;
    suppliers: any[];
}

const CATEGORIES = [
    { value: 'TRANSPORT', label: 'Transporte' },
    { value: 'FOOD', label: 'Alimentação' },
    { value: 'HOTEL', label: 'Hospedagem' },
    { value: 'TECHNICAL', label: 'Técnica/Roadie' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'OTHER', label: 'Outros' }
];

const OPTIONS = [
    { value: 'UPCOMING', label: 'Agendado' },
    { value: 'PERFORMED', label: 'Realizado' },
    { value: 'SETTLED', label: 'Liquidado (Pago)' },
    { value: 'CANCELLED', label: 'Cancelado' }
];

export function GigFinancialsEditor({
    gigId,
    initialFee,
    initialTaxRate,
    initialTaxAmount,
    initialExpenses,
    initialCommissionRate,
    initialStatus,
    suppliers
}: GigFinancialsEditorProps) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [commissionRate, setCommissionRate] = useState(initialCommissionRate || 0);
    const [status, setStatus] = useState(initialStatus);
    const [isSaving, setIsSaving] = useState(false);
    const [isCalculatingFreight, setIsCalculatingFreight] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState("");

    const fee = initialFee || 0;
    const taxes = (fee * (initialTaxRate || 0) / 100) + (initialTaxAmount || 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const commission = (fee * commissionRate / 100);
    const netProfit = fee - taxes - totalExpenses - commission;

    const addExpense = () => {
        setExpenses([...expenses, { description: "", amount: 0, category: "OTHER" }]);
    };

    const removeExpense = (index: number) => {
        setExpenses(expenses.filter((_, i) => i !== index));
    };

    const updateExpense = (index: number, field: keyof Expense, value: any) => {
        const newExpenses = [...expenses];
        newExpenses[index] = { ...newExpenses[index], [field]: value };
        setExpenses(newExpenses);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const expRes = await updateGigExpenses({ gigId, expenses });
            const finRes = await updateGigFinancials({ gigId, commissionRate, status });

            if (expRes.success && finRes.success) {
                toast.success("Financeiro atualizado com sucesso!");
            } else {
                toast.error("Erro ao salvar dados financeiros.");
            }
        } catch (error) {
            toast.error("Erro inesperado ao salvar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCalculateFreight = async () => {
        if (!selectedSupplierId) {
            toast.error("Selecione um fornecedor logístico primeiro.");
            return;
        }
        setIsCalculatingFreight(true);
        try {
            const res = await calculateFreight({ gigId, supplierId: selectedSupplierId });
            if (res.success && res.data) {
                setExpenses([...expenses, {
                    description: `Frete (Automático): ${res.data.distanceKm} km`,
                    amount: res.data.amount,
                    category: "TRANSPORT"
                }]);
                toast.success(`Custo de frete estimado para ${res.data.distanceKm} km adicionado.`);
            } else {
                toast.error(res.error || "Erro ao calcular frete automático.");
            }
        } catch (error) {
            toast.error("Erro ao chamar serviço de rotas.");
        } finally {
            setIsCalculatingFreight(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Automatic Freight Module */}
            <div className="bg-zinc-900/40 p-8 border border-white/5 flex flex-col md:flex-row md:items-end gap-6 rounded-none backdrop-blur-sm">
                <div className="flex-1 space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-2 ml-1">
                        <Truck className="h-3 w-3 text-[#ccff00]" /> CÁLCULO FRETE AUTOMÁTICO
                    </label>
                    <select
                        title="Fornecedor de Transporte"
                        value={selectedSupplierId}
                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                        className="w-full h-14 bg-black border border-white/5 text-zinc-400 font-black uppercase tracking-widest text-[11px] px-6 rounded-none focus:ring-1 focus:ring-[#ccff00]/30 outline-none transition-all appearance-none"
                    >
                        <option value="">SELECIONE FORNECEDOR LOGÍSTICO...</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id} className="bg-black text-white">{s.name} [R${s.kmValue.toFixed(2)}/KM]</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleCalculateFreight}
                    disabled={isCalculatingFreight || !selectedSupplierId}
                    className="h-14 px-8 bg-[#ccff00] text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:scale-[1.02] transition-all rounded-none flex items-center gap-4 disabled:opacity-20 shadow-[0 0 30px rgba(204,255,0,0.1)] border-none"
                >
                    {isCalculatingFreight ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    EXECUTAR PROCEDURE
                </button>
            </div>

            {/* Status & Commission Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">DO EVENTO</label>
                    <select
                        title="Status do Evento"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-14 bg-black border border-white/5 text-white font-black uppercase tracking-widest text-[11px] px-6 rounded-none focus:ring-1 focus:ring-[#ccff00]/30 outline-none appearance-none"
                    >
                        {OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-black">{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">COMISSÃO COMERCIAL (%)</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={commissionRate || ""}
                            onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                            className="w-full h-14 bg-black border border-white/10 text-white font-black uppercase tracking-widest text-sm px-6 rounded-none focus:ring-1 focus:ring-[#ccff00]/30 outline-none text-center"
                            placeholder="0"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-[10px]">%</span>
                    </div>
                </div>
            </div>

            {/* Profit Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-none relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-zinc-700 mb-4">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">DEBITO TOTAL REGISTRO</span>
                    </div>
                    <p className="text-3xl font-black text-red-500 tracking-tighter">
                        R$ {(totalExpenses + commission + taxes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-8 bg-[#ccff00]/5 border border-[#ccff00]/10 rounded-none relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-[#ccff00] mb-4">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">MARGEM NET REMAINING</span>
                    </div>
                    <p className="text-3xl font-black text-[#ccff00] tracking-tighter">
                        R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#ccff00]/10 blur-3xl" />
                </div>
            </div>

            {/* Expenses List (Cost Center) */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                        <PieChart className="h-4 w-4 text-[#ccff00]" />
                        FOLHA DE DÉBITOS OPEC
                    </h3>
                    <button
                        onClick={addExpense}
                        className="h-10 px-6 bg-black border border-[#ccff00]/30 text-[#ccff00] text-[9px] font-black uppercase tracking-widest hover:bg-[#ccff00] hover:text-black transition-all rounded-none flex items-center gap-3"
                    >
                        <Plus className="h-3 w-3" /> ADICIONAR ITEM
                    </button>
                </div>

                <div className="space-y-4">
                    {expenses.length === 0 ? (
                        <div className="p-16 text-center border-3 border-dashed border-white/5 bg-black/40 rounded-none opacity-20">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">RELATÓRIO DE DÉBITOS LIMPO</p>
                        </div>
                    ) : (
                        expenses.map((exp, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-6 items-center bg-black border border-white/5 p-6 hover:border-white/10 transition-all rounded-none group relative">
                                <div className="flex-1 w-full space-y-3">
                                    <Label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">DESCRIÇÃO DÉBITO</Label>
                                    <input
                                        type="text"
                                        value={exp.description}
                                        onChange={(e) => updateExpense(index, 'description', e.target.value)}
                                        placeholder="EX: TRANSPORTE AEREO"
                                        className="w-full bg-zinc-900 border border-white/5 h-12 px-5 text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-white/20 outline-none text-white rounded-none placeholder:text-zinc-800"
                                    />
                                </div>
                                <div className="w-full md:w-48 space-y-3">
                                    <Label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest text-center block">CATEGORIA</Label>
                                    <select
                                        title="Categoria de Despesa"
                                        value={exp.category}
                                        onChange={(e) => updateExpense(index, 'category', e.target.value)}
                                        className="w-full h-12 bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest px-4 rounded-none outline-none appearance-none cursor-pointer hover:bg-zinc-800 transition-colors text-zinc-500 text-center"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full md:w-56 space-y-3">
                                    <Label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1 text-right block pr-1">MONTANTE BRL</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-[10px]">R$</span>
                                        <input
                                            type="number"
                                            value={exp.amount || ""}
                                            onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                                            className="w-full h-12 bg-black border border-white/5 pl-10 pr-5 text-right font-black text-sm text-red-500 focus:ring-1 focus:ring-red-500/20 outline-none rounded-none tabular-nums"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>
                                <button
                                    title="Remover Despesa"
                                    onClick={() => removeExpense(index)}
                                    className="p-3 text-zinc-800 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 rounded-none bg-zinc-900/50"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-20 flex items-center justify-center gap-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[12px] hover:bg-[#ccff00] hover:scale-[1.01] transition-all rounded-none disabled:opacity-20 shadow-[0 0 50px rgba(255,255,255,0.05)] mt-12 border-none group"
            >
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6 group-hover:scale-110 transition-transform" />}
                SALVAR REGISTRO FINANCEIRO
            </button>
        </div>
    );
}

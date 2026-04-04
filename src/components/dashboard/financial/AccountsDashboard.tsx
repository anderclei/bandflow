"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Upload, Check, AlertTriangle, ArrowRight, DollarSign, Receipt, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Transaction {
    id: string
    description: string
    amount: number
    type: "INCOME" | "EXPENSE"
    status: "PENDING" | "PAID" | "CANCELLED"
    dueDate?: Date | null
    paymentDate?: Date | null
    receiptUrl?: string | null
    isRecurring?: boolean
}

export function AccountsDashboard({ transactions, bandId }: { transactions: Transaction[], bandId: string }) {
    const [activeTab, setActiveTab] = useState<"PAYABLES" | "RECEIVABLES">("PAYABLES")

    const payables = transactions.filter(t => t.type === "EXPENSE")
    const receivables = transactions.filter(t => t.type === "INCOME")

    const currentList = activeTab === "PAYABLES" ? payables : receivables

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return "Sem data"
        return new Date(date).toLocaleDateString('pt-BR')
    }

    const isOverdue = (date: Date | null | undefined) => {
        if (!date) return false
        return new Date(date) < new Date()
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex bg-black border border-white/5 p-1 rounded-none w-fit">
                <button
                    onClick={() => setActiveTab("PAYABLES")}
                    className={cn("px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all", activeTab === "PAYABLES" ? "bg-[#ccff00] text-black shadow-[0 0 20px rgba(204,255,0,0.2)]" : "text-zinc-600 hover:text-white hover:bg-white/5")}
                >
                    CONTAS A PAGAR
                </button>
                <button
                    onClick={() => setActiveTab("RECEIVABLES")}
                    className={cn("px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all", activeTab === "RECEIVABLES" ? "bg-[#ccff00] text-black shadow-[0 0 20px rgba(204,255,0,0.2)]" : "text-zinc-600 hover:text-white hover:bg-white/5")}
                >
                    CONTAS A RECEBER
                </button>
            </div>

            <div className="bg-zinc-900/40 border border-white/10 p-10 shadow-2xl backdrop-blur-md rounded-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-10">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black font-heading flex items-center gap-4 uppercase tracking-tighter text-white">
                            {activeTab === "PAYABLES" ? <DollarSign className="h-6 w-6 text-red-500" /> : <DollarSign className="h-6 w-6 text-[#ccff00]" />}
                            {activeTab === "PAYABLES" ? "SAÍDAS DE CAIXA" : "ENTRADAS DE CAIXA"}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">AUDITORIA DE VENCIMENTOS E PROVISÕES DE CAIXA</p>
                    </div>
                    <Button className="h-14 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-none px-8 hover:bg-[#ccff00] transition-all shrink-0">
                        <Plus className="h-4 w-4 mr-3" />
                        ADICIONAR LANCḀMENTO
                    </Button>
                </div>

                <div className="space-y-6">
                    {currentList.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/5 bg-black/20 rounded-none opacity-40">
                            <Receipt className="h-16 w-16 text-zinc-800 mx-auto mb-6" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">MODO OFFLINE : NENHUMA MOVIMENTAÇÃO ENCONTRADA</p>
                        </div>
                    ) : (
                        currentList.map(t => (
                            <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-8 border border-white/5 bg-black/40 hover:bg-white/[0.03] transition-all group rounded-none">
                                <div className="flex items-start gap-6">
                                    <div className={cn(
                                        "h-16 w-16 shrink-0 flex items-center justify-center border transition-all",
                                        t.status === "PAID"
                                            ? "bg-[#ccff00]/10 border-[#ccff00]/20 text-[#ccff00]"
                                            : isOverdue(t.dueDate)
                                                ? "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0 0 20px rgba(239,68,68,0.1)]"
                                                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                    )}>
                                        {t.status === "PAID" ? <Check className="h-8 w-8" /> : isOverdue(t.dueDate) ? <AlertTriangle className="h-8 w-8" /> : <CalendarIcon className="h-8 w-8" />}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-black text-white text-xl uppercase tracking-tighter">{t.description}</p>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                            <span className={cn(isOverdue(t.dueDate) && t.status !== "PAID" ? "text-red-500" : "text-zinc-500")}>
                                                VENCIMENTO: {formatDate(t.dueDate)}
                                            </span>
                                            {t.isRecurring && <span className="bg-white/5 px-3 py-1 text-zinc-400 border border-white/5">RECORRENTE</span>}
                                            {t.receiptUrl && <span className="bg-[#ccff00]/5 px-3 py-1 text-[#ccff00] border border-[#ccff00]/10">NF ANEXADA</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-6">
                                    <p className={cn("font-black text-3xl tracking-tighter", activeTab === "PAYABLES" ? "text-white" : "text-[#ccff00]")}>
                                        {formatCurrency(t.amount)}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {!t.receiptUrl && (
                                            <Button variant="outline" size="sm" className="h-10 text-[9px] font-black uppercase tracking-widest border-dashed border-white/10 rounded-none hover:bg-white hover:text-black">
                                                <Upload className="h-3 w-3 mr-2" />
                                                ANEXAR DOC
                                            </Button>
                                        )}
                                        {t.status !== "PAID" && (
                                            <Button size="sm" className="h-10 text-[9px] font-black uppercase tracking-widest bg-[#ccff00] text-black rounded-none px-6 hover:brightness-110 transition-all shadow-[0 0 20px rgba(204,255,0,0.1)]">
                                                SALVAR BAIXA
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

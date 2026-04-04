"use client"

import { useState } from "react"
import { Calculator, Users, Plus, Trash2, Percent, DollarSign, ArrowRight, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FixedFee {
    id: string
    name: string
    amount: number
}

interface Partner {
    id: string
    name: string
    percentage: number
}

export function SplitCalculator() {
    const [grossAmount, setGrossAmount] = useState<number>(0)
    const [commissionRate, setCommissionRate] = useState<number>(10)
    const [taxRate, setTaxRate] = useState<number>(6)

    // Equipe e Músicos ganham CACHÊ (Valor Fixo)
    const [fixedFees, setFixedFees] = useState<FixedFee[]>([
        { id: "1", name: "Baterista", amount: 400 },
        { id: "2", name: "Baixista", amount: 400 },
        { id: "3", name: "Roadie", amount: 250 },
        { id: "4", name: "Técnico P.A", amount: 350 },
    ])

    // Sócios ganham SPLIT (Porcentagem do Lucro Líquido)
    const [partners, setPartners] = useState<Partner[]>([
        { id: "p1", name: "Cantor (Sócio)", percentage: 70 },
        { id: "p2", name: "Empresário", percentage: 30 },
    ])

    const commissionAmount = grossAmount * (commissionRate / 100)
    const taxAmount = grossAmount * (taxRate / 100)
    const totalFixedFees = fixedFees.reduce((acc, fee) => acc + fee.amount, 0)

    // Lucro Líquido só existe APÓS pagar impostos, comissão e cachês da equipe
    const netProfit = grossAmount - commissionAmount - taxAmount - totalFixedFees

    const totalPercentage = partners.reduce((acc, p) => acc + p.percentage, 0)

    const addFixedFee = () => {
        setFixedFees([...fixedFees, { id: Date.now().toString(), name: `Novo Cachê ${fixedFees.length + 1}`, amount: 0 }])
    }

    const removeFixedFee = (id: string) => {
        setFixedFees(fixedFees.filter(f => f.id !== id))
    }

    const updateFixedFee = (id: string, field: "name" | "amount", value: string | number) => {
        setFixedFees(fixedFees.map(f => f.id === id ? { ...f, [field]: value } : f))
    }

    const addPartner = () => {
        setPartners([...partners, { id: Date.now().toString(), name: `Novo Sócio ${partners.length + 1}`, percentage: 0 }])
    }

    const removePartner = (id: string) => {
        setPartners(partners.filter(p => p.id !== id))
    }

    const updatePartner = (id: string, field: "name" | "percentage", value: string | number) => {
        setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p))
    }

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Lado Esquerdo - Configurações */}
            <div className="space-y-10">
                <div className="bg-zinc-900/40 p-10 border border-white/5 shadow-2xl backdrop-blur-md rounded-none">
                    <h2 className="text-2xl font-black font-heading uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
                        <Calculator className="h-6 w-6 text-[#ccff00]" />
                        RECIBO E DEDUÇÕES
                    </h2>
                    <div className="grid gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="grossAmount" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">CACHÊ VENDA BRUTO (BRL)</Label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 font-black text-xs">R$</span>
                                <Input
                                    id="grossAmount"
                                    type="number"
                                    value={grossAmount || ""}
                                    onChange={(e) => setGrossAmount(Number(e.target.value))}
                                    className="pl-14 bg-black border-white/5 h-16 text-xl font-black focus-visible:ring-[#ccff00]/30 rounded-none text-[#ccff00] placeholder:text-zinc-900"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="commission" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">COMISSÃO (%)</Label>
                                <div className="relative">
                                    <Input
                                        id="commission"
                                        type="number"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                                        className="bg-black border-white/5 h-14 pr-12 focus-visible:ring-[#ccff00]/30 rounded-none text-white font-black text-center"
                                    />
                                    <Percent className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="tax" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">IMPOSTO NF (%)</Label>
                                <div className="relative">
                                    <Input
                                        id="tax"
                                        type="number"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value))}
                                        className="bg-black border-white/5 h-14 pr-12 focus-visible:ring-[#ccff00]/30 rounded-none text-white font-black text-center"
                                    />
                                    <Percent className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bloco de Cachês Fixos */}
                <div className="bg-zinc-900/40 p-10 border border-white/5 shadow-2xl backdrop-blur-md rounded-none">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Briefcase className="h-6 w-6 text-[#ccff00]" />
                            <div>
                                <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">FOLHA GERAL</h2>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mt-1">MÚSICOS E EQUIPE TÉCNICA</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={addFixedFee} className="text-[#ccff00] hover:text-black hover:bg-[#ccff00] rounded-none border border-[#ccff00]/20 font-black text-[10px] uppercase tracking-widest px-4">
                            <Plus className="h-4 w-4 mr-2" /> ADICIONAR RECURSO
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {fixedFees.map(fee => (
                            <div key={fee.id} className="flex items-center gap-4 group">
                                <Input
                                    value={fee.name}
                                    onChange={(e) => updateFixedFee(fee.id, "name", e.target.value)}
                                    className="flex-1 bg-black border-white/5 h-14 text-[11px] font-black uppercase tracking-widest focus-visible:ring-[#ccff00]/30 rounded-none placeholder:text-zinc-800"
                                    placeholder="NOME PROFISSIONAL"
                                />
                                <div className="relative w-40">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-[10px]">R$</span>
                                    <Input
                                        type="number"
                                        value={fee.amount}
                                        onChange={(e) => updateFixedFee(fee.id, "amount", Number(e.target.value))}
                                        className="bg-black border-white/5 h-14 pl-10 pr-4 w-full text-right font-black text-sm focus-visible:ring-[#ccff00]/30 rounded-none text-red-500"
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFixedFee(fee.id)} className="h-14 w-14 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 border border-white/5 rounded-none transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bloco de Sócios (Split percentual) */}
                <div className="bg-zinc-900/40 p-10 border border-white/5 shadow-2xl backdrop-blur-md rounded-none">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Users className="h-6 w-6 text-amber-500" />
                            <div>
                                <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">REPASSE SOCIETÁRIO</h2>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mt-1">DIVISÃO NET PROFIT</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={addPartner} className="text-amber-500 hover:text-black hover:bg-amber-500 rounded-none border border-amber-500/20 font-black text-[10px] uppercase tracking-widest px-4">
                            <Plus className="h-4 w-4 mr-2" /> ADICIONAR SÓCIO
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {partners.map(partner => (
                            <div key={partner.id} className="flex items-center gap-4 group">
                                <Input
                                    value={partner.name}
                                    onChange={(e) => updatePartner(partner.id, "name", e.target.value)}
                                    className="flex-1 bg-black border-white/5 h-14 text-[11px] font-black uppercase tracking-widest focus-visible:ring-amber-500/30 rounded-none placeholder:text-zinc-800"
                                    placeholder="NOME SÓCIO"
                                />
                                <div className="relative w-32">
                                    <Input
                                        type="number"
                                        value={partner.percentage}
                                        onChange={(e) => updatePartner(partner.id, "percentage", Number(e.target.value))}
                                        className="bg-black border-white/5 h-14 pr-10 font-black text-center focus-visible:ring-amber-500/30 rounded-none text-white text-sm"
                                    />
                                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removePartner(partner.id)} className="h-14 w-14 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 border border-white/5 rounded-none transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {partners.length > 0 && (
                        <div className={cn(
                            "mt-8 p-6 text-[10px] font-black uppercase tracking-widest flex justify-between items-center transition-all border rounded-none",
                            totalPercentage === 100
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                            <span>INTEGRIDADE DO REPASSE:</span>
                            <span>{totalPercentage}% {totalPercentage !== 100 && "[ERRO: COMPLETE 100%]"}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Lado Direito - Resumo */}
            <div className="space-y-10">
                <div className="bg-[#ccff00] p-10 text-black shadow-[0 0 80px rgba(204,255,0,0.1)] rounded-none sticky top-8 border-l-[12px] border-black">
                    <h2 className="text-3xl font-black font-heading uppercase tracking-tighter mb-12">RESUMO DA OPERAÇÃO</h2>

                    <div className="space-y-8">
                        <div className="flex justify-between items-end border-b border-black/10 pb-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">RECEITA REGISTRO</span>
                            <span className="text-3xl font-black tracking-tighter">{formatCurrency(grossAmount)}</span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                <span className="opacity-60">TAXA TRIBUTÁRIA ({taxRate}%)</span>
                                <span className="text-red-900">-{formatCurrency(taxAmount)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                <span className="opacity-60">COMISSÃO COMERCIAL ({commissionRate}%)</span>
                                <span className="text-red-900">-{formatCurrency(commissionAmount)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest pt-6 border-t border-black/10">
                                <span className="opacity-60">FOLHA PAGAMENTOS</span>
                                <span className="font-black text-red-900">-{formatCurrency(totalFixedFees)}</span>
                            </div>
                        </div>

                        <div className="bg-black p-10 mt-12 relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                                <DollarSign className="h-48 w-48 text-white" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 mb-4">SALDO NET REMAINING</p>
                                <p className={cn("text-5xl font-black tracking-tighter text-white", netProfit < 0 && "text-red-600")}>
                                    {formatCurrency(netProfit)}
                                </p>
                            </div>
                        </div>

                        {netProfit < 0 && (
                            <div className="bg-red-600 p-6 text-white text-[10px] font-black uppercase tracking-widest text-center shadow-lg">
                                ALERTA SISTÊMICO: DÉBITO EXCEDE ARRECADAÇÃO. OPERAÇÃO NEGATIVA!
                            </div>
                        )}

                        {/* Fatias Percentuais dos Sócios */}
                        {partners.length > 0 && netProfit > 0 && (
                            <div className="mt-12 pt-12 border-t border-black/10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-black/60">DETALHAMENTO SOCIETÁRIO</h3>
                                <div className="space-y-4">
                                    {partners.map(partner => (
                                        <div key={partner.id} className="flex justify-between items-center bg-black/5 p-5 border border-black/10 hover:bg-black hover:text-white transition-all group">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black group-hover:text-[#ccff00]">{partner.percentage}%</span>
                                                <span className="text-[11px] font-black uppercase tracking-widest">{partner.name}</span>
                                            </div>
                                            <span className="text-lg font-black tracking-tighter">
                                                {formatCurrency(netProfit * (partner.percentage / 100))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button className="w-full mt-12 bg-black text-white hover:bg-zinc-800 h-20 rounded-none font-black text-[12px] uppercase tracking-[0.5em] gap-4 group">
                            SALVAR REGISTRO FINANCEIRO
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

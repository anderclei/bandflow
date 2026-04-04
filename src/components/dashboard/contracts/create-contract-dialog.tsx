"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { ContractPDFPreview } from "./contract-pdf-preview"

import { useEffect } from "react"
import { getContractors } from "@/app/actions/contractors"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CreateContractDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateContractDialog({ open, onOpenChange }: CreateContractDialogProps) {
    const [date, setDate] = useState<Date>()
    const [includeRider, setIncludeRider] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [contractors, setContractors] = useState<any[]>([])
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [outsideHeadquarters, setOutsideHeadquarters] = useState(false)

    useEffect(() => {
        if (open) {
            getContractors().then(res => {
                if (res.success && res.data) {
                    setContractors(res.data)
                }
            })
            // Dynamically import to avoid circular dependencies if any
            import("@/app/actions/logistics-suppliers").then(mod => {
                mod.getLogisticsSuppliers().then(res => {
                    setSuppliers(res)
                })
            })
        }
    }, [open])

    // Estados do formulário
    const [contractType, setContractType] = useState<"BAR" | "WEDDING" | "CITY_HALL">("BAR")
    const [formData, setFormData] = useState({
        clientName: "",
        venue: "",
        amount: "",
        startTime: "",
        endTime: "",
        distanceKm: "",
        logisticsSupplierId: "none",
        // Campos dinâmicos
        couvertValue: "",
        foodIncluded: false,
        ceremonyTime: "",
        biddingProcess: "",
        paymentTerms: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, clientName: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-white/10 rounded-none shadow-[0_0_50px_rgba(0,0,0,1)]">
                <DialogHeader className="border-b border-white/5 pb-6">
                    <DialogTitle className="text-2xl font-black font-heading uppercase tracking-tighter text-white">Novo Orçamento / Contrato</DialogTitle>
                    <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        Preencha os dados do evento para gerar uma proposta (orçamento) ou contrato.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
                    {/* Lado Esquerdo - Formulário */}
                    <div className="space-y-6">
                        <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Tipo de Contrato</Label>
                            <Select value={contractType} onValueChange={(val: any) => setContractType(val)}>
                                <SelectTrigger className="w-full h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-white outline-none focus:ring-0 focus:border-[#ccff00]/50 transition-all">
                                    <SelectValue placeholder="Selecione o tipo..." />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 rounded-none">
                                    <SelectItem value="BAR" className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">Bar / Pub / Restaurante</SelectItem>
                                    <SelectItem value="WEDDING" className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">Evento Social (Casamento/15 Anos)</SelectItem>
                                    <SelectItem value="CITY_HALL" className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">Prefeitura / Edital / Evento Público</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Contratante</Label>
                            <Select value={formData.clientName} onValueChange={handleSelectChange}>
                                <SelectTrigger className="w-full h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-white outline-none focus:ring-0 focus:border-[#ccff00]/50 transition-all">
                                    <SelectValue placeholder="Selecione um contratante salvo" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 rounded-none border border-white/10 shadow-3xl">
                                    {contractors.map(c => (
                                        <SelectItem key={c.id} value={c.name} className="text-[10px] font-black uppercase tracking-widest focus:bg-[#ccff00] focus:text-black py-3">
                                            {c.name} {c.document ? `(${c.document})` : ''}
                                        </SelectItem>
                                    ))}
                                    {contractors.length === 0 && (
                                        <SelectItem value="none" disabled className="text-[10px] font-black uppercase tracking-widest py-3">Nenhum contratante cadastrado</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <div className="text-right">
                                <a href="/dashboard/contractors" className="text-[9px] font-black uppercase tracking-widest text-[#ccff00]/50 hover:text-[#ccff00] transition-colors leading-none">
                                    + Cadastrar novo contratante
                                </a>
                            </div>
                        </div>

                        {/* Campos Dinâmicos por Tipo */}
                        {contractType === "BAR" && (
                            <div className="p-6 rounded-none bg-zinc-900/40 border border-white/5 space-y-6">
                                <div className="grid gap-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Valor do Couvert (R$)</Label>
                                    <Input
                                        id="couvertValue"
                                        name="couvertValue"
                                        type="number"
                                        placeholder="EX: 15,00"
                                        value={formData.couvertValue}
                                        onChange={handleInputChange}
                                        className="h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Switch
                                        id="food-included"
                                        checked={formData.foodIncluded}
                                        onCheckedChange={(val) => setFormData(prev => ({ ...prev, foodIncluded: val }))}
                                        className="data-[state=checked]:bg-[#ccff00] data-[state=unchecked]:bg-zinc-800"
                                    />
                                    <Label htmlFor="food-included" className="text-[10px] font-black uppercase tracking-widest text-white mt-0.5">Alimentação/Bebida inclusa?</Label>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Data do Show</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-14 justify-start text-left bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all",
                                            !date && "text-zinc-600"
                                        )}
                                    >
                                        <CalendarIcon className="mr-3 h-4 w-4 text-[#ccff00]" />
                                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-black border-white/10 rounded-none">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="bg-black text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Local do Evento</Label>
                            <Input
                                id="venue"
                                name="venue"
                                placeholder="ENDEREÇO COMPLETO"
                                value={formData.venue}
                                onChange={handleInputChange}
                                className="h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Início</Label>
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all font-mono"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Término</Label>
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Cachê (R$)</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder="0,00"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all font-mono"
                            />
                        </div>

                        <Button 
                            className="w-full h-16 mt-8 bg-[#ccff00] text-black hover:bg-white rounded-none border-none font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all active:scale-95" 
                            onClick={() => setShowPreview(true)}
                        >
                            Gerar Prévia
                        </Button>
                    </div>

                    {/* Lado Direito - Preview */}
                    <div className="border border-white/5 rounded-none p-8 bg-zinc-900/20 min-h-[500px] flex flex-col relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-8 border-b border-white/5 pb-4">Prévia do Contrato</h3>
                        {showPreview ? (
                            <ContractPDFPreview
                                data={{
                                    ...formData,
                                    contractType,
                                    date,
                                    includeRider,
                                    outsideHeadquarters,
                                    displacementValue: (() => {
                                        if (!outsideHeadquarters || !formData.distanceKm) return 0;
                                        const supplier = suppliers.find(s => s.id === formData.logisticsSupplierId);
                                        return supplier ? (supplier.kmValue * Number(formData.distanceKm)) : 0;
                                    })()
                                }}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-[10px] font-black uppercase tracking-widest text-center p-12 border-2 border-dashed border-white/5 rounded-none group-hover:border-[#ccff00]/10 transition-all">
                                <FileText className="w-12 h-12 mb-6 opacity-10" />
                                <p className="max-w-[200px] leading-relaxed">
                                    Preencha o formulário e clique no botão abaixo para visualizar o contrato.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

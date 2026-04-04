"use client"

import Link from "next/link"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, FileText, Download, Trash2, ShieldCheck, FileSignature, CalendarCheck, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateContractDialog } from "@/components/dashboard/contracts/create-contract-dialog"
import { ContractDetailsDialog } from "@/components/dashboard/contracts/contract-details-dialog"
import { DigitalSignatureDialog } from "@/components/dashboard/contracts/digital-signature-dialog"
import { deleteContract } from "@/app/actions/contracts"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type ContractStatus = "Rascunho" | "Enviado" | "Assinado" | "Cancelado" | "Orçamento"

interface Contract {
    id: string
    eventName?: string | null
    date?: string | null
    amount?: number | null
    status?: ContractStatus | null
    clientName?: string | null
    createdAt?: string
    data?: string // JSON original do banco
}

interface Contractor {
    id: string
    name: string
}

const getStatusColor = (status?: string | null) => {
    switch (status) {
        case "Rascunho": return "secondary"
        case "Enviado": return "default"
        case "Assinado": return "outline"
        case "Cancelado": return "destructive"
        default: return "secondary"
    }
}

export function ContractsClient({
    initialContracts,
    contractors,
}: {
    initialContracts: Contract[];
    contractors: Contractor[];
}) {
    const router = useRouter();
    const [isNewContractOpen, setIsNewContractOpen] = useState(false)
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isSignatureOpen, setIsSignatureOpen] = useState(false)
    const [contracts, setContracts] = useState<Contract[]>(initialContracts.map(c => {
        if (c.data) {
            try {
                const parsed = JSON.parse(c.data);
                return {
                    ...c,
                    eventName: parsed.eventName || parsed.venue || "Contrato sem título",
                    clientName: parsed.clientName || "—",
                    date: parsed.date,
                    amount: parsed.amount
                };
            } catch (e) {
                return c;
            }
        }
        return c;
    }))

    const handleViewDetails = (contract: Contract) => {
        setSelectedContract(contract)
        setIsDetailsOpen(true)
    }

    const handleOpenSignature = (contract: Contract) => {
        setSelectedContract(contract)
        setIsSignatureOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este contrato?")) return
        try {
            await deleteContract(id)
            setContracts(prev => prev.filter(c => c.id !== id))
            toast.success("Contrato excluído")
        } catch (e) {
            toast.error("Erro ao excluir contrato")
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00] rounded-none">
                            <FileSignature className="h-6 w-6" />
                        </div>
                        <h1 className="text-5xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                            PROPOSTAS <span className="text-zinc-600">E CONTRATOS</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        GESTÃO DE ACORDOS E FORMALIZAÇÕES DE SHOWS
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild className="h-12 px-8 rounded-none border-white/5 bg-zinc-900/40 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white hover:text-black transition-all">
                        <Link href="/dashboard/templates">
                            <FileText className="mr-3 h-4 w-4" />
                            MODELOS
                        </Link>
                    </Button>
                    <Button onClick={() => setIsNewContractOpen(true)} className="h-12 px-8 rounded-none bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(204,255,0,0.1)] border-0">
                        <Plus className="h-4 w-4 mr-3" />
                        NOVO CONTRATO
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {contracts.length > 0 ? (
                    contracts.map((contract) => (
                        <div key={contract.id} className="group relative rounded-none bg-zinc-900/40 p-8 border border-white/5 hover:border-[#ccff00]/30 transition-all flex flex-col sm:flex-row gap-8 items-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/2 blur-3xl pointer-events-none" />
                            <div className="flex flex-col items-center justify-center p-6 rounded-none bg-black border border-white/5 text-[#ccff00] min-w-[100px]">
                                <FileText className="h-8 w-8 mb-2" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center">
                                    {contract.status === "Orçamento" ? "ORÇAMENTO" : "CONTRATO"}
                                </span>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-[#ccff00] transition-colors">{contract.eventName || "Sem título"}</h3>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">{contract.clientName || "—"}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">REF {contract.id.slice(0,6).toUpperCase()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[9px] font-black uppercase tracking-widest border px-4 py-1.5 rounded-none",
                                                contract.status === "Assinado" ? "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20" : "bg-black text-white border-white/5"
                                            )}
                                        >
                                            {contract.status || "EM RASCUNHO"}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 text-zinc-600 hover:text-white hover:bg-white/5">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none bg-zinc-900 border-white/5 text-[10px] font-black uppercase tracking-widest">
                                                <DropdownMenuLabel className="p-4 text-zinc-600">AÇÕES DISPONÍVEIS</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleViewDetails(contract)} className="p-4 focus:bg-[#ccff00] focus:text-black transition-colors rounded-none">
                                                    <FileText className="mr-3 h-4 w-4" /> VER DETALHES
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenSignature(contract)} className="p-4 focus:bg-[#ccff00] focus:text-black transition-colors rounded-none">
                                                    <FileSignature className="mr-3 h-4 w-4" /> ASSINAR AGORA
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(contract.id)} className="p-4 text-red-500 focus:bg-red-500 focus:text-white transition-colors rounded-none">
                                                    <Trash2 className="mr-3 h-4 w-4" /> EXCLUIR REGISTRO
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-white/5">
                                    {contract.date && (
                                        <div className="flex items-center gap-3">
                                            <CalendarCheck className="h-4 w-4 text-zinc-600" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">{new Date(contract.date).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    )}
                                    {contract.amount != null && (
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-4 w-4 text-[#ccff00]" />
                                            <span className="text-[11px] font-black tracking-widest text-white">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(contract.amount)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-24 text-center border-2 border-dashed border-white/5 bg-zinc-900/20">
                        <div className="inline-flex p-8 bg-black border border-white/5 text-zinc-800 mb-8 scale-150 relative">
                            <div className="absolute inset-0 bg-[#ccff00]/5 animate-pulse" />
                            <FileText className="h-8 w-8 relative z-10" />
                        </div>
                        <h3 className="text-3xl font-black font-heading uppercase tracking-widest text-zinc-700 leading-none mb-6">NADA POR AQUI</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">Crie seu primeiro contrato para carregar os dados.</p>
                    </div>
                )}
            </div>

            <CreateContractDialog
                open={isNewContractOpen}
                onOpenChange={(open) => {
                    setIsNewContractOpen(open);
                    if (!open) router.refresh();
                }}
            />

            <ContractDetailsDialog
                contract={selectedContract}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />

            <DigitalSignatureDialog
                contract={selectedContract}
                open={isSignatureOpen}
                onOpenChange={setIsSignatureOpen}
            />
        </div>
    )
}

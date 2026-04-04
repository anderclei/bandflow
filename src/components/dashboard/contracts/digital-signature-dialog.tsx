"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Send, ShieldCheck, Fingerprint, MousePointer2 } from "lucide-react"
import { useState } from "react"
import { updateContractStatus } from "@/app/actions/contracts"
import { toast } from "sonner"

interface DigitalSignatureDialogProps {
    contract: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DigitalSignatureDialog({ contract, open, onOpenChange }: DigitalSignatureDialogProps) {
    const [isSimulating, setIsSimulating] = useState(false)

    if (!contract) return null

    const steps = [
        { label: "Enviado", status: ["Enviado", "Assinado"].includes(contract.status), icon: Send },
        { label: "Visualizado", status: ["Assinado"].includes(contract.status) || (contract.status === "Enviado" && Math.random() > 0.5), icon: MousePointer2 },
        { label: "Assinado", status: contract.status === "Assinado", icon: CheckCircle2 },
    ]

    const handleSimulateSignature = async () => {
        setIsSimulating(true)
        try {
            await updateContractStatus(contract.id, "Assinado")
            toast.success("Contrato assinado com sucesso! (Simulado)")
            onOpenChange(false)
        } catch (error) {
            toast.error("Erro ao simular assinatura")
        } finally {
            setIsSimulating(false)
        }
    }

    const handleSendForSignature = async () => {
        setIsSimulating(true)
        try {
            await updateContractStatus(contract.id, "Enviado")
            toast.success("Contrato enviado para assinatura!")
            onOpenChange(false)
        } catch (error) {
            toast.error("Erro ao enviar para assinatura")
        } finally {
            setIsSimulating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <DialogTitle>Fluxo de Assinatura Digital</DialogTitle>
                    </div>
                    <DialogDescription>
                        Acompanhe ou simule o processo de coleta de assinaturas jurídicas.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-8">
                    {/* Progress Steps */}
                    <div className="relative flex justify-between">
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-10" />
                        {steps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step.status
                                        ? "bg-secondary border-secondary text-white"
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                                    }`}>
                                    <step.icon className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${step.status ? "text-secondary" : "text-zinc-500"}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Metadata Box */}
                    <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-100 dark:border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-medium">Validado por IP</span>
                            <span className="font-mono text-zinc-400">187.xx.xx.xxx</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-medium">Selo de Integridade</span>
                            <Badge variant="outline" className="text-[9px] h-4 bg-green-500/10 text-green-600 border-green-200">SHA-256 ACTIVE</Badge>
                        </div>
                        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                            <p className="text-[10px] leading-relaxed text-zinc-400 italic">
                                "Ao assinar este documento, as partes concordam com os termos conforme a Medida Provisória nº 2.200-2/2001."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3">
                    {contract.status === "Rascunho" && (
                        <Button
                            className="bg-secondary text-white hover:bg-secondary/90 h-12 rounded-xl gap-2 shadow-lg shadow-secondary/20"
                            onClick={handleSendForSignature}
                            disabled={isSimulating}
                        >
                            <Send className="h-4 w-4" />
                            Enviar para Contratante
                        </Button>
                    )}

                    {contract.status === "Enviado" && (
                        <Button
                            variant="outline"
                            className="h-12 rounded-xl gap-2 border-secondary text-secondary hover:bg-secondary/5"
                            onClick={handleSimulateSignature}
                            disabled={isSimulating}
                        >
                            <Fingerprint className="h-4 w-4" />
                            Simular Assinatura do Cliente
                        </Button>
                    )}

                    {contract.status === "Assinado" && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-200 text-green-700 text-center">
                            <p className="text-sm font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Documento Juridicamente Vinculado
                            </p>
                        </div>
                    )}

                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

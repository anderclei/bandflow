"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createContractor, updateContractor } from "@/app/actions/contractors"

interface ContractorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    contractor?: any
    onSuccess?: () => void
}

export function ContractorDialog({ open, onOpenChange, contractor, onSuccess }: ContractorDialogProps) {
    const isEdit = !!contractor
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [type, setType] = useState<"PF" | "PJ">(contractor?.type || "PF")
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (open) {
            setError(null)
            setIsPending(false)
            if (contractor) {
                setType(contractor.type || "PF")
            } else {
                setType("PF")
            }
        }
    }, [open, contractor])

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError(null)

        formData.append("type", type)

        const result = isEdit
            ? await updateContractor(contractor.id, formData)
            : await createContractor(formData)

        if (result.success) {
            onSuccess?.()
            onOpenChange(false)
        } else {
            setError(result.error as string)
        }
        setIsPending(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[1100px] w-[95vw] max-h-[90vh] overflow-y-auto outline-none bg-black border-white/5 rounded-none p-12">
                <DialogHeader className="mb-10">
                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-white">
                        {isEdit ? "ATUALIZAÇÃO DE LOCAL" : "REGISTRO DE LOCAL CONTRATANTE"}
                    </DialogTitle>
                    <DialogDescription className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mt-2">
                        REGISTRO DE Cadastro OPERACIONAIS
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={type} onValueChange={(v) => setType(v as "PF" | "PJ")} className="w-full mt-2">
                    <div className="flex justify-start w-full mb-10">
                        <TabsList className="grid w-full max-w-md grid-cols-2 bg-zinc-900/40 border border-white/5 p-1 rounded-none h-14">
                            <TabsTrigger value="PF" className="rounded-none font-black uppercase tracking-widest text-[9px] data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-600">ENTIDADE FÍSICA (PF)</TabsTrigger>
                            <TabsTrigger value="PJ" className="rounded-none font-black uppercase tracking-widest text-[9px] data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-600">ENTIDADE JURÍDICA (PJ)</TabsTrigger>
                        </TabsList>
                    </div>

                    <form ref={formRef} action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-500/10 rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 border-b border-white/5 pb-4">
                                METADADOS PRIMÁRIOS
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{type === "PJ" ? "RAZÃO SOCIAL *" : "NOME COMPLETO *"}</Label>
                                    <Input name="name" required defaultValue={contractor?.name} className="h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-[#ccff00]" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{type === "PJ" ? "CNPJ *" : "CPF *"}</Label>
                                    <Input name="document" required defaultValue={contractor?.document} className="h-14 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-[#ccff00]" />
                                </div>

                                {type === "PF" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700 dark:text-zinc-300">RG</Label>
                                            <Input name="rg" defaultValue={contractor?.rg} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700 dark:text-zinc-300">Órgão Emissor / UF</Label>
                                            <Input name="issuingBody" defaultValue={contractor?.issuingBody} placeholder="SSP/SP" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700 dark:text-zinc-300">Nacionalidade</Label>
                                            <Input name="nationality" defaultValue={contractor?.nationality} placeholder="Brasileiro(a)" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700 dark:text-zinc-300">Estado Civil</Label>
                                            <Input name="maritalStatus" defaultValue={contractor?.maritalStatus} placeholder="Solteiro(a)" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700 dark:text-zinc-300">Profissão</Label>
                                            <Input name="profession" defaultValue={contractor?.profession} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cont-status" className="text-zinc-700 dark:text-zinc-300">Status CRM</Label>
                                            <select 
                                                id="cont-status"
                                                name="status" 
                                                title="Status no CRM"
                                                defaultValue={contractor?.status || "LEAD"}
                                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                            >
                                                <option value="LEAD">Lead (Novo Contato)</option>
                                                <option value="NEGOTIATING">Negociando</option>
                                                <option value="WON">Fechado (Ganho)</option>
                                                <option value="LOST">Perdido</option>
                                                <option value="ARCHIVED">Arquivado</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {type === "PJ" && (
                            <div className="space-y-8 mt-12">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 border-b border-white/5 pb-4">
                                    METADADOS DE REPRESENTAÇÃO
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">Nome do Representante *</Label>
                                        <Input name="repName" required={type === "PJ"} defaultValue={contractor?.repName} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">CPF</Label>
                                        <Input name="repCpf" defaultValue={contractor?.repCpf} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">RG</Label>
                                        <Input name="repRg" defaultValue={contractor?.repRg} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">Nacionalidade</Label>
                                        <Input name="repNationality" defaultValue={contractor?.repNationality} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">Estado Civil</Label>
                                        <Input name="repMaritalStatus" defaultValue={contractor?.repMaritalStatus} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">Profissão</Label>
                                        <Input name="repProfession" defaultValue={contractor?.repProfession} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8 mt-12">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 border-b border-white/5 pb-4">
                                LOCAL E COMUNICAÇÃO
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                <div className="col-span-1 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">CEP</Label>
                                    <Input name="zipCode" defaultValue={contractor?.zipCode} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="col-span-3 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">Rua / Av</Label>
                                    <Input name="address" defaultValue={contractor?.address} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="col-span-1 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">Número</Label>
                                    <Input name="addressNumber" defaultValue={contractor?.addressNumber} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="col-span-1 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">UF</Label>
                                    <Input name="state" defaultValue={contractor?.state} maxLength={2} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">Complemento</Label>
                                    <Input name="addressComplement" defaultValue={contractor?.addressComplement} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">Bairro</Label>
                                    <Input name="neighborhood" defaultValue={contractor?.neighborhood} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">Cidade</Label>
                                    <Input name="city" defaultValue={contractor?.city} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">E-mail</Label>
                                    <Input name="email" type="email" defaultValue={contractor?.email} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">Telefone / WhatsApp</Label>
                                    <Input name="phone" defaultValue={contractor?.phone} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-zinc-700 dark:text-zinc-300">Observações Internas</Label>
                                    <Input name="notes" defaultValue={contractor?.notes} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-10 border-t border-white/5 mt-12">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-14 px-10 rounded-none font-black uppercase tracking-widest text-[10px] text-zinc-500 hover:text-white">ABORTAR</Button>
                            <Button type="submit" disabled={isPending} className="h-14 px-14 bg-[#ccff00] text-black hover:bg-white rounded-none border-none font-black uppercase tracking-widest text-[10px] shadow-[0 0 30px rgba(204,255,0,0.1)]">
                                {isPending ? "SALVANDO..." : (isEdit ? "SINCRONIZAR DADOS" : "SALVAR REGISTRO")}
                            </Button>
                        </div>
                    </form>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

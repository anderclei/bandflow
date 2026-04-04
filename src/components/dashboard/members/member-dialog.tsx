"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createMember, updateMember } from "@/app/actions/members"
import { MemberDocumentsTab } from "./member-documents-tab"
import { Users } from "lucide-react"

interface MemberDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    member?: any
    formats: any[]
    onSuccess?: () => void
}

export function MemberDialog({ open, onOpenChange, member, formats, onSuccess }: MemberDialogProps) {
    const isEdit = !!member
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const [selectedFormats, setSelectedFormats] = useState<string[]>([])
    const [role, setRole] = useState<"ADMIN" | "MEMBER">(member?.role || "MEMBER")

    useEffect(() => {
        if (open) {
            setError(null)
            setIsPending(false)
            setRole(member?.role || "MEMBER")
            if (member?.formats) {
                setSelectedFormats(member.formats.map((f: any) => f.id))
            } else {
                setSelectedFormats([])
            }
        }
    }, [open, member])

    function toggleFormat(formatId: string) {
        setSelectedFormats(prev =>
            prev.includes(formatId)
                ? prev.filter(id => id !== formatId)
                : [...prev, formatId]
        )
    }

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError(null)

        const data = {
            name: formData.get("name") as string,
            position: formData.get("position") as string,
            whatsapp: formData.get("whatsapp") as string,
            cache: formData.get("cache") ? Number(formData.get("cache")) : null,
            cpf: formData.get("cpf") as string,
            rg: formData.get("rg") as string,
            role: role,
            selectedFormats: selectedFormats,
        }

        const result = isEdit
            ? await updateMember({ id: member.id, ...data })
            : await createMember(data)

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
            <DialogContent className="max-w-[700px] w-[95vw] max-h-[90vh] overflow-y-auto outline-none border-white/5 bg-[#0a0a0a] text-white p-0 overflow-hidden rounded-none">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ccff00]/5 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="p-10 space-y-10">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Users className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-2xl font-black font-heading uppercase tracking-tighter">
                                {isEdit ? "Editar_Perfil" : "Contratar_Asset"}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                            Personnel_Registration_Protocol : V.2.4
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="p-4 bg-red-600/10 border border-red-600/20 text-[10px] font-black uppercase tracking-widest text-red-500">
                             ERROR : {error}
                        </div>
                    )}

                    <form ref={formRef} action={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="member-name" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Identificação_Civil</Label>
                                <Input id="member-name" name="name" required defaultValue={member?.name || member?.user?.name || ""} placeholder="NOME_COMPLETO" title="Nome do Integrante" className="bg-black border border-white/5 py-6 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-800 rounded-none h-14" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="member-position" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Designação_Operacional</Label>
                                <Input id="member-position" name="position" required defaultValue={member?.position} placeholder="EX: BATERISTA_TECH" title="Cargo ou Função" className="bg-black border border-white/5 py-6 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-800 rounded-none h-14" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Cluster_Access_Level</Label>
                                <Select value={role} onValueChange={(v: any) => setRole(v)}>
                                    <SelectTrigger title="Nível de Acesso" className="w-full bg-black border border-white/5 py-6 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 appearance-none text-[#ccff00] rounded-none h-14">
                                        <SelectValue placeholder="Selecione um papel" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white rounded-none">
                                        <SelectItem value="MEMBER">INTEGRANTE (VIEW)</SelectItem>
                                        <SelectItem value="ADMIN">ADMIN_CORE (FULL)</SelectItem>
                                        <SelectItem value="PRODUCER">PRODUTOR_EXEC</SelectItem>
                                        <SelectItem value="FINANCIAL">CONTROLADOR_FIN</SelectItem>
                                        <SelectItem value="ROADIE">TÉCNICO_CAMPO</SelectItem>
                                        <SelectItem value="MUSICIAN">MÚSICO_SESSION</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="member-whatsapp" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Comms_WhatsApp</Label>
                                <Input id="member-whatsapp" name="whatsapp" defaultValue={member?.whatsapp} placeholder="(00) 00000-0000" title="WhatsApp para Contato" className="bg-black border border-white/5 py-6 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 rounded-none h-14" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="member-cache" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Fee_Base (R$)</Label>
                                <Input id="member-cache" name="cache" type="number" step="0.01" defaultValue={member?.cache || ""} placeholder="0.00" title="Valor do Cachê Base" className="bg-black border border-white/5 py-6 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 rounded-none h-14" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="member-cpf" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Doc_CPF</Label>
                                <Input id="member-cpf" name="cpf" defaultValue={member?.cpf} placeholder="000.000.000-00" title="CPF para Documentação" className="bg-black border border-white/5 py-6 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 rounded-none h-14" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="member-rg" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Doc_RG</Label>
                                <Input id="member-rg" name="rg" defaultValue={member?.rg} placeholder="00.000.000-0" title="RG para Documentação" className="bg-black border border-white/5 py-6 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 rounded-none h-14" />
                            </div>
                        </div>

                        {/* SHOW FORMATS */}
                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
                                Link_Operational_Formats
                            </div>
                            {formats.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {formats.map((format: any) => (
                                        <div key={format.id} className="flex flex-row items-center space-x-4 p-4 border border-white/5 bg-zinc-900/20 hover:bg-white/[0.02] cursor-pointer transition-all" onClick={() => toggleFormat(format.id)}>
                                            <Checkbox
                                                id={`format-${format.id}`}
                                                checked={selectedFormats.includes(format.id)}
                                                onCheckedChange={() => toggleFormat(format.id)}
                                                className="border-white/10 data-[state=checked]:bg-[#ccff00] data-[state=checked]:text-black rounded-none"
                                            />
                                            <div className="space-y-1">
                                                <Label htmlFor={`format-${format.id}`} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                    {format.name}
                                                </Label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 border border-dashed border-white/10 text-center opacity-40">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">No_Formats_Detected</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-white/5">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white rounded-none h-14 px-8">ABORT_COMMAND</Button>
                            <Button type="submit" disabled={isPending} className="bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 rounded-none h-14 px-10">
                                {isPending ? "EXECUTING..." : (isEdit ? "COMMIT_CHANGES" : "REGISTER_ASSET")}
                            </Button>
                        </div>
                    </form>

                    {isEdit && (
                        <div className="space-y-6 pt-16 mt-8 border-t border-white/5">
                            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
                                Encrypted_Doc_Storage
                            </div>
                            <div className="bg-zinc-900/20 border border-white/5 p-8">
                                <MemberDocumentsTab
                                    memberId={member.id}
                                    bandId={member.bandId}
                                    initialDocuments={member.documents || []}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

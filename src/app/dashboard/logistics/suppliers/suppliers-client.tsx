"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Building, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLogisticsSupplier, updateLogisticsSupplier, deleteLogisticsSupplier } from "@/app/actions/logistics-suppliers"

interface Supplier {
    id: string;
    name: string;
    contact: string | null;
    kmValue: number;
}

export function SuppliersClient({ initialSuppliers }: { initialSuppliers: Supplier[] }) {
    const [suppliers, setSuppliers] = useState(initialSuppliers)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [formData, setFormData] = useState({ name: "", contact: "", kmValue: 0 })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (editingSupplier) {
                await updateLogisticsSupplier(editingSupplier.id, {
                    name: formData.name,
                    contact: formData.contact,
                    kmValue: Number(formData.kmValue)
                })
                setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, name: formData.name, contact: formData.contact, kmValue: Number(formData.kmValue) } : s))
                toast.success("Fornecedor atualizado com sucesso!")
            } else {
                const res = await createLogisticsSupplier({
                    name: formData.name,
                    contact: formData.contact,
                    kmValue: Number(formData.kmValue)
                })
                setSuppliers([res.supplier as Supplier, ...suppliers])
                toast.success("Fornecedor cadastrado com sucesso!")
            }
            setIsAddOpen(false)
            setEditingSupplier(null)
            setFormData({ name: "", contact: "", kmValue: 0 })
        } catch (error) {
            toast.error("Erro ao salvar")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return
        try {
            await deleteLogisticsSupplier(id)
            setSuppliers(suppliers.filter(s => s.id !== id))
            toast.success("Fornecedor removido!")
        } catch (error) {
            toast.error("Erro ao excluir")
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                        Malha <span className="text-zinc-600"> Logística</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        GERENCIAMENTO DE FROTAS E CUSTOS OPERACIONAIS POR KM
                    </p>
                </div>
                <Dialog open={isAddOpen || !!editingSupplier} onOpenChange={(open) => {
                    if (!open) {
                        setIsAddOpen(false)
                        setEditingSupplier(null)
                        setFormData({ name: "", contact: "", kmValue: 0 })
                    } else setIsAddOpen(true)
                }}>
                    <DialogTrigger asChild>
                        <Button className="h-14 bg-[#ccff00] text-black hover:bg-white rounded-none border-none font-black uppercase tracking-widest text-[10px] px-8 shadow-[0 0 30px rgba(204,255,0,0.1)] transition-all gap-3">
                            <Plus className="h-4 w-4" /> NOVO FORNECEDOR
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border border-white/10 rounded-none max-w-2xl p-12">
                        <DialogHeader className="mb-10 text-left">
                            <DialogTitle className="text-3xl font-black font-heading uppercase text-white tracking-tighter">
                                {editingSupplier ? "EDITAR REGISTRO" : "ADICIONAR RECURSO LOGÍSTICO"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">IDENTIFICAÇÃO DA EMPRESA</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="EX: VIAÇÃO COMETA / OPERADOR LOG"
                                    className="h-14 bg-zinc-900/50 border-white/5 rounded-none text-sm font-black uppercase tracking-widest placeholder:text-zinc-800 focus:border-[#ccff00]/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">CANAL DE COMUNICAÇÃO</Label>
                                <Input
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    placeholder="EX: (11) 99999-9999 / EMAIL LINK"
                                    className="h-14 bg-zinc-900/50 border-white/5 rounded-none text-sm font-black uppercase tracking-widest placeholder:text-zinc-800 focus:border-[#ccff00]/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">TAXA DE DESLOCAMENTO KM (BRL)</Label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.kmValue}
                                    onChange={e => setFormData({ ...formData, kmValue: Number(e.target.value) })}
                                    placeholder="0.00"
                                    className="h-14 bg-zinc-900/50 border-white/5 rounded-none text-sm font-black uppercase tracking-widest text-[#ccff00] focus:border-[#ccff00]/50"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} className="h-16 w-full bg-[#ccff00] text-black hover:bg-white rounded-none border-none font-black uppercase tracking-widest text-xs shadow-[0 0 40px rgba(204,255,0,0.2)] mt-6">
                                {isLoading ? "SINCRONIZANDO..." : "SINCRONIZAR REGISTRO"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-black border border-white/5 rounded-none overflow-hidden">
                {suppliers.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6 px-8">EMPRESA CÉLULA</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">CANAL CONTATO</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">FATOR CUSTO KM</TableHead>
                                <TableHead className="w-[120px] text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">AÇÕES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map(supplier => (
                                <TableRow key={supplier.id} className="border-white/5 hover:bg-zinc-900/40 group transition-all">
                                    <TableCell className="font-black text-xs uppercase tracking-widest text-white py-8 px-8">{supplier.name}</TableCell>
                                    <TableCell className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{supplier.contact || "-"}</TableCell>
                                    <TableCell className="font-black text-sm text-[#ccff00] tracking-tighter">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(supplier.kmValue)} <span className="text-[8px] text-zinc-700 font-bold"> TARIFA / KM</span>
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                title="EDITAR REGISTRO"
                                                className="bg-black border border-white/5 rounded-none h-12 w-12 hover:bg-white hover:text-black transition-all"
                                                onClick={() => {
                                                    setFormData({ name: supplier.name, contact: supplier.contact || "", kmValue: supplier.kmValue })
                                                    setEditingSupplier(supplier)
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                title="DELETAR REGISTRO"
                                                className="bg-black border border-white/5 rounded-none h-12 w-12 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                                onClick={() => handleDelete(supplier.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="py-24 text-center border-dashed border-white/5 opacity-20 grayscale">
                        <Building className="h-12 w-12 text-zinc-900 mx-auto mb-8" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">SEM FORNECEDORES SINCRONIZADOS</p>
                    </div>
                )}
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Coffee, Plus, Trash2, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addCateringItem, toggleCateringItem, deleteCateringItem } from "@/app/actions/catering"

interface CateringItem {
    id: string
    name: string
    quantity: string | null
    category: string
    isChecked: boolean
}

interface Gig {
    id: string
    title: string
    date: Date
    cateringItems: CateringItem[]
}

export function CateringList({ gigs }: { gigs: Gig[] }) {
    const [selectedGigId, setSelectedGigId] = useState<string>(gigs[0]?.id || "")
    const [newItemName, setNewItemName] = useState("")
    const [newItemQty, setNewItemQty] = useState("")
    const [newItemCategory, setNewItemCategory] = useState("BEBIDAS HIDRATAÇÃO")
    const [isSaving, setIsSaving] = useState(false)

    const selectedGig = gigs.find(g => g.id === selectedGigId)

    const handleAddItem = async () => {
        if (!newItemName.trim() || !selectedGigId) return
        setIsSaving(true)
        await addCateringItem(selectedGigId, {
            name: newItemName,
            quantity: newItemQty,
            category: newItemCategory
        })
        setNewItemName("")
        setNewItemQty("")
        setIsSaving(false)
    }

    const categories = Array.from(new Set(selectedGig?.cateringItems.map(i => i.category) || []))
    if (!categories.includes("BEBIDAS HIDRATAÇÃO")) categories.push("BEBIDAS HIDRATAÇÃO")
    if (!categories.includes("ALIMENTAÇÃO LOGÍSTICA")) categories.push("ALIMENTAÇÃO LOGÍSTICA")
    if (!categories.includes("INFRAESTRUTURA CAMARIM")) categories.push("INFRAESTRUTURA CAMARIM")

    return (
        <div className="space-y-12 pb-20">
            {gigs.length === 0 ? (
                <div className="bg-black border border-dashed border-white/5 p-20 text-center flex flex-col items-center justify-center grayscale opacity-30">
                    <Coffee className="h-12 w-12 text-zinc-900 mb-8" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">NULL GIG RECORDS.CAT PROTOCOL OFFLINE.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Event Selector & Add Form */}
                    <div className="space-y-12 lg:col-span-1">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">SELEÇÃO DE ESTAÇÃO</label>
                            <select
                                value={selectedGigId}
                                title="Selecionar Show para Camarim"
                                onChange={(e) => setSelectedGigId(e.target.value)}
                                className="w-full h-16 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all appearance-none cursor-pointer"
                            >
                                {gigs.map(g => (
                                    <option key={g.id} value={g.id}>
                                        {g.title.toUpperCase()} // {new Date(g.date).toLocaleDateString("pt-BR")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                            <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                                <Plus className="h-4 w-4 text-[#ccff00]" />
                                <h3 className="text-xl font-black font-heading uppercase tracking-tighter text-white">REGISTRAR RECURSO</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-1">IDENTIFICADOR PRODUTO</label>
                                    <input
                                        placeholder="EX: ÁGUA MINERAL NODES..."
                                        title="Nome do Item de Camarim"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-1">VOLUME QUANTIDADE</label>
                                        <input
                                            placeholder="QTY"
                                            title="Quantidade"
                                            value={newItemQty}
                                            onChange={(e) => setNewItemQty(e.target.value)}
                                            className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-1">CATEGORIA PROCESSO</label>
                                        <select
                                            value={newItemCategory}
                                            title="Categoria do Item"
                                            onChange={(e) => setNewItemCategory(e.target.value)}
                                            className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none focus:border-[#ccff00]/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="BEBIDAS HIDRATAÇÃO">BEBIDAS HIDRATAÇÃO</option>
                                            <option value="ALIMENTAÇÃO LOGÍSTICA">ALIMENTAÇÃO LOGÍSTICA</option>
                                            <option value="INFRAESTRUTURA CAMARIM">INFRAESTRUTURA CAMARIM</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddItem}
                                    disabled={isSaving || !newItemName.trim()}
                                    className="w-full h-16 bg-[#ccff00] text-black text-[12px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0 0 40px rgba(204,255,0,0.1)] active:scale-95 disabled:opacity-30 mt-4"
                                >
                                    SINCRONIZAR REQUISITO
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="lg:col-span-2 space-y-12">
                        {categories.map(cat => {
                            const items = selectedGig?.cateringItems.filter(i => i.category === cat) || []
                            return (
                                <div key={cat} className="space-y-6">
                                    <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                                        <h3 className="text-xl font-black font-heading uppercase tracking-tighter text-white">{cat} <span className="text-zinc-700"> LOCAL</span></h3>
                                        <span className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest bg-[#ccff00]/5 border border-[#ccff00]/10 px-4 py-1">
                                            {items.filter(i => i.isChecked).length} // {items.length} CONCLUÍDO
                                        </span>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="p-10 border border-dashed border-white/5 grayscale items-center flex justify-center opacity-10">
                                            <p className="text-[8px] font-black uppercase tracking-[0.5em]">PARTIÇÃO VAZIA</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map(item => (
                                                <div key={item.id} className="flex flex-row items-center justify-between p-6 bg-zinc-900/40 border border-white/5 hover:border-[#ccff00]/40 transition-all group">
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            onClick={async () => await toggleCateringItem(item.id, !item.isChecked)}
                                                            title={item.isChecked ? "Desmarcar item" : "Marcar item como concluído"}
                                                            className="h-10 w-10 flex items-center justify-center bg-black border border-white/5 text-zinc-800 transition-all"
                                                        >
                                                            {item.isChecked ? <CheckCircle2 className="h-5 w-5 text-[#ccff00]" /> : <Circle className="h-5 w-5 hover:text-white" />}
                                                        </button>
                                                        <div className="flex flex-col">
                                                            <span className={`text-[12px] font-black uppercase tracking-widest transition-all ${item.isChecked ? 'line-through text-zinc-700 opacity-50' : 'text-white'}`}>
                                                                {item.name}
                                                            </span>
                                                            {item.quantity && <span className="text-[10px] font-black text-[#ccff00]/60 uppercase tracking-[0.2em] mt-1">VOL QTD: {item.quantity}</span>}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={async () => await deleteCateringItem(item.id)}
                                                        title="Deletar Item"
                                                        className="w-12 h-12 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

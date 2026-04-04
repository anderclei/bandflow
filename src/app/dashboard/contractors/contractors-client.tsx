"use client"

import { useState, useMemo, useEffect } from "react"
import { Briefcase, Building2, Plus, Users, Search, MapPin, Phone, Mail, FileText, MoreHorizontal, Trash2, LayoutGrid, List as ListIcon, Filter, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ContractorDialog } from "@/components/dashboard/contractors/contractor-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { deleteContractor, updateContractorStatus } from "@/app/actions/contractors"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
    useDraggable,
    useDroppable,
    DragOverlay,
} from "@dnd-kit/core"

interface Contractor {
    id: string;
    name: string;
    document?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    notes?: string | null;
    bandId: string;
    status: string;
}

function DraggableContractor({ contractor, onClick }: { contractor: Contractor, onClick: () => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: contractor.id,
        data: { contractor }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(
                "p-5 rounded-none bg-black border border-white/5 shadow-none transition-all cursor-grab active:cursor-grabbing group hover:border-[#ccff00]/30",
                isDragging ? "opacity-50 border-[#ccff00] z-50 scale-105" : "z-0"
            )}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0" onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}>
                    <h4 className="font-black text-[11px] uppercase tracking-widest text-white group-hover:text-[#ccff00] truncate">{contractor.name}</h4>
                    <div className="mt-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-zinc-800" />
                        <span className="truncate">{contractor.city || "SEM DATA"}</span>
                    </div>
                </div>
                <div {...listeners} className="p-1 -mr-2 text-zinc-800 hover:text-[#ccff00] cursor-grab">
                    <GripVertical className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}

function DroppableColumn({ id, title, color, count, children }: { id: string, title: string, color: string, count: number, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 flex flex-col gap-6 p-4 rounded-none transition-all border-l border-white/5",
                isOver ? "bg-[#ccff00]/5 border-l-[#ccff00]" : "bg-transparent"
            )}
        >
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-none ${color} shadow-[0 0 10px currentColor]`} />
                    <h3 className="font-black text-white uppercase text-[10px] tracking-[0.3em]">
                        {title}
                    </h3>
                </div>
                <span className="bg-zinc-900 border border-white/5 px-3 py-1 rounded-none text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    {count}
                </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[600px] p-1">
                {children}
            </div>
        </div>
    );
}

export function ContractorsClient({ initialContractors }: { initialContractors: Contractor[] }) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [cityFilter, setCityFilter] = useState<string>("ALL")
    const [view, setView] = useState<"list" | "pipeline">("list")
    const [selectedContractor, setSelectedContractor] = useState<any>(null)
    const [contractors, setContractors] = useState<Contractor[]>(initialContractors)
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        setContractors(initialContractors);
    }, [initialContractors]);

    const cities = useMemo(() => {
        const uniqueCities = new Set(contractors.map(c => c.city).filter(Boolean))
        return Array.from(uniqueCities).sort()
    }, [contractors])

    const filteredContractors = contractors.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.document?.includes(searchTerm)
        
        const matchesStatus = statusFilter === "ALL" || c.status === statusFilter
        const matchesCity = cityFilter === "ALL" || c.city === cityFilter

        return matchesSearch && matchesStatus && matchesCity
    })

    const handleEdit = (contractor: any) => {
        setSelectedContractor(contractor)
        setIsDialogOpen(true)
    }

    const handleNew = () => {
        setSelectedContractor(null)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir este contratante?")) return;
        const res = await deleteContractor(id);
        if (res.success) {
            setContractors(contractors.filter(c => c.id !== id));
            toast.success("Contratante excluído!");
        } else {
            toast.error(res.error || "Erro ao excluir.");
        }
    }

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        
        if (!over) return;

        const contractorId = active.id as string;
        const newStatus = over.id as string;
        const contractor = contractors.find(c => c.id === contractorId);

        if (!contractor || contractor.status === newStatus) return;

        const previousContractors = [...contractors];
        setContractors(contractors.map(c => 
            c.id === contractorId ? { ...c, status: newStatus } : c
        ));

        const result = await updateContractorStatus(contractorId, newStatus);
        
        if (!result.success) {
            setContractors(previousContractors);
            toast.error("Erro ao atualizar status. Tente novamente.");
        } else {
            toast.success(`${contractor.name} movido para ${newStatus}`);
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                        MEUS <span className="text-zinc-600"> CLIENTES</span>
                    </h1>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        BANCO DE DADOS DE CONTRATANTES E PARCEIROS
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleNew} className="h-14 px-10 bg-[#ccff00] text-black hover:bg-white rounded-none border-none font-black uppercase tracking-widest text-[11px] shadow-[0 0 30px rgba(204,255,0,0.1)]">
                        <Plus className="h-4 w-4 mr-2" />
                        CADASTRAR CLIENTE
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-800" />
                    <Input
                        type="search"
                        placeholder="BUSCAR POR NOME OU DOCUMENTO..."
                        className="h-14 pl-12 bg-black border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest text-[#ccff00] placeholder:text-zinc-900 shadow-none focus:border-[#ccff00]/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="filter-status" className="text-[9px] uppercase font-black tracking-widest text-zinc-700 ml-1">FILTRAR STATUS</Label>
                        <select
                            id="filter-status"
                            name="status"
                            title="Status do Contratante"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-14 rounded-none border border-white/5 bg-black px-6 text-[10px] font-black uppercase tracking-widest text-white focus:border-[#ccff00]/50 outline-none appearance-none cursor-pointer"
                        >
                            <option value="ALL">TODOS OS STATUS</option>
                            <option value="LEAD">INTERESSADOS</option>
                            <option value="NEGOTIATING">EM NEGOCIAÇÃO</option>
                            <option value="WON">SHOWS FECHADOS</option>
                            <option value="LOST">NÃO EVOLUIU</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filter-city" className="text-[9px] uppercase font-black tracking-widest text-zinc-700 ml-1">CIDADE</Label>
                        <select
                            id="filter-city"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            title="Filtrar por Cidade"
                            className="h-14 rounded-none border border-white/5 bg-black px-6 text-[10px] font-black uppercase tracking-widest text-white focus:border-[#ccff00]/50 outline-none appearance-none cursor-pointer"
                        >
                            <option value="ALL">TODAS AS LOCALIZAÇÕES</option>
                            {cities.map(city => (
                                <option key={city} value={city!}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-none ml-4 h-14">
                        <button
                            onClick={() => setView("list")}
                            className={`px-6 h-full rounded-none transition-all flex items-center justify-center ${view === 'list' ? 'bg-[#ccff00] text-black' : 'text-zinc-600 hover:text-white'}`}
                            title="Ver Lista"
                        >
                            <ListIcon className="h-4 w-4 mr-2" />
                            <span className="text-[8px] font-black uppercase tracking-widest">LISTA</span>
                        </button>
                        <button
                            onClick={() => setView("pipeline")}
                            className={`px-6 h-full rounded-none transition-all flex items-center justify-center ${view === 'pipeline' ? 'bg-[#ccff00] text-black' : 'text-zinc-600 hover:text-white'}`}
                            title="Ver Pipeline"
                        >
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            <span className="text-[8px] font-black uppercase tracking-widest">VENDAS</span>
                        </button>
                    </div>
                </div>
            </div>

            {view === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContractors.length > 0 ? (
                        filteredContractors.map((contractor) => (
                            <div key={contractor.id} className="group relative rounded-none bg-zinc-900/40 p-8 border border-white/5 hover:border-[#ccff00]/30 transition-all flex flex-col gap-6 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/2 blur-3xl pointer-events-none" />
                                <div className="flex justify-between items-start border-b border-white/5 pb-2 min-h-[80px]">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 rounded-none bg-black border border-white/5 text-[#ccff00]">
                                            <Briefcase className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors leading-none">
                                                {contractor.name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-3">
                                                <span className={cn(
                                                    "text-[8px] font-black px-3 py-1 bg-zinc-900 border border-white/5 uppercase tracking-widest",
                                                    contractor.status === 'WON' ? 'text-[#ccff00] border-[#ccff00]/20' : contractor.status === 'NEGOTIATING' ? 'text-amber-500' : 'text-zinc-600'
                                                )}>
                                                    {contractor.status || "LEAD"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="sr-only">Abrir menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-black border-white/5 rounded-none text-white">
                                            <DropdownMenuLabel className="font-black text-[9px] uppercase tracking-widest">Ações</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEdit(contractor)} className="font-black text-[9px] uppercase tracking-widest hover:bg-[#ccff00] hover:text-black focus:bg-[#ccff00] focus:text-black">
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500 font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white" onClick={() => handleDelete(contractor.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-4 mt-2 text-[10px] uppercase font-black tracking-widest">
                                    {contractor.email && (
                                        <div className="flex items-center gap-4 text-zinc-500">
                                            <Mail className="h-3 w-3 text-zinc-800" />
                                            <span className="truncate">{contractor.email}</span>
                                        </div>
                                    )}
                                    {contractor.phone && (
                                        <div className="flex items-center gap-4 text-zinc-500">
                                            <Phone className="h-3 w-3 text-zinc-800" />
                                            <span>{contractor.phone}</span>
                                        </div>
                                    )}
                                    {(contractor.city || contractor.state) && (
                                        <div className="flex items-center gap-4 text-zinc-500">
                                            <MapPin className="h-3 w-3 text-zinc-800" />
                                            <span className="truncate">
                                                {contractor.city}{contractor.city && contractor.state ? " // " : ""}{contractor.state}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full rounded-none bg-black/40 border border-dashed border-white/5 p-20 text-center flex flex-col items-center gap-8 grayscale opacity-20">
                            <Users className="h-12 w-12 text-zinc-800" />
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase tracking-widest text-zinc-700 leading-none">BANCO DE DADOS VAZIO</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900">AGUARDANDO INPUT DE ENTIDADES CONTRATANTES</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex-1 overflow-x-auto pb-8">
                        <div className="flex gap-6 h-full min-w-[1000px]">
                            {[
                                { id: "LEAD", title: "PROSPECÇÃO (LEAD)", color: "bg-blue-600" },
                                { id: "NEGOTIATING", title: "NEGOCIAÇÃO ATIVA", color: "bg-amber-600" },
                                { id: "WON", title: "COMMIT FECHADO", color: "bg-[#ccff00]" },
                                { id: "LOST", title: "SINAL PERDIDO", color: "bg-red-600" }
                            ].map(col => (
                                <DroppableColumn 
                                    key={col.id} 
                                    id={col.id} 
                                    title={col.title} 
                                    color={col.color} 
                                    count={filteredContractors.filter(c => c.status === col.id).length}
                                >
                                    {filteredContractors.filter(c => c.status === col.id).map(contractor => (
                                        <DraggableContractor 
                                            key={contractor.id} 
                                            contractor={contractor} 
                                            onClick={() => handleEdit(contractor)} 
                                        />
                                    ))}
                                </DroppableColumn>
                            ))}
                        </div>
                    </div>

                    <DragOverlay>
                        {activeId ? (
                            <div className="p-6 rounded-none bg-black border border-[#ccff00] shadow-2xl w-[300px] rotate-3 opacity-90 scale-110 pointer-events-none">
                                <h4 className="font-black text-[12px] uppercase tracking-widest text-[#ccff00] truncate">
                                    {contractors.find(c => c.id === activeId)?.name}
                                </h4>
                                <div className="mt-4 text-[10px] font-black uppercase text-zinc-600 flex items-center gap-3">
                                    <MapPin className="h-3 w-3" />
                                    <span className="tracking-widest">{contractors.find(c => c.id === activeId)?.city || "SEM DATA"}</span>
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}


            <ContractorDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                contractor={selectedContractor}
                onSuccess={() => {
                    setIsDialogOpen(false);
                    router.refresh();
                }}
            />
        </div>
    )
}

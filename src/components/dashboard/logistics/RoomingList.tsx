"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Hotel, MapPin, Calendar as CalendarIcon, Trash2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createTrip, deleteTrip, createRoom, deleteRoom, assignMemberToRoom, removeAssignment } from "@/app/actions/trips"
import { useRouter } from "next/navigation"

type MemberType = { id: string; name: string | null; role: string; user?: { name: string | null } }
type RoomType = { id: string; name: string; type: string; assignments: { member: MemberType }[] }
type TripType = { id: string; eventName: string; city: string; date: string | null; hotel: string | null; rooms: RoomType[] }

interface Props {
    initialTrips: TripType[];
    members: MemberType[];
}

export function RoomingList({ initialTrips, members }: Props) {
    const router = useRouter();
    const [trips, setTrips] = useState<TripType[]>(initialTrips);
    const [loading, setLoading] = useState<string | null>(null);

    // Novo trip
    const [newTrip, setNewTrip] = useState({ eventName: "", city: "", date: "", hotel: "" });
    const [showNewTrip, setShowNewTrip] = useState(false);

    const handleCreateTrip = async () => {
        if (!newTrip.eventName || !newTrip.city) return toast.error("Nome e cidade são obrigatórios.");
        setLoading("create-trip");
        try {
            await createTrip(newTrip);
            setNewTrip({ eventName: "", city: "", date: "", hotel: "" });
            setShowNewTrip(false);
            router.refresh();
            toast.success("Evento de hospedagem criado!");
        } catch { toast.error("Erro ao criar evento."); }
        finally { setLoading(null); }
    };

    const handleDeleteTrip = async (id: string) => {
        if (!confirm("Excluir este evento e todos os quartos?")) return;
        setLoading("delete-" + id);
        try {
            await deleteTrip(id);
            setTrips(trips.filter(t => t.id !== id));
            toast.success("Evento excluído!");
        } catch { toast.error("Erro ao excluir."); }
        finally { setLoading(null); }
    };

    const handleCreateRoom = async (tripId: string) => {
        const name = prompt("Nome do quarto (ex: Quarto 204):");
        if (!name) return;
        setLoading("room-" + tripId);
        try {
            await createRoom(tripId, { name, type: "DOUBLE" });
            router.refresh();
            toast.success("Quarto criado!");
        } catch { toast.error("Erro ao criar quarto."); }
        finally { setLoading(null); }
    };

    const handleDeleteRoom = async (id: string) => {
        if (!confirm("Excluir este quarto?")) return;
        setLoading("room-del-" + id);
        try {
            await deleteRoom(id);
            router.refresh();
            toast.success("Quarto excluído!");
        } catch { toast.error("Erro ao excluir quarto."); }
        finally { setLoading(null); }
    };

    const handleAssign = async (roomId: string, memberId: string) => {
        try {
            await assignMemberToRoom(roomId, memberId);
            router.refresh();
        } catch { toast.error("Erro ao alocar membro."); }
    };

    const handleRemove = async (roomId: string, memberId: string) => {
        try {
            await removeAssignment(roomId, memberId);
            router.refresh();
        } catch { toast.error("Erro ao remover."); }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Botão novo evento */}
            <div className="flex justify-end border-b border-white/5 pb-10">
                <button
                    className="h-16 px-10 bg-[#ccff00] text-black text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-4"
                    onClick={() => setShowNewTrip(!showNewTrip)}
                >
                    <Plus className="h-4 w-4" /> ADICIONAR HOSPEDAGEM
                </button>
            </div>

            {/* Form novo evento */}
            {showNewTrip && (
                <div className="bg-zinc-900/40 border border-[#ccff00]/20 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                    <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                        <Plus className="h-4 w-4 text-[#ccff00]" />
                        <h3 className="text-xl font-black font-heading uppercase tracking-tighter text-white">RESERVAR HOTEL</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">NOME DO EVENTO</label>
                            <input title="Nome do Evento" value={newTrip.eventName} onChange={e => setNewTrip({ ...newTrip, eventName: e.target.value })} placeholder="EX: SHOW EM SÃO PAULO" className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">CIDADE</label>
                            <input title="Cidade do Evento" value={newTrip.city} onChange={e => setNewTrip({ ...newTrip, city: e.target.value })} placeholder="EX: SÃO PAULO, SP" className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">DATA</label>
                            <input title="Data do Evento" type="date" value={newTrip.date} onChange={e => setNewTrip({ ...newTrip, date: e.target.value })} className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none focus:border-[#ccff00]/50 transition-all cursor-pointer" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">HOTEL</label>
                            <input title="Hotel do Evento" value={newTrip.hotel} onChange={e => setNewTrip({ ...newTrip, hotel: e.target.value })} placeholder="EX: HOTEL MERCURE" className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all" />
                        </div>
                    </div>
                    <div className="flex gap-6 justify-end mt-12 pt-8 border-t border-white/5">
                        <button className="h-14 px-8 text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-white transition-colors" onClick={() => setShowNewTrip(false)}>CANCELAR</button>
                        <button
                            className="h-14 px-12 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all active:scale-95"
                            onClick={handleCreateTrip}
                            disabled={loading === "create-trip"}
                        >
                            {loading === "create-trip" ? <Loader2 className="h-4 w-4 animate-spin" /> : "SALVAR RESERVA"}
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de trips */}
            {trips.length === 0 ? (
                <div className="bg-black border border-dashed border-white/5 p-20 text-center flex flex-col items-center justify-center grayscale opacity-10">
                    <Hotel className="h-12 w-12 text-zinc-900 mb-8" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">NENHUMA HOSPEDAGEM MARCADA.</p>
                </div>
            ) : (
                <div className="grid gap-12">
                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-zinc-900/40 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/2 blur-3xl pointer-events-none" />
                            <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <h3 className="text-3xl font-black font-heading uppercase tracking-tighter text-white leading-none">{trip.eventName}</h3>
                                        <span className="text-[9px] font-black text-[#ccff00] uppercase tracking-widest bg-[#ccff00]/5 border border-[#ccff00]/10 px-4 py-1">
                                            {trip.rooms.length} QUARTOS RESERVADOS
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600"><MapPin className="h-4 w-4 text-[#ccff00]" /> {trip.city}</span>
                                        {trip.date && <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600"><CalendarIcon className="h-4 w-4 text-zinc-400" /> {trip.date}</span>}
                                        {trip.hotel && <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600"><Hotel className="h-4 w-4 text-white/40" /> {trip.hotel}</span>}
                                    </div>
                                </div>
                                <button
                                    title="Remover Hospedagem"
                                    className="h-14 w-14 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                                    onClick={() => handleDeleteTrip(trip.id)}
                                    disabled={loading === "delete-" + trip.id}
                                >
                                    {loading === "delete-" + trip.id
                                        ? <Loader2 className="h-5 w-5 animate-spin" />
                                        : <Trash2 className="h-6 w-6" />}
                                </button>
                            </div>
                            <div className="p-10">
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {trip.rooms.map((room) => {
                                        const assigned = room.assignments.map(a => a.member);
                                        const unassigned = members.filter(m => !assigned.find(a => a.id === m.id));
                                        return (
                                            <div key={room.id} className="bg-black border border-white/5 p-8 hover:border-[#ccff00]/40 transition-all group/room relative">
                                                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ccff00]">{room.name}</span>
                                                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 mt-1">{room.type}</span>
                                                    </div>
                                                    <button 
                                                        title="Excluir Quarto"
                                                        className="w-10 h-10 flex items-center justify-center bg-zinc-900 text-zinc-800 hover:text-red-500 transition-colors opacity-0 group-hover/room:opacity-100" 
                                                        onClick={() => handleDeleteRoom(room.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Membros alocados */}
                                                <div className="space-y-3 mb-8">
                                                    {assigned.map(m => (
                                                        <div key={m.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 hover:border-white/10 transition-colors">
                                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{m.user?.name || m.name}</span>
                                                            <button title="Remover Membro" onClick={() => handleRemove(room.id, m.id)} className="text-zinc-800 hover:text-red-500 transition-colors cursor-pointer">✕</button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Alocar novo membro */}
                                                {unassigned.length > 0 && (
                                                    <select
                                                        title="Alocar Membro da Equipe"
                                                        className="w-full h-12 bg-transparent border border-dashed border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-700 px-4 focus:text-[#ccff00] focus:border-[#ccff00]/30 transition-all outline-none appearance-none cursor-pointer"
                                                        onChange={e => { if (e.target.value) handleAssign(room.id, e.target.value); e.target.value = ""; }}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>+ ALOCAR_OPERADOR</option>
                                                        {unassigned.map(m => (
                                                            <option key={m.id} value={m.id}>{m.user?.name || m.name}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        );
                                    })}

                                    <button
                                        onClick={() => handleCreateRoom(trip.id)}
                                        title="Adicionar Novo Quarto"
                                        disabled={loading === "room-" + trip.id}
                                        className="flex h-full min-h-[220px] flex-col items-center justify-center gap-6 bg-zinc-900/20 border border-dashed border-white/5 hover:bg-black hover:border-[#ccff00]/40 transition-all group/add grayscale opacity-30 hover:grayscale-0 hover:opacity-100"
                                    >
                                        <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center group-hover/add:text-[#ccff00] group-hover/add:border-[#ccff00]/40 transition-all">
                                            {loading === "room-" + trip.id
                                                ? <Loader2 className="h-6 w-6 animate-spin text-[#ccff00]" />
                                                : <Plus className="h-8 w-8" />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 group-hover/add:text-zinc-400">ADICIONAR_QUARTO</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

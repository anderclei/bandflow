"use client"

import { useState } from "react"
import { Plane, Plus, Trash2, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addFlight, deleteFlight } from "@/app/actions/flights"

interface Flight {
    id: string
    airline: string
    flightNumber: string | null
    locator: string | null
    departureTime: Date | null
    arrivalTime: Date | null
    origin: string | null
    destination: string | null
    passengers: string | null
}

interface Trip {
    id: string
    eventName: string
    city: string
    date: string | null
    flights: Flight[]
}

export function FlightList({ trips }: { trips: Trip[] }) {
    const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || "")
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        airline: "",
        flightNumber: "",
        locator: "",
        origin: "",
        destination: "",
        passengers: "",
        departureTime: "",
        arrivalTime: ""
    })

    const selectedTrip = trips.find(t => t.id === selectedTripId)

    const handleAddFlight = async () => {
        if (!formData.airline.trim() || !selectedTripId) return
        setIsSaving(true)

        await addFlight(selectedTripId, {
            airline: formData.airline,
            flightNumber: formData.flightNumber,
            locator: formData.locator,
            origin: formData.origin,
            destination: formData.destination,
            passengers: formData.passengers,
            departureTime: formData.departureTime ? new Date(formData.departureTime) : undefined,
            arrivalTime: formData.arrivalTime ? new Date(formData.arrivalTime) : undefined
        })

        setFormData({ airline: "", flightNumber: "", locator: "", origin: "", destination: "", passengers: "", departureTime: "", arrivalTime: "" })
        setIsSaving(false)
    }

    const formatDateTime = (date: Date | null) => {
        if (!date) return "--:--"
        return new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {trips.length === 0 ? (
                <div className="text-center py-24 rounded-none border border-dashed border-white/5 bg-black/40 grayscale opacity-20">
                    <Plane className="h-12 w-12 text-zinc-800 mx-auto mb-8" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">NENHUM VOO ATRIBUÍDO A ESTE SHOW.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Selector & Add Form */}
                    <div className="space-y-8 lg:col-span-1 border-r border-white/5 lg:pr-10">
                        <div>
                            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4 block">SELECIONAR SHOW</label>
                            <select
                                value={selectedTripId}
                                onChange={(e) => setSelectedTripId(e.target.value)}
                                className="w-full h-14 bg-black border border-white/10 rounded-none px-6 outline-none focus:border-[#ccff00]/50 text-[10px] font-black uppercase tracking-widest text-[#ccff00] appearance-none cursor-pointer"
                            >
                                {trips.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.eventName.toUpperCase()} // {t.city.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-zinc-900/40 p-8 rounded-none border border-white/5 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-white">
                                <Plus className="h-4 w-4 text-[#ccff00]" /> DETALHES DO VOO
                            </h3>

                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">CIA AÉREA</label>
                                <input
                                    placeholder="EX: LATAM / GOL / AZUL"
                                    value={formData.airline}
                                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                                    className="w-full h-14 bg-black border border-white/10 rounded-none px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 space-y-2">
                                    <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">NÚMERO DO VOO</label>
                                    <input
                                        placeholder="EX: LA3456"
                                        value={formData.flightNumber}
                                        onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                                        className="w-full h-14 bg-black border border-white/10 rounded-none px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50"
                                    />
                                </div>
                                <div className="w-1/2 space-y-2">
                                    <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">CÓDIGO (PNR)</label>
                                    <input
                                        placeholder="EX: XYZ123"
                                        value={formData.locator}
                                        onChange={(e) => setFormData({ ...formData, locator: e.target.value })}
                                        className="w-full h-14 bg-black border border-white/10 rounded-none px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 font-black"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 space-y-2">
                                    <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">DE ONDE SAI?</label>
                                    <input
                                        placeholder="EX: CGH"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                        className="w-full h-14 bg-black border border-white/10 rounded-none px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50"
                                    />
                                </div>
                                <div className="w-1/2 space-y-2">
                                    <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">PARA ONDE VAI?</label>
                                    <input
                                        placeholder="EX: SDU"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        className="w-full h-14 bg-black border border-white/10 rounded-none px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 space-y-2">
                                    <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">DATA/HORA PARTIDA</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.departureTime}
                                        onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                                        className="w-full h-14 bg-black border border-white/10 rounded-none px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 outline-none focus:border-[#ccff00]/50"
                                    />
                                </div>
                                <div className="w-1/2 space-y-2">
                                    <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">DATA/HORA CHEGADA</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.arrivalTime}
                                        onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                                        className="w-full h-14 bg-black border border-white/10 rounded-none px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 outline-none focus:border-[#ccff00]/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-zinc-800 uppercase tracking-widest ml-1">QUEM VAI VIAJAR?</label>
                                <textarea
                                    placeholder="EX: JOÃO DA SILVA, MARIA SOUZA..."
                                    value={formData.passengers}
                                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-none px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 min-h-[80px]"
                                />
                            </div>

                            <Button
                                onClick={handleAddFlight}
                                disabled={isSaving || !formData.airline.trim()}
                                className="h-14 w-full bg-[#ccff00] text-black hover:bg-white rounded-none border-none font-black uppercase tracking-widest text-[10px] shadow-[0 0 30px rgba(204,255,0,0.1)] transition-all"
                            >
                                ADICIONAR VOO
                            </Button>
                        </div>
                    </div>

                    {/* Flights List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                            <h3 className="font-black tracking-[0.3em] uppercase text-[10px] text-zinc-600">VOOS AGENDADOS</h3>
                            <span className="bg-zinc-900 border border-white/5 text-[#ccff00] text-[9px] px-3 py-1 rounded-none font-bold">
                                {selectedTrip?.flights.length || 0} VOOS
                            </span>
                        </div>


                        {!selectedTrip || selectedTrip.flights.length === 0 ? (
                            <div className="text-center py-20 bg-black/20 border border-dashed border-white/5">
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Nenhum voo cadastrado para este evento.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedTrip.flights.map(flight => (
                                    <div key={flight.id} className="bg-zinc-900/40 border border-white/5 p-8 rounded-none transition-all hover:border-[#ccff00]/30 shadow-none flex flex-col md:flex-row md:items-start justify-between gap-10 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/2 blur-3xl pointer-events-none" />
                                        <div className="flex-1 space-y-8">
                                            <div className="flex items-start gap-6 leading-none">
                                                <div className="h-14 w-14 shrink-0 rounded-none bg-black border border-white/10 flex items-center justify-center text-[#ccff00]">
                                                    <Plane className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="font-black text-xl uppercase tracking-tighter text-white">{flight.airline} {flight.flightNumber && <span className="text-zinc-600 ml-2">#{flight.flightNumber}</span>}</h4>
                                                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-0.5">LOCALIZADOR PNR: <span className="text-[#ccff00] font-black bg-black border border-white/5 px-3 py-1 ml-2">{flight.locator || "NULL PNR"}</span></p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-10 bg-black border border-white/5 p-8 rounded-none w-fit">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[8px] text-zinc-700 uppercase font-black tracking-widest mb-3">DE ONDE SAI?</span>
                                                    <span className="font-black text-4xl text-white tracking-tighter leading-none">{flight.origin || "---"}</span>
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-4 flex items-center gap-2 bg-zinc-900/50 px-2 py-1"><Clock className="h-3 w-3" /> {formatDateTime(flight.departureTime)}</span>
                                                </div>

                                                <div className="flex flex-col items-center justify-center pt-2">
                                                    <div className="w-1.5 h-1.5 bg-[#ccff00]/20 mb-1" />
                                                    <div className="h-px w-20 bg-white/5" />
                                                    <Plane className="h-4 w-4 text-zinc-800 my-4" />
                                                    <div className="h-px w-20 bg-white/5" />
                                                    <div className="w-1.5 h-1.5 bg-[#ccff00]/20 mt-1" />
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <span className="text-[8px] text-zinc-700 uppercase font-black tracking-widest mb-3">PARA ONDE VAI?</span>
                                                    <span className="font-black text-4xl text-white tracking-tighter leading-none">{flight.destination || "---"}</span>
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-4 flex items-center gap-2 bg-zinc-900/50 px-2 py-1"><Clock className="h-3 w-3" /> {formatDateTime(flight.arrivalTime)}</span>
                                                </div>
                                            </div>

                                            {flight.passengers && (
                                                <div className="bg-black border border-white/5 p-6 rounded-none relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/20" />
                                                    <span className="font-black text-[8px] uppercase tracking-[0.3em] block mb-3 text-zinc-700">QUEM VAI VIAJAR?</span>
                                                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-relaxed">
                                                        {flight.passengers}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end pt-4 md:pt-0">
                                            <button
                                                title="EXCLUIR VOO"
                                                onClick={async () => await deleteFlight(flight.id)}
                                                className="h-14 w-14 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

"use client";

import { useState } from "react";
import { Truck, Calculator, MapPin, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

interface Supplier {
    id: string;
    name: string;
    kmValue: number;
    contact: string | null;
}

interface FreightResult {
    originDisplay: string;
    destinationDisplay: string;
    straightKm: number;
    roadKm: number;
    estimatedCost: number | null;
}

interface FreightCalculatorProps {
    suppliers: Supplier[];
    bandCity?: string; // cidade base da banda (préfill)
}

export function FreightCalculator({ suppliers, bandCity = "" }: FreightCalculatorProps) {
    const [origin, setOrigin] = useState(bandCity);
    const [destination, setDestination] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        suppliers.length > 0 ? suppliers[0] : null
    );
    const [result, setResult] = useState<FreightResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!origin.trim() || !destination.trim()) {
            setError("Informe a cidade de origem e destino.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const params = new URLSearchParams({
                origin: origin.trim(),
                destination: destination.trim(),
                kmValue: selectedSupplier ? String(selectedSupplier.kmValue) : "0",
            });
            const res = await fetch(`/api/freight?${params}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Erro ao calcular distância.");
            } else {
                setResult(data);
            }
        } catch {
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const fmt = (v: number) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div className="rounded-none bg-black border border-white/5 p-10 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                <div className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                    <Truck className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">ESTIMATIVA DE FRETE</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">CÁLCULO LOGÍSTICO POR DISTÂNCIA</p>
                </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1 flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> CIDADE DE ORIGEM
                    </label>
                    <input
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="EX: SÃO PAULO"
                        className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-white placeholder:text-zinc-900 rounded-none"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1 flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-[#ccff00]" /> CIDADE DO SHOW
                    </label>
                    <input
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="EX: CAMPINAS"
                        className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-white placeholder:text-zinc-900 rounded-none"
                    />
                </div>
            </div>

            {/* Supplier select */}
            {suppliers.length > 0 ? (
                <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1">FORNECEDOR DE TRANSPORTE</label>
                    <div className="relative">
                        <select
                            value={selectedSupplier?.id ?? ""}
                            title="Selecione o fornecedor"
                            onChange={(e) => {
                                const s = suppliers.find((s) => s.id === e.target.value) || null;
                                setSelectedSupplier(s);
                            }}
                            className="w-full bg-black border border-white/10 py-5 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all text-[#ccff00] appearance-none cursor-pointer rounded-none"
                        >
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} — {fmt(s.kmValue)}/km
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-none">
                    <AlertCircle className="h-4 w-4 text-zinc-800 flex-shrink-0" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                        CADASTRE FORNECEDORES PARA CÁLCULO DE CUSTO ESTIMADO.
                    </p>
                </div>
            )}

            {/* Calcular button */}
            <button
                onClick={calculate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 bg-[#ccff00] py-8 text-[12px] font-black uppercase tracking-[0.5em] text-black hover:bg-white transition-all shadow-[0 0 40px rgba(204,255,0,0.15)] active:scale-95 disabled:opacity-50 rounded-none"
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Calculator className="h-5 w-5" />
                )}
                {loading ? "PROCESSANDO..." : "ESTIMAR LOGÍSTICA"}
            </button>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-4 p-5 bg-red-600/10 border border-red-600/20 text-red-600 rounded-none">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="p-10 bg-zinc-900/40 border border-white/5 space-y-8 rounded-none">
                    <div className="flex items-center gap-4 text-[#ccff00] font-black text-[11px] uppercase tracking-widest">
                        <CheckCircle2 className="h-5 w-5" />
                        ESTIMATIVA CONCLUÍDA
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="p-8 bg-black border border-white/5 text-center rounded-none">
                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4">DISTÂNCIA REAL</p>
                            <p className="text-4xl font-black text-white tracking-tighter">{result.roadKm.toLocaleString("pt-BR")}</p>
                            <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest mt-2">KM ESTIMADOS</p>
                        </div>

                        <div className="p-8 bg-[#ccff00]/5 border border-[#ccff00]/20 text-center rounded-none">
                            <p className="text-[9px] font-black text-[#ccff00] uppercase tracking-[0.4em] mb-4">CUSTO LOGÍSTICO</p>
                            <p className="text-4xl font-black text-[#ccff00] tracking-tighter">
                                {result.estimatedCost !== null
                                    ? fmt(result.estimatedCost)
                                    : "—"}
                            </p>
                            <p className="text-[9px] font-black text-[#ccff00]/40 uppercase tracking-widest mt-2 truncate">
                                {selectedSupplier ? `VIA ${selectedSupplier.name}` : "SEM OPERADOR"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">📍 <span className="text-white">{result.originDisplay.split(",").slice(0, 2).join(",").toUpperCase()}</span></p>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">🎯 <span className="text-white">{result.destinationDisplay.split(",").slice(0, 2).join(",").toUpperCase()}</span></p>
                        <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em] pt-4 italic">
                            * CÁLCULO BASEADO EM LINHA RETA × 1.35 (FATOR ESTRADA MÉDIO).
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

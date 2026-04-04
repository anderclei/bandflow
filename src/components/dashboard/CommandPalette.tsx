"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, ArrowRight, Music, MapPin, Users, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
    id: string;
    title: string;
    type: string;
    href: string;
}

const typeLabels: Record<string, { label: string; icon: any }> = {
    gig: { label: "Show", icon: MapPin },
    song: { label: "Música", icon: Music },
    contractor: { label: "Contratante", icon: Users },
    document: { label: "Documento", icon: FileText },
};

export function CommandPalette({ bandId }: { bandId: string }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Ctrl+K to open
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        }
    }, [open]);

    // Debounced search
    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&bandId=${bandId}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 250);
        return () => clearTimeout(timer);
    }, [query, bandId]);

    const handleSelect = useCallback(
        (result: SearchResult) => {
            setOpen(false);
            router.push(result.href);
        },
        [router]
    );

    const handleKeyNavigation = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex items-start justify-center pt-[15vh] animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-zinc-900 border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 blur-3xl -z-10 group-hover:bg-[#ccff00]/10 transition-all duration-1000" />
                
                <div className="flex items-center gap-6 px-10 py-8 border-b border-white/5 bg-black/40">
                    <Search className="h-6 w-6 text-[#ccff00]" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyNavigation}
                        placeholder="BUSCAR SHOWS, MÚSICAS, CONTRATANTES..."
                        className="flex-1 bg-transparent text-lg font-black uppercase tracking-widest text-white outline-none placeholder:text-zinc-800"
                    />                    <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-800">SISTEMA ONLINE</span>
                        <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-pulse" />
                    </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                    {loading && (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-zinc-900 border-t-[#ccff00] animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">PROCURANDO...</p>
                        </div>
                    )}
                    {!loading && results.length === 0 && query.length >= 2 && (
                        <div className="p-20 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 italic">NADA ENCONTRADO</p>
                        </div>
                    )}
                    {!loading && results.length === 0 && query.length < 2 && (
                        <div className="p-10 border-b border-white/5 bg-black/20 text-center">
                            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800">
                                [DIGITE PARA BUSCAR] // MÍNIMO 2 LETRAS
                            </p>
                        </div>
                    )}
                    {results.map((result, i) => {
                        const meta = typeLabels[result.type] || { label: result.type, icon: Search };
                        const Icon = meta.icon;
                        const isActive = i === selectedIndex;
                        return (
                            <button
                                key={result.id}
                                onClick={() => handleSelect(result)}
                                className={`group w-full flex items-center justify-between px-10 py-6 transition-all border-b border-white/5 text-left relative
                                    ${isActive ? "bg-[#ccff00]/5 border-l-4 border-l-[#ccff00]" : "bg-transparent border-l-4 border-l-transparent hover:bg-white/5"}
                                `}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 flex items-center justify-center border transition-all
                                        ${isActive ? "bg-[#ccff00] text-black border-[#ccff00]" : "bg-zinc-900 text-zinc-600 border-white/5"}
                                    `}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[12px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-white" : "text-zinc-500"}`}>{result.title}</p>
                                        <p className={`text-[8px] font-black uppercase tracking-[0.4em] mt-1 ${isActive ? "text-[#ccff00]" : "text-zinc-800"}`}>{meta.label}</p>
                                    </div>
                                </div>
                                <ArrowRight className={`h-4 w-4 transition-all ${isActive ? "translate-x-0 opacity-100 text-[#ccff00]" : "-translate-x-4 opacity-0 text-zinc-800"}`} />
                            </button>
                        );
                    })}
                </div>

                <div className="px-10 py-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                            <kbd className="px-2 py-1 bg-zinc-900 border border-white/5 text-[8px] font-black text-zinc-600 uppercase">↑↓</kbd>
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-800">Escolher</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <kbd className="px-2 py-1 bg-zinc-900 border border-white/5 text-[8px] font-black text-zinc-600 uppercase">↵</kbd>
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-800">Confirmar</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <kbd className="px-2 py-1 bg-zinc-900 border border-white/5 text-[8px] font-black text-zinc-600 uppercase">ESC</kbd>
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-800">Sair</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client"

import React, { useState } from 'react';
import { Plus, Trash2, Save, CheckCircle2, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { updateShowFormatTechnical } from "@/app/actions/show-formats";
import { toast } from "sonner";

export type InputChannel = {
    id: string;
    channel: string;
    instrument: string;
    mic: string;
    insert: string;
}

interface InputListEditorProps {
    formatId: string;
    initialData?: string | null;
}

export function InputListEditor({ formatId, initialData }: InputListEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [channels, setChannels] = useState<InputChannel[]>(() => {
        if (initialData) {
            try {
                return JSON.parse(initialData);
            } catch (e) {
                console.error("Failed to parse input list data", e);
            }
        }
        return [
            { id: crypto.randomUUID(), channel: "01", instrument: "Bumbo", mic: "Shure Beta 52", insert: "Gate" },
            { id: crypto.randomUUID(), channel: "02", instrument: "Caixa", mic: "Shure SM57", insert: "Comp" },
            { id: crypto.randomUUID(), channel: "03", instrument: "Hi-Hat", mic: "Shure SM81", insert: "" },
        ];
    });

    const addChannel = () => {
        const nextNum = channels.length + 1;
        const channelStr = nextNum.toString().padStart(2, '0');
        setChannels([
            ...channels,
            { id: crypto.randomUUID(), channel: channelStr, instrument: "", mic: "", insert: "" }
        ]);
    };

    const updateChannel = (id: string, field: keyof InputChannel, value: string) => {
        setChannels(channels.map(ch =>
            ch.id === id ? { ...ch, [field]: value } : ch
        ));
    };

    const removeChannel = (id: string) => {
        setChannels(channels.filter(ch => ch.id !== id));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateShowFormatTechnical(formatId, {
                inputList: JSON.stringify(channels)
            });
            if (result.success) {
                toast.success("Lista de inputs salva com sucesso!");
            } else {
                toast.error("Erro ao salvar lista de inputs");
            }
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between p-10 border-b border-white/5 gap-6">
                <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="w-14 h-14 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                        <ListMusic className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                            MAPA <span className="text-zinc-600">DE CANAIS</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">CONFIGURAÇÃO DE ÁUDIO ATIVA</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button 
                        onClick={addChannel} 
                        className="flex-1 lg:flex-none h-14 px-8 border border-white/10 text-[10px] font-black uppercase tracking-[.4em] text-zinc-400 hover:text-[#ccff00] hover:border-[#ccff00]/50 transition-all flex items-center justify-center gap-3"
                    >
                        <Plus className="h-4 w-4" />
                        ADICIONAR CANAL
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 lg:flex-none h-14 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[.4em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-3"
                    >
                        {isSaving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        SALVAR LISTA
                    </button>
                </div>
            </div>
            <div className="p-10">
                <div className="border border-white/5 bg-black/20">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent bg-zinc-900/50 h-16">
                                <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 text-center">CANAL</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">INSTRUMENTO / FONTE</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">MICROFONE / DI</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">PROCESSAMENTO / FX</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {channels.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-zinc-700 font-black uppercase text-[10px] tracking-[0.5em]">
                                        NENHUM CANAL CADASTRADO. INICIE A LISTA.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                channels.map((channel) => (
                                    <TableRow key={channel.id} className="border-white/5 hover:bg-white/[0.02] transition-colors h-20">
                                        <TableCell className="p-4">
                                            <input
                                                value={channel.channel}
                                                title="Número do Canal"
                                                onChange={(e) => updateChannel(channel.id, "channel", e.target.value)}
                                                className="h-12 w-full bg-black border border-white/10 text-center font-black text-[#ccff00] uppercase outline-none focus:border-[#ccff00]/50 text-[12px]"
                                            />
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <input
                                                value={channel.instrument}
                                                title="Instrumento / Fonte"
                                                onChange={(e) => updateChannel(channel.id, "instrument", e.target.value)}
                                                className="w-full h-12 bg-black/40 border border-white/5 px-6 text-[12px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-800"
                                                placeholder="INSTRUMENTO..."
                                            />
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <input
                                                value={channel.mic}
                                                title="Microfone / DI"
                                                onChange={(e) => updateChannel(channel.id, "mic", e.target.value)}
                                                className="w-full h-12 bg-black/40 border border-white/5 px-6 text-[12px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900"
                                                placeholder="MICROFONE / DI..."
                                            />
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <input
                                                value={channel.insert}
                                                title="Insert / Efeito"
                                                onChange={(e) => updateChannel(channel.id, "insert", e.target.value)}
                                                className="w-full h-12 bg-black/40 border border-white/5 px-6 text-[12px] font-black uppercase tracking-widest text-zinc-600 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900"
                                                placeholder="INSERT / FX..."
                                            />
                                        </TableCell>
                                        <TableCell className="p-4 text-center">
                                            <button
                                                className="h-12 w-12 flex items-center justify-center text-zinc-800 hover:text-red-500 hover:bg-black border border-transparent hover:border-white/5 transition-all"
                                                onClick={() => removeChannel(channel.id)}
                                                title="Eliminar Canal"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/20" />
                        <div className="flex items-center gap-4 mb-4 text-[#ccff00]">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-[.4em]">PADRÃO PROFISSIONAL</span>
                        </div>
                        <p className="text-[10px] font-black text-zinc-600 leading-relaxed uppercase tracking-widest">
                            Organize seus canais seguindo o fluxo padrão (Ritmo, Harmonia, Metais, Vozes).
                        </p>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800" />
                        <div className="flex items-center gap-4 mb-4 text-white">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-[.4em]">PRECISÃO TÉCNICA</span>
                        </div>
                        <p className="text-[10px] font-black text-zinc-700 leading-relaxed uppercase tracking-widest">
                            Especifique modelos exatos de microfones para garantir a qualidade sonora desejada.
                        </p>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-secondary/20" />
                        <div className="flex items-center gap-4 mb-4 text-secondary">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-[.4em]">SINCRONIZAÇÃO PDF</span>
                        </div>
                        <p className="text-[10px] font-black text-zinc-600 leading-relaxed uppercase tracking-widest">
                            Esta lista será injetada automaticamente no Rider Técnico gerado pelo sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

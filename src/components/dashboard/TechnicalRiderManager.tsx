"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Map, ListMusic, FileText, Layout, AudioLines, Plus } from "lucide-react";
import { StagePlotEditor } from "./StagePlotEditor";
import { InputListEditor } from "./InputListEditor";
import { TechSpecsEditor } from "./TechSpecsEditor";
import { RiderGenerator } from "./inventory/RiderGenerator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createDefaultShowFormat } from "@/app/actions/show-formats";
import { toast } from "sonner";

interface ShowFormat {
    id: string;
    name: string;
    stagePlot: string | null;
    inputList: string | null;
    techSpecs: string | null;
}

interface TechnicalRiderManagerProps {
    formats: ShowFormat[];
    bandId: string;
    bandName: string;
}

export function TechnicalRiderManager({ formats, bandId, bandName }: TechnicalRiderManagerProps) {
    const [selectedFormatId, setSelectedFormatId] = useState<string>(formats[0]?.id || "");
    const selectedFormat = formats.find(f => f.id === selectedFormatId);

    const [isCreatingDefault, setIsCreatingDefault] = useState(false);

    const handleCreateDefaultFormat = async () => {
        setIsCreatingDefault(true);
        try {
            const res = await createDefaultShowFormat(bandId, "Formato Padrão");
            if (res.success) {
                toast.success("Formato criado com sucesso!");
                window.location.reload();
            } else {
                toast.error(res.error || "Erro ao criar formato.");
            }
        } catch (e) {
            toast.error("Erro inesperado.");
        } finally {
            setIsCreatingDefault(false);
        }
    };

    if (formats.length === 0) {
        return (
            <div className="p-24 text-center border-2 border-dashed border-white/5 bg-zinc-900/20 rounded-none relative">
                <div className="inline-flex p-10 bg-black border border-white/5 text-[#ccff00] mb-10 scale-150 relative">
                     <div className="absolute inset-0 bg-[#ccff00]/5 animate-pulse" />
                    <AudioLines className="h-10 w-10 relative z-10" />
                </div>
                <h3 className="text-4xl font-black font-heading uppercase tracking-widest text-zinc-700 leading-none mb-6">NENHUM RIDER</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-12 max-w-lg mx-auto">Crie seu primeiro formato de show para começar a organizar o mapa de palco e exigências técnicas.</p>
                <Button
                    onClick={handleCreateDefaultFormat}
                    disabled={isCreatingDefault}
                    className="h-16 px-12 rounded-none bg-[#ccff00] text-black text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_50px_rgba(204,255,0,0.15)] active:scale-95 border-0"
                >
                    {isCreatingDefault ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    ) : (
                        <Plus className="h-4 w-4 mr-4" />
                    )}
                    CRIAR MODELO PADRÃO
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-900/40 border-y border-white/5 p-12 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/2 blur-3xl pointer-events-none" />

                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-16 w-16 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.05)]">
                        <Layout className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-[12px] font-black font-heading uppercase tracking-[0.3em] text-[#ccff00]">SELECIONAR MODELO</h2>
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-1.5">CONFIGURAÇÃO ATIVA DO SHOW</p>
                    </div>
                </div>
                <Select value={selectedFormatId} onValueChange={setSelectedFormatId}>
                    <SelectTrigger className="w-full md:w-[450px] h-16 bg-black border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:border-[#ccff00]/50 transition-all rounded-none relative z-10 px-10 shadow-2xl">
                        <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border border-white/10 text-white rounded-none">
                        {formats.map((f) => (
                            <SelectItem key={f.id} value={f.id} className="focus:bg-[#ccff00] focus:text-black cursor-pointer uppercase font-black text-[10px] tracking-widest p-4">
                                {f.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedFormat && (
                <Tabs defaultValue="input-list" className="w-full space-y-12">
                    <TabsList className="bg-black/20 border-b border-white/5 p-0 h-auto gap-1 flex-wrap rounded-none w-full">
                        <TabsTrigger
                            value="input-list"
                            className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] rounded-none px-12 py-6 transition-all flex items-center gap-4 border-r border-white/5"
                        >
                            <ListMusic className="h-4 w-4" />
                            LISTA DE CANAIS
                        </TabsTrigger>
                        <TabsTrigger
                            value="tech-specs"
                            className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] rounded-none px-12 py-6 transition-all flex items-center gap-4 border-r border-white/5"
                        >
                            <FileText className="h-4 w-4" />
                            LISTA DE EXIGÊNCIAS
                        </TabsTrigger>
                        <TabsTrigger
                            value="stage-plot"
                            className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] rounded-none px-12 py-6 transition-all flex items-center gap-4 border-r border-white/5"
                        >
                            <Map className="h-4 w-4" />
                            MAPA DE PALCO
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] rounded-none px-12 py-6 transition-all flex items-center gap-4"
                        >
                            <AudioLines className="h-4 w-4" />
                            GERAR PDF
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <TabsContent value="input-list" className="mt-0">
                            <InputListEditor
                                formatId={selectedFormat.id}
                                initialData={selectedFormat.inputList}
                            />
                        </TabsContent>
                        <TabsContent value="tech-specs" className="mt-0">
                            <TechSpecsEditor
                                formatId={selectedFormat.id}
                                initialData={selectedFormat.techSpecs}
                            />
                        </TabsContent>
                        <TabsContent value="stage-plot" className="mt-0">
                            <StagePlotEditor
                                bandId={bandId}
                                formatId={selectedFormat.id}
                                initialData={selectedFormat.stagePlot ? JSON.parse(selectedFormat.stagePlot) : []}
                            />
                        </TabsContent>
                        <TabsContent value="preview" className="mt-0">
                            <Card className="border-white/5 bg-black/40 shadow-2xl">
                                <CardContent className="pt-6">
                                    <RiderGenerator
                                        equipment={[]} // We won't use physical equipment anymore
                                        formats={[selectedFormat]}
                                        bandName={bandName}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            )}
        </div>
    );
}

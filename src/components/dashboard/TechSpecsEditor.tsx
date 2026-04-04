"use client"

import React, { useState } from 'react';
import { Save, Music, Speaker, Settings, Info, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateShowFormatTechnical } from "@/app/actions/show-formats";
import { toast } from "sonner";

export type TechSpecs = {
    paSystem: string;
    monitorSystem: string;
    console: string;
    backlineDrum: string;
    backlineAmps: string;
    backlineOther: string;
}

interface TechSpecsEditorProps {
    formatId: string;
    initialData?: string | null;
}

export function TechSpecsEditor({ formatId, initialData }: TechSpecsEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [specs, setSpecs] = useState<TechSpecs>(() => {
        if (initialData) {
            try {
                return JSON.parse(initialData);
            } catch (e) {
                console.error("Failed to parse tech specs data", e);
            }
        }
        return {
            paSystem: "",
            monitorSystem: "",
            console: "",
            backlineDrum: "",
            backlineAmps: "",
            backlineOther: ""
        };
    });

    const updateSpec = (field: keyof TechSpecs, value: string) => {
        setSpecs(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateShowFormatTechnical(formatId, {
                techSpecs: JSON.stringify(specs)
            });
            if (result.success) {
                toast.success("Especificações técnicas salvas!");
            } else {
                toast.error("Erro ao salvar especificações");
            }
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <FileText className="h-8 w-8 text-secondary" />
                        Rider Técnico
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Especificações detalhadas de som, monitoração e backline.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-secondary hover:bg-secondary/90 text-white gap-2 transition-all active:scale-95 px-8"
                >
                    {isSaving ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Salvar Especificações
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-3xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-black/20 p-8">
                        <div className="flex items-center gap-4 mb-2">
                             <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Speaker className="h-5 w-5" />
                             </div>
                            <CardTitle className="text-xl font-black uppercase tracking-widest text-white">PA & Monitor</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] uppercase tracking-widest text-zinc-600">Especificações de sistema de som e monitoração.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-12 p-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Sistema de PA</label>
                            <textarea
                                value={specs.paSystem}
                                onChange={(e) => updateSpec("paSystem", e.target.value)}
                                placeholder="EX: LINE ARRAY COMPATÍVEL COM O LOCAL..."
                                className="w-full min-h-[120px] bg-black/40 border border-white/5 p-6 text-[11px] font-medium uppercase tracking-widest text-zinc-300 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Monitoração (Vias)</label>
                            <textarea
                                value={specs.monitorSystem}
                                onChange={(e) => updateSpec("monitorSystem", e.target.value)}
                                placeholder="EX: 06 VIAS DE MONITOR INDEPENDENTES..."
                                className="w-full min-h-[120px] bg-black/40 border border-white/5 p-6 text-[11px] font-medium uppercase tracking-widest text-zinc-300 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Console (Mesa de Som)</label>
                            <textarea
                                value={specs.console}
                                onChange={(e) => updateSpec("console", e.target.value)}
                                placeholder="EX: CONSOLE DIGITAL MÍNIMO 32 CANAIS..."
                                className="w-full min-h-[100px] bg-black/40 border border-white/5 p-6 text-[11px] font-medium uppercase tracking-widest text-zinc-300 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900 transition-all"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-3xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-black/20 p-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ff8800]">
                                <Music className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-black uppercase tracking-widest text-white">Backline</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] uppercase tracking-widest text-zinc-600">Equipamentos que devem ser fornecidos pelo contratante/local.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-12 p-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Bateria</label>
                            <textarea
                                value={specs.backlineDrum}
                                onChange={(e) => updateSpec("backlineDrum", e.target.value)}
                                placeholder="EX: PEARL EXPORT OU SUPERIOR (BUMBO 22)..."
                                className="w-full min-h-[120px] bg-black/40 border border-white/5 p-6 text-[11px] font-medium uppercase tracking-widest text-zinc-300 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Amplificadores</label>
                            <textarea
                                value={specs.backlineAmps}
                                onChange={(e) => updateSpec("backlineAmps", e.target.value)}
                                placeholder="EX: 01 MARSHALL DSL40 PARA GUITARRA..."
                                className="w-full min-h-[120px] bg-black/40 border border-white/5 p-6 text-[11px] font-medium uppercase tracking-widest text-zinc-300 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-1">Outros / Acessórios</label>
                            <textarea
                                value={specs.backlineOther}
                                onChange={(e) => updateSpec("backlineOther", e.target.value)}
                                placeholder="EX: 04 PONTOS DE ENERGIA 110V..."
                                className="w-full min-h-[100px] bg-black/40 border border-white/5 p-6 text-[11px] font-medium uppercase tracking-widest text-zinc-300 outline-none focus:border-[#ccff00]/30 placeholder:text-zinc-900 transition-all"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="py-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="text-sm text-zinc-400 leading-relaxed">
                        <strong className="text-foreground block mb-1 font-bold italic underline">Dica para o Usuário:</strong>
                        Seja o mais específico possível nos modelos e marcas aceitáveis. Isso evita problemas técnicos no dia do show
                        e garante que a sonoridade da banda seja preservada. Requisitos de energia e espaço também são vitais.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useState } from "react";
import { updateStagePlot } from "@/app/actions/stagePlot";
import { StagePlotEditor } from "@/components/dashboard/formats/StagePlotEditor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface StagePlotConfiguratorProps {
    formatId: string;
    initialPlot: any[];
    libraryAssets?: any[];
}

export function StagePlotConfigurator({ formatId, initialPlot, libraryAssets = [] }: StagePlotConfiguratorProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (jsonString: string) => {
        setIsSaving(true);
        try {
            const result = await updateStagePlot(formatId, jsonString);
            if (result.success) {
                toast.success("Mapa de palco atualizado com sucesso!");
            } else {
                toast.error("Erro ao salvar mapa.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocorreu um erro ao processar sua solicitação.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative flex-1 flex flex-col">
            {isSaving && (
                <div className="absolute inset-0 z-[100] bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-3xl">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                        <span className="text-sm font-bold">Salvando arquitetura...</span>
                    </div>
                </div>
            )}
            
            <StagePlotEditor 
                initialData={JSON.stringify(initialPlot)} 
                onSave={handleSave} 
                bandName="Sua Banda" 
                libraryAssets={libraryAssets}
            />

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-500 font-medium flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                DICA: Arraste os ícones para posicionar. Clique em um ícone no palco para revelar controles de rotação e exclusão.
            </div>
        </div>
    );
}

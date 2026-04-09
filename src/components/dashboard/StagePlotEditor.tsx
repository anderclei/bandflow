"use client"

import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors, PointerActivationConstraint } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateShowFormatTechnical } from "@/app/actions/show-formats";
import { toast } from "sonner";

import {
    StageItem,
    StageItemType,
    ELEMENT_CONFIG,
    StageItemIcon
} from './StagePlotAssets';

const DraggableItem = ({ id, type, x, y, label, rotation, scale, selected, onSelect, svgContent, imageUrl }: StageItem & { selected: boolean, onSelect: () => void }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        left: `${x}px`,
        top: `${y}px`,
        position: 'absolute' as 'absolute',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={() => onSelect()}
            className={`cursor-move transition-transform touch-none flex flex-col items-center group z-10 ${selected ? 'z-50' : ''}`}
        >
            <div
                className={`relative transition-all duration-200 ${selected ? 'ring-2 ring-[#ccff00] ring-offset-4 ring-offset-black rounded-none shadow-[0_0_20px_rgba(204,255,0,0.2)]' : 'group-hover:opacity-80'}`}
                style={{
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                    color: selected ? '#ccff00' : 'white'
                }}
            >
                <StageItemIcon 
                    type={type} 
                    svgContent={svgContent} 
                    imageUrl={imageUrl} 
                />
            </div>

            <span
                className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-none -mt-4 shadow-2xl whitespace-nowrap z-20 pointer-events-none select-none border border-white/10 transition-colors ${selected ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-zinc-900 text-zinc-400'}`}
                style={{
                    transform: `translateY(${15 * scale}px)`,
                }}
            >
                {label}
            </span>
        </div>
    );
};

export function StagePlotEditor({ bandId, initialData = [], formatId, libraryAssets = [] }: { bandId: string, initialData?: StageItem[], formatId?: string, libraryAssets?: any[] }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [items, setItems] = useState<StageItem[]>(initialData);


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        setMounted(true);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedId && (e.key === 'Delete' || e.key === 'Backspace')) {
                // Prevenir comportamento padrão se não estiver em um input
                if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    removeItem(selectedId);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, items]); // Include items if needed for context, but selectedId is key

    if (!mounted) return null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setItems((items) =>
            items.map((item) => {
                if (item.id === active.id) {
                    return {
                        ...item,
                        x: item.x + delta.x,
                        y: item.y + delta.y,
                    };
                }
                return item;
            })
        );
    };

    const handleSave = async () => {
        if (!formatId) return;
        setIsSaving(true);
        try {
            const result = await updateShowFormatTechnical(formatId, { stagePlot: JSON.stringify(items) });
            if (result.success) {
                toast.success("Mapa de palco salvo com sucesso!");
            } else {
                toast.error("Erro ao salvar: " + result.error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setIsSaving(false);
        }
    }

    const addItem = (type: string, isDatabase = false, data: any = {}) => {
        let label = "Item";
        let svgContent = null;
        let imageUrl = null;

        if (isDatabase) {
            label = data.label || data.name || "Item";
            svgContent = data.svgContent;
            imageUrl = data.imageUrl;
        } else {
            const config = ELEMENT_CONFIG[type as StageItemType];
            label = config?.label || "Item";
        }

        const newItem: StageItem = {
            id: `${type}-${Date.now()}`,
            type: type as any,
            x: 50,
            y: 50,
            label,
            rotation: 0,
            scale: 1,
            svgContent,
            imageUrl
        }
        setItems([...items, newItem])
        setSelectedId(newItem.id);
    }

    const updateItem = (id: string, updates: Partial<StageItem>) => {
        setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
    }

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
        if (selectedId === id) setSelectedId(null);
    }

    // Grouping library assets by category
    const groupedLibrary = libraryAssets.reduce((acc, asset) => {
        const cat = asset.category || "GERAL";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(asset);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

            <div className="lg:col-span-1 space-y-8">
                <Card className="rounded-none bg-black border border-white/5 overflow-hidden">
                    <CardHeader className="border-b border-white/5 pb-6 bg-zinc-900/20">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center justify-between text-white">
                            BIBLIOTECA
                            <span className="text-[10px] font-black text-[#ccff00]">{items.length} ITENS</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-10 pt-8">
                        {/* Database Assets */}
                        {Object.keys(groupedLibrary).length > 0 ? (
                            (Object.entries(groupedLibrary) as [string, any[]][]).map(([cat, assets]) => (
                                <div key={cat} className="space-y-4">
                                    <h3 className="text-[9px] font-black uppercase text-[#ccff00]/40 tracking-[0.4em] px-1">{cat}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {assets.map((asset) => (
                                            <button
                                                key={asset.id}
                                                className="flex flex-col h-24 gap-2 bg-zinc-900/40 border border-white/10 hover:border-[#ccff00] hover:bg-[#ccff00]/5 p-2 items-center justify-center transition-all active:scale-95 group/item rounded-none"
                                                onClick={() => addItem(asset.type, true, asset)}
                                            >
                                                <div className="pointer-events-none scale-[0.6] text-white group-hover/item:text-[#ccff00] transition-colors flex items-center justify-center">
                                                    <StageItemIcon 
                                                        type={asset.type} 
                                                        svgContent={asset.svgContent}
                                                        imageUrl={asset.imageUrl}
                                                        className="w-16 h-16" 
                                                    />
                                                </div>
                                                <span className="text-[8px] text-center uppercase tracking-widest font-black text-white group-hover/item:text-white mt-auto truncate w-full">{asset.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-4 px-4">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                                    Biblioteca vazia.<br/>
                                    Configure os instrumentos no painel Super Admin.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                    <Button
                        className="w-full bg-[#ccff00] hover:bg-white text-black font-black h-16 rounded-none shadow-[0_0_40px_rgba(204,255,0,0.1)] uppercase tracking-[0.4em] text-[10px] transition-all active:scale-95"
                        disabled={isSaving || !formatId}
                        onClick={handleSave}
                    >
                        {isSaving ? "PROCESSANDO..." : "SALVAR ALTERAÇÕES"}
                    </Button>
                    <Button
                        className="w-full bg-transparent border border-red-900/30 hover:border-red-600 hover:bg-red-600/5 text-red-900 hover:text-red-500 font-black h-14 rounded-none uppercase tracking-[0.3em] text-[9px] transition-all"
                        onClick={() => {
                            if (window.confirm("🗑️ Deseja realmente limpar todo o palco? Esta ação não pode ser desfeita.")) {
                                setItems([]);
                            }
                        }}
                    >
                        LIMPAR PALCO
                    </Button>
                </div>
            </div>

            <div className="lg:col-span-3">
                <Card className="h-[700px] relative overflow-hidden bg-black border border-white/10 rounded-none shadow-2xl transition-colors group/stage">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ccff0003_1px,transparent_1px),linear-gradient(to_bottom,#ccff0003_1px,transparent_1px)] bg-[size:200px_200px]"></div>
                    
                    {/* Center Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#ccff00]/10 z-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[#ccff00]/5 blur-[2px]"></div>
                    </div>
                    
                    {/* Stage Headers */}
                    <div className="absolute top-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md py-4 border-b border-white/5 text-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.8em] z-20 pointer-events-none">
                        BACKSTAGE
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md py-4 border-t border-white/5 text-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.8em] z-20 pointer-events-none">
                        AUDIENCE / PLATEIA
                    </div>

                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <div className="relative w-full h-full p-20">
                            {items.map((item) => (
                                <DraggableItem
                                    key={item.id}
                                    {...item}
                                    selected={selectedId === item.id}
                                    onSelect={() => setSelectedId(item.id)}
                                />
                            ))}
                        </div>
                    </DndContext>

                    {selectedId && (
                        <div className="absolute top-12 right-8 bg-zinc-900 border border-[#ccff00]/30 p-6 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col gap-6 z-50 animate-in fade-in slide-in-from-right-4 w-48">
                            <span className="text-[9px] font-black text-center text-zinc-600 uppercase tracking-[0.3em]">AJUSTES</span>
                            
                            <div className="space-y-4">
                                <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest text-center">ROTAÇÃO</p>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        className="h-10 w-full bg-black border border-white/5 hover:border-[#ccff00] text-white transition-all flex items-center justify-center font-black"
                                        onClick={() => {
                                            const item = items.find(i => i.id === selectedId);
                                            if (item) updateItem(selectedId, { rotation: (item.rotation || 0) - 45 });
                                        }}
                                        title="Girar Esquerda"
                                    >
                                        ↺
                                    </button>
                                    <button
                                        className="h-10 w-full bg-black border border-white/5 hover:border-[#ccff00] text-white transition-all flex items-center justify-center font-black"
                                        onClick={() => {
                                            const item = items.find(i => i.id === selectedId);
                                            if (item) updateItem(selectedId, { rotation: (item.rotation || 0) + 45 });
                                        }}
                                        title="Girar Direita"
                                    >
                                        ↻
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest text-center">ESCALA</p>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        className="h-10 w-full bg-black border border-white/5 hover:border-[#ccff00] text-white transition-all flex items-center justify-center font-black"
                                        onClick={() => {
                                            const item = items.find(i => i.id === selectedId);
                                            if (item) updateItem(selectedId, { scale: Math.max(0.3, (item.scale || 1) - 0.1) });
                                        }}
                                        title="Diminuir"
                                    >
                                        -
                                    </button>
                                    <button
                                        className="h-10 w-full bg-black border border-white/5 hover:border-[#ccff00] text-white transition-all flex items-center justify-center font-black"
                                        onClick={() => {
                                            const item = items.find(i => i.id === selectedId);
                                            if (item) updateItem(selectedId, { scale: Math.min(3, (item.scale || 1) + 0.1) });
                                        }}
                                        title="Aumentar"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                className="w-full h-12 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest active:scale-95"
                                onClick={() => removeItem(selectedId)}
                            >
                                REMOVER ITEM
                            </button>
                        </div>
                    )}
                </Card>
                <div className="flex justify-center mt-8">
                    <div className="bg-zinc-900 border border-white/5 px-8 py-3 rounded-none shadow-lg">
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
                            SELECIONOU? AJUSTE O ÂNGULO E TAMANHO NO PAINEL LATERAL.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

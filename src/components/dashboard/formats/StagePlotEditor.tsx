"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StageIcons, StageIconType } from '@/lib/icons/stage-icons';
import { Plus, RotateCw, Trash2, Maximize, MousePointer2, Save, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StageItem {
    id: string;
    type: string;
    x: number;
    y: number;
    rotation: number;
    label: string;
    // New fields for database assets
    isDatabaseAsset?: boolean;
    svgContent?: string | null;
    imageUrl?: string | null;
}

interface StagePlotEditorProps {
    initialData?: string; // JSON string
    onSave: (data: string) => void;
    bandName: string;
    libraryAssets?: any[];
}

const DynamicIcon = ({ type, isDatabaseAsset, svgContent, className }: { type: string, isDatabaseAsset?: boolean, svgContent?: string | null, className?: string }) => {
    if (isDatabaseAsset && svgContent) {
        // Safe Base64 encoding for SVG
        const svgNormalized = svgContent.includes('xmlns=') 
            ? svgContent 
            : svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        
        const dataUriTarget = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgNormalized)))}`;

        return (
            <div 
                className={cn("bg-current", className)} 
                style={{ 
                    WebkitMaskImage: `url("${dataUriTarget}")`, 
                    WebkitMaskSize: "contain", 
                    WebkitMaskRepeat: "no-repeat", 
                    WebkitMaskPosition: "center",
                    maskImage: `url("${dataUriTarget}")`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center"
                }}
            />
        );
    }
    
    // Fallback to hardcoded StageIcons
    const Icon = StageIcons[type as StageIconType];
    return Icon ? <Icon className={className} /> : <div className={cn("w-full h-full bg-zinc-800", className)} />;
};

export function StagePlotEditor({ initialData, onSave, bandName, libraryAssets = [] }: StagePlotEditorProps) {
    const [items, setItems] = useState<StageItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (initialData) {
            try {
                const parsed = JSON.parse(initialData);
                if (Array.isArray(parsed)) setItems(parsed);
            } catch (e) {
                console.error("Erro ao carregar mapa de palco:", e);
            }
        }
    }, [initialData]);

    const addItem = (type: string, isDatabase = false, svgContent: string | null = null, label = "") => {
        const newItem: StageItem = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: 50, // Posição central inicial
            y: 50,
            rotation: 0,
            label: label || "",
            isDatabaseAsset: isDatabase,
            svgContent: svgContent
        };
        setItems([...items, newItem]);
        setSelectedId(newItem.id);
    };

    const updateItem = (id: string, updates: Partial<StageItem>) => {
        setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
        setSelectedId(null);
    };

    const rotateItem = (id: string) => {
        const item = items.find(i => i.id === id);
        if (item) {
            updateItem(id, { rotation: (item.rotation + 45) % 360 });
        }
    };

    // Grouping library assets by category
    const groupedLibrary = libraryAssets.reduce((acc, asset) => {
        const cat = asset.category || "GERAL";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(asset);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="flex flex-col lg:flex-row h-[700px] bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 ring-1 ring-zinc-800 shadow-2xl">
            {/* Toolbar Lateral */}
            <div className="w-full lg:w-72 bg-zinc-900/50 border-r border-white/5 p-6 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase text-secondary tracking-widest">Biblioteca</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Categorias da Rede</p>
                </div>

                <div className="space-y-6">
                    {Object.keys(groupedLibrary).length > 0 ? (
                        (Object.entries(groupedLibrary) as [string, any[]][]).map(([cat, assets]) => (
                            <div key={cat} className="space-y-3">
                                <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest border-l-2 border-secondary pl-2">{cat}</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {assets.map((asset) => (
                                        <button
                                            key={asset.id}
                                            onClick={() => addItem(asset.type, true, asset.svgContent, asset.label)}
                                            className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-secondary hover:text-white transition-all group text-left"
                                        >
                                            <div className="h-8 w-8 shrink-0 bg-black/40 rounded-xl p-1.5 group-hover:bg-white/10 transition-colors">
                                                <DynamicIcon 
                                                    type={asset.type} 
                                                    isDatabaseAsset={true} 
                                                    svgContent={asset.svgContent} 
                                                    className="w-full h-full text-zinc-400 group-hover:text-white" 
                                                />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-[9px] font-bold uppercase tracking-tight text-zinc-400 group-hover:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {asset.label}
                                                </span>
                                                <span className="text-[7px] font-mono text-zinc-600 group-hover:text-zinc-800">{asset.type}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center space-y-4 px-4 border border-dashed border-white/5 rounded-3xl">
                             <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                                Biblioteca vazia.<br/>
                                Configure os instrumentos no painel Super Admin.
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stage Canvas Area */}
            <div className="flex-1 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[#0a0a0a] overflow-hidden group/canvas">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                />

                {/* Stage Indicator */}
                <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-40 shadow-[0_0_20px_rgba(var(--secondary),0.5)]" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Frente do Palco / Proscênio</div>

                {/* Interactive Items */}
                <div id="stage-canvas" className="absolute inset-4 translate-y-12 bg-zinc-900/20 rounded-2xl border border-white/5 shadow-inner">
                    <AnimatePresence>
                        {items.map((item) => {
                            const isSelected = selectedId === item.id;

                            return (
                                <motion.div
                                    key={item.id}
                                    drag
                                    dragMomentum={false}
                                    onDragStart={() => setSelectedId(item.id)}
                                    // Use absolute positioning with percentages correctly
                                    style={{ 
                                        left: `${item.x}%`, 
                                        top: `${item.y}%`, 
                                        position: 'absolute',
                                        zIndex: isSelected ? 50 : 10
                                    }}
                                    onDragEnd={(_, info) => {
                                        const canvas = document.getElementById('stage-canvas');
                                        if (canvas) {
                                            const rect = canvas.getBoundingClientRect();
                                            // Calculate new percentage based on the drop point relative to the canvas
                                            const newX = ((info.point.x - rect.left) / rect.width) * 100;
                                            const newY = ((info.point.y - rect.top) / rect.height) * 100;
                                            
                                            // Clamp values between 5% and 95% to avoid going off-stage
                                            updateItem(item.id, { 
                                                x: Math.max(5, Math.min(95, newX)), 
                                                y: Math.max(5, Math.min(95, newY)) 
                                            });
                                        }
                                    }}
                                    className={cn(
                                        "cursor-grab active:cursor-grabbing p-2 transition-all group -translate-x-1/2 -translate-y-1/2",
                                        isSelected ? "bg-white/10 rounded-2xl ring-1 ring-secondary shadow-lg scale-110" : "hover:bg-white/5 rounded-xl"
                                    )}
                                >
                                    <div style={{ transform: `rotate(${item.rotation}deg)` }} className="relative flex flex-col items-center">
                                        <div className={cn(
                                            "w-20 h-20 transition-all drop-shadow-2xl",
                                            isSelected ? "text-secondary" : "text-zinc-200 group-hover:text-white"
                                        )}>
                                            <DynamicIcon 
                                                type={item.type} 
                                                isDatabaseAsset={item.isDatabaseAsset} 
                                                svgContent={item.svgContent} 
                                                className="w-full h-full" 
                                            />
                                        </div>
                                        {/* Item Name Label */}
                                        <div className={cn(
                                            "mt-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md whitespace-nowrap text-[8px] font-black uppercase tracking-widest border border-white/10",
                                            isSelected ? "text-secondary border-secondary/30" : "text-zinc-500"
                                        )}>
                                            {item.label}
                                        </div>
                                    </div>

                                    {/* Action Overlays for selected item */}
                                    {isSelected && (
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-950 border border-white/20 p-1 rounded-xl shadow-2xl z-[60] animate-in zoom-in-50 duration-200">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); rotateItem(item.id); }} 
                                                className="p-2 hover:bg-zinc-800 rounded-lg text-white transition-colors" 
                                                title="Girar 45°"
                                            >
                                                <RotateCw className="h-4 w-4" />
                                            </button>
                                            <div className="w-[1px] h-4 bg-white/10 mx-1" />
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} 
                                                className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" 
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="absolute bottom-6 right-6 flex items-center gap-4 z-[60]">
                <Button 
                    variant="outline" 
                    onClick={() => setItems([])}
                    className="rounded-xl border-white/5 bg-zinc-900/80 backdrop-blur-xl text-zinc-400 hover:text-red-500 gap-2"
                >
                    <Undo2 className="h-4 w-4" />
                    Limpar
                </Button>
                <Button 
                    onClick={() => onSave(JSON.stringify(items))}
                    className="rounded-xl bg-secondary text-white hover:bg-secondary/90 px-8 shadow-xl shadow-secondary/20 gap-2 font-bold"
                >
                    <Save className="h-4 w-4" />
                    Salvar Stage Plot
                </Button>
            </div>

            {/* Empty State Instructions */}
            {items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center space-y-4 opacity-10 scale-150">
                        <Maximize className="h-20 w-20 mx-auto" />
                        <h2 className="text-6xl font-black uppercase tracking-tighter">STAGE ARCHITECT</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

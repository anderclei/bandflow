"use client";

import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus, Music } from "lucide-react";
import { updateSetlistItems } from "@/app/actions/setlists";

interface Song {
    id: string;
    title: string;
    artist?: string | null;
    duration?: number | null;
}

interface SetlistItem {
    id: string;
    songId: string;
    song: Song;
}

interface Setlist {
    id: string;
    title: string;
    items: SetlistItem[];
}

interface Props {
    setlist: Setlist;
    availableSongs: Song[];
}

function SortableItem({ item, onRemove }: { item: SetlistItem, onRemove: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-6 p-8 mb-6 bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group transition-all hover:border-[#ccff00]/40"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 group-hover:bg-[#ccff00] transition-colors" />
            <button 
                {...attributes} 
                {...listeners} 
                title="Arrastar música"
                className="cursor-grab text-zinc-700 hover:text-[#ccff00] transition-colors"
            >
                <GripVertical className="h-6 w-6" />
            </button>
            <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-black text-white uppercase tracking-widest truncate group-hover:text-[#ccff00] transition-colors">{item.song.title}</h4>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest truncate mt-1">{item.song.artist || "NULL_ARTIST"}</p>
            </div>
            <button
                onClick={() => onRemove(item.id)}
                title="Remover música do setlist"
                className="w-12 h-12 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="h-5 w-5" />
            </button>
        </div>
    );
}

export default function SetlistManager({ setlist, availableSongs }: Props) {
    const [items, setItems] = useState(setlist.items);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addSong = (song: Song) => {
        const newItem: SetlistItem = {
            id: `temp-${Date.now()}`,
            songId: song.id,
            song: song,
        };
        setItems([...items, newItem]);
    };

    const removeSong = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const itemsToSave = items.map((item, index) => ({
                songId: item.songId,
                position: index,
            }));
            await updateSetlistItems(setlist.id, itemsToSave);
            alert("Setlist salvo com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar setlist");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 pb-20">
            <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black font-heading tracking-tighter uppercase leading-none text-white">ORDEM DAS <span className="text-zinc-600"> MÚSICAS</span></h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">REPERTÓRIO ATUAL</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">{items.length} SELECIONADAS</span>
                        </div>
                    </div>
                    <button
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(204,255,0,0.1)] hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                    >
                        {isSaving ? "SALVANDO..." : "SALVAR REPERTÓRIO"}
                    </button>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.length > 0 ? (
                            <div className="min-h-[400px]">
                                {items.map((item) => (
                                    <SortableItem key={item.id} item={item} onRemove={removeSong} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-24 bg-black border border-dashed border-white/5 grayscale opacity-20">
                                <Music className="h-12 w-12 mb-8 text-zinc-900" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">LISTA VAZIA</p>
                            </div>
                        )}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="space-y-10">
                <div className="space-y-4 border-b border-white/5 pb-10">
                    <h2 className="text-2xl font-black font-heading tracking-tighter uppercase leading-none text-white">MINHA <span className="text-zinc-600"> LISTA</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">REPERTÓRIO DISPONÍVEL</p>
                </div>
                <div className="bg-zinc-900/40 border border-white/5 p-10 max-h-[800px] overflow-y-auto custom-scrollbar relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                    <div className="space-y-4">
                        {availableSongs.map((song) => (
                            <div
                                key={song.id}
                                className="flex items-center justify-between p-6 bg-black border border-white/5 hover:border-[#ccff00]/40 transition-all group"
                            >
                                <div className="min-w-0">
                                    <h4 className="text-[12px] font-black text-white uppercase tracking-widest truncate group-hover:text-[#ccff00] transition-colors">{song.title}</h4>
                                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1 truncate">{song.artist || "DESCONHECIDO"}</p>
                                </div>
                                <button
                                    onClick={() => addSong(song)}
                                    title="Incluir música"
                                    className="w-12 h-12 bg-zinc-900 border border-white/5 text-[#ccff00] flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-2xl"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

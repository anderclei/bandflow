"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DealCard } from "./DealCard";
import { Deal } from "./KanbanBoard";

interface ColumnProps {
    column: {
        id: string;
        title: string;
    };
    deals: Deal[];
}

export function KanbanColumn({ column, deals }: ColumnProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="w-96 shrink-0 bg-[#ccff00]/5 border border-[#ccff00]/20 h-full flex flex-col backdrop-blur-xl"
            ></div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-96 shrink-0 bg-black/40 border border-white/5 h-full flex flex-col relative overflow-hidden group"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800 group-hover:bg-[#ccff00] transition-colors" />
            
            <div
                {...attributes}
                {...listeners}
                className="p-8 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-white/5 bg-black/20"
            >
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                        {column.title.replace(' ', '_')}
                    </span>
                    <span className="bg-zinc-900 border border-white/5 px-2 py-1 text-[8px] font-black text-[#ccff00] tracking-widest">
                        {deals.length}_NODES
                    </span>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col custom-scrollbar">
                {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                ))}
            </div>
        </div>
    );
}

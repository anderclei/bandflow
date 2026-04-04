"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Deal } from "./KanbanBoard";
import { Building, DollarSign } from "lucide-react";

export function DealCard({ deal }: { deal: Deal }) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: deal.id,
        data: {
            type: "Deal",
            deal,
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
                className="bg-[#ccff00]/20 border border-[#ccff00] h-32 opacity-50 backdrop-blur-xl"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-black border border-white/5 p-6 hover:border-[#ccff00]/40 transition-all group cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ccff00]/2 blur-xl pointer-events-none" />
            
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors mb-4 line-clamp-2 leading-relaxed">
                {deal.title.replace(' ', '_')}
            </h4>

            <div className="space-y-4">
                {deal.contractor && (
                    <div className="flex items-center gap-3">
                        <Building className="h-3 w-3 text-zinc-800" />
                        <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest truncate">{deal.contractor.name}</span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {deal.value ? (
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-[#ccff00]" />
                            <span className="text-[10px] font-black text-white tracking-widest">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-zinc-900" />
                            <span className="text-[9px] font-black uppercase text-zinc-800 tracking-widest">NULL_FEE</span>
                        </div>
                    )}
                </div>
            </div>

            {deal.status === "WON" && (
                <div className="mt-6">
                    <a
                        href={`/dashboard/gigs/new?dealId=${deal.id}&title=${encodeURIComponent(deal.title)}${deal.contractorId ? `&contractorId=${deal.contractorId}` : ''}${deal.value ? `&fee=${deal.value}` : ''}`}
                        className="flex w-full items-center justify-center h-10 bg-[#ccff00] text-black text-[8px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.1)]"
                    >
                        SYNC_TO_AGENDA
                    </a>
                </div>
            )}
        </div>
    );
}

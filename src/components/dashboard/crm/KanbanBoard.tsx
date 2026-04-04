"use client";

import { useState, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { DealCard } from "./DealCard";
import { createPortal } from "react-dom";
import { updateDealStatus } from "@/app/actions/deals";
import { Plus } from "lucide-react";
import { DealModal } from "./DealModal";

export type Deal = {
    id: string;
    title: string;
    value: number | null;
    status: string;
    contractorId: string | null;
    contractor?: { name: string } | null;
    updatedAt: Date;
    expectedDate: Date | null;
};

type Column = {
    id: string;
    title: string;
    deals: Deal[];
};

const defaultCols = [
    { id: "LEAD", title: "PROSPECÇÃO" },
    { id: "NEGOTIATING", title: "EM NEGOCIAÇÃO" },
    { id: "CONTRACT_SENT", title: "CONTRATO ENVIADO" },
    { id: "WON", title: "VAGA FECHADA" },
    { id: "LOST", title: "NEGÓCIO PERDIDO" },
];

export function KanbanBoard({ initialDeals, contractors, bandId }: { initialDeals: any[], contractors: any[], bandId: string }) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columnsId = useMemo(() => defaultCols.map((c) => c.id), []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Deal") {
            setActiveDeal(event.active.data.current.deal);
            return;
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveDeal = active.data.current?.type === "Deal";
        const isOverDeal = over.data.current?.type === "Deal";
        const isOverColumn = over.data.current?.type === "Column";

        if (!isActiveDeal) return;

        // Dropping a Deal over another Deal
        if (isActiveDeal && isOverDeal) {
            setDeals((deals) => {
                const activeIndex = deals.findIndex((t) => t.id === activeId);
                const overIndex = deals.findIndex((t) => t.id === overId);

                if (deals[activeIndex].status !== deals[overIndex].status) {
                    deals[activeIndex].status = deals[overIndex].status;
                    return arrayMove(deals, activeIndex, overIndex - 1);
                }

                return arrayMove(deals, activeIndex, overIndex);
            });
        }

        // Dropping a Deal over a Column
        if (isActiveDeal && isOverColumn) {
            setDeals((deals) => {
                const activeIndex = deals.findIndex((t) => t.id === activeId);
                deals[activeIndex].status = overId.toString();
                return arrayMove(deals, activeIndex, activeIndex);
            });
        }
    }

    async function onDragEnd(event: DragEndEvent) {
        setActiveDeal(null);
        const { active, over } = event;
        if (!over) return;

        const activeDealId = active.id.toString();
        const deal = deals.find(d => d.id === activeDealId);

        if (deal && deal.status) {
            // Update backend
            await updateDealStatus(activeDealId, deal.status);
        }
    }

    return (
        <>
            <div className="h-full w-full flex gap-10 overflow-x-auto overflow-y-hidden pb-8 snap-x custom-scrollbar">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                >
                    <div className="flex gap-10 items-start h-full">
                        {defaultCols.map((col) => (
                            <KanbanColumn
                                key={col.id}
                                column={col}
                                deals={deals.filter((d) => d.status === col.id)}
                            />
                        ))}
                    </div>

                    {createPortal(
                        <DragOverlay>
                            <div className="rotate-3 opacity-80 backdrop-blur-xl">
                                {activeDeal && <DealCard deal={activeDeal} />}
                            </div>
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>

                <div className="shrink-0 w-[400px]">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full h-32 flex flex-col items-center justify-center gap-4 bg-black border border-dashed border-white/5 text-zinc-800 hover:border-[#ccff00]/40 hover:text-[#ccff00] transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#ccff00]/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Plus className="h-6 w-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">NOVA NEGOCIAÇÃO</span>
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <DealModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    contractors={contractors}
                    bandId={bandId}
                />
            )}
        </>
    );
}

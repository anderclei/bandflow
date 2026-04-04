import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { Briefcase, Search, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/dashboard/crm/KanbanBoard";

export default async function DealsPage() {
    const { band } = await getActiveBand({
        deals: {
            include: { contractor: true },
            orderBy: { updatedAt: 'desc' }
        },
        contractors: {
            orderBy: { name: 'asc' }
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const deals = band.deals || [];
    const contractors = band.contractors || [];

    return (
        <div className="space-y-12 h-[calc(100vh-12rem)] flex flex-col pb-20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10 shrink-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                VENDAS <span className="text-zinc-600">COMERCIAL</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">CONTROLE DE NEGÓCIOS</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">FLUXO ATIVO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-black/20 border border-white/5 p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/2 blur-3xl pointer-events-none" />
                <KanbanBoard initialDeals={deals} contractors={contractors} bandId={band.id} />
            </div>
        </div>
    );
}

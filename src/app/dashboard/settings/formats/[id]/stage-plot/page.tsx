import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { StagePlotConfigurator } from "./StagePlotConfigurator";
import { ArrowLeft, Map } from "lucide-react";
import Link from "next/link";
export const dynamic = 'force-dynamic';

export default async function StagePlotPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    const { band } = await getActiveBand();

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const format = await prisma.showFormat.findUnique({
        where: { id, bandId: band.id },
    });

    if (!format) {
        notFound();
    }

    // Default stage plot configuration
    const initialPlot = format.stagePlot ? JSON.parse(format.stagePlot) : [];

    // Fetch dynamic assets from database with fallback
    let libraryAssets: any[] = [];
    try {
        const assets = await prisma.stageAssetDefinition.findMany({
            orderBy: { category: "asc" },
        });
        
        libraryAssets = assets.map(a => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
            updatedAt: a.updatedAt.toISOString(),
        }));
    } catch (e: any) {
        console.error("Erro ao buscar biblioteca de assets:", e);
        // Debugging info for dev
        (libraryAssets as any)._error = e.message;
    }

    return (
        <div className="space-y-12 h-full flex flex-col pb-20">
            <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                <Link
                    href="/dashboard/settings/formats"
                    className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white hover:text-black transition-all"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Map className="h-5 w-5" />
                        </div>
                        <h1 className="text-3xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                            Stage <span className="text-zinc-600">_Plot</span> : {format.name}
                        </h1>
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-4">
                        Arrastar_e_Soltar_Nodos para configurar disposição técnica do palco.
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-zinc-900/40 border border-white/5 overflow-hidden flex flex-col relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                <StagePlotConfigurator 
                    formatId={format.id} 
                    initialPlot={initialPlot} 
                    libraryAssets={libraryAssets}
                />
            </div>
        </div>
    );
}

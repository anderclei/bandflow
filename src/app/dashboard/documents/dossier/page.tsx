import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import { DossierClient } from "./DossierClient";
import { Share2 } from "lucide-react";

export default async function DossierPage() {
    const { band } = await getActiveBand({
        documents: {
            orderBy: { createdAt: 'desc' }
        },
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Banda não encontrada.</h2></div>;
    }

    const documents = (band.documents as any[]) || [];

    return (
        <div className="space-y-8 h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Share2 className="h-8 w-8 text-secondary" />
                        Gerador de Dossiê (Prefeituras)
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        Selecione os documentos abaixo para gerar um link único de compartilhamento público para Prefeituras e Órgãos de Licitação.
                    </p>
                </div>
            </div>

            <DossierClient documents={documents} bandSlug={band.slug} />
        </div>
    );
}

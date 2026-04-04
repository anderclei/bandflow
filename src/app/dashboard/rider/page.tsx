import { getActiveBand } from "@/lib/getActiveBand";
import { AudioLines } from "lucide-react";
import { redirect } from "next/navigation";
import { TechnicalRiderManager } from "@/components/dashboard/TechnicalRiderManager";
import { FeatureGuard } from "@/components/ui/feature-guard";

export default async function RiderPage() {
    const { band } = await getActiveBand({
        formats: {
            orderBy: { name: 'asc' }
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const formats = (band.formats as any[]) || [];

    return (
        <FeatureGuard
            plan={band.subscriptionPlan as any}
            feature="rider"
            fallbackTitle="Rider & Palco"
            fallbackDescription="Crie mapas de palco profissionais (Stage Plots) com drag-and-drop, gerencie a Input List da banda e gere Riders Técnicos em PDF para agilizar sua produção. Funcionalidade Exclusiva do Plano PROFISSIONAL."
        >
            <div className="space-y-8 pb-20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-0">
                    <div>
                        <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                            RIDER <span className="text-[#ccff00]">TÉCNICO</span>
                        </h1>
                        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                            GERENCIE O MAPA DE PALCO, TABELA DE CANAIS E EXIGÊNCIAS TÉCNICAS.
                        </p>
                    </div>
                </div>

                <div className="px-4 lg:px-0">
                    <TechnicalRiderManager formats={formats} bandId={band.id} bandName={band.name} />
                </div>
            </div>
        </FeatureGuard>
    );
}

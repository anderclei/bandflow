import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import { Clock, Plus } from "lucide-react";
import { FeatureGuard } from "@/components/ui/feature-guard";

export default async function SchedulePage() {
    const { band } = await getActiveBand();

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    return (
        <FeatureGuard
            plan={band.subscriptionPlan as any}
            feature="logistics_advanced"
            fallbackTitle="Produção e Estrada"
            fallbackDescription="Desbloqueie a organização avançada de voos, hotéis, cronogramas de estrada (Rooming List) e gestão de fornecedores. Funcionalidade Exclusiva do Plano PROFISSIONAL."
        >
            <ScheduleClient bandName={band.name} />
        </FeatureGuard>
    );
}

import { ScheduleClient } from "./schedule-client";

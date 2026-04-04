import { getActiveBand } from "@/lib/getActiveBand"
import EpkEditorClient from "./epk-editor-client"
import { Globe } from "lucide-react"
import { FeatureGuard } from "@/components/ui/feature-guard"

export default async function EpkDashboardPage() {
    const { band } = await getActiveBand()

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>
    }

    return (
        <FeatureGuard
            plan={band.subscriptionPlan}
            feature="epk"
            fallbackTitle="Dossiê Eletrônico (EPK)"
            fallbackDescription="Crie e hospede uma vitrine digital pública premium para sua banda e atraia mais contratantes. Funcionalidade Exclusiva do Plano PREMIUM."
        >
            <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Globe className="h-8 w-8 text-secondary" />
                            Painel do EPK
                        </h1>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                            Configure seu press kit público para enviar a contratantes.
                        </p>
                    </div>
                </div>

                <div className="px-4 lg:px-0">
                    <EpkEditorClient band={band} />
                </div>
            </div>
        </FeatureGuard>
    )
}

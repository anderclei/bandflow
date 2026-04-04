import { ContractTemplateManager } from "@/components/dashboard/contracts/ContractTemplateManager"
import { LayoutTemplate } from "lucide-react"

export default function TemplatesPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10 px-0">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                        MODELOS <span className="text-zinc-600">DE DOCUMENTO</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        CRIE E GERENCIE OS MODELOS PADRÃO PARA SEUS CONTRATOS E ORÇAMENTOS.
                    </p>
                </div>
            </div>

            <ContractTemplateManager />
        </div>
    )
}

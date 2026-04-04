// Página de Contratos — server component com dados reais do banco
import { getActiveBand } from "@/lib/getActiveBand"
import { ContractsClient } from "./contracts-client"
import { getContractors } from "@/app/actions/contractors"
import { FeatureGuard } from "@/components/ui/feature-guard"
import { redirect } from "next/navigation"

export default async function ContractsPage() {
    const [{ band }, contractorsResult] = await Promise.all([
        getActiveBand({ generatedContracts: { orderBy: { createdAt: "desc" } } }),
        getContractors(),
    ]);

    if (!band) {
        redirect("/login");
    }

    const contracts = (band as any)?.generatedContracts || [];
    const contractors = contractorsResult.success ? (contractorsResult.data ?? []) : [];

    return (
        <FeatureGuard
            plan={band.subscriptionPlan as any}
            feature="contracts"
            fallbackTitle="Contratos Dinâmicos"
            fallbackDescription="Gere, gerencie e envie contratos em PDF automaticamente para seus contratantes. Funcionalidade Exclusiva do Plano PROFISSIONAL."
        >
            <ContractsClient initialContracts={contracts} contractors={contractors as any} />
        </FeatureGuard>
    );
}

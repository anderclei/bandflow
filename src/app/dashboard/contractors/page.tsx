// Página Server Component — busca dados reais do banco
import { getContractors } from "@/app/actions/contractors"
import { ContractorsClient } from "./contractors-client"
import { getActiveBand } from "@/lib/getActiveBand"
import { FeatureGuard } from "@/components/ui/feature-guard"
import { redirect } from "next/navigation"

export default async function ContractorsPage() {
    const { band } = await getActiveBand();

    if (!band) {
        redirect("/login");
    }

    const result = await getContractors();
    const contractors = result.success ? (result.data ?? []) : [];

    return (
        <FeatureGuard
            plan={band.subscriptionPlan as any}
            feature="crm"
            fallbackTitle="CRM & Contratantes"
            fallbackDescription="Faça a gestão dos seus contatos comerciais, funil de vendas e histórico de negociações. Funcionalidade Exclusiva do Plano PROFISSIONAL."
        >
            <ContractorsClient initialContractors={contractors as any} />
        </FeatureGuard>
    );
}

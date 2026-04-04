import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import { FileText, Plus, Search } from "lucide-react";

export default async function CommercialPage() {
    const { band } = await getActiveBand();

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <FileText className="h-8 w-8 text-secondary" />
                        Contratos & Orçamentos
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Gerencie propostas, contratos e orçamentos comerciais da banda em um só lugar.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-secondary/20">
                    <Plus className="h-4 w-4" /> Novo Orçamento
                </button>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Nenhum contrato ativo</h3>
                    <p className="mt-2 text-zinc-500 max-w-sm mx-auto">
                        Seus contratos e orçamentos do antigo CRM foram unificados aqui. Comece criando um novo para seu próximo show.
                    </p>
                </div>
            </div>
        </div>
    );
}

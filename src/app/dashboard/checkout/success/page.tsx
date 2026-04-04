"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const mpId = searchParams.get("mock_mp_id") || searchParams.get("preapproval_id");

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-xl mx-auto px-4">
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8">
                <CheckCircle2 className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
                Assinatura Confirmada!
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Seu pagamento foi processado com sucesso. Bem-vindo(a) ao próximo nível na gestão da sua carreira musical. As novas funcionalidades já estão liberadas.
            </p>

            {mpId && (
                <div className="text-xs text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 rounded-lg mb-10">
                    Ref Mercado Pago: {mpId}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button asChild className="w-full h-14 text-base font-bold bg-zinc-900 border-0 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    <Link href="/dashboard">
                        Explorar o Dashboard
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                </Button>
            </div>

            <div className="mt-12 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-left flex items-start gap-4">
                <Zap className="w-8 h-8 text-yellow-500 shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-foreground">Como funciona o faturamento?</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Este é um ciclo de pagamento automático. O Mercado Pago processará sua renovação a cada 30 dias automaticamente usando o cartão cadastrado.</p>
                </div>
            </div>
        </div>
    );
}

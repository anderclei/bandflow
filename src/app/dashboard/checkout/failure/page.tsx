"use client";

import { AlertTriangle, ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutFailurePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-xl mx-auto px-4">
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-8">
                <AlertTriangle className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
                Assinatura Recusada
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Houve um problema ao processar seu pagamento. Não se preocupe, nenhuma cobrança foi realizada no seu cartão. Verifique os dados com sua operadora e tente novamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button asChild variant="outline" className="h-14 text-base font-bold bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <Link href="/dashboard/settings">
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Voltar para Configurações
                    </Link>
                </Button>

                <Button asChild className="h-14 px-8 text-base font-bold bg-zinc-900 border-0 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    <Link href="/dashboard/settings">
                        Tentar Novamente
                        <CreditCard className="w-5 h-5 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

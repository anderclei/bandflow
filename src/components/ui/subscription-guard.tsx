import { Suspense } from "react";
import { Lock, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionGuardProps {
    status: string; // e.g., 'TRIAL', 'ACTIVE', 'OVERDUE', 'SUSPENDED', 'CANCELED'
    plan: string;
    expiresAt?: Date | null;
    children: React.ReactNode;
}

export function SubscriptionGuard({ status, plan, expiresAt, children }: SubscriptionGuardProps) {
    // 1. Se estiver Inadimplente MÁXIMO (Suspendido após > 7 dias)
    if (status === 'SUSPENDED' || status === 'CANCELED') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center bg-black border-2 border-red-600/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                
                <div className="flex h-24 w-24 items-center justify-center bg-zinc-900 border border-red-600/30 text-red-600 mb-10 shadow-[0_0_50px_rgba(220,38,38,0.2)] relative">
                    <Lock className="h-10 w-10" />
                </div>

                <h2 className="text-4xl font-black font-heading tracking-tighter text-white mb-6 uppercase leading-none">
                    Account <span className="text-red-600">_Terminated</span>
                </h2>

                <div className="max-w-md mx-auto space-y-8 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 leading-relaxed">
                        Detectamos que sua assinatura <span className="text-white">[{plan}]</span> está com pagamento pendente crônico. O período de carência foi <span className="text-red-500 underline decoration-red-500/50 underline-offset-4">esgotado</span>.
                    </p>
                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-relaxed border border-white/5 p-4 bg-zinc-900/50">
                        Os dados de performance, CRM e BI permanecem integrados ao banco de dados, mas o acesso está negado até a regularização do pagamento.
                    </p>
                    
                    <div className="pt-8 flex flex-col gap-4">
                        <button className="w-full h-16 bg-red-600 text-white text-[12px] font-black uppercase tracking-[.5em] hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(220,38,38,0.2)] active:scale-95">
                            RESTORE_ACCESS_NOW
                        </button>
                        <button className="w-full h-12 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors">
                            CONTACT_SYS_ADMIN
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Banner de Alerta (Vencido há < 7 dias)
    const isOverdue = status === 'OVERDUE';

    return (
        <div className="relative">
            {isOverdue && (
                <div className="mb-10 bg-zinc-900 border border-amber-600/20 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-600" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-black border border-amber-600/20 text-amber-600 flex items-center justify-center shrink-0">
                                <FileWarning className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-1">Warning: Payment_Protocol_Failure</h4>
                                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                                    Falha na renovação automática. Atualize o método de faturamento para evitar LOCKDOWN em 7 dias.
                                </p>
                            </div>
                        </div>
                        <button className="h-12 px-10 bg-amber-600 text-black text-[10px] font-black uppercase tracking-[.3em] hover:bg-white transition-all active:scale-95 shrink-0">
                            RETRY_PAYMENT_NODE
                        </button>
                    </div>
                </div>
            )}

            {/* O conteúdo livre (ou apenas com o banner em cima) */}
            {children}
        </div>
    );
}

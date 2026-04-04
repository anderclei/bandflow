import { getUsers } from "@/app/actions/super-admin";
import { ClientManager } from "@/components/super-admin/ClientManager";
import { Users, Shield } from "lucide-react";

export default async function SuperAdminClientsPage() {
    const response = await getUsers();

    if (!response.success || !response.users) {
        return (
            <div className="p-20 text-center">
                <div className="w-16 h-16 bg-red-950/20 border border-red-500/50 flex items-center justify-center mx-auto mb-8">
                    <Shield className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">Falha na Sincronização de Credenciais de Usuário.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
             {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Users className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">Usuários do <span className="text-zinc-600">Sistema</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Pilha de Identidades e Acessos</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Sinal Autorizado [OK]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ClientManager initialUsers={response.users} />
        </div>
    );
}

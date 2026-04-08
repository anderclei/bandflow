import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Users, LayoutDashboard, LogOut, CreditCard, LifeBuoy, Search, FileText, Globe, Zap } from "lucide-react";
import { BandFlowIcon } from "@/components/bandflow-icon";

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user?.isSuperAdmin) {
        redirect("/dashboard");
    }

    const navItems = [
        { name: "Visão Geral", href: "/super-admin", icon: LayoutDashboard },
        { name: "Contas & Instâncias", href: "/super-admin/tenants", icon: Users },
        { name: "Faturamento (SaaS)", href: "/super-admin/billing", icon: CreditCard },
        { name: "Suporte (Tickets)", href: "/super-admin/tickets", icon: LifeBuoy },
        { name: "Auditoria Global", href: "/super-admin/audit", icon: Search },
        { name: "Templates do Sistema", href: "/super-admin/templates", icon: FileText },
        { name: "Ativos de Palco", href: "/super-admin/stage-assets", icon: Zap },
        { name: "Configurações", href: "/super-admin/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white font-body selection:bg-[#ccff00] selection:text-black">
            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[100]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-[#0a0a0a] hidden lg:flex flex-col relative z-10">
                <div className="h-28 flex items-center px-8 border-b border-white/5">
                    <Link href="/" className="group flex items-center gap-2">
                        <BandFlowIcon className="w-7 h-auto" glow={false} />
                        <div>
                            <span className="text-2xl font-black tracking-tighter uppercase font-heading leading-none">
                                Band<span className="text-[#ccff00]">Flow</span>
                            </span>
                            <div className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-600 mt-1">Administração Geral</div>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 px-4 py-8 overflow-y-auto space-y-8">
                    <div>
                        <span className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-6 block">Centro de Controle</span>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center rounded-none px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent hover:border-[#ccff00]"
                                    >
                                        <Icon className="mr-4 h-4 w-4 group-hover:text-[#ccff00] transition-colors" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div>
                        <span className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-6 block">Status da Rede</span>
                        <div className="px-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Latência API</span>
                                <span className="text-[8px] font-black text-green-500">12ms</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="w-[80%] h-full bg-[#ccff00]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5">
                    <Link
                        href="/dashboard"
                        className="flex w-full items-center justify-center gap-3 py-4 bg-zinc-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#ccff00] hover:text-black transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sair da Administração</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-28 flex items-center justify-between px-10 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-3xl z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 py-1 px-3 bg-zinc-900 rounded-full border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_green]" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 uppercase">Sistema Online</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest">{user.name || "Administrador"}</span>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Nível de Acesso: Root</span>
                        </div>
                        <div className="h-12 w-12 rounded-none bg-zinc-900 border border-white/10 p-1 group cursor-pointer hover:border-[#ccff00] transition-colors relative">
                            <div className="absolute inset-0 bg-[#ccff00] scale-0 group-hover:scale-100 transition-transform -z-10" />
                            {user.image ? (
                                <img src={user.image} alt={user.name || "Admin"} className="h-full w-full object-cover grayscale brightness-75" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs font-black">
                                    {user.name?.charAt(0) || "A"}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto bg-[#0a0a0a] p-10 relative">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ccff00]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                    
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

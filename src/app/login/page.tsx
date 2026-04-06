import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ArrowLeft, Lock, Mail, ShieldCheck, Play } from "lucide-react";
import Link from "next/link";
import { BandFlowIcon } from "@/components/bandflow-icon";

type Props = {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function LoginPage(props: Props) {
    const searchParams = await props.searchParams;
    const officeSlug = searchParams?.office as string | undefined;

    let b2bConfig: any = null;
    if (officeSlug) {
        b2bConfig = await prisma.band.findUnique({
            where: { slug: officeSlug },
            select: { name: true, primaryColor: true, secondaryColor: true, imageUrl: true }
        });
    }

    const brandName = b2bConfig?.name || 'BandFlow';
    const primaryColor = "#ccff00";

    // TEMPORARY: Create the super admin user automatically
    const adminEmail = "anderclei@gmail.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin || !existingAdmin.password) {
        const hashedPassword = await bcrypt.hash("Leh1829*", 10);
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                password: hashedPassword,
                isSuperAdmin: true,
                name: "Anderclei"
            },
            create: {
                email: adminEmail,
                password: hashedPassword,
                isSuperAdmin: true,
                name: "Anderclei",
                licenseStatus: "ACTIVE",
                maxBands: 10
            }
        });
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black font-body flex items-center justify-center relative overflow-hidden">
            {/* Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] noise-layer" />

            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ccff00]/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#ccff00]/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="w-full max-w-sm px-6 relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-[#ccff00] transition-colors mb-12 group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">VOLTAR AO REPOSITORIO</span>
                    </Link>
                    
                    <div className="flex flex-col items-center justify-center gap-4 mb-8">
                        <BandFlowIcon className="w-32 h-auto" />
                        <div className="text-4xl font-black tracking-tighter uppercase font-heading leading-none">
                            Band<span className="text-[#ccff00]">Flow</span>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl p-10 rounded-sm shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-0 bg-[#ccff00] group-hover:h-full transition-all duration-700" />
                    
                    <div className="flex justify-center mb-12 h-10 items-center">
                         {b2bConfig?.imageUrl ? (
                            <img src={b2bConfig.imageUrl} alt={brandName} className="h-full w-auto grayscale opacity-50 contrast-150" />
                        ) : (
                            <span className="text-[8px] font-black uppercase tracking-[1em] text-zinc-700 border-b border-zinc-800 pb-2">ACESSO VIA TERMINAL</span>
                        )}
                    </div>

                    <form
                        action={async (formData: FormData) => {
                            "use server";
                            const email = formData.get("email") as string;
                            const password = formData.get("password") as string;
                            // Pre-auth check for super admin
                            const user = await prisma.user.findUnique({
                                where: { email },
                                select: { isSuperAdmin: true }
                            });
                            const redirectUrl = user?.isSuperAdmin ? "/super-admin" : "/dashboard";
                            try {
                                await signIn("credentials", {
                                    email,
                                    password,
                                    redirectTo: redirectUrl,
                                });
                            } catch (error) {
                                throw error;
                            }
                        }}
                        className="space-y-8"
                    >
                        <div className="space-y-3">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">IDENTIDADE DE ACESSO EMAIL</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="ACCESS@BANDFLOW.IO"
                                required
                                className="w-full bg-black/50 border border-white/5 rounded-none py-5 px-6 text-[10px] font-black uppercase tracking-widest placeholder:text-zinc-800 outline-none focus:border-[#ccff00]/50 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">CHAVE DE VERIFICAÇÃO SENHA</label>
                            </div>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full bg-black/50 border border-white/5 rounded-none py-5 px-6 text-[10px] font-black uppercase tracking-widest placeholder:text-zinc-800 outline-none focus:border-[#ccff00]/50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="group w-full bg-[#ccff00] text-black py-6 rounded-none font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-4 mt-12 overflow-hidden relative"
                        >
                            <span className="relative z-10 transition-transform group-hover:scale-110">INICIALIZAR SESSÃO CORE</span>
                            <Play className="w-3 h-3 fill-current relative z-10" />
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">SEGURANÇA: REGISTRO ATIVO</span>
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

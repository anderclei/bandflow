import { getActiveBand } from "@/lib/getActiveBand";
import { User, Shield, Music, Settings as SettingsIcon, Save, CreditCard, Cpu, Database, Globe } from "lucide-react";
import { updateBand } from "@/app/actions/bands";
import { BandImageUpload } from "@/components/dashboard/BandImageUpload";
import { ColorPickerInput } from "@/components/dashboard/ColorPickerInput";
import { BillingPanel } from "@/components/dashboard/BillingPanel";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BrutalistInput } from "@/components/ui/BrutalistInput";

export default async function SettingsPage() {
    const { band: activeBand, membership, session } = await getActiveBand();

    if (!activeBand) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center border border-dashed border-white/10 m-8">
                <div className="text-center space-y-4">
                    <Cpu className="w-12 h-12 text-zinc-800 mx-auto animate-pulse" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
                        Error_404: NO_ENTITY_LINKED
                    </h2>
                </div>
            </div>
        );
    }

    const band = await (prisma as any).band.findUnique({
        where: { id: activeBand.id }
    }) ?? activeBand;

    const user = session?.user;

    return (
        <div className="max-w-7xl mx-auto space-y-16 pb-32">
            {/* --- HEADER --- */}
            <div className="relative group">
                <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-[#ccff00]" />
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-black border-2 border-[#ccff00]/20 flex items-center justify-center text-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.05)]">
                                <SettingsIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                                    <span className="text-[12px] font-medium text-zinc-400">Escritório Autenticado</span>
                                </div>
                                <h1 className="text-5xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                    Configurações
                                </h1>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden lg:block">
                        <div className="bg-zinc-900 border border-white/5 px-6 py-4 flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[14px] font-medium text-white">{new Date().toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                
                {/* --- MODULE: BAND IDENTITY --- */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="flex items-center gap-4">
                        <Database className="h-4 w-4 text-[#ccff00]" />
                        <h2 className="text-[12px] font-bold text-white tracking-widest uppercase">Identidade da Banda</h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="relative">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/[0.02] blur-[80px] rounded-full pointer-events-none" />
                        
                        <div className="bg-zinc-900/30 border border-white/5 p-8 lg:p-12 relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent" />
                            
                            <div className="flex flex-col sm:flex-row items-center gap-10 mb-16 pb-12 border-b border-white/5">
                                <div className="relative group/img">
                                    <BandImageUpload defaultImage={band.imageUrl} />
                                    <div className="absolute -bottom-2 -right-2 bg-black border border-[#ccff00] p-1">
                                        <Cpu className="w-3 h-3 text-[#ccff00]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Transp_Logo_Vector</label>
                                    <BandImageUpload defaultImage={band.logoUrl} fieldName="logoUrl" variant="logo" />
                                </div>
                                <div className="text-center sm:text-left space-y-2">
                                    <h3 className="text-2xl font-black font-heading uppercase tracking-tighter text-white">{band.name}</h3>
                                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                                        <Link
                                            href={`/band/${band.slug}`}
                                            target="_blank"
                                            className="text-[11px] font-bold text-[#ccff00] hover:underline"
                                        >
                                            Ver Perfil Público
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <form action={async (formData) => {
                                'use server';
                                const data = {
                                    name: formData.get("name") as string,
                                    secondaryColor: formData.get("secondaryColor") as string,
                                    imageUrl: formData.get("imageUrl") as string,
                                    logoUrl: formData.get("logoUrl") as string,
                                    respName: formData.get("respName") as string,
                                    respDocument: formData.get("respDocument") as string,
                                    addressStreet: formData.get("addressStreet") as string,
                                    addressNumber: formData.get("addressNumber") as string,
                                    addressNeighborhood: formData.get("addressNeighborhood") as string,
                                    addressZipCode: formData.get("addressZipCode") as string,
                                    addressCity: formData.get("addressCity") as string,
                                    addressState: formData.get("addressState") as string,
                                }
                                await updateBand(data);
                            }} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="md:col-span-2">
                                        <BrutalistInput
                                            id="band-name"
                                            name="name"
                                            label="Nome da Banda"
                                            defaultValue={band.name}
                                            variant="neon"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="band-color" className="text-[11px] font-bold text-zinc-500 ml-1">Cor do Sistema</label>
                                        <div className="bg-black border border-white/10 p-3 hover:border-[#ccff00]/40 transition-all">
                                            <ColorPickerInput
                                                id="band-color"
                                                name="secondaryColor"
                                                defaultValue={(band as any).secondaryColor || "#ccff00"}
                                            />
                                        </div>
                                    </div>

                                    <BrutalistInput
                                        id="resp-name"
                                        name="respName"
                                        label="Responsável Principal"
                                        defaultValue={(band as any).respName || ""}
                                        placeholder="Nome Completo..."
                                    />

                                    <div className="md:col-span-2">
                                        <BrutalistInput
                                            id="resp-doc"
                                            name="respDocument"
                                            label="Documento Fiscal (CPF / CNPJ)"
                                            defaultValue={(band as any).respDocument || ""}
                                            placeholder="Apenas números..."
                                            variant="dim"
                                        />
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-white/10 space-y-10">
                                    <div className="flex items-center gap-4">
                                        <Globe className="w-3 h-3 text-zinc-700" />
                                        <h4 className="text-[12px] font-bold text-zinc-500 tracking-widest uppercase">Endereço e Localização</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        <div className="md:col-span-9">
                                            <BrutalistInput
                                                id="addr-street"
                                                name="addressStreet"
                                                label="Logradouro"
                                                defaultValue={band.addressStreet || ""}
                                                variant="dim"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <BrutalistInput
                                                id="addr-number"
                                                name="addressNumber"
                                                label="Nº"
                                                defaultValue={(band as any).addressNumber || ""}
                                                variant="dim"
                                                className="text-center"
                                            />
                                        </div>
                                        <div className="md:col-span-6">
                                            <BrutalistInput
                                                id="addr-neighborhood"
                                                name="addressNeighborhood"
                                                label="Distrito / Bairro"
                                                defaultValue={(band as any).addressNeighborhood || ""}
                                                variant="dim"
                                            />
                                        </div>
                                        <div className="md:col-span-6">
                                            <BrutalistInput
                                                id="addr-zip"
                                                name="addressZipCode"
                                                label="Postal_Code (CEP)"
                                                defaultValue={(band as any).addressZipCode || ""}
                                                variant="dim"
                                            />
                                        </div>
                                        <div className="md:col-span-9">
                                            <BrutalistInput
                                                id="addr-city"
                                                name="addressCity"
                                                label="Central_City"
                                                defaultValue={(band as any).addressCity || ""}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <BrutalistInput
                                                id="addr-state"
                                                name="addressState"
                                                label="UF"
                                                defaultValue={(band as any).addressState || ""}
                                                maxLength={2}
                                                className="text-center"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                        type="submit" 
                                        className="h-20 bg-[#ccff00] text-black text-[14px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_20px_50px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-6 w-full"
                                    >
                                        <Save className="h-6 w-6" />
                                        SALVAR ALTERAÇÕES
                                    </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- SIDEBAR: OPERATOR & BILLING --- */}
                <div className="lg:col-span-5 space-y-16">
                    
                    {/* --- MODULE: USUÁRIO --- */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <User className="h-4 w-4 text-white" />
                            <h2 className="text-[12px] font-bold text-white tracking-widest uppercase">Seu Usuário</h2>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="bg-zinc-900/30 border border-white/5 p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/5" />
                            
                            <div className="flex items-center gap-10 mb-12">
                                <div className="relative">
                                    {(user as any)?.image ? (
                                        <img src={(user as any).image} alt="" className="h-28 w-28 border-2 border-white/10 bg-black object-cover grayscale hover:grayscale-0 transition-all" />
                                    ) : (
                                        <div className="h-28 w-28 bg-black border-2 border-white/10 flex items-center justify-center text-zinc-800">
                                            <User className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#ccff00]/20 rounded-full blur-sm animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black font-heading uppercase tracking-tighter text-white">{(user as any)?.name}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">{(user as any)?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-black border border-white/5 relative group/auth overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <Shield className="h-6 w-6 text-[#ccff00]" />
                                            <div>
                                                <p className="text-[11px] font-bold text-zinc-500 mb-1">Nível de Acesso</p>
                                                <p className="text-[16px] font-black text-white">{membership.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Link
                                        href="/dashboard/settings/formats"
                                        className="h-16 flex items-center justify-center bg-zinc-900 border border-white/5 text-[11px] font-bold text-white hover:bg-white hover:text-black transition-all"
                                    >
                                        Formatos de Show
                                    </Link>

                                    <button className="h-16 border-2 border-dashed border-white/5 text-[11px] font-bold text-zinc-700 hover:text-white hover:border-white/20 transition-all">
                                        Re-autenticar Email
                                    </button>

                                    <button className="h-16 border border-red-500/10 text-[11px] font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all mt-6">
                                        Encerrar Sessão
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MODULE: SUBSCRIPTION LEDGER --- */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <CreditCard className="h-4 w-4 text-[#ccff00]" />
                            <h2 className="text-[12px] font-bold text-white tracking-widest uppercase">Assinatura e Faturamento</h2>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                        <BillingPanel
                            bandId={band.id}
                            currentPlan={band.subscriptionPlan || "ESSENTIAL"}
                            status={band.subscriptionStatus || "TRIAL"}
                            expiresAt={band.planExpiresAt || null}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

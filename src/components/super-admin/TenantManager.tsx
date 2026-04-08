"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Search, Users, Globe, Trash2, Edit, Building2, Music, ImagePlus, X, RotateCcw, DollarSign, Link as LinkIcon, Zap, Shield, LayoutGrid, Terminal } from "lucide-react";
import { createTenant, updateTenant, deleteTenant, impersonateTenant, resetBandData } from "@/app/actions/super-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function TenantManager({ initialBands }: { initialBands: any[] }) {
    const [bands, setBands] = useState(initialBands);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [editingBand, setEditingBand] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [tenantType, setTenantType] = useState<"BANDA" | "OFFICE">("BANDA");
    const logoInputRef = useRef<HTMLInputElement>(null);
    const firstBandLogoInputRef = useRef<HTMLInputElement>(null);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/[^\w\s-]/g, "") 
            .replace(/\s+/g, "-") 
            .replace(/-+/g, "-") 
            .trim();
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "logoUrl" | "firstBandLogo") => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("A imagem deve ter menos de 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            setFormData(prev => ({ ...prev, [field]: ev.target?.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const defaultFormData = {
        name: "",
        slug: "",
        logoUrl: "",
        primaryColor: "#333333",
        secondaryColor: "#ccff00",
        respName: "",
        respDocument: "",
        respPhone: "",
        respEmail: "",
        addressStreet: "",
        addressNumber: "",
        addressNeighborhood: "",
        addressZipCode: "",
        addressCity: "",
        addressState: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        city: "",
        adminEmail: "",
        firstBandName: "",
        firstBandLogo: "",
        subscriptionPlan: "ESSENTIAL",
        subscriptionStatus: "TRIAL",
        planExpiresAt: "",
        customModules: [] as string[],
        maxStorageGB: 5,
        maxMembers: 10
    };

    const [formData, setFormData] = useState(defaultFormData);

    const filteredBands = bands.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === "name" && !editingBand) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleCreate = async () => {
        setSaving(true);
        try {
            const result = await createTenant({
                ...formData,
                type: tenantType,
            });
            if (result.success) {
                toast.success(`${tenantType === "OFFICE" ? "Escritório" : "Banda"} criada com sucesso!`);
                window.location.reload();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Erro inesperado na solicitação.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingBand) return;
        setSaving(true);
        try {
            const result = await updateTenant(editingBand.id, {
                name: formData.name,
                slug: formData.slug,
                logoUrl: formData.logoUrl,
                secondaryColor: formData.secondaryColor,
                respName: formData.respName,
                respDocument: formData.respDocument,
                respPhone: formData.respPhone,
                respEmail: formData.respEmail,
                addressStreet: formData.addressStreet,
                addressNumber: formData.addressNumber,
                addressNeighborhood: formData.addressNeighborhood,
                addressZipCode: formData.addressZipCode,
                addressCity: formData.addressCity,
                addressState: formData.addressState,
                // @ts-ignore
                subscriptionPlan: formData.subscriptionPlan,
                // @ts-ignore
                subscriptionStatus: formData.subscriptionStatus,
                customModules: JSON.stringify(formData.customModules),
                maxStorageGB: Number((formData as any).maxStorageGB || 5),
                maxMembers: Number((formData as any).maxMembers || 10)
            });
            if (result.success) {
                toast.success("Parâmetros da conta atualizados.");
                window.location.reload();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Erro na transmissão de dados.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`CRITICAL: Deseja deletar a conta ${name}? Todos os dados serão perdidos.`)) {
            try {
                const result = await deleteTenant(id);
                if (result.success) {
                    toast.success("Instância removida com sucesso.");
                    window.location.reload();
                } else {
                    toast.error(result.error);
                }
            } catch (error) {
                toast.error("Erro ao remover instância.");
            }
        }
    };

    const handleReset = async (id: string, name: string) => {
        if (confirm(`ALERTA: Deseja realmente RESETAR todos os dados da banda ${name}?`)) {
            setSaving(true);
            try {
                const result = await resetBandData(id);
                if (result.success) {
                    toast.success("Purgue de dados concluído.");
                    window.location.reload();
                } else {
                    toast.error(result.error);
                }
            } catch (error) {
                toast.error("Erro ao resetar.");
            } finally {
                setSaving(false);
            }
        }
    };

    const openEdit = (band: any) => {
        setEditingBand(band);
        setTenantType(band.type || "BANDA");
        setFormData({
            ...defaultFormData,
            name: band.name,
            slug: band.slug,
            logoUrl: band.imageUrl || "",
            primaryColor: "#333333",
            secondaryColor: band.secondaryColor || "#ccff00",
            respName: band.respName || "",
            respDocument: band.respDocument || "",
            respPhone: band.respPhone || "",
            respEmail: band.respEmail || "",
            addressStreet: band.addressStreet || "",
            addressNumber: band.addressNumber || "",
            addressNeighborhood: band.addressNeighborhood || "",
            addressZipCode: band.addressZipCode || "",
            addressCity: band.addressCity || "",
            addressState: band.addressState || "",
            subscriptionPlan: band.subscriptionPlan || "ESSENTIAL",
            subscriptionStatus: band.subscriptionStatus || "TRIAL",
            customModules: band.customModules ? JSON.parse(band.customModules) : [],
        });
        setIsCreating(true);
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditingBand(null);
        setTenantType("BANDA");
        setFormData(defaultFormData);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {!isCreating && (
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-zinc-900/30 p-6 border border-white/5">
                    <div className="relative w-full sm:w-[500px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                        <input
                            placeholder="BUSCAR NO REGISTRO DE INSTÂNCIAS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/50 border border-white/5 py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest placeholder:text-zinc-800 outline-none focus:border-[#ccff00]/50 transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)} 
                        className="w-full sm:w-auto px-8 py-3 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Criar Nova Conta
                    </button>
                </div>
            )}

            {isCreating && (
                <div className="bg-zinc-900 border border-white/10 relative overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                        <div className="flex justify-between items-center border-b border-white/5 pb-8">
                            <div>
                                <h2 className="text-3xl font-black font-heading uppercase tracking-tighter text-white">
                                    {editingBand ? "Modificar Instância" : "Contruir Novo Cluster"}
                                </h2>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.4em] mt-2">
                                    Configuração de Conta Administrativa
                                </p>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" onClick={closeForm}>Encerrar Processo [X]</button>
                        </div>

                        {!editingBand && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTenantType("BANDA")}
                                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tenantType === "BANDA" ? "bg-[#ccff00] text-black shadow-[0 0 20px rgba(204,255,0,0.2)]" : "bg-zinc-900 text-zinc-600 border border-white/5"}`}
                                >
                                    Unidade Solo (Banda)
                                </button>
                                <button
                                    onClick={() => setTenantType("OFFICE")}
                                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tenantType === "OFFICE" ? "bg-[#ccff00] text-black shadow-[0 0 20px rgba(204,255,0,0.2)]" : "bg-zinc-900 text-zinc-600 border border-white/5"}`}
                                >
                                    Nexus Hub (Escritório)
                                </button>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-20">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-zinc-500 flex items-center gap-4">
                                        <div className="w-10 h-[1px] bg-zinc-800" /> Identificador
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Nome da Entidade</label>
                                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50" placeholder="Ex: PHANTOM SQUADRON" />
                                        </div>

                                        <div className="space-y-2 opacity-50">
                                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Slug / Rota de Acesso</label>
                                            <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-black/20 border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none" readOnly />
                                        </div>

                                        {tenantType === "BANDA" && (
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Identidade Visual (Logo)</label>
                                                <input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleLogoUpload(e, "logoUrl")} className="hidden" />
                                                <div onClick={() => logoInputRef.current?.click()} className="border border-dashed border-white/10 p-6 flex items-center gap-6 cursor-pointer hover:border-[#ccff00]/50 hover:bg-[#ccff00]/5 transition-all">
                                                    {formData.logoUrl ? (
                                                        <>
                                                            <img src={formData.logoUrl} alt="preview" className="w-16 h-16 bg-zinc-950 grayscale" />
                                                            <div className="flex-1">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Asset Vinculado</p>
                                                                <p className="text-[8px] text-zinc-600 uppercase font-bold mt-1">Toque para Substituir</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-16 h-16 bg-zinc-950 flex items-center justify-center border border-white/5">
                                                                <ImagePlus className="w-6 h-6 text-zinc-800" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Enviar Símbolo</p>
                                                                <p className="text-[8px] text-zinc-700 uppercase font-bold mt-1">PNG/JPG Max 2MB</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-white/5">
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-zinc-500 flex items-center gap-4">
                                        <div className="w-10 h-[1px] bg-zinc-800" /> Acesso e Permissões
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Tier de Licença</label>
                                            <select
                                                name="subscriptionPlan"
                                                value={(formData as any).subscriptionPlan}
                                                onChange={(e: any) => setFormData(prev => ({ ...prev, subscriptionPlan: e.target.value }))}
                                                className="w-full bg-black/50 border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none appearance-none"
                                            >
                                                <option value="ESSENTIAL">ESSENTIAL PROTOCOL</option>
                                                <option value="PRO">PRO COMMANDER</option>
                                                <option value="PREMIUM">PREMIUM ELITE</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Status de Rede</label>
                                            <select
                                                name="subscriptionStatus"
                                                value={(formData as any).subscriptionStatus}
                                                onChange={(e: any) => setFormData(prev => ({ ...prev, subscriptionStatus: e.target.value }))}
                                                className="w-full bg-black/50 border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none appearance-none font-black text-[#ccff00]"
                                            >
                                                <option value="TRIAL">MODO SANDBOX</option>
                                                <option value="ACTIVE">LIVE DEPLOΥ</option>
                                                <option value="OVERDUE">PERDA SINAL</option>
                                                <option value="SUSPENDED">BLOQUEIO HARD</option>
                                                <option value="CANCELED">ENCERRADO</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-zinc-500 flex items-center gap-4">
                                        <div className="w-10 h-[1px] bg-zinc-800" /> Credencial Root
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Assinatura de Email Admin</label>
                                            <input name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} className="w-full bg-black/50 border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50" placeholder="ROOT@CLUSTER.IO" />
                                        </div>
                                        <p className="text-[8px] font-black text-[#ccff00]/50 uppercase tracking-[0.2em] leading-relaxed">
                                            Aviso: Chave temporária "123456" será gerada para o handshake inicial. Exige rotação imediata de segurança.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-20">
                                    <button 
                                        onClick={editingBand ? handleUpdate : handleCreate} 
                                        disabled={saving || !formData.name || !formData.slug} 
                                        className="w-full py-8 bg-[#ccff00] text-black text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0 0 40px rgba(204,255,0,0.1)] active:scale-95"
                                    >
                                        {saving ? "TRANSMITINDO..." : (editingBand ? "SALVAR ALTERAÇÕES" : "EXECUTAR INÍCIO")}
                                    </button>

                                    {editingBand && (
                                        <div className="mt-12 p-8 border border-[#ccff00]/10 bg-[#ccff00]/5 relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 text-zinc-800 opacity-20">
                                                <Shield className="w-10 h-10" />
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] mb-4">Reset Completo de Dados</h4>
                                            <button
                                                onClick={() => handleReset(editingBand.id, editingBand.name)}
                                                className="w-full border border-[#ccff00]/20 py-4 text-[8px] font-black uppercase tracking-[0.3em] text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all"
                                            >
                                                Purgar Todos os Dados Segmentados
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isCreating && (
                <div className="border border-white/5 bg-[#0a0a0a] relative overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-zinc-900 border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Segmento</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Ref Node</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Tier</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Sincronização</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredBands.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-zinc-800">
                                            Cluster Vazio. Nenhuma Instância Ativa.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBands.map((band) => {
                                        const type = band.type || "BANDA";
                                        const plan = band.subscriptionPlan || "ESSENTIAL";
                                        const status = band.subscriptionStatus || "TRIAL";

                                        return (
                                            <tr key={band.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 p-1 relative overflow-hidden">
                                                            {band.imageUrl ? (
                                                                <img src={band.imageUrl} alt={band.name} className="w-full h-full object-cover grayscale" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center font-black text-xs text-zinc-700">
                                                                    {band.name.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div className={`absolute bottom-0 left-0 right-0 h-1 ${band.usageStatus === 'GREEN' ? 'bg-[#ccff00]' : 'bg-zinc-800'}`} />
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors">{band.name}</div>
                                                            <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{band.respName || "ANÔNIMO"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">/{band.slug}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-2">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${type === "OFFICE" ? "text-white" : "text-zinc-600"}`}>
                                                            {type}
                                                        </span>
                                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-zinc-900 border border-white/5 w-fit">
                                                            {plan}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-[#ccff00]' : 'bg-zinc-800'}`} />
                                                        <span className={status === 'ACTIVE' ? 'text-[#ccff00]' : 'text-zinc-600'}>{status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button onClick={() => openEdit(band)} className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all" title="Editar Parâmetros">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={async () => {
                                                            const result = await impersonateTenant(band.id);
                                                            if (result.success) window.location.href = "/dashboard";
                                                        }} className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-all" title="Acessar Painel">
                                                            <Globe className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(band.id, band.name)} className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center hover:text-white transition-all text-zinc-800" title="Deletar Instância">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

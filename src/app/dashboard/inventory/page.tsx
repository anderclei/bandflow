import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { Plus, Trash2, Box, Guitar, Mic, Settings2, Cable, Package } from "lucide-react";
import { redirect } from "next/navigation";
import { createEquipment, deleteEquipment } from "@/app/actions/inventory";
import { cn } from "@/lib/utils";
import { FeatureGuard } from "@/components/ui/feature-guard";

const CategoryIcon = ({ type, className }: { type: string, className?: string }) => {
    switch (type) {
        case "Instrument": return <Guitar className={className} />;
        case "Microphone": return <Mic className={className} />;
        case "PA": return <Settings2 className={className} />;
        case "Cable": return <Cable className={className} />;
        default: return <Box className={className} />;
    }
};

export default async function InventoryPage() {
    const { band } = await getActiveBand({
        equipment: {
            include: { owner: { include: { user: true } }, formats: true },
            orderBy: { category: 'asc' }
        },
        members: {
            include: { user: true }
        },
        formats: true
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const equipment = (band.equipment as any[]) || [];
    const members = (band.members as any[]) || [];
    const formats = (band.formats as any[]) || [];

    const totalValue = equipment.reduce((acc, eq) => acc + (eq.value || 0), 0);

    return (
        <FeatureGuard
            plan={band.subscriptionPlan as any}
            feature="inventory"
            fallbackTitle="Inventário & Patrimônio"
            fallbackDescription="Cataloge os equipamentos e instrumentos da banda, gerencie valores segurados e associe gears aos formatos de show. Funcionalidade Exclusiva do Plano PROFISSIONAL."
        >
            <div className="space-y-8">
            <div className="space-y-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Package className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                    MEUS <span className="text-[#ccff00]">EQUIPAMENTOS</span>
                                </h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">LISTA DE BENS E INSTRUMENTOS</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">CONTROLE TOTAL</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-zinc-900/40 border border-white/5 p-6 min-w-[140px] relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/20" />
                            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">ITENS CADASTRADOS</p>
                            <p className="text-2xl font-black text-white">{equipment.length}</p>
                        </div>
                        <div className="bg-zinc-900/40 border border-white/5 p-6 min-w-[200px] relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]" />
                            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">VALOR TOTAL ESTIMADO</p>
                            <p className="text-2xl font-black text-[#ccff00]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Form to add new equipment */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-none bg-zinc-900/40 p-8 border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden">
                             <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ccff00]/5 blur-[60px] rounded-none pointer-events-none" />
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] rounded-none">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">
                                    NOVO ITEM
                                </h2>
                            </div>

                            <form action={createEquipment.bind(null, band.id)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">DESCRIÇÃO DO EQUIPAMENTO</label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-800 rounded-none"
                                        placeholder="EX: FENDER STRATOCASTER"
                                        title="Nome / Descrição"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">CATEGORIA</label>
                                        <select
                                            name="category"
                                            required
                                            title="Selecione a categoria do equipamento"
                                            className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 appearance-none text-[#ccff00] rounded-none"
                                        >
                                            <option value="Instrument">Instrumento</option>
                                            <option value="Microphone">Microfone</option>
                                            <option value="Cable">Cabo</option>
                                            <option value="PA">P.A. / Monitor</option>
                                            <option value="Other">Outro</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">MARCA</label>
                                        <input
                                            name="brand"
                                            className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-800 rounded-none"
                                            placeholder="EX: SHURE"
                                            title="Marca"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Nº DE SÉRIE</label>
                                        <input
                                            name="serialNumber"
                                            className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-800 rounded-none"
                                            placeholder="N/S OPCIONAL"
                                            title="Nº de Série"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">VALOR (R$)</label>
                                        <input
                                            name="value"
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-800 rounded-none"
                                            placeholder="0.00"
                                            title="Valor (R$)"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">PROPRIETÁRIO / DONO</label>
                                    <select
                                        name="ownerId"
                                        title="Selecione o proprietário"
                                        className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50 appearance-none text-[#ccff00] rounded-none"
                                    >
                                        <option value="band">BANDA (GERAL)</option>
                                        {members.map(m => (
                                            <option key={m.id} value={m.id}>
                                                INTEGRANTE ({m.user?.name?.toUpperCase()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {formats.length > 0 && (
                                    <div className="space-y-3">
                                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-1">Formatos de Show Vinculados</label>
                                        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto p-4 bg-black border border-white/5">
                                            {formats.map((f: any) => (
                                                <label key={f.id} className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" name="formats" value={f.id} className="w-4 h-4 rounded-none border-white/10 bg-zinc-900 checked:bg-[#ccff00] checked:border-none focus:ring-0 transition-all" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">{f.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-[#ccff00] py-6 text-[12px] font-black uppercase tracking-[0.5em] text-black hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95"
                                >
                                    SALVAR ITEM
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List of equipment */}
                    <div className="lg:col-span-2">
                        {
                            equipment.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {equipment.map((item: any) => (
                                        <div key={item.id} className="group flex flex-col bg-zinc-900/40 border border-white/5 hover:border-[#ccff00]/30 transition-all shadow-xl overflow-hidden">
                                            <div className="p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] relative overflow-hidden">
                                                            {item.photoUrl ? (
                                                                <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover grayscale" />
                                                            ) : (
                                                                <CategoryIcon type={item.category} className="w-6 h-6" />
                                                            )}
                                                            <div className="absolute inset-0 bg-[#ccff00]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-[12px] font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors">{item.name}</h3>
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">{item.brand || "SEM MARCA"}</span>
                                                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">SN: {item.serialNumber || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <form action={async () => {
                                                        "use server";
                                                        await deleteEquipment({ id: item.id });
                                                    }}>
                                                        <button 
                                                            title="Excluir equipamento"
                                                            className="w-10 h-10 flex items-center justify-center text-zinc-800 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </form>
                                                </div>

                                                <div className="space-y-4 pt-6 border-t border-white/5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600">VALOR DE MERCADO</span>
                                                        <span className="text-[10px] font-black text-white">
                                                            {item.value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value) : '--'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600">PROPRIETÁRIO</span>
                                                        <span className="inline-flex items-center bg-black border border-white/5 px-3 py-1 text-[8px] font-black text-[#ccff00] uppercase tracking-widest">
                                                            {item.owner?.user?.name || 'COLETIVO (BANDA)'}
                                                        </span>
                                                    </div>

                                                    {item.formats && item.formats.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 pt-2">
                                                            {item.formats.map((f: any) => (
                                                                <span key={f.id} className="text-[7px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-[#ccff00]/5 border border-[#ccff00]/10 text-[#ccff00]/60">
                                                                    {f.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-zinc-900/40 p-20 text-center border border-dashed border-white/10 opacity-40">
                                    <div className="inline-flex p-8 bg-black border border-white/5 text-zinc-800 mb-8 scale-150">
                                        <Box className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-black font-heading uppercase tracking-widest text-zinc-700 leading-none">INVENTÁRIO VAZIO</h3>
                                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">Nenhum equipamento cadastrado ainda.</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            </div>
        </FeatureGuard>
    );
}

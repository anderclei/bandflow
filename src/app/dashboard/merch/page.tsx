import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import { Store, Plus, Trash2, Package, TrendingUp } from "lucide-react";
import { createMerchItem, deleteMerchItem, updateMerchStock } from "@/app/actions/merch";
import Link from "next/link";
import { FeatureGuard } from "@/components/ui/feature-guard";

export default async function MerchPage() {
    const { band } = await getActiveBand({
        merchItems: { orderBy: { category: 'asc' } },
        merchSales: {
            include: {
                items: { include: { item: true } },
                gig: true
            },
            orderBy: { date: 'desc' },
            take: 5
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const items = (band.merchItems as any[]) || [];
    const sales = (band.merchSales as any[]) || [];

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalItemsInStock = items.reduce((acc, item) => acc + item.stock, 0);

    return (
        <FeatureGuard
            plan={(band as any).subscriptionPlan}
            feature="merch"
            fallbackTitle="Lojinha & Merchandising"
            fallbackDescription="Abra sua frente de caixa, gerencie estoques de camisetas e discos, e acompanhe o faturamento direto no show. Funcionalidade Exclusiva do Plano PREMIUM."
        >
            <div className="space-y-12 pb-20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Store className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                    Produtos <span className="text-zinc-600">& Estoque</span>
                                </h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">CONTROLE DE ESTOQUE</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">TUDO EM DIA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/merch/pos"
                        className="h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-4"
                    >
                        <Package className="h-4 w-4" />
                        ABRIR FRENTE DE CAIXA
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800" />
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">TOTAL EM ESTOQUE</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tighter">{totalItemsInStock}</p>
                        <p className="text-[8px] text-zinc-800 mt-4 uppercase font-black tracking-widest leading-relaxed">Itens físicos no depósito</p>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/20" />
                        <p className="text-[8px] font-black text-[#ccff00]/60 uppercase tracking-[0.4em] mb-4">VENDAS TOTAIS</p>
                        <p className="text-3xl font-black text-[#ccff00] leading-none tracking-tighter">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                        </p>
                        <p className="text-[8px] text-zinc-800 mt-4 uppercase font-black tracking-widest leading-relaxed">Resultado Financeiro</p>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800" />
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">ITENS CADASTRADOS</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tighter">{items.length}</p>
                        <p className="text-[8px] text-zinc-800 mt-4 uppercase font-black tracking-widest leading-relaxed">Variedade de Catálogo</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Form to add new product */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ccff00]/5 blur-[40px] rounded-full pointer-events-none" />
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">NOVO PRODUTO</h2>
                            </div>

                            <form action={createMerchItem.bind(null, band.id)} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="merch-name" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">NOME DO PRODUTO</label>
                                    <input
                                        id="merch-name"
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Ex: Camiseta Turnê 2024"
                                        className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="merch-category" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">CATEGORIA</label>
                                    <select
                                        id="merch-category"
                                        name="category"
                                        required
                                        title="Selecione a categoria do produto"
                                        className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all shadow-none ring-0 appearance-none bg-no-repeat bg-[right_1.5rem_center] cursor-pointer"
                                    >
                                        <option value="Vestuário">VESTUÁRIO</option>
                                        <option value="Físico">MÍDIA FÍSICA</option>
                                        <option value="Acessório">ACESSÓRIO</option>
                                        <option value="Outro">OUTROS</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="merch-price" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">PREÇO DE VENDA</label>
                                        <input
                                            id="merch-price"
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            required
                                            placeholder="0.00"
                                            className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all font-bold placeholder:text-zinc-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="merch-cost" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">CUSTO PRODUÇÃO</label>
                                        <input
                                            id="merch-cost"
                                            type="number"
                                            step="0.01"
                                            name="costPrice"
                                            placeholder="0.00"
                                            className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-[#ccff00]/50 transition-all font-bold placeholder:text-zinc-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="merch-sizes" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">TAMANHOS / VARIANTES</label>
                                    <input
                                        id="merch-sizes"
                                        type="text"
                                        name="sizes"
                                        placeholder="P, M, G, GG..."
                                        defaultValue="P, M, G, GG"
                                        className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="merch-image" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">URL DA IMAGEM</label>
                                    <input
                                        id="merch-image"
                                        type="text"
                                        name="imageUrl"
                                        placeholder="LINK DA FOTO DO PRODUTO"
                                        className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-800 outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-4 w-full"
                                >
                                    <Plus className="h-4 w-4" />
                                    SALVAR PRODUTO
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List of Products */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white font-heading">RELAÇÃO DE ESTOQUE</h2>
                                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Tempo Real</span>
                            </div>

                            <div className="divide-y divide-white/5 flex flex-col">
                                {items.length === 0 ? (
                                    <div className="p-20 text-center opacity-30 border border-dashed border-white/5 m-8">
                                        <Store className="mx-auto h-12 w-12 text-zinc-900 mb-6" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">NENHUM PRODUTO ENCONTRADO</p>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:bg-white/5 transition-all group/item">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-black border border-white/5 shrink-0 overflow-hidden relative shadow-lg">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover grayscale transition-all group-hover/item:grayscale-0 duration-500" />
                                                    ) : (
                                                        <Store className="h-6 w-6 absolute inset-0 m-auto text-zinc-900" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-[14px] font-black text-white uppercase tracking-widest mb-2 group-hover/item:text-[#ccff00] transition-colors">{item.name}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[8px] font-black uppercase tracking-widest bg-zinc-900 border border-white/5 px-2 py-1 text-zinc-500">
                                                            {item.category.toUpperCase()}
                                                        </span>
                                                        <span className="text-[10px] font-black text-[#ccff00] tracking-widest">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-10">
                                                <div className="text-right">
                                                    <span className="block text-[8px] uppercase text-zinc-800 font-black tracking-widest mb-2">SALDO DISPONÍVEL</span>
                                                    <span className={`text-2xl font-black tracking-tighter leading-none ${item.stock <= 5 ? 'text-red-600' : 'text-white'}`}>
                                                        {item.stock}
                                                    </span>
                                                </div>

                                                <form action={deleteMerchItem.bind(null, item.id)}>
                                                    <button
                                                        type="submit"
                                                        title="Excluir produto"
                                                        className="w-12 h-12 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/item:opacity-100"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Sales History */}
                        <div className="bg-zinc-900/40 border border-white/5 relative overflow-hidden group">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <TrendingUp className="h-5 w-5 text-[#ccff00]" />
                                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">HISTÓRICO DE VENDAS</h2>
                                </div>
                            </div>

                            <div className="divide-y divide-white/5 bg-black/20">
                                {sales.length === 0 ? (
                                    <div className="p-16 text-center opacity-20 border border-dashed border-white/5 m-8">
                                        <p className="text-[8px] font-black uppercase tracking-[0.5em]">NENHUMA VENDA RECENTE</p>
                                    </div>
                                ) : (
                                    sales.map((sale: any) => (
                                        <div key={sale.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:bg-black transition-all">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[12px] font-black text-[#ccff00] tracking-[0.2em] bg-black border border-white/5 px-4 py-2 shadow-2xl">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalAmount)}
                                                    </span>
                                                    <span className="text-[8px] font-black uppercase tracking-[.4em] text-zinc-600 bg-white/5 px-3 py-1">
                                                        PAGAMENTO: {sale.paymentMethod.toUpperCase()}
                                                    </span>
                                                    {sale.gig && (
                                                        <span className="text-[8px] font-black text-[#ccff00] uppercase tracking-widest bg-[#ccff00]/5 px-3 py-1 border border-[#ccff00]/10">
                                                            LOCAL: {sale.gig.title.toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed opacity-60">
                                                    {sale.items.map((si: any) => `${si.quantity}X ${si.item.name.toUpperCase()}`).join(' | ')}
                                                </div>
                                                <div className="text-[8px] text-zinc-800 uppercase font-black tracking-[0.4em]">
                                                    DATA/HORA: {new Date(sale.date).toLocaleString('pt-BR')}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FeatureGuard>
    );
}

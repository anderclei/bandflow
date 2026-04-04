"use client";

import { useState } from "react";
import { Store, ShoppingCart, Plus, Minus, CreditCard, Banknote, QrCode, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { registerMerchSale } from "@/app/actions/merch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PixPaymentModal } from "./PixPaymentModal";

interface MerchItem {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
}

interface Gig {
    id: string;
    title: string;
    date: Date;
}

interface CartItem extends MerchItem {
    quantity: number;
}

export function POSClient({ items, gigs, bandId }: { items: MerchItem[], gigs: Gig[], bandId: string }) {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedGigId, setSelectedGigId] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isPixModalOpen, setIsPixModalOpen] = useState(false);

    const addToCart = (item: MerchItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                if (existing.quantity >= item.stock) return prev; // Cannot exceed stock
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
            }
            return prev.filter(i => i.id !== itemId);
        });
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = async (method: string) => {
        if (cart.length === 0) return;

        if (method === "PIX" && !isPixModalOpen) {
            setIsPixModalOpen(true);
            return;
        }

        setIsPixModalOpen(false);
        setIsProcessing(true);

        try {
            const formattedCart = cart.map(item => ({
                itemId: item.id,
                quantity: item.quantity,
                unitPrice: item.price
            }));

            const result = await registerMerchSale(
                bandId,
                formattedCart,
                method,
                selectedGigId || undefined
            );

            if (result?.success) {
                setCart([]);
                setSuccessMessage(`Venda de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)} registrada!`);
                setTimeout(() => {
                    setSuccessMessage("");
                    router.refresh();
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao processar venda");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex h-full flex-col lg:flex-row gap-0 bg-black -m-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ccff00]/2 blur-[120px] pointer-events-none" />

            {/* Left side - Products Grid */}
            <div className="flex-1 flex flex-col border-r border-white/5 overflow-hidden relative">
                <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 bg-black/40 backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/merch" title="Voltar ao inventário" className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-all group">
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                                PONTO DE <span className="text-zinc-600">VENDA</span>
                            </h2>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-800">CAIXA ABERTO</span>
                                <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-pulse" />
                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#ccff00]">SISTEMA ONLINE</span>
                            </div>
                        </div>
                    </div>
                    {gigs.length > 0 && (
                        <div className="relative group">
                            <select
                                value={selectedGigId}
                                onChange={(e) => setSelectedGigId(e.target.value)}
                                title="Vincular venda a um show"
                                className="appearance-none bg-black border border-white/10 text-[#ccff00] text-[10px] font-black uppercase tracking-widest px-6 py-4 pr-12 outline-none focus:border-[#ccff00]/50 min-w-[280px] cursor-pointer transition-all rounded-none"
                            >
                                <option value="">SEM EVENTO VINCULADO</option>
                                {gigs.map(g => (
                                    <option key={g.id} value={g.id}>VINCULAR AO SHOW: {g.title.toUpperCase()}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-800 group-hover:text-[#ccff00] transition-colors">
                                <Plus className="h-4 w-4" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative z-10 scroll-smooth">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-zinc-900 border border-white/5 flex items-center justify-center mb-8 grayscale opacity-20 rounded-none">
                                <Store className="h-10 w-10" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">CARRINHO VAZIO: NENHUM PRODUTO CADASTRADO</p>
                            <Link href="/dashboard/merch" className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#ccff00] hover:text-white transition-colors border-b border-[#ccff00]/20 pb-1">
                                [ADICIONAR PRODUTOS]
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-3 gap-6 pb-24">
                            {items.map(item => {
                                const inCart = cart.find(i => i.id === item.id)?.quantity || 0;
                                const isSoldOut = inCart >= item.stock;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => addToCart(item)}
                                        disabled={isSoldOut}
                                        className={`relative p-8 border text-left transition-all group aspect-square flex flex-col justify-between overflow-hidden rounded-none
                                            ${isSoldOut
                                                ? 'border-white/5 bg-zinc-950/20 opacity-20 cursor-not-allowed'
                                                : 'border-white/5 bg-zinc-900/40 hover:bg-black hover:border-[#ccff00]/40'
                                            }
                                            ${inCart > 0 ? 'border-[#ccff00]/40 bg-[#ccff00]/2 shadow-[0 0 40px rgba(204,255,0,0.05)]' : ''}
                                        `}
                                    >
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className="text-[8px] font-black text-zinc-800 tracking-widest uppercase">
                                                {item.stock - inCart} DISPONÍVEL
                                            </span>
                                        </div>

                                        <div className="relative z-10">
                                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-2">{item.category}</p>
                                            <h3 className="text-[12px] font-black text-white uppercase tracking-widest leading-relaxed line-clamp-2 group-hover:text-[#ccff00] transition-colors">{item.name}</h3>
                                        </div>

                                        <div className="relative z-10 pt-4 flex items-end justify-between border-t border-white/5">
                                            <span className="text-xl font-black text-white tracking-tighter">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                            </span>
                                            {inCart > 0 && (
                                                <div className="w-8 h-8 bg-[#ccff00] flex items-center justify-center text-black text-[12px] font-black rounded-none">
                                                    {inCart}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right side - Cart / Checkout */}
            <div className="w-full lg:w-[500px] flex flex-col bg-zinc-900/20 backdrop-blur-3xl shrink-0 relative overflow-hidden group/cart">
                <div className="p-10 border-b border-white/5 bg-black/40">
                    <h2 className="text-[12px] font-black text-white uppercase tracking-[0.5em] flex items-center justify-between">
                        <span>ITENS NO CARRINHO</span>
                        <ShoppingCart className="h-4 w-4 text-[#ccff00]" />
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-6 relative custom-scrollbar">
                    {/* Success Overlay */}
                    {successMessage && (
                        <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center text-[#ccff00] p-12 text-center animate-in fade-in duration-500">
                            <CheckCircle2 className="h-16 w-16 mb-8 animate-bounce" />
                            <p className="text-2xl font-black uppercase tracking-tighter leading-none mb-4">VENDA FINALIZADA</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-50">{successMessage}</p>
                        </div>
                    )}

                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-800 rotate-90 whitespace-nowrap">CARRINHO VAZIO</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex flex-col gap-6 p-8 bg-black border border-white/5 relative overflow-hidden rounded-none">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/40" />
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="text-[11px] font-black text-white uppercase tracking-widest">{item.name}</div>
                                        <div className="text-[8px] font-black text-zinc-700 tracking-widest uppercase">
                                            PREÇO UNITÁRIO: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                        </div>
                                    </div>
                                    <div className="text-[14px] font-black text-[#ccff00] tracking-tighter">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-800">QUANTIDADE</span>
                                    <div className="flex items-center gap-1 bg-zinc-900/50 p-1 border border-white/5 rounded-none">
                                        <button onClick={() => removeFromCart(item.id)} title="Remover um item" className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-white transition-all active:scale-90 rounded-none">
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="font-black w-12 text-center text-white text-sm">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} title="Adicionar mais um" className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-[#ccff00] transition-all active:scale-90 disabled:opacity-5 rounded-none" disabled={item.quantity >= item.stock}>
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-10 bg-black/60 border-t border-white/5 backdrop-blur-2xl">
                    <div className="space-y-6 mb-10">
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">RESUMO ({cartCount})</span>
                            <span className="text-[10px] font-black text-zinc-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-6">
                            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase leading-none">TOTAL GERAL</span>
                            <span className="text-5xl font-black text-[#ccff00] tracking-tighter leading-none shadow-[0 0 50px rgba(204,255,0,0.1)]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => handleCheckout("PIX")}
                            disabled={cart.length === 0 || isProcessing}
                            className="h-20 bg-black border border-white/10 text-white hover:border-[#ccff00] hover:text-[#ccff00] transition-all disabled:opacity-20 flex items-center justify-between px-10 group rounded-none"
                        >
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[12px] font-black uppercase tracking-[0.3em]">PAGAR COM PIX</span>
                                <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">PAGAMENTO INSTANTÂNEO</span>
                            </div>
                            <QrCode className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleCheckout("CREDIT")}
                                disabled={cart.length === 0 || isProcessing}
                                className="h-20 bg-black border border-white/10 text-white hover:border-white hover:bg-white hover:text-black transition-all disabled:opacity-20 flex items-center flex-col justify-center gap-2 rounded-none"
                            >
                                <CreditCard className="h-5 w-5" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">CARTÃO</span>
                            </button>

                            <button
                                onClick={() => handleCheckout("CASH")}
                                disabled={cart.length === 0 || isProcessing}
                                className="h-20 bg-black border border-white/10 text-white hover:border-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all disabled:opacity-20 flex items-center flex-col justify-center gap-2 rounded-none"
                            >
                                <Banknote className="h-5 w-5" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">DINHEIRO</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isPixModalOpen && (
                <PixPaymentModal
                    total={cartTotal}
                    onConfirm={() => handleCheckout("PIX")}
                    onClose={() => setIsPixModalOpen(false)}
                />
            )}
        </div>
    );
}

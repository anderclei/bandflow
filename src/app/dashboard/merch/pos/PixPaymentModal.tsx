import { QrCode, X, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface PixPaymentModalProps {
    total: number;
    onConfirm: () => void;
    onClose: () => void;
}

export function PixPaymentModal({ total, onConfirm, onClose }: PixPaymentModalProps) {
    const [copied, setCopied] = useState(false);

    const pixKey = "financeiro@bandmanager.com.br"; // Exemplo de chave
    const pixCopyPaste = "00020126580014BR.GOV.BCB.PIX0114" + pixKey.replace(/[@.]/g, '') + "5204000053039865404" + total.toFixed(2) + "5802BR5913BANDFLOW00006008BRASILIA62070503***6304";

    const handleCopy = () => {
        navigator.clipboard.writeText(pixCopyPaste);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-950/90 border border-white/10 w-full max-w-md rounded-3xl shadow-[0_0_50px_rgba(0,180,180,0.1)] overflow-hidden animate-in zoom-in duration-300 relative">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00B4B4]/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-[#00B4B4]" />
                        Pagamento via PIX
                    </h3>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center text-center relative z-10">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Total a Pagar</p>
                    <div className="text-4xl font-black text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                    </div>

                    <p className="text-zinc-400 text-sm mb-6">Escaneie o QR Code abaixo</p>

                    <div className="relative group mb-8">
                        <div className="absolute -inset-4 bg-[#00B4B4]/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-white p-4 rounded-3xl shadow-2xl border-4 border-white">
                            <QrCode className="h-48 w-48 text-zinc-950" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-[2px] rounded-2xl">
                                <span className="text-xs font-black text-zinc-900 uppercase tracking-widest">QR Code Demonstrativo</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-4 text-sm font-bold text-white hover:bg-white/10 active:scale-[0.98] transition-all"
                        >
                            {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> : <Copy className="h-5 w-5 text-zinc-400" />}
                            {copied ? "Código Copiado!" : "Copiar Pix Copia e Cola"}
                        </button>

                        <button
                            onClick={onConfirm}
                            className="w-full rounded-2xl bg-gradient-to-r from-[#00B4B4] to-emerald-500 py-4 text-white font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,180,180,0.3)] hover:shadow-[0_0_30px_rgba(0,180,180,0.5)] active:scale-[0.98] hover:scale-[1.02] transition-all"
                        >
                            Confirmar Pagamento
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 border-t border-white/5 p-4 text-center relative z-10">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                        O estoque será atualizado automaticamente
                    </p>
                </div>
            </div>
        </div>
    );
}

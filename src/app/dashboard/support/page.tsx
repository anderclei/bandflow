"use client";

import { useState, useEffect } from "react";
import { getTickets, createTicket, replyToTicket } from "@/app/actions/support";
import { toast } from "sonner";
import { LifeBuoy, Plus, MessageSquare, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function BandSupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);

    // Form states
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("GENERAL");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        const res = await getTickets(); 
        if (res.success && res.tickets) {
            setTickets(res.tickets);
        } else {
            toast.error(res.error || "Erro ao carregar chamados.");
        }
        setLoading(false);
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        const res = await createTicket({ subject, category, priority: "NORMAL", message });
        if (res.success) {
            toast.success("Chamado aberto com sucesso!");
            setIsCreating(false);
            setSubject("");
            setMessage("");
            loadTickets();
        } else {
            toast.error(res.error);
        }
        setSending(false);
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;
        setSending(true);
        const res = await replyToTicket(selectedTicket.id, replyText);
        if (res.success) {
            toast.success("Mensagem enviada!");
            setReplyText("");
            loadTickets();
            setSelectedTicket((prev: any) => ({
                ...prev,
                _count: { messages: (prev._count?.messages || 0) + 1 }
            }));
        } else {
            toast.error(res.error);
        }
        setSending(false);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-red-500">
                            <LifeBuoy className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                Suporte <span className="text-zinc-600">& Ajuda</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">CENTRAL DE ATENDIMENTO</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">CONEXÃO ATIVA</span>
                            </div>
                        </div>
                    </div>
                </div>
                {!isCreating && !selectedTicket && (
                    <button 
                        onClick={() => setIsCreating(true)} 
                        className="bg-red-600 px-8 py-4 text-[10px] font-black uppercase tracking-[.4em] text-white hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(220,38,38,0.1)] active:scale-95 flex items-center gap-3 font-heading"
                    >
                        <Plus className="w-4 h-4" /> NOVO CHAMADO
                    </button>
                )}
            </div>

            {isCreating ? (
                <div className="bg-zinc-900/40 border border-white/5 p-10 max-w-2xl relative overflow-hidden group shadow-2xl">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-600/5 blur-[40px] rounded-full pointer-events-none" />
                    <h2 className="text-[12px] font-black uppercase tracking-[.5em] text-[#ccff00] mb-8">ABRIR SOLICITAÇÃO</h2>
                    <form onSubmit={handleCreateTicket} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">ASSUNTO</label>
                            <input 
                                required
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="Ex: Erro ao gerar contrato, Dúvida financeira..." 
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-800" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">SETOR RESPONSÁVEL</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-red-500/50 appearance-none rounded-none cursor-pointer"
                                title="Selecione a categoria do chamado"
                            >
                                <option value="GENERAL">DÚVIDA GERAL</option>
                                <option value="TECHNICAL">SUPORTE TÉCNICO (ERROS)</option>
                                <option value="BILLING">FINANCEIRO / COBRANÇA</option>
                                <option value="FEATURE_REQUEST">SUGESTÕES E MELHORIAS</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">MENSAGEM DETALHADA</label>
                            <textarea 
                                required
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Conte em detalhes como podemos te ajudar..." 
                                className="w-full h-40 bg-black border border-white/10 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-900 resize-none" 
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                            <button type="button" onClick={() => setIsCreating(false)} className="h-14 px-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors">CANCELAR</button>
                            <button type="submit" disabled={sending} className="h-14 px-10 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(220,38,38,0.1)] active:scale-95 font-heading">
                                {sending ? "ENVIANDO..." : "ENVIAR CHAMADO"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : selectedTicket ? (
                <div className="bg-zinc-900/40 border border-white/5 flex flex-col max-h-[800px] relative overflow-hidden group shadow-3xl">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-600/5 blur-[40px] rounded-full pointer-events-none" />
                    
                    <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between bg-black/40 gap-6">
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                        <button 
                            onClick={() => setSelectedTicket(null)} 
                            className="w-12 h-12 flex items-center justify-center bg-black border border-white/5 text-zinc-600 hover:text-white transition-colors"
                            title="Voltar"
                        >
                            <Plus className="w-4 h-4 rotate-45" />
                        </button>
                            <div>
                                <h2 className="text-[12px] font-black uppercase tracking-widest text-white leading-tight">{selectedTicket.subject}</h2>
                                <p className="text-[8px] font-black uppercase tracking-[.4em] text-zinc-600 mt-1">STATUS: {selectedTicket.status === 'OPEN' ? 'ABERTO' : selectedTicket.status === 'IN_PROGRESS' ? 'EM ANÁLISE' : 'CONCLUÍDO'}</p>
                            </div>
                        </div>
                        <span className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest ${selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {selectedTicket.status === 'RESOLVED' ? "FINALIZADO" : "EM ATENDIMENTO"}
                        </span>
                    </div>

                    <div className="flex-1 p-10 overflow-y-auto space-y-10 min-h-[400px]">
                        <div className="p-6 bg-amber-500/5 border border-amber-500/10 text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/70 flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="leading-relaxed">Aguardando resposta de nossa equipe. Você será notificado assim que houver uma atualização.</p>
                        </div>
                    </div>

                    {selectedTicket.status !== 'CLOSED' && selectedTicket.status !== 'RESOLVED' && (
                        <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row gap-4">
                            <input 
                                type="text"
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Escreva sua mensagem aqui..."
                                className="flex-1 h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-red-500/50 placeholder:text-zinc-900"
                            />
                            <button 
                                onClick={handleReply} 
                                disabled={sending || !replyText.trim()} 
                                className="w-full sm:w-20 h-14 flex items-center justify-center bg-red-600 text-white hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl"
                                title="Enviar Resposta"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ) : loading ? (
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-900/40 border border-white/5 animate-pulse"></div>)}
                </div>
            ) : tickets.length === 0 ? (
                <div className="p-20 bg-zinc-900/20 border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-40">
                    <div className="w-20 h-20 bg-black border border-white/5 flex items-center justify-center text-zinc-900 mb-8 scale-150 shadow-2xl">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-zinc-700">SEM PENDÊNCIAS</h3>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-800 mt-4 max-w-xs">Nenhum chamado aberto no momento. Tudo operando normalmente.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className="p-8 bg-zinc-900/40 border border-white/5 hover:border-red-500/30 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-center group gap-6 shadow-xl"
                        >
                            <div className="flex gap-6 items-center w-full">
                                <div className={`w-14 h-14 flex items-center justify-center shadow-2xl ${ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-black uppercase tracking-widest text-white group-hover:text-red-500 transition-colors">{ticket.subject.toUpperCase()}</h3>
                                    <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[.4em] text-zinc-600 mt-2">
                                        <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                                        <span className="bg-black border border-white/5 px-2 py-0.5 text-zinc-500">
                                            {ticket.category === 'GENERAL' ? 'DÚVIDA GERAL' : ticket.category === 'TECHNICAL' ? 'SUPORTE TÉCNICO' : ticket.category === 'BILLING' ? 'FINANCEIRO' : 'SUGESTÃO'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto text-right">
                                <span className={`text-[8px] font-black uppercase tracking-[0.5em] px-4 py-2 border ${ticket.status === 'OPEN' ? 'text-red-500 border-red-500/20 bg-red-500/5' : ticket.status === 'IN_PROGRESS' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'}`}>
                                    {ticket.status === 'OPEN' ? 'EM FILA' : ticket.status === 'IN_PROGRESS' ? 'EM ANÁLISE' : 'RESOLVIDO'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

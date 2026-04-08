"use client";

import { useState, useEffect } from "react";
import { getTickets, replyToTicket, updateTicketStatus } from "@/app/actions/support";
import { toast } from "sonner";
import { LifeBuoy, Search, Filter, MessageSquare, Clock, CheckCircle2, User, Building2, Send, Terminal, Zap, Shield } from "lucide-react";

export default function SuperAdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("OPEN"); 
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        const res = await getTickets();
        if (res.success && res.tickets) {
            setTickets(res.tickets);
        } else {
            toast.error(res.error || "Erro ao carregar tickets");
        }
        setLoading(false);
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;
        setSending(true);
        const res = await replyToTicket(selectedTicket.id, replyText);
        if (res.success) {
            toast.success("Resposta enviada!");
            setReplyText("");
            loadTickets();
            setSelectedTicket((prev: any) => ({
                ...prev,
                status: "IN_PROGRESS",
                _count: { messages: (prev._count?.messages || 0) + 1 }
            }));
        } else {
            toast.error(res.error);
        }
        setSending(false);
    };

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        const res = await updateTicketStatus(ticketId, newStatus);
        if (res.success) {
            toast.success("Status atualizado!");
            loadTickets();
        } else {
            toast.error("Erro ao atualizar status");
        }
    };

    const filteredTickets = tickets.filter(t => filter === "ALL" ? true : t.status === filter);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
             {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">Sincronização de <span className="text-zinc-600">Suporte</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Stream de Helpdesk Ativo</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Pacotes de Entrada</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-none">
                    {["OPEN", "IN_PROGRESS", "RESOLVED", "ALL"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-[#ccff00] text-black" : "text-zinc-600 hover:text-white"}`}
                        >
                            {f === "OPEN" ? "Abertos" : f === "IN_PROGRESS" ? "Andamento" : f === "RESOLVED" ? "Resolvidos" : "Todos"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-900/50 border border-white/5"></div>)}
                </div>
            ) : (
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Lista de Chamados */}
                    <div className="lg:col-span-1 space-y-3 h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredTickets.length === 0 ? (
                            <div className="text-center p-10 bg-zinc-900/20 border border-dashed border-zinc-800">
                                <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">Pilha Vazia</p>
                            </div>
                        ) : (
                            filteredTickets.map(ticket => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-6 border transition-all cursor-crosshair relative group ${selectedTicket?.id === ticket.id ? "bg-[#ccff00]/5 border-[#ccff00]/30" : "bg-zinc-900/40 border-white/5 hover:border-[#ccff00]/20"}`}
                                >
                                    {selectedTicket?.id === ticket.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ccff00]" />}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'OPEN' ? 'bg-[#ccff00] shadow-[0_0_10px_#ccff00]' : 'bg-zinc-800'}`} />
                                            <span className="text-[10px] font-black text-white group-hover:text-[#ccff00] transition-colors uppercase tracking-widest">{ticket.subject}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between opacity-50">
                                         <div className="flex items-center gap-2 text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <Building2 className="w-3 h-3" />
                                            <span>{ticket.band?.name}</span>
                                        </div>
                                        <span className="text-[8px] font-black text-zinc-600">#{ticket.id.slice(-4).toUpperCase()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Visão de Detalhe e Resposta */}
                    <div className="lg:col-span-3">
                        {selectedTicket ? (
                            <div className="bg-zinc-900 border border-white/10 flex flex-col h-[700px]">
                                {/* Header do Ticket */}
                                <div className="p-8 border-b border-white/5 bg-black/40 flex flex-col sm:flex-row justify-between items-start gap-6">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 block">Inspeção Ativa</span>
                                        <h2 className="text-3xl font-black font-heading uppercase tracking-tighter text-white">{selectedTicket.subject}</h2>
                                        <div className="flex flex-wrap items-center gap-6">
                                            <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-500"><User className="w-3 h-3" /> {selectedTicket.user?.name}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-500"><Building2 className="w-3 h-3" /> {selectedTicket.band?.name}</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-zinc-800 border border-white/5 text-[#ccff00]">{selectedTicket.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <select
                                            value={selectedTicket.status}
                                            onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                                            className="w-full sm:w-auto bg-black border border-white/10 text-[10px] font-black uppercase tracking-widest px-6 py-3 outline-none focus:border-[#ccff00] transition-colors"
                                        >
                                            <option value="OPEN">STATUS: ABERTO</option>
                                            <option value="IN_PROGRESS">STATUS: PROCESSANDO</option>
                                            <option value="RESOLVED">STATUS: RESOLVIDO</option>
                                            <option value="CLOSED">STATUS: ENCERRADO</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 overflow-y-auto space-y-10 custom-scrollbar bg-[#0a0a0a]/50">
                                     <div className="flex gap-6 max-w-4xl opacity-80">
                                        <div className="w-10 h-10 bg-zinc-950 border border-white/5 flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-zinc-800" />
                                        </div>
                                        <div className="p-6 bg-zinc-900 border border-white/5 relative">
                                            <div className="absolute -left-2 top-4 w-4 h-4 bg-zinc-900 border-l border-t border-white/5 rotate-[-45deg]" />
                                            <p className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-4">Pacote de Mensagem do Cliente</p>
                                            <p className="text-xs text-zinc-400 leading-relaxed font-medium uppercase tracking-tight">
                                                *O conteúdo original do cliente seria carregado aqui via `getTicketDetails(ticketId)` na implementação completa do componente.* <br /><br/> Estamos visualizando em modo Overview de Auditoria de Suporte.
                                            </p>
                                        </div>
                                     </div>
                                </div>

                                {/* Área de Resposta */}
                                <div className="p-8 border-t border-white/5 bg-black/40">
                                    <div className="flex gap-4">
                                        <textarea 
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            placeholder="INSERIR PACOTE DE RESPOSTA..."
                                            className="flex-1 resize-none bg-black border border-white/10 p-6 text-[11px] font-medium uppercase tracking-widest outline-none focus:border-[#ccff00] transition-all min-h-[120px] placeholder:text-zinc-900"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-6">
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">Aviso: Respostas Oficiais Ativas</p>
                                        <button 
                                            onClick={handleReply}
                                            disabled={sending || !replyText.trim()}
                                            className="px-10 py-4 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all hover:bg-white disabled:opacity-30"
                                            title="Enviar Resposta"
                                        >
                                            {sending ? "TRANSMITINDO..." : <><Send className="w-4 h-4 shadow-[0_0_5px_rgba(0,0,0,0.2)]" /> Executar Resposta</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-20 bg-zinc-900/10 border border-dashed border-zinc-900">
                                <Zap className="w-16 h-16 text-zinc-800 mb-8" />
                                <h3 className="text-xl font-black font-heading uppercase tracking-widest text-zinc-700">Sem Alvo Selecionado</h3>
                                <p className="text-zinc-900 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm mx-auto mt-4">Selecione um pacote de suporte para iniciar a inspeção.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageCircle, X, Send, Sparkles, User, Bot, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function EPKChat({ bandId, bandName, primaryColor }: { bandId: string, bandName: string, primaryColor?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // In AI SDK v6, we use Transports for communication
    const transport = useMemo(() => new DefaultChatTransport({ 
        api: "/api/ai/epk-chat",
        body: { bandId }
    }), [bandId])

    const { messages, sendMessage, status, error } = useChat({
        transport,
        messages: [
            { id: 'welcome', role: 'assistant', content: `Olá! Sou o assistente oficial de ${bandName}. Como posso te ajudar com sua reserva ou dúvidas técnicas hoje? 🎸` }
        ]
    } as any)

    const isLoading = status === 'streaming' || status === 'submitted'

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const currentInput = input
        setInput("")
        
        try {
            await sendMessage({ text: currentInput })
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen])

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            {/* Chat Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Fechar chat" : "Falar com o assistente"}
                className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white shadow-[0_8px_32px_rgba(var(--secondary),0.4)] transition-all hover:scale-105 active:scale-95"
            >
                <div className="absolute -inset-1 rounded-full bg-secondary opacity-20 blur group-hover:opacity-40 transition-opacity animate-pulse" />
                {isOpen ? <X className="h-6 w-6 relative" /> : <MessageCircle className="h-6 w-6 relative" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[90vw] max-w-[380px] h-[550px] max-h-[70vh] flex flex-col rounded-[2rem] bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-secondary/20 to-purple-950/20 border-b border-white/5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Assistente {bandName}</h4>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.1em] font-black">Online & Pronto para Agendar</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
                        {messages.map((m: any) => (
                            <div key={m.id} className={cn("flex flex-col gap-1.5", m.role === "user" ? "items-end" : "items-start")}>
                                <div className={cn("flex items-center gap-2 mb-1", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                                    <div className={cn("p-1 rounded-lg", m.role === "user" ? "bg-zinc-800" : "bg-secondary/10")}>
                                        {m.role === "user" ? <User className="h-3 w-3 text-zinc-400" /> : <Bot className="h-3 w-3 text-secondary" />}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                                        {m.role === "user" ? "Você" : bandName}
                                    </span>
                                </div>
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed",
                                    m.role === "user" 
                                        ? "bg-zinc-800 text-white rounded-tr-none" 
                                        : "bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-zinc-500 p-2">
                                <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                                <span className="text-xs italic">Digitando...</span>
                            </div>
                        )}
                        {error && (
                            <div className="text-[10px] text-red-500 p-2 text-center bg-red-500/10 rounded-lg">
                                Erro de conexão com a IA. Tente novamente.
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-4 bg-zinc-900/50 border-t border-white/5">
                        <div className="relative flex items-center">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Dúvidas sobre show ou datas?"
                                className="w-full rounded-2xl bg-zinc-900 border-zinc-800 p-3.5 pr-12 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-secondary/50"
                            />
                            <button
                                type="submit"
                                title="Enviar mensagem"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 rounded-xl bg-secondary text-white disabled:opacity-30 disabled:grayscale transition-all"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

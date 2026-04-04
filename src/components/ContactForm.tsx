"use client";

import { useState } from "react";
import { sendContactEmail } from "@/app/actions/email";
import { Send, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
    bandId: string;
}

export function ContactForm({ bandId }: ContactFormProps) {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");

        const formData = new FormData(e.currentTarget);
        formData.append("bandId", bandId);

        try {
            const result = await sendContactEmail(formData);
            if (result.success) {
                setStatus("success");
                e.currentTarget.reset();
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-[2rem] text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h3 className="text-2xl font-bold">Mensagem Enviada!</h3>
                <p>A banda entrará em contato com você em breve.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-6 py-2 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
                >
                    Enviar outra mensagem
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 border border-white/10 p-8 rounded-[2rem]">
            <h3 className="text-2xl font-bold mb-6">Entre em Contato</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Seu Nome</label>
                    <input
                        name="name"
                        required
                        className="w-full rounded-xl bg-black/50 border-white/10 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-zinc-600"
                        placeholder="Ex: João Silva"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Seu E-mail</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-xl bg-black/50 border-white/10 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-zinc-600"
                        placeholder="Ex: joao@email.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Mensagem</label>
                <textarea
                    name="message"
                    required
                    className="w-full rounded-xl bg-black/50 border-white/10 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-zinc-600 h-32 resize-none"
                    placeholder="Sua proposta, dúvida ou orçamento..."
                />
            </div>

            <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-sm font-bold text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 mt-4"
            >
                {status === "sending" ? (
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Send className="w-5 h-5" />
                )}
                Enviar Mensagem
            </button>

            {status === "error" && (
                <p className="text-red-400 text-sm text-center mt-2">
                    Erro ao enviar mensagem. Tente novamente mais tarde.
                </p>
            )}
        </form>
    );
}

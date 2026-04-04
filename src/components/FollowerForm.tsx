"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { createFollower } from "@/app/actions/fans";

export function FollowerForm({ bandId, bandName }: { bandId: string, bandName: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        const formData = new FormData(e.currentTarget);

        const res = await createFollower(bandId, formData);

        if (res?.error) {
            setStatus("error");
            setMessage(res.error);
        } else {
            setStatus("success");
            setMessage(res?.message || "Inscrição confirmada!");
        }
    };

    if (status === "success") {
        return (
            <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 p-8 text-center ring-1 ring-emerald-200 dark:ring-emerald-800">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 mb-4">
                    <Check className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">Você faz parte da família!</h3>
                <p className="text-emerald-600 dark:text-emerald-400">
                    Obrigado por apoiar {bandName}. Você receberá novidades em breve.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-3xl bg-zinc-900 p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-emerald-500 rounded-full blur-[64px] opacity-20 group-hover:opacity-40 transition-opacity" />

            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Mail className="text-emerald-500" />
                Siga a Banda
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">
                Entre para a lista VIP e seja o primeiro a saber sobre novos shows, lançamentos e merch exclusivo de {bandName}.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    name="email"
                    placeholder="Seu melhor e-mail"
                    required
                    className="flex-1 rounded-xl bg-white/10 border border-white/10 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-zinc-500"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 px-6 rounded-xl bg-emerald-500 font-bold text-white hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                >
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Inscrever"}
                </button>
            </form>

            {status === "error" && (
                <p className="text-red-400 text-xs mt-3">{message}</p>
            )}
        </div>
    );
}

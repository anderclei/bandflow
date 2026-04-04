"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";

export function DateRangePicker() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fromVal = formData.get("from") as string;
        const toVal = formData.get("to") as string;

        const params = new URLSearchParams();
        if (fromVal) params.set("from", fromVal);
        if (toVal) params.set("to", toVal);

        router.push(`/dashboard?${params.toString()}`);
    };

    const handleClear = () => {
        router.push("/dashboard");
    };

    return (
        <form onSubmit={handleApply} className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <input
                    name="from"
                    type="date"
                    defaultValue={from}
                    className="px-2 py-1 text-xs rounded-lg border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-xs text-zinc-400">até</span>
                <input
                    name="to"
                    type="date"
                    defaultValue={to}
                    className="px-2 py-1 text-xs rounded-lg border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
            </div>
            <button
                type="submit"
                className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
            >
                Filtrar
            </button>
            {(from || to) && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1 text-xs font-bold rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 transition-colors"
                >
                    Limpar
                </button>
            )}
        </form>
    );
}

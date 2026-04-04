"use client";

import { extendTrial } from "@/app/actions/super-admin";
import { toast } from "sonner";
import { Plus, Loader2, Zap } from "lucide-react";
import { useState } from "react";

export function ExtendTrialButton({ bandId }: { bandId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExtend = async (days: number) => {
        setIsLoading(true);
        const res = await extendTrial(bandId, days);
        setIsLoading(false);

        if (res.success) {
            toast.success(`Protocol: Trial extended by ${days} days.`);
            window.location.reload();
        } else {
            toast.error(res.error || "Extension protocol failed.");
        }
    };

    return (
        <div className="flex items-center gap-1">
            <button
                disabled={isLoading}
                onClick={() => handleExtend(7)}
                className="text-[8px] bg-zinc-950 border border-white/5 text-zinc-600 hover:text-[#ccff00] hover:border-[#ccff00]/50 px-2 py-1 flex items-center font-black uppercase tracking-widest transition-all disabled:opacity-20"
            >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-2.5 h-2.5 mr-1" />} +7D
            </button>
            <button
                disabled={isLoading}
                onClick={() => handleExtend(15)}
                className="text-[8px] bg-zinc-950 border border-white/5 text-zinc-600 hover:text-[#ccff00] hover:border-[#ccff00]/50 px-2 py-1 flex items-center font-black uppercase tracking-widest transition-all disabled:opacity-20"
            >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-2.5 h-2.5 mr-1" />} +15D
            </button>
        </div>
    );
}

"use client";

import React, { ReactNode } from "react";
import { FeatureKey, hasFeature, SubscriptionPlan } from "@/lib/feature-flags";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FeatureGuardProps {
    plan: SubscriptionPlan | string | undefined | null;
    feature: FeatureKey;
    children: ReactNode;
    fallbackTitle?: string;
    fallbackDescription?: string;
}

export function FeatureGuard({
    plan,
    feature,
    children,
    fallbackTitle = "Recurso Exclusivo",
    fallbackDescription = "Esta funcionalidade requer um plano superior para ser acessada."
}: FeatureGuardProps) {
    const isAllowed = hasFeature(plan, feature);

    if (isAllowed) {
        return <>{children}</>;
    }

    // Blurred/Locked State
    return (
        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center border border-white/5 bg-black/60 backdrop-blur-sm overflow-hidden group">
            {/* Faux content blurred out to simulate the real thing behind the paywall */}
            <div className="absolute inset-0 p-12 blur-xl opacity-10 select-none overflow-hidden grayscale pointer-events-none" aria-hidden="true">
                <div className="h-10 w-1/4 bg-zinc-800 mb-12" />
                <div className="grid grid-cols-3 gap-10 mb-12">
                    <div className="h-40 bg-zinc-800 border border-white/10" />
                    <div className="h-40 bg-zinc-800 border border-white/10" />
                    <div className="h-40 bg-zinc-800 border border-white/10" />
                </div>
                <div className="h-96 bg-zinc-800 border border-white/10" />
            </div>

            {/* Paywall Overlay */}
            <div className="relative z-10 max-w-lg mx-auto text-center p-12 bg-black border border-[#ccff00]/20 shadow-[0_0_100px_rgba(204,255,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent" />
                
                <div className="mx-auto w-20 h-20 bg-zinc-900 border border-white/5 text-[#ccff00] flex items-center justify-center mb-10 shadow-2xl relative">
                    <div className="absolute -inset-4 border border-[#ccff00]/10 animate-pulse" />
                    <Lock className="w-10 h-10" />
                </div>
                
                <h3 className="text-3xl font-black font-heading tracking-tighter text-white mb-4 uppercase leading-none">
                    Protocol <span className="text-zinc-600">_Locked</span>
                </h3>
                
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="h-px w-8 bg-zinc-800" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">{fallbackTitle}</span>
                    <span className="h-px w-8 bg-zinc-800" />
                </div>

                <p className="text-[10px] text-zinc-500 mb-12 leading-relaxed font-black uppercase tracking-widest max-w-sm mx-auto">
                    {fallbackDescription}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/dashboard/settings/billing" className="w-full sm:w-auto">
                        <button className="w-full h-16 px-12 bg-[#ccff00] text-black text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.15)] active:scale-95 flex items-center justify-center gap-4">
                            UPGRADE_LEVEL <Sparkles className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em]">Security_Access_Filter_Enabled_Plan: {String(plan || "FREE")}</p>
                </div>
            </div>
        </div>
    );
}

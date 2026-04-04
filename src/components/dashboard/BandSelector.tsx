"use client";

import { useState } from "react";
import { ChevronDown, Check, Music, Plus } from "lucide-react";
import { switchBand } from "@/app/actions/bands";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Band {
    id: string;
    name: string;
    imageUrl?: string | null;
}

interface BandSelectorProps {
    bands: Band[];
    activeBandId: string;
    isCollapsed?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
}

export function BandSelector({ bands, activeBandId, isCollapsed, primaryColor, secondaryColor }: BandSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const activeBand = bands.find((b) => b.id === activeBandId) || bands[0];

    // Primary/Secondary colors for display
    const brandColor = primaryColor || "#10b981";
    const accentColor = secondaryColor || brandColor;

    const handleSwitch = async (id: string) => {
        await switchBand(id);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={bands.length <= 1}
                className={cn(
                    "flex w-full items-center justify-center transition-all",
                    bands.length > 1 ? "hover:scale-105 active:scale-95 cursor-pointer" : "cursor-default",
                    isCollapsed && "mx-auto"
                )}
                title={isCollapsed ? activeBand?.name : ""}
            >
                <div
                    className={cn(
                        "flex items-center justify-center rounded-lg overflow-hidden transition-all",
                        isCollapsed ? "h-10 w-10" : "w-full h-16"
                    )}
                >
                    {activeBand?.imageUrl ? (
                        <img
                            src={activeBand.imageUrl}
                            alt={activeBand.name}
                            className="w-full h-full object-contain grayscale brightness-0 invert"
                        />
                    ) : (
                        <Music className="h-8 w-8 text-white" />
                    )}
                </div>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={cn(
                        "absolute left-0 mt-2 z-50 rounded-xl bg-zinc-900 p-2 shadow-2xl ring-1 ring-white/10 outline-none",
                        isCollapsed ? "w-56 left-4" : "right-0"
                    )}>
                        <div className="space-y-1">
                            {bands.map((band) => (
                                <button
                                    key={band.id}
                                    onClick={() => handleSwitch(band.id)}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${band.id === activeBandId
                                        ? "text-white bg-secondary"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                >
                                    <span className="truncate">{band.name}</span>
                                    {band.id === activeBandId && <Check className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}

"use client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ColorPickerInputProps {
    name: string;
    defaultValue?: string;
    id?: string;
}

export function ColorPickerInput({ name, defaultValue = "#10b981", id }: ColorPickerInputProps) {
    const [color, setColor] = useState(defaultValue);
    const colorInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex gap-2 items-center">
            {/* Swatch clicável que abre o seletor nativo */}
            <div
                style={{ "--swatch-color": color } as React.CSSProperties}
                className={cn(
                    "w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer flex-shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-sm",
                    "bg-[var(--swatch-color)]"
                )}
                onClick={() => colorInputRef.current?.click()}
                title="Clique para escolher a cor"
            />

            {/* Input nativo de cor (escondido — acionado pelo swatch) */}
            <input
                ref={colorInputRef}
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="sr-only"
                title="Seletor de cor nativo"
            />

            {/* Input de texto com o valor hex */}
            <input
                id={id}
                name={name}
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/20 uppercase font-mono"
                placeholder="#000000"
                maxLength={7}
            />
        </div>
    );
}

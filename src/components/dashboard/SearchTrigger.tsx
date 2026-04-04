"use client";

import { Search } from "lucide-react";

export function SearchTrigger() {
    const handleOpenSearch = () => {
        // Dispatch a custom event that CommandPalette listens to, 
        // or simply simulate the Ctrl+K keypress
        const event = new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
            metaKey: true
        });
        window.dispatchEvent(event);
    };

    return (
        <button
            onClick={handleOpenSearch}
            className="text-xs text-secondary font-medium px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors flex items-center gap-2"
        >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">
                <kbd className="font-bold">Ctrl+K</kbd> Buscar
            </span>
            <span className="sm:hidden">Buscar</span>
        </button>
    );
}

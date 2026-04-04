"use client";

import { useRoleStore, UserRole } from "@/store/useRoleStore";
import { Shield, User, Hammer, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: 'ADMIN', label: 'Dono (Admin)', icon: Shield },
    { id: 'PRODUCER', label: 'Produtor', icon: Hammer },
    { id: 'MUSICIAN', label: 'Músico', icon: User },
    { id: 'MERCH_SELLER', label: 'Vendedor', icon: ShoppingBag },
];

export function RoleToggle({ primaryColor }: { primaryColor?: string }) {
    const { currentRole, setRole } = useRoleStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by returning a matching structure on server/initial render
    if (!isMounted) {
        return (
            <div className="flex items-center gap-2 p-2 bg-zinc-900/40 border border-white/5 backdrop-blur-xl h-14" />
        );
    }

    return (
        <div
            className="flex items-center gap-2 p-2 bg-zinc-900/40 border border-white/5 backdrop-blur-xl"
        >
            {roles.map((role) => {
                const Icon = role.icon;
                const isActive = currentRole === role.id;

                return (
                    <button
                        key={role.id}
                        onClick={() => setRole(role.id)}
                        title={role.label}
                        className={cn(
                            "h-10 px-4 transition-all flex items-center gap-3 border",
                            isActive
                                ? "bg-black border-[#ccff00] text-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.1)]"
                                : "bg-transparent border-transparent text-zinc-700 hover:text-white hover:bg-white/5 grayscale"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {isActive && <span className="text-[10px] font-black uppercase tracking-[0.2em]">{role.label}</span>}
                    </button>
                );
            })}
        </div>
    );
}

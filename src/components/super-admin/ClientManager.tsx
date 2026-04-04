"use client";

import { useState } from "react";
import { updateUserLicense } from "@/app/actions/super-admin";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldAlert, ShieldCheck, Save, Search, Terminal, Zap, Shield } from "lucide-react";

export function ClientManager({ initialUsers }: { initialUsers: any[] }) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(initialUsers);
    const [saving, setSaving] = useState<Record<string, boolean>>({});

    const handleSave = async (userId: string, data: any) => {
        setSaving(prev => ({ ...prev, [userId]: true }));
        try {
            const result = await updateUserLicense(userId, data);
            if (result.success) {
                toast.success("Licença atualizada com sucesso!");
                setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            toast.error("Erro inesperado ao salvar");
        } finally {
            setSaving(prev => ({ ...prev, [userId]: false }));
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
             {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">Licenças de <span className="text-zinc-600">Clientes</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Controle de Acesso de Usuário</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Motor de Licenciamento Ativo</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                    <input 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="FILTRAR REGISTRO DE USUÁRIOS..."
                        className="w-full bg-black/50 border border-white/5 py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest placeholder:text-zinc-800 outline-none focus:border-[#ccff00]/50 transition-all"
                        title="Filtrar Usuários"
                    />
                </div>
            </div>

            <div className="border border-white/5 bg-[#0a0a0a] relative overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-900 border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Pacote de Identidade</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">Perms Root</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">Código de Ativação</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">Limite de Instâncias</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">Commit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center relative overflow-hidden">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover grayscale" />
                                                ) : (
                                                    <span className="font-black text-xs text-zinc-700">{user.name?.charAt(0) || "U"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white">{user.name}</div>
                                                <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <Switch
                                                checked={user.isSuperAdmin}
                                                onCheckedChange={(val) => setUsers(users.map(u => u.id === user.id ? { ...u, isSuperAdmin: val } : u))}
                                                className="data-[state=checked]:bg-[#ccff00] data-[state=unchecked]:bg-zinc-800"
                                            />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Root</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <select
                                                value={user.licenseStatus}
                                                onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, licenseStatus: e.target.value } : u))}
                                                className="bg-black border border-white/10 text-[9px] font-black uppercase tracking-widest px-4 py-2 outline-none focus:border-[#ccff00] text-[#ccff00]"
                                                title="Status da Licença"
                                            >
                                                <option value="ACTIVE" className="bg-zinc-950">ATIVO_LIVE</option>
                                                <option value="TRIAL" className="bg-zinc-950 text-white">AVALIAÇÃO</option>
                                                <option value="BLOCKED" className="bg-zinc-950 text-zinc-600">TERMINADO</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <input
                                                type="number"
                                                min={1}
                                                value={user.maxBands}
                                                onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, maxBands: parseInt(e.target.value) || 1 } : u))}
                                                className="w-20 bg-black border border-white/5 py-2 text-center text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50"
                                                title="Máximo de Instâncias"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            disabled={saving[user.id]}
                                            onClick={() => handleSave(user.id, {
                                                licenseStatus: user.licenseStatus,
                                                maxBands: user.maxBands,
                                                isSuperAdmin: user.isSuperAdmin
                                            })}
                                            className="px-6 py-2 bg-zinc-900 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-[#ccff00] hover:text-black transition-all disabled:opacity-30"
                                        >
                                            {saving[user.id] ? "SYNC..." : "COMMIT"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

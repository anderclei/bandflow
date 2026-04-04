"use client";

import { useState } from "react";
import { Plus, Trash2, DollarSign, Users, Percent, Calendar } from "lucide-react";
import { createRoyaltySplit, deleteRoyaltySplit, recordRoyaltyPayment, updateSongPublishing } from "@/app/actions/publishing";

interface SongPublishingDetailsProps {
    song: any;
    members: any[];
}

export function SongPublishingDetails({ song, members }: SongPublishingDetailsProps) {
    const [isSaving, setIsSaving] = useState(false);

    const totalSplits = song.splits.reduce((acc: number, s: any) => acc + s.percentage, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Metadata Section */}
            <div className="rounded-3xl bg-zinc-50 p-6 dark:bg-zinc-800/50">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Metadados da Obra</h3>
                <form action={updateSongPublishing} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="hidden" name="songId" value={song.id} />
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">ISRC</label>
                        <input
                            name="isrc"
                            defaultValue={song.isrc || ""}
                            placeholder="Ex: BR-XXX-YY-00001"
                            className="w-full rounded-xl border-zinc-200 bg-white p-2.5 text-sm dark:bg-zinc-900 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-secondary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">ISWC</label>
                        <input
                            name="iswc"
                            defaultValue={song.iswc || ""}
                            placeholder="Ex: T-034.524.680-1"
                            className="w-full rounded-xl border-zinc-200 bg-white p-2.5 text-sm dark:bg-zinc-900 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-secondary/20"
                        />
                    </div>
                    <div className="sm:col-span-2 text-right">
                        <button
                            type="submit"
                            className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all dark:bg-white dark:text-black"
                        >
                            Salvar Metadados
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Splits Management */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Divisão de Royalties (Splits)
                    </h3>
                    <div className="rounded-3xl border border-zinc-200 p-6 dark:border-zinc-800 space-y-4">
                        <div className="space-y-2">
                            {song.splits.map((split: any) => (
                                <div key={split.id} className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs">
                                            {split.member.user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{split.member.user.name}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase">{split.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-secondary">{split.percentage}%</span>
                                        <button
                                            onClick={() => deleteRoyaltySplit(split.id)}
                                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {song.splits.length === 0 && (
                                <p className="text-center py-8 text-sm text-zinc-500 italic">Nenhum split definido para esta música.</p>
                            )}
                        </div>

                        {/* Add Split Form */}
                        <form action={createRoyaltySplit} className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                            <input type="hidden" name="songId" value={song.id} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <select name="memberId" required className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700">
                                        <option value="">Selecione Integrante</option>
                                        {members.map(m => (
                                            <option key={m.id} value={m.id}>{m.user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <input
                                        name="percentage"
                                        type="number"
                                        step="0.1"
                                        required
                                        placeholder="%"
                                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-2 pr-8 text-xs dark:bg-zinc-800 dark:border-zinc-700"
                                    />
                                    <Percent className="absolute right-2.5 top-2.5 h-3 w-3 text-zinc-400" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <input
                                    name="role"
                                    placeholder="Papel (Ex: Compositor)"
                                    className="flex-1 rounded-xl border-zinc-200 bg-zinc-50 p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700"
                                />
                                <button type="submit" className="p-2 rounded-xl bg-secondary text-white hover:bg-secondary/90 transition-colors">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            {totalSplits > 100 && (
                                <p className="text-[10px] text-red-500 font-bold">Atenção: A soma dos splits ultrapassa 100% ({totalSplits}%)</p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Payments History */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Histórico de Recebimentos
                    </h3>
                    <div className="rounded-3xl border border-zinc-200 p-6 dark:border-zinc-800 space-y-4">
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                            {song.payments.map((payment: any) => (
                                <div key={payment.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase">{payment.source} • {new Date(payment.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                                        <DollarSign className="h-3 w-3" />
                                    </div>
                                </div>
                            ))}
                            {song.payments.length === 0 && (
                                <p className="text-center py-12 text-sm text-zinc-500 italic">Nenhum pagamento registrado.</p>
                            )}
                        </div>

                        {/* Record Payment Form */}
                        <form action={recordRoyaltyPayment} className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                            <input type="hidden" name="songId" value={song.id} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Valor (R$)</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0,00"
                                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Data</label>
                                    <input
                                        name="date"
                                        type="date"
                                        required
                                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <input
                                    name="source"
                                    placeholder="Fonte (Ex: Spotify, ECAD)"
                                    required
                                    className="flex-1 rounded-xl border-zinc-200 bg-zinc-50 p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700"
                                />
                                <button type="submit" className="px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all dark:bg-white dark:text-black font-bold text-xs uppercase tracking-tight">
                                    Lançar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { PlusCircle, Music, Plus, Clock, Paperclip } from "lucide-react";
import { createSong } from "@/app/actions/songs";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SongFileUpload } from "@/components/dashboard/SongFileUpload";

export function AddSongDialog() {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        try {
            await createSong(formData);
            setIsOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error creating song", error);
            alert("Erro ao criar música");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/10">
                    <PlusCircle className="h-4 w-4" />
                    Nova Música
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Music className="h-5 w-5 text-secondary" />
                        Adicionar ao Repertório
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os dados da música e anexe arquivos se necessário.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Título</label>
                            <input
                                name="title"
                                required
                                className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                placeholder="Ex: Paranoid"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Artista (Opcional)</label>
                            <input
                                name="artist"
                                className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                placeholder="Ex: Black Sabbath"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Duração (segundos)</label>
                                <input
                                    name="duration"
                                    type="number"
                                    className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                    placeholder="Ex: 170"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">BPM</label>
                                <input
                                    name="bpm"
                                    type="number"
                                    className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                    placeholder="Ex: 120"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tom</label>
                                <input
                                    name="key"
                                    className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                    placeholder="Ex: Am"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
                                <select
                                    name="status"
                                    className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                >
                                    <option value="READY">Pronta</option>
                                    <option value="IN_PROGRESS">Em Ensaio</option>
                                    <option value="ARCHIVED">Arquivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">ISWC</label>
                                <input
                                    name="iswc"
                                    className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                    placeholder="Ex: T-034.522.680-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cód. Obra (ECAD)</label>
                                <input
                                    name="workId"
                                    className="w-full rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                    placeholder="Ex: 12345678"
                                />
                            </div>
                        </div>

                        <SongFileUpload />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-secondary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-secondary/20"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Cadastrar Música
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

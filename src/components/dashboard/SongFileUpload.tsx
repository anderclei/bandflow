"use client";

import { Paperclip, X } from "lucide-react";
import { useState, useRef } from "react";

export function SongFileUpload() {
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert("O arquivo não pode ter mais de 10MB.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "song");

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setFileUrl(data.url);
            setFileName(file.name);
        } catch (error) {
            console.error(error);
            alert("Erro ao fazer upload do arquivo.");
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFileUrl(null);
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Anexo (Cifra/Partitura)
            </label>
            <input
                type="hidden"
                name="fileUrl"
                value={fileUrl || ""}
            />
            <input
                type="file"
                accept=".pdf,image/*,.doc,.docx"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {fileName ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-secondary/20 bg-secondary/10">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-secondary truncate font-medium">
                            {fileName}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={clearFile}
                        className="p-1 text-secondary hover:text-secondary/80"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-sm text-zinc-500 disabled:opacity-50"
                >
                    {isUploading ? (
                        <span className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Paperclip className="h-4 w-4" />
                    )}
                    {isUploading ? "Enviando..." : "Anexar Arquivo"}
                </button>
            )}
            <p className="text-[10px] text-zinc-400 mt-1">PDF, Imagens ou Docs (Máx 10MB)</p>
        </div>
    );
}

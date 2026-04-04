"use client";

import { Camera, Music } from "lucide-react";
import { useState, useRef } from "react";

interface BandImageUploadProps {
    defaultImage?: string | null;
    fieldName?: string;
    variant?: "avatar" | "logo";
    onUploadComplete?: (url: string) => void;
}

export function BandImageUpload({ 
    defaultImage, 
    fieldName = "imageUrl", 
    variant = "avatar" 
}: BandImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Ensure it's an image
        if (!file.type.startsWith("image/")) {
            alert("Por favor, selecione uma imagem válida.");
            return;
        }

        // Check size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("A imagem não pode ter mais de 5MB.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "logo");

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setPreview(data.url);
        } catch (error) {
            console.error(error);
            alert("Erro ao fazer upload da imagem.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative group">
            <input
                type="hidden"
                name={fieldName}
                value={preview || ""}
            />
            <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
                title="Fazer upload de imagem"
            />

            <div className={`h-24 w-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden relative shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 ${variant === 'logo' ? 'bg-white p-2' : ''}`}>
                {preview ? (
                    <img src={preview} alt="Band image" className={`w-full h-full ${variant === 'logo' ? 'object-contain' : 'object-cover'}`} />
                ) : (
                    <Music className="h-10 w-10" />
                )}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 text-white rounded-3xl opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm disabled:hidden"
                aria-label="Alterar imagem da banda"
            >
                <Camera className="h-6 w-6" />
            </button>
        </div>
    );
}

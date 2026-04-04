"use client"

import { useState } from "react"
import { Globe, Save, Instagram, Youtube, Music, Link as LinkIcon, Camera, Copy, Check } from "lucide-react"
import { updateEpkData } from "@/app/actions/bands"
import { useRouter } from "next/navigation"

export default function EpkEditorClient({ band }: { band: any }) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)

    const parsedLinks = band.socialLinks ? JSON.parse(band.socialLinks) : { instagram: '', youtube: '', spotify: '' }

    const [formData, setFormData] = useState({
        shortBio: band.shortBio || "",
        videoUrl: band.videoUrl || "",
        instagram: parsedLinks.instagram || "",
        youtube: parsedLinks.youtube || "",
        spotify: parsedLinks.spotify || ""
    })

    const epkUrl = typeof window !== 'undefined' 
        ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/epk/${band.slug}` 
        : `/epk/${band.slug}`

    const handleCopy = () => {
        navigator.clipboard.writeText(epkUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSave = async () => {
        setIsSaving(true)
        const socialLinks = JSON.stringify({
            instagram: formData.instagram,
            youtube: formData.youtube,
            spotify: formData.spotify
        })

        await updateEpkData(band.id, {
            shortBio: formData.shortBio,
            videoUrl: formData.videoUrl,
            socialLinks
        })

        setIsSaving(false)
        router.refresh()
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Link Público Section */}
            <div className="bg-black border border-[#ccff00]/20 p-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
                    <div className="space-y-3">
                        <h2 className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-600 mb-1">LINK PÚBLICO (EPK)</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Globe className="h-5 w-5" />
                            </div>
                            <code className="text-[#ccff00] font-black text-xs md:text-lg tracking-tighter bg-zinc-900/50 px-4 py-2 border border-white/5 break-all">{epkUrl}</code>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleCopy} 
                            className="h-14 px-8 bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all flex items-center gap-3 font-heading"
                        >
                            {copied ? <Check className="h-4 w-4 text-[#ccff00]" /> : <Copy className="h-4 w-4" />}
                            {copied ? "COPIADO" : "COPIAR LINK"}
                        </button>
                        <a 
                            href={epkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="h-14 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] flex items-center justify-center gap-3 font-heading"
                        >
                            <Globe className="h-4 w-4" />
                            VISUALIZAR
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Apresentação & Release */}
                <div className="space-y-10 bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group shadow-2xl">
                    <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
                        <div className="w-14 h-14 bg-black border border-white/5 flex items-center justify-center text-[#ccff00] shadow-3xl">
                            <Camera className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter font-heading">
                            APRESENTAÇÃO & RELEASE
                        </h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">BIOGRAFIA RESUMIDA (RELEASE)</label>
                            <textarea
                                className="w-full min-h-[250px] bg-black border border-white/10 p-8 text-[12px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900 resize-none leading-relaxed"
                                placeholder="Descreva a história da banda, estilo musical e principais conquistas de forma profissional..."
                                value={formData.shortBio}
                                onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">VÍDEO DE DESTAQUE (LINK DO YOUTUBE)</label>
                            <div className="relative">
                                <input
                                    className="w-full h-16 bg-black border border-white/10 px-8 text-[12px] font-black tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800">
                                    <Youtube className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2">Cole o link completo do vídeo mais profissional da banda (Clipe ou Show).</p>
                        </div>
                    </div>
                </div>

                {/* Redes Sociais */}
                <div className="space-y-10 bg-zinc-900/40 border border-white/5 p-10 relative overflow-hidden group shadow-2xl">
                    <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
                        <div className="w-14 h-14 bg-black border border-white/5 flex items-center justify-center text-amber-500 shadow-3xl">
                            <LinkIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter font-heading">
                            CONEXÕES & REDES SOCIAIS
                        </h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">INSTAGRAM</label>
                            <div className="relative">
                                <input
                                    className="w-full h-16 bg-black border border-white/10 px-8 text-[12px] font-black tracking-widest text-white outline-none focus:border-pink-500/50 transition-all placeholder:text-zinc-900"
                                    placeholder="https://instagram.com/perfil-oficial"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-500/20">
                                    <Instagram className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">CANAL DO YOUTUBE</label>
                            <div className="relative">
                                <input
                                    className="w-full h-16 bg-black border border-white/10 px-8 text-[12px] font-black tracking-widest text-white outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-900"
                                    placeholder="https://youtube.com/@seu-canal"
                                    value={formData.youtube}
                                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-red-500/20">
                                    <Youtube className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">PERFIL NO SPOTIFY</label>
                            <div className="relative">
                                <input
                                    className="w-full h-16 bg-black border border-white/10 px-8 text-[12px] font-black tracking-widest text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-900"
                                    placeholder="Link do perfil do artista no Spotify"
                                    value={formData.spotify}
                                    onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500/20">
                                    <Music className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full h-20 mt-12 bg-[#ccff00] text-black text-[12px] font-black uppercase tracking-[0.6em] hover:bg-white transition-all shadow-[0_0_50px_rgba(204,255,0,0.15)] active:scale-[0.98] flex items-center justify-center gap-4 font-heading"
                        >
                            {isSaving ? "SALVANDO..." : <><Save className="h-5 w-5" /> SALVAR CONFIGURAÇÕES</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

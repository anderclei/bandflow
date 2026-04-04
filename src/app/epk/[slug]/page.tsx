import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Instagram, Youtube, Download, MapPin, AudioLines, Music, Users, Camera, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"
import { EPKChat } from "@/components/epk/EPKChat"

export default async function EPKPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const band = await prisma.band.findUnique({
        where: { slug: slug },
        include: {
            formats: {
                orderBy: { name: 'asc' }
            },
            members: {
                include: { user: true }
            },
        }
    })

    if (!band) {
        notFound()
    }

    const { primaryColor, secondaryColor, name, imageUrl, shortBio, videoUrl, socialLinks, addressCity, addressState } = band as any
    const parsedLinks = socialLinks ? JSON.parse(socialLinks) : {}

    // Extract YouTube ID for embed
    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const videoId = getYouTubeId(videoUrl);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-secondary/30 selection:text-white font-sans overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen transition-all duration-1000" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] opacity-30 mix-blend-screen transition-all duration-1000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                    <span className="text-secondary">#</span> {name}
                </div>
                <div className="flex items-center gap-4">
                    {parsedLinks.instagram && (
                        <a href={parsedLinks.instagram} title="Visitar Instagram da Banda" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                            <Instagram className="h-5 w-5" />
                        </a>
                    )}
                    {parsedLinks.youtube && (
                        <a href={parsedLinks.youtube} title="Visitar Youtube da Banda" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                            <Youtube className="h-5 w-5" />
                        </a>
                    )}
                    {parsedLinks.spotify && (
                        <a href={parsedLinks.spotify} title="Ouvir Banda no Spotify" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                            <Music className="h-5 w-5" />
                        </a>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center pt-20 pb-20 z-10">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt={name} className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105 animate-slow-zoom" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/50 to-[#0a0a0a]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent h-1/2 bottom-0" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-[#0a0a0a]" />
                    )}
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center space-y-8 max-w-5xl mt-auto">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-zinc-300">
                        <Globe className="h-4 w-4 text-secondary drop-shadow-[0_0_8px_rgba(var(--secondary),0.8)]" />
                        Digital Press Kit
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase drop-shadow-2xl" style={{
                        color: 'white',
                        textShadow: secondaryColor ? `0 0 40px ${secondaryColor}40` : 'none'
                    }}>
                        {name}
                    </h1>

                    {addressCity && (
                        <p className="flex items-center justify-center gap-2 text-zinc-400 font-medium tracking-widest uppercase text-sm">
                            <MapPin className="h-4 w-4 text-secondary" />
                            {addressCity} {addressState && `- ${addressState}`}
                        </p>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 container mx-auto px-6 py-24 max-w-6xl space-y-40">

                {/* Bio & Video */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="space-y-2">
                            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-secondary">Apresentação</h2>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Sobre o Projeto</h3>
                        </div>
                        <div className="w-12 h-1 bg-secondary rounded-full shadow-[0_0_15px_rgba(var(--secondary),0.5)]"></div>
                        <p className="text-xl leading-relaxed text-zinc-400 font-light">
                            {shortBio || "Biografia não disponível no momento. Um artista em ascensão com foco em entregar a melhor performance de palco e criar conexões reais através da música."}
                        </p>

                        <div className="flex gap-4 pt-4">
                            <a href="#rider" className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-white hover:bg-secondary/90 transition-all shadow-[0_0_20px_rgba(var(--secondary),0.4)] hover:shadow-[0_0_30px_rgba(var(--secondary),0.6)]">
                                Ver Necessidades Técnicas
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        {videoId ? (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`}
                                        title={`${name} - Live Performance / Music Video`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            </div>
                        ) : (
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center text-zinc-600 backdrop-blur-sm">
                                <Camera className="h-16 w-16 mb-4 opacity-50" />
                                <p className="text-sm font-medium tracking-widest uppercase">Nenhum vídeo em destaque</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tech Rider Download */}
                <div id="rider" className="scroll-mt-32 space-y-16">
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-xs font-black tracking-[0.2em] uppercase text-secondary">Área Técnica</h2>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Rider & Palco</h3>
                        <p className="text-zinc-500 text-lg">
                            Documentação técnica oficial para produtores e contratantes. Faça o download dos mapas atualizados.
                        </p>
                    </div>

                    {band.formats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {band.formats.map((format: any) => (
                                <div key={format.id} className="group relative bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-zinc-800/60 hover:border-secondary/30 transition-all duration-300 text-center space-y-8 flex flex-col h-full">
                                    <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>

                                    <div className="relative">
                                        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800/50 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-secondary/50 group-hover:shadow-[0_0_20px_rgba(var(--secondary),0.3)] transition-all duration-500">
                                            <AudioLines className="h-8 w-8 text-zinc-400 group-hover:text-secondary transition-colors" />
                                        </div>
                                        <h4 className="font-bold text-xl mt-6 text-zinc-100 group-hover:text-white transition-colors">{format.name}</h4>
                                        <p className="text-sm text-zinc-500 mt-3 font-medium leading-relaxed">
                                            {format.description || "Formato padrão de apresentação. Inclui mapa de palco e input list completo."}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5 relative">
                                        <a href={`/api/rider/${format.id}/download`} target="_blank" className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold px-4 py-4 text-sm hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                                            <Download className="h-4 w-4" />
                                            Baixar Rider Técnico (PDF)
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 rounded-3xl border border-dashed border-white/10 text-center bg-zinc-900/20 backdrop-blur-sm">
                            <AudioLines className="h-12 w-12 mx-auto text-zinc-700 mb-4" />
                            <h3 className="text-xl font-bold text-zinc-400">Nenhum Rider Disponível</h3>
                            <p className="text-zinc-600 mt-2">A banda ainda não publicou nenhum formato de show público.</p>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-purple-900/20 mix-blend-screen"></div>
                    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl"></div>

                    <div className="relative p-12 md:p-20 text-center max-w-3xl mx-auto space-y-8">
                        <Users className="h-12 w-12 mx-auto text-secondary drop-shadow-[0_0_15px_rgba(var(--secondary),0.5)]" />
                        <h3 className="text-3xl md:text-5xl font-bold tracking-tight">Leve o {name} para o seu evento</h3>
                        <p className="text-xl text-zinc-400">
                            Entre em contato com nossa equipe de produção para solicitar um orçamento ou verificar disponibilidade de agenda.
                        </p>
                        <div className="pt-4">
                            {/* Temporary placeholder, could link to a contact form or mailto in the future */}
                            <a href={`mailto:contato@bandmanager.com.br?subject=Interesse em contratar ${name}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-8 py-4 font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Falar com a Produção
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-20 border-t border-white/5 bg-[#050505] py-16 mt-20">
                <div className="container mx-auto px-6 text-center text-sm">
                    <div className="inline-flex items-center gap-2 font-black tracking-[0.2em] uppercase text-zinc-700 mb-6">
                        <Globe className="h-4 w-4" />
                        BandFlow SaaS
                    </div>
                    <p className="text-zinc-600">
                        &copy; {new Date().getFullYear()} {name}. Todos os direitos reservados.
                    </p>
                </div>
            </footer>

            <EPKChat 
                bandId={band.id} 
                bandName={name} 
                primaryColor={primaryColor} 
            />
        </div>
    )
}

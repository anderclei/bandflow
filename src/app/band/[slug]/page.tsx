import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Music, Calendar, MapPin, Clock, Users } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { FollowerForm } from "@/components/FollowerForm";
import { Copy, Heart } from "lucide-react";

export default async function PublicBandPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;

    const band = await prisma.band.findUnique({
        where: { slug } as any,
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            imageUrl: true,
            primaryColor: true,
            secondaryColor: true,
            type: true,
            gigs: {
                where: { date: { gte: new Date() } },
                orderBy: { date: 'asc' },
                select: {
                    id: true,
                    title: true,
                    date: true,
                    location: true,
                    fee: true,
                    taxRate: true,
                    taxAmount: true,
                },

            },
            songs: {
                orderBy: { title: 'asc' },
                select: { id: true, title: true, artist: true },
            },
            members: {
                select: {
                    id: true,
                    role: true,
                    position: true,
                    user: {
                        select: { id: true, name: true, image: true },
                    },
                },
            },
        },
    }) as any;


    if (!band) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* Header & Hero */}
            <header className="relative pt-32 pb-20 overflow-hidden border-b border-white/10">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-500 to-emerald-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {band.imageUrl && (
                        <div className="flex-shrink-0">
                            <img
                                src={band.imageUrl}
                                alt={`Logo da banda ${band.name}`}
                                className="w-48 h-48 rounded-[2rem] object-cover ring-1 ring-white/10 shadow-2xl"
                            />
                        </div>
                    )}
                    <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-medium mb-8 transition-colors">
                            <span className="text-2xl tracking-tight">BandFlow</span>
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{band.name}</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8">
                            {band.description || "Ainda não definiu uma descrição, mas com certeza é uma banda incrível! 🎸"}
                        </p>

                        {/* Top Actions: Social Links & Tip Jar */}
                        <div className="flex flex-wrap items-center gap-4">
                            {(band as any).instagram && (
                                <a href={`https://instagram.com/${(band as any).instagram}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </a>
                            )}
                            {(band as any).spotify && (
                                <a href={(band as any).spotify} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><path d="M8 11.973c2.5-1.473 5.5-.473 7.5.527" /><path d="M9 15c1.5-1 4-1 5 .5" /><path d="M7 9c3-2 6-2 9 0" /></svg>
                                </a>
                            )}
                            {(band as any).youtube && (
                                <a href={(band as any).youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                                </a>
                            )}

                            {/* Tip Jar (Demostration Placeholder) */}
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-transform hover:scale-105 ml-auto md:ml-4 shadow-lg shadow-emerald-500/20">
                                <Heart className="h-4 w-4" />
                                Apoiar Banda (PIX)
                            </button>
                        </div>
                    </div>
                </div>
            </header>


            <main className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Gigs */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Calendar className="text-emerald-500 h-8 w-8" />
                                Próximos Shows
                            </h2>
                            {band.gigs.length > 0 ? (
                                <div className="grid gap-6">
                                    {band.gigs.map((gig: any) => (
                                        <div key={gig.id} className="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 min-w-[80px]">
                                                        <span className="text-2xl font-bold">{new Date(gig.date).getDate()}</span>
                                                        <span className="text-xs uppercase font-black">{new Date(gig.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-500 transition-colors">{gig.title}</h3>
                                                        <div className="flex flex-wrap gap-4 text-zinc-500 dark:text-zinc-400">
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <MapPin className="h-4 w-4" />
                                                                {gig.location}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Clock className="h-4 w-4" />
                                                                {new Date(gig.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="px-6 py-3 rounded-full bg-zinc-900 dark:bg-white dark:text-black text-white font-bold hover:scale-105 transition-transform">
                                                    Ver Detalhes
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center rounded-3xl bg-zinc-100 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                    <p className="text-zinc-500">Nenhum show público confirmado no momento. Fique ligado!</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Repertoire & Team */}
                    <div className="space-y-16">
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Music className="text-emerald-500 h-6 w-6" />
                                Repertório
                            </h2>
                            <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 text-black dark:text-white">
                                {band.songs.length > 0 ? (
                                    <ul className="space-y-4">
                                        {band.songs.slice(0, 10).map((song: any) => (
                                            <li key={song.id} className="flex flex-col border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                                                <span className="font-bold">{song.title}</span>
                                                <span className="text-sm text-zinc-500">{song.artist}</span>
                                            </li>
                                        ))}
                                        {band.songs.length > 10 && (
                                            <li className="pt-2 text-center">
                                                <p className="text-sm text-zinc-400">E mais {band.songs.length - 10} músicas incríveis...</p>
                                            </li>
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-zinc-500 text-center py-4">Repertório sendo atualizado.</p>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Users className="text-emerald-500 h-6 w-6" />
                                Integrantes
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {band.members.map((member: any) => (
                                    <div key={member.id} className="group relative">
                                        {member.user.image ? (
                                            <img src={member.user.image} alt={member.user.name || ""} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-emerald-500 transition-all" />
                                        ) : (
                                            <div className="h-16 w-16 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-all">
                                                <Music className="h-8 w-8" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded bg-zinc-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {member.user.name} ({member.role.toLowerCase()})
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="contact">
                            <ContactForm bandId={band.id} />
                        </section>

                        <section id="newsletter">
                            <FollowerForm bandId={band.id} bandName={band.name} />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

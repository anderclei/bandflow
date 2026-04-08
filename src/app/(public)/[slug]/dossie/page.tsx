import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FileText, Download, ShieldCheck, DownloadCloud } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
    params: {
        slug: string;
    };
    searchParams: {
        docs?: string;
    }
}

export default async function PublicDossierPage({ params, searchParams }: PageProps) {
    const slug = params.slug;
    const docIdsStr = searchParams.docs;

    if (!docIdsStr) {
        return notFound();
    }

    const docIds = docIdsStr.split(',').filter(Boolean);

    if (docIds.length === 0) {
        return notFound();
    }

    // 1. Validate Band
    const band = await prisma.band.findUnique({
        where: { slug }
    });

    if (!band) {
        return notFound();
    }

    // 2. Load requested Documents
    const documents = await prisma.document.findMany({
        where: {
            id: { in: docIds },
            bandId: band.id // Ensures documents actually belong to this band
        },
        orderBy: {
            category: 'asc' // Groups CNDs, CONTRATOS, etc together
        }
    });

    if (documents.length === 0) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-black font-sans text-white p-6 sm:p-12 lg:p-20">
            {/* Main Content */}
            <main className="max-w-6xl mx-auto space-y-20">
                <div className="flex flex-col gap-10 border-b border-white/5 pb-20">
                    <div className="flex items-start justify-between gap-10">
                        <div className="space-y-6">
                            <div className="h-20 w-20 flex items-center justify-center bg-[#ccff00] text-black font-black text-4xl rounded-none shadow-[0 0 50px rgba(204,255,0,0.2)]">
                                {band.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-6xl font-black font-heading tracking-tighter uppercase leading-none">{band.name}</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 mt-4 outline-none">REGISTRO DE HABILITAÇÃO E INEXIGIBILIDADE</p>
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col items-end gap-4">
                            <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 px-6 py-2 rounded-none flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Acesso Autenticado</span>
                            </div>
                            <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">ID SESSÃO: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/2 blur-[100px] pointer-events-none" />
                        <div className="flex items-start gap-10 relative z-10">
                            <div className="h-16 w-16 bg-black border border-white/10 flex items-center justify-center text-[#ccff00] shrink-0">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-2xl font-black font-heading uppercase text-white tracking-widest leading-none">Documentação Digital <span className="text-[#ccff00]">[{documents.length}]</span></h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 max-w-xl">
                                    ESTE ESPAÇO CONTÉM A DOCUMENTAÇÃO OFICIAL LIBERADA PELA PRODUÇÃO PARA FINS DE HABILITAÇÃO HABILITAÇÃO E CONTRATAÇÃO PÚBLICA.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="flex items-center gap-6">
                        <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white">OBJETOS DISPONÍVEIS</h3>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {documents.map((doc: any) => {
                            const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();

                            return (
                                <div key={doc.id} className="bg-zinc-900/40 border border-white/5 p-10 flex flex-col justify-between gap-10 transform transition-all group hover:border-[#ccff00]/40 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#ccff00]/5 overflow-hidden" />
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">{doc.category}</span>
                                            {doc.expiryDate && (
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 border ${isExpired ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-[#ccff00]/5 border-[#ccff00]/20 text-zinc-500'}`}>
                                                    {isExpired ? "EXPI PROTOCOL" : "VALI PROTOCOL"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-[#ccff00] transition-colors">{doc.title}</h4>
                                            {doc.expiryDate && (
                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">LIM REF: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}</p>
                                            )}
                                        </div>
                                    </div>

                                    <a
                                        href={doc.fileUrl}
                                        target=" blank"
                                        rel="noopener noreferrer"
                                        className="h-16 w-full flex items-center justify-center gap-4 bg-black border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-[#ccff00] hover:text-black hover:border-transparent transition-all"
                                    >
                                        <DownloadCloud className="w-5 h-5" />
                                        EXTRAIR DADO PDF
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center pt-24 border-t border-white/5">
                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.6em]">
                        DOCUMENTOS PROCESSADOS VIA <a href="#" className="text-zinc-600 hover:text-[#ccff00] transition-colors">BANDFLOW SYSTEM</a>
                    </p>
                </div>
            </main>
        </div>
    );
}

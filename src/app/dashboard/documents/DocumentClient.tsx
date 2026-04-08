"use client";

import { useState } from "react";
import { FolderOpen, Upload, FileText, Trash2, AlertCircle, FileKey, ShieldAlert, CreditCard, ChevronDown, Wand2, CheckCircle2 } from "lucide-react";
import { createDocument, deleteDocument } from "@/app/actions/documents";
import { generateEcadRepertoire } from "@/app/actions/ecad-gen";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Document {
    id: string;
    title: string;
    category: string;
    fileUrl: string;
    expiryDate: Date | null;
    member?: { user: { name: string } } | null;
}

interface Member {
    id: string;
    user: { name: string };
}

interface DocumentClientProps {
    initialDocuments: Document[];
    members: Member[];
    bandId: string;
    setlists?: any[];
}

export function DocumentClient({ initialDocuments, members, bandId, setlists = [] }: DocumentClientProps) {
    const [documents, setDocuments] = useState(initialDocuments);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [genResult, setGenResult] = useState<any>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("CND");
    const [memberId, setMemberId] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const isExpired = (date: Date | null) => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    const isExpiringSoon = (date: Date | null) => {
        if (!date) return false;
        const diffTime = Math.abs(new Date(date).getTime() - new Date().getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "document");

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");

            const { url } = await uploadRes.json();

            const docFormData = new FormData();
            docFormData.append("title", title);
            docFormData.append("category", category);
            if (expiryDate) docFormData.append("expiryDate", expiryDate);
            if (memberId) docFormData.append("memberId", memberId);

            await createDocument(bandId, url, docFormData);

            setTitle("");
            setFile(null);
            setExpiryDate("");
            setMemberId("");

            window.location.reload();

        } catch (error) {
            console.error("Error creating document", error);
            alert("Erro ao enviar documento");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este documento?")) {
            await deleteDocument(id);
            setDocuments(documents.filter(d => d.id !== id));
        }
    };

    const handleGenerateEcad = async (type: "FULL" | "SETLIST", setlistId?: string) => {
        setIsGenerating(true);
        try {
            const res = await generateEcadRepertoire({ type, setlistId });
            setGenResult(res);
        } catch (error) {
            console.error("Error generating ECAD", error);
            alert("Erro ao gerar documento");
        } finally {
            setIsGenerating(false);
        }
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'CND': return <ShieldAlert className="h-5 w-5 text-blue-500" />;
            case 'IDENTIFICACAO': return <CreditCard className="h-5 w-5 text-indigo-500" />;
            case 'CONTRATO': return <FileKey className="h-5 w-5 text-amber-500" />;
            case 'ECAD': return <FileText className="h-5 w-5 text-green-500" />;
            default: return <FileText className="h-5 w-5 text-zinc-500" />;
        }
    };

    const getCategoryName = (cat: string) => {
        switch (cat) {
            case 'CND': return 'Certidão Negativa (CND)';
            case 'IDENTIFICACAO': return 'Identificação (RG/CPF)';
            case 'CONTRATO': return 'Contrato / Estatuto';
            case 'RIDER_CAMARIM': return 'Rider de Camarim';
            case 'ECAD': return 'Documentação ECAD';
            default: return 'Outros';
        }
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 pb-20">
            {genResult && (
                <div className="lg:col-span-3 mb-6 bg-[#ccff00] p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-black flex items-center justify-center text-[#ccff00] shadow-3xl">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <div>
                            <h4 className="font-black text-black uppercase tracking-widest text-lg">DOCUMENTO GERADO!</h4>
                            <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mt-1">
                                {genResult.message} ({genResult.itemCount} músicas processadas).
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="h-14 px-8 bg-black text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-900 transition-all font-heading"
                            onClick={() => setGenResult(null)}
                        >
                            FECHAR
                        </button>
                        <button className="h-14 px-10 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all shadow-xl font-heading">
                            BAIXAR RELAÇÃO
                        </button>
                    </div>
                </div>
            )}

            {/* Generative Tools */}
            <div className="lg:col-span-3">
                <div className="bg-black border border-[#ccff00]/20 p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                    <div className="flex items-center gap-8 text-left relative z-10">
                        <div className="h-16 w-16 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00] shadow-3xl shrink-0">
                            <Wand2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-heading">AUTOMAÇÃO DE DOCUMENTOS</h3>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2 max-w-xl leading-relaxed">
                                Gere automaticamente a **Relação de Obras (ECAD)** usando os dados de seu repertório oficial.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 relative z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button disabled={isGenerating} className="h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center gap-4 font-heading">
                                    {isGenerating ? "PROCESSANDO..." : "GERAR RELAÇÃO (ECAD)"}
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 bg-black border border-white/10 p-4 rounded-none shadow-3xl">
                                <DropdownMenuLabel className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 pb-4 border-b border-white/5">FONTE DE DADOS</DropdownMenuLabel>
                                <DropdownMenuItem className="py-4 hover:bg-[#ccff00] hover:text-black cursor-pointer text-[10px] font-black uppercase tracking-widest text-white transition-all rounded-none" onClick={() => handleGenerateEcad("FULL")}>
                                    <FileText className="mr-4 h-4 w-4" />
                                    CATÁLOGO COMPLETO
                                </DropdownMenuItem>
                                {setlists.length > 0 && (
                                    <>
                                        <div className="h-px bg-white/5 my-4" />
                                        <DropdownMenuLabel className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2">POR SETLIST ATIVO</DropdownMenuLabel>
                                        {setlists.slice(0, 5).map(s => (
                                            <DropdownMenuItem key={s.id} className="py-4 hover:bg-[#ccff00] hover:text-black cursor-pointer text-[10px] font-black uppercase tracking-widest text-white transition-all rounded-none" onClick={() => handleGenerateEcad("SETLIST", s.id)}>
                                                <FolderOpen className="mr-4 h-4 w-4" />
                                                {s.title.toUpperCase()}
                                            </DropdownMenuItem>
                                        ))}
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Upload Form */}
            <div className="lg:col-span-1">
                <form onSubmit={handleUpload} className="bg-zinc-900/40 border border-white/5 p-10 sticky top-6 shadow-2xl">
                    <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-10 border-b border-white/5 pb-6">ADICIONAR DOCUMENTO</h2>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">TÍTULO</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Ex: CND FEDERAL 2026"
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-[#ccff00] outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">CATEGORIA</label>
                            <select
                                title="CATEGORIA DE DOCUMENTO"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 appearance-none rounded-none cursor-pointer"
                            >
                                <option value="CND">CERTIDÃO NEGATIVA (CND)</option>
                                <option value="IDENTIFICACAO">DOCUMENTO PESSOAL (RG/CNH)</option>
                                <option value="CONTRATO">CONTRATO / ESTATUTO</option>
                                <option value="RIDER_CAMARIM">RIDER DE CAMARIM</option>
                                <option value="ECAD">DOCUMENTAÇÃO ECAD</option>
                                <option value="OUTROS">OUTROS</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">MEMBRO RESPONSÁVEL</label>
                            <select
                                title="MEMBRO RESPONSÁVEL"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 appearance-none rounded-none cursor-pointer"
                            >
                                <option value="">PERTENCE À BANDA</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {(m.user?.name || "MEMBRO SEM NOME").toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">DATA DE VALIDADE</label>
                            <input
                                title="DATA DE VALIDADE"
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 appearance-none rounded-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">ARQUIVO (PDF/IMAGEM)</label>
                            <input
                                title="ARQUIVO DO DOCUMENTO"
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="w-full h-14 bg-black border border-white/10 p-2 text-[8px] font-black uppercase tracking-widest text-zinc-600 file:mr-6 file:bg-zinc-900 file:border-0 file:px-6 file:h-10 file:text-[8px] file:font-black file:uppercase file:tracking-widest file:text-white hover:file:bg-[#ccff00] hover:file:text-black cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading || !file}
                            className="w-full h-16 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-4 mt-10 font-heading"
                        >
                            <Upload className="h-4 w-4" />
                            {isUploading ? "ENVIANDO..." : "ENVIAR DOCUMENTO"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
                {documents.length === 0 ? (
                    <div className="bg-zinc-900/20 border border-dashed border-white/10 p-20 text-center opacity-30 flex flex-col items-center">
                        <FolderOpen className="h-16 w-16 text-zinc-900 mb-8" />
                        <h3 className="text-[12px] font-black uppercase tracking-[.5em] text-zinc-700">NENHUM DOCUMENTO</h3>
                        <p className="text-[8px] font-black uppercase tracking-[.4em] text-zinc-800 mt-4 max-w-xs">Arraste seus CNDs e documentos da banda para começar a gestão profissional.</p>
                    </div>
                ) : (
                    [...documents].sort((a, b) => {
                        const aExpired = isExpired(a.expiryDate);
                        const bExpired = isExpired(b.expiryDate);
                        const aExpiring = isExpiringSoon(a.expiryDate);
                        const bExpiring = isExpiringSoon(b.expiryDate);

                        if (aExpired && !bExpired) return -1;
                        if (!aExpired && bExpired) return 1;
                        if (aExpiring && !bExpiring) return -1;
                        if (!aExpiring && bExpiring) return 1;

                        if (a.expiryDate && b.expiryDate) {
                            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
                        }
                        return 0;
                    }).map(doc => {
                        const expired = isExpired(doc.expiryDate);
                        const expiring = isExpiringSoon(doc.expiryDate);

                        return (
                            <div key={doc.id} className="bg-zinc-900/40 border border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-8 transition-all hover:border-[#ccff00]/30 shadow-xl group">
                                <div className="flex items-center gap-8">
                                    <div className="flex h-16 w-16 items-center justify-center bg-black border border-white/5 text-white/50 group-hover:text-[#ccff00] transition-colors shadow-2xl">
                                        {getCategoryIcon(doc.category)}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[14px] font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ccff00] transition-colors leading-none">
                                                {doc.title.toUpperCase()}
                                            </a>
                                            {doc.member?.user?.name && (
                                                <span className="text-[8px] font-black bg-zinc-900 border border-white/5 text-zinc-600 px-3 py-1 uppercase tracking-widest">
                                                    {doc.member.user.name.toUpperCase()}
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                                                {getCategoryName(doc.category).toUpperCase()}
                                            </span>

                                            {doc.expiryDate && (
                                                <>
                                                    <span className="text-zinc-800">•</span>
                                                    <span className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-2
                                                        ${expired ? 'text-red-500' : expiring ? 'text-amber-500' : 'text-[#ccff00]'}
                                                    `}>
                                                        {(expired || expiring) && <AlertCircle className="h-3 w-3" />}
                                                        {expired ? 'VENCIDO EM' : 'VENCE EM'}: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-12 px-6 bg-zinc-900 border border-white/5 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center font-heading"
                                    >
                                        VISUALIZAR
                                    </a>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="h-12 w-12 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:text-red-600 transition-all"
                                        title="Excluir documento"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

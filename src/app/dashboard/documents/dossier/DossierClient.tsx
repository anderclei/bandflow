"use client";

import { useState } from "react";
import { ShieldAlert, FileText, CreditCard, FileKey, CheckSquare, Copy, ExternalLink } from "lucide-react";

interface Document {
    id: string;
    title: string;
    category: string;
    fileUrl: string;
    expiryDate: Date | null;
}

export function DossierClient({ documents, bandSlug }: { documents: Document[]; bandSlug: string }) {
    const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

    const toggleDoc = (id: string) => {
        const newSet = new Set(selectedDocs);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedDocs(newSet);
    };

    const isExpired = (date: Date | null) => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'CND': return <ShieldAlert className="h-5 w-5 text-blue-500" />;
            case 'IDENTIFICACAO': return <CreditCard className="h-5 w-5 text-indigo-500" />;
            case 'CONTRATO': return <FileKey className="h-5 w-5 text-amber-500" />;
            default: return <FileText className="h-5 w-5 text-zinc-500" />;
        }
    };

    // Gera um link público baseado nos IDs dos documentos.
    // URL amigável: /public/[bandSlug]/dossie?docs=id1,id2,id3
    const publicUrl = selectedDocs.size > 0
        ? `${window.location.origin}/public/${bandSlug}/dossie?docs=${Array.from(selectedDocs).join(",")}`
        : "";

    const copyToClipboard = () => {
        if (!publicUrl) return;
        navigator.clipboard.writeText(publicUrl);
        alert("Link copiado para a área de transferência!");
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <CheckSquare className="h-5 w-5 text-secondary" />
                        Selecione os Documentos para o Dossiê
                    </h3>
                    <p className="text-sm text-zinc-500">
                        Apenas os documentos selecionados ficarão visíveis no link público gerado.
                    </p>
                </div>

                {documents.length === 0 ? (
                    <div className="text-center p-8 text-zinc-500">Nenhum documento encontrado no Drive.</div>
                ) : (
                    <div className="space-y-3">
                        {documents.map(doc => {
                            const expired = isExpired(doc.expiryDate);

                            return (
                                <div
                                    key={doc.id}
                                    onClick={() => toggleDoc(doc.id)}
                                    className={`rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer border-2 
                                        ${selectedDocs.has(doc.id)
                                            ? 'border-secondary bg-secondary/5 dark:bg-secondary/10'
                                            : 'border-transparent bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 hover:ring-zinc-300'}
                                    `}
                                >
                                    <div className="shrink-0 flex items-center justify-center p-2">
                                        <div className={`w-5 h-5 rounded border ${selectedDocs.has(doc.id) ? 'bg-secondary border-secondary flex items-center justify-center' : 'border-zinc-300'}`}>
                                            {selectedDocs.has(doc.id) && <CheckSquare className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                        {getCategoryIcon(doc.category)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-foreground">
                                            {doc.title}
                                        </h3>
                                        <div className="text-xs text-zinc-500 flex items-center gap-2">
                                            {doc.category}
                                            {expired && <span className="text-red-500 font-medium">• Vencido</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="lg:col-span-1">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sticky top-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Link Público</h2>

                    {selectedDocs.size === 0 ? (
                        <div className="text-center py-8 text-zinc-500 text-sm bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
                            Selecione pelo menos um documento ao lado para gerar o link do Dossiê.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                O link a seguir dará acesso somente leitura aos <strong>{selectedDocs.size} documentos selecionados</strong>.
                            </p>

                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl break-all text-xs font-mono text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                {publicUrl}
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-colors"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copiar Link
                                </button>

                                <a
                                    href={publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Testar Link Público
                                </a>
                            </div>

                            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-[11px] text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg leading-relaxed mix-blend-multiply flex gap-2">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    Atenção: Qualquer pessoa com este link poderá visualizar e baixar os PDFs anexados ao dossiê.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

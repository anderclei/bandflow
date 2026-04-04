"use client"

import { useState } from "react"
import { createDocument, deleteDocument } from "@/app/actions/documents"
import { FolderOpen, Upload, FileText, Trash2, AlertCircle, FileKey, ShieldAlert, CreditCard } from "lucide-react"

export function MemberDocumentsTab({ memberId, bandId, initialDocuments }: { memberId: string, bandId: string, initialDocuments: any[] }) {
    const [documents, setDocuments] = useState(initialDocuments)
    const [isUploading, setIsUploading] = useState(false)

    // Form state
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("IDENTIFICACAO")
    const [expiryDate, setExpiryDate] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const isExpired = (date: Date | null) => {
        if (!date) return false
        return new Date(date) < new Date()
    }

    const isExpiringSoon = (date: Date | null) => {
        if (!date) return false
        const diffTime = Math.abs(new Date(date).getTime() - new Date().getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 30 && diffDays > 0
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !title) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("type", "document")

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!uploadRes.ok) throw new Error("Upload failed")

            const { url } = await uploadRes.json()

            const docFormData = new FormData()
            docFormData.append("title", title)
            docFormData.append("category", category)
            docFormData.append("memberId", memberId)
            if (expiryDate) docFormData.append("expiryDate", expiryDate)

            await createDocument(bandId, url, docFormData)

            setTitle("")
            setFile(null)
            setExpiryDate("")

            // Note: In an ideal world we'd update state locally, but server actions automatically revalidate
            // For modal UX, we will just reload or let the state hold for now
            window.location.reload()
        } catch (error) {
            console.error("Error creating document", error)
            alert("Erro ao enviar documento")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault() // Prevent form submission if clicked inside the modal accidentally
        if (confirm("Tem certeza que deseja excluir este documento?")) {
            await deleteDocument(id)
            setDocuments(documents.filter(d => d.id !== id))
        }
    }

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'CND': return <ShieldAlert className="h-5 w-5 text-blue-500" />
            case 'IDENTIFICACAO': return <CreditCard className="h-5 w-5 text-indigo-500" />
            case 'CONTRATO': return <FileKey className="h-5 w-5 text-amber-500" />
            case 'ECAD': return <FileText className="h-5 w-5 text-green-500" />
            default: return <FileText className="h-5 w-5 text-zinc-500" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-500">
                Faça o upload do RG, Passaporte, CNH ou Contratos específicos deste membro para que eles fiquem salvos no Drive da Banda e sejam fáceis de anexar em Rooming Lists.
            </div>

            <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Ex: Passaporte"
                        className="w-full rounded-lg bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                    >
                        <option value="IDENTIFICACAO">Documento Pessoal (RG/CPF)</option>
                        <option value="CONTRATO">Contrato Individual</option>
                        <option value="ECAD">Documentação ECAD</option>
                        <option value="OUTROS">Outros</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Vencimento (Opcional)</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full rounded-lg bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Arquivo (PDF/Img)</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full rounded-lg bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-1.5 text-xs outline-none file:mr-2 file:rounded file:border-0 file:bg-secondary/10 file:px-2 file:py-1 file:font-semibold file:text-secondary hover:file:bg-secondary/20"
                    />
                </div>

                <div className="sm:col-span-2 pt-2">
                    <button
                        type="submit"
                        disabled={isUploading || !file}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Enviando..." : "Anexar Documento ao Perfil"}
                    </button>
                </div>
            </form>

            <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground">Documentos Salvos</h4>
                {documents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-500">
                        <FolderOpen className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                        <p className="text-sm">Nenhum documento anexado.</p>
                    </div>
                ) : (
                    documents.map(doc => {
                        const expired = isExpired(doc.expiryDate)
                        const expiring = isExpiringSoon(doc.expiryDate)

                        return (
                            <div key={doc.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                        {getCategoryIcon(doc.category)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-sm text-foreground truncate">
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {doc.title}
                                            </a>
                                        </h3>
                                        {doc.expiryDate && (
                                            <span className={`text-[10px] font-medium flex items-center gap-1 mt-0.5
                                                ${expired ? 'text-red-500' : expiring ? 'text-amber-500' : 'text-zinc-500'}
                                            `}>
                                                {(expired || expiring) && <AlertCircle className="h-3 w-3" />}
                                                Vence: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={(e) => handleDelete(doc.id, e)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

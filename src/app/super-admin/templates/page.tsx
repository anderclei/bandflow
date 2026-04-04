"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Plus, Edit, Trash2, X, Save, Terminal, Zap } from "lucide-react";
import { getSystemTemplates, createSystemTemplate, updateSystemTemplate, deleteSystemTemplate } from "@/app/actions/super-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TemplatesManager() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);

    const defaultFormData = {
        name: "",
        description: "",
        type: "CONTRACT", 
        content: "",
        isActive: true
    };

    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = await getSystemTemplates();
        if (result.success) {
            setTemplates(result.templates || []);
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCreate = async () => {
        setSaving(true);
        const result = await createSystemTemplate(formData);
        if (result.success) {
            toast.success("Template construído com sucesso!");
            setIsCreating(false);
            setFormData(defaultFormData);
            fetchData();
        } else {
            toast.error(result.error);
        }
        setSaving(false);
    };

    const handleUpdate = async () => {
        setSaving(true);
        const result = await updateSystemTemplate(editingTemplate.id, formData);
        if (result.success) {
            toast.success("Blueprint atualizado no cluster!");
            setEditingTemplate(null);
            setFormData(defaultFormData);
            fetchData();
        } else {
            toast.error(result.error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Tem certeza que deseja excluir o template "${name}"?`)) {
            const result = await deleteSystemTemplate(id);
            if (result.success) {
                toast.success("Template removido da pilha.");
                fetchData();
            } else {
                toast.error(result.error);
            }
        }
    };

    const openCreateForm = () => {
        setEditingTemplate(null);
        setFormData(defaultFormData);
        setIsCreating(true);
    };

    const openEditForm = (template: any) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            description: template.description || "",
            type: template.type,
            content: template.content,
            isActive: template.isActive
        });
        setIsCreating(false);
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditingTemplate(null);
        setFormData(defaultFormData);
    };

    if (loading) {
        return (
            <div className="flex h-60 items-center justify-center">
                <div className="h-10 w-10 animate-pulse text-zinc-800">
                    <Terminal className="w-full h-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
             {/* Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <FileText className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">Templates do <span className="text-zinc-600">Sistema</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Repositório Mestre de Blueprints</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Source Ativo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!isCreating && !editingTemplate && (
                    <button 
                        onClick={openCreateForm} 
                        className="px-8 py-3 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-white transition-all shadow-[0 0 20px rgba(204,255,0,0.1)] active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Novo Blueprint
                    </button>
                )}
            </div>

            {(isCreating || editingTemplate) && (
                <div className="bg-zinc-900 border border-white/10 p-10 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                        <h2 className="text-xl font-black font-heading uppercase tracking-widest text-[#ccff00]">
                            {isCreating ? "Construir Novo Node de Documento" : "Modificar Node de Documento"}
                        </h2>
                        <button 
                            onClick={closeForm} 
                            className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white"
                        >
                            Encerrar Operação [X]
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Label do Template</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50" placeholder="Ex: STANDARD GIG CONTRACT V2" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Lógica do Documento</label>
                                <select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleChange}
                                    className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none"
                                >
                                    <option value="CONTRACT">CONTRATO REGISTRO</option>
                                    <option value="RIDER">DADOS RIDER TECNICO</option>
                                    <option value="ONBOARDING EMAIL">EMAIL BOAS VINDAS</option>
                                    <option value="AGREEMENT">ACORDO COMERCIAL</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Descrição Meta</label>
                            <input name="description" value={formData.description} onChange={handleChange} className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50" placeholder="Breve contexto de uso..." />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">Código Fonte (HTML/Markdown)</label>
                                <span className="text-[8px] font-black text-[#ccff00]/30 uppercase tracking-widest">Injeção dinâmica ativa: {'{{band name}}'}</span>
                            </div>
                            <textarea 
                                name="content" 
                                value={formData.content} 
                                onChange={handleChange} 
                                className="w-full h-96 bg-black border border-white/10 p-6 text-[11px] font-mono uppercase tracking-widest outline-none focus:border-[#ccff00] transition-all"
                                placeholder="..."
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <input 
                                type="checkbox" 
                                name="isActive" 
                                id="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 bg-zinc-900 border border-white/5 rounded-none text-[#ccff00] focus:ring-0"
                            />
                            <label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer">Definir status ativo para deploy no cluster</label>
                        </div>
                        
                        <div className="pt-8 flex justify-end gap-1">
                            <button onClick={isCreating ? handleCreate : handleUpdate} disabled={saving || !formData.name || !formData.content} className="px-12 py-5 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all disabled:opacity-30">
                                {saving ? "PREPARANDO BUFFERS..." : "EXECUTAR COMMIT"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isCreating && !editingTemplate && (
                <div className="border border-white/5 bg-[#0a0a0a] relative overflow-hidden">
                    {templates.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-zinc-900 border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Label do Blueprint</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Identificador</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-left">Status de Deploy</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {templates.map(template => (
                                    <tr key={template.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors">{template.name}</div>
                                            {template.description && <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1 opacity-50">{template.description}</div>}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-zinc-900 border border-white/5 text-zinc-400">
                                                {template.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-[#ccff00]' : 'bg-zinc-800'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${template.isActive ? 'text-[#ccff00]' : 'text-zinc-600'}`}>
                                                    {template.isActive ? 'Ativo' : 'Offline'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => openEditForm(template)} className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all" title="Editar">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(template.id, template.name)} className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center hover:text-white transition-all text-zinc-800" title="Deletar">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center border-2 border-dashed border-zinc-900">
                            <Zap className="w-12 h-12 text-zinc-900 mx-auto mb-6" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">Cluster Source Vazio. Nenhum Blueprint Encontrado.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

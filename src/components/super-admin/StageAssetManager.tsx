"use client";

import React, { useState, Fragment } from "react";
import { Plus, Edit2, Trash2, X, Check, Search, Save, AlertTriangle, Upload, Image as ImageIcon, DownloadCloud, Sparkles } from "lucide-react";
import { createStageAsset, updateStageAsset, deleteStageAsset, seedDefaultStageAssets, suggestSvgIcon } from "@/app/actions/stage-assets-actions";
import { supabase } from "@/lib/supabase-client";

type StageAsset = {
  id: string;
  type: string;
  label: string;
  category: string;
  widthClass: string;
  svgContent: string | null;
  imageUrl: string | null;
  isActive: boolean;
};

export function StageAssetManager({ initialAssets }: { initialAssets: StageAsset[] }) {
  const [assets, setAssets] = useState<StageAsset[]>(initialAssets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(0);
  
  // Agrupar ativos por categoria para exibição normalizando caixa alta/baixa
  const groupedAssets = assets.reduce((acc, asset) => {
    let cat = (asset.category || "GERAL").trim();
    // Capitaliza a primeira letra para padronizar
    cat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
    
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(asset);
    return acc;
  }, {} as Record<string, StageAsset[]>);

  const sortedCategories = Object.keys(groupedAssets).sort();

  const [formData, setFormData] = useState({
    type: "",
    label: "",
    category: "GERAL",
    widthClass: "w-24 h-24",
    svgContent: "",
    imageUrl: "",
    isActive: true
  });

  const handleOpenModal = (asset?: StageAsset) => {
    if (asset) {
      setEditingId(asset.id);
      setFormData({
        type: asset.type,
        label: asset.label,
        category: asset.category,
        widthClass: asset.widthClass,
        svgContent: asset.svgContent || "",
        imageUrl: asset.imageUrl || "",
        isActive: asset.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        type: "",
        label: "",
        category: "GERAL",
        widthClass: "w-24 h-24",
        svgContent: "",
        imageUrl: "",
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const res = await updateStageAsset(editingId, {
          ...formData,
          svgContent: formData.svgContent || undefined,
          imageUrl: formData.imageUrl || undefined
        });
        if (res.success && res.asset) {
          setAssets(assets.map(a => a.id === editingId ? res.asset as StageAsset : a));
          handleCloseModal();
        } else {
          alert("Erro: " + res.error);
        }
      } else {
        const res = await createStageAsset({
          ...formData,
          svgContent: formData.svgContent || undefined,
          imageUrl: formData.imageUrl || undefined
        });
        if (res.success && res.asset) {
          setAssets([...assets, res.asset as StageAsset]);
          handleCloseModal();
        } else {
          alert("Erro: " + res.error);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este item permanentemente?")) return;
    
    setLoading(true);
    const res = await deleteStageAsset(id);
    if (res.success) {
      setAssets(assets.filter(a => a.id !== id));
    } else {
      alert("Erro ao deletar: " + res.error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage.from('assets').upload(fileName, file);

      if (error) {
         throw error;
      }
      
      const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(fileName);
      setFormData({ ...formData, imageUrl: publicUrlData.publicUrl });
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Erro ao subir imagem no Supabase. O bucket "assets" existe e é público?');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSuggestIcon = async () => {
    if (!formData.label) {
      alert("Preencha o Label primeiro para eu saber o que buscar!");
      return;
    }
    setSuggesting(true);
    try {
      const res = await suggestSvgIcon(formData.label, suggestIndex);
      if (res.success && res.svg) {
        setFormData({ ...formData, svgContent: res.svg, imageUrl: "" });
        setSuggestIndex(prev => prev + 1);
      } else {
        alert(res.error || "Erro ao buscar ícone.");
      }
    } catch (e: any) {
      alert("Erro ao buscar: " + e.message);
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {assets.length === 0 && !isModalOpen && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center justify-center text-center rounded-lg space-y-4">
          <DownloadCloud className="w-12 h-12 text-zinc-600" />
          <div>
            <h3 className="text-white font-bold mb-1">Nenhum Ativo Encontrado</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Seu banco de dados não possui imagens cadastradas para o mapa de palco. 
              Você pode adicionar manualmente ou gerar os itens padrões para depois editá-los e subir as imagens.
            </p>
          </div>
          <button 
            onClick={async () => {
              setLoading(true);
              const res = await seedDefaultStageAssets();
              if (res.success) {
                window.location.reload();
              } else {
                alert("Erro ao popular: " + res.error);
                setLoading(false);
              }
            }}
            disabled={loading}
            className="flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#b3e600] transition-colors"
          >
            {loading ? 'Processando...' : 'GERAR ITENS PADRÃO (BATERIA, GUITARRA, ETC.)'}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-[#ccff00]">MAPA DE PALCO DA REDE</h2>
          <p className="text-zinc-500 font-mono text-xs mt-1">Gerencie os ícones e instrumentos disponíveis globalmente.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#ccff00] text-black px-4 py-2 font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" /> NOVO ATIVO
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black text-zinc-500 font-mono text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Preview</th>
              <th className="px-6 py-4">Label</th>
              <th className="px-6 py-4">ID (Type)</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-xs">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  Nenhum ativo de palco cadastrado.
                </td>
              </tr>
            ) : (
              sortedCategories.map(category => (
                <React.Fragment key={category}>
                  <tr className="bg-white/5 border-t border-b border-white/10">
                    <td colSpan={5} className="px-6 py-2 text-[#ccff00] font-black uppercase tracking-widest">
                      {category}
                    </td>
                  </tr>
                  {groupedAssets[category].sort((a, b) => a.label.localeCompare(b.label)).map(asset => (
                    <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        {asset.svgContent ? (
                          <div 
                            className="w-8 h-8 text-white bg-current" 
                            style={{ 
                                WebkitMaskImage: `url("data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(asset.svgContent.includes('xmlns=') ? asset.svgContent : asset.svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'))))}")`, 
                                WebkitMaskSize: "contain", 
                                WebkitMaskRepeat: "no-repeat", 
                                WebkitMaskPosition: "center" 
                            }}
                          />
                        ) : asset.imageUrl ? (
                          <img src={asset.imageUrl} alt={asset.label} className="w-8 h-8 object-contain" />
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-zinc-500 rounded border border-dashed border-zinc-600 text-[8px]">
                            Sem Imagem
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white font-bold">{asset.label}</td>
                      <td className="px-6 py-4 text-zinc-400">{asset.type}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-[10px] uppercase border border-white/10">{asset.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(asset)} className="p-2 text-zinc-400 hover:text-white bg-black border border-white/5 hover:border-white/20 transition-all" title="Editar">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(asset.id)} className="p-2 text-zinc-400 hover:text-red-500 bg-black border border-white/5 hover:border-red-500/50 transition-all" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal} />
          
          <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black">
              <h3 className="font-heading font-black text-white tracking-tighter uppercase text-xl">
                {editingId ? "Editar Ativo" : "Novo Ativo de Palco"}
              </h3>
              <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#ccff00]">Label (Nome Exibido)</label>
                  <input
                    required
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="Ex: Bateria"
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#ccff00]">ID / Type (Chave Única)</label>
                  <input
                    required
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    placeholder="Ex: drum-kit"
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#ccff00]" htmlFor="category-select">Categoria</label>
                  <input
                    id="category-select"
                    title="Categoria"
                    type="text"
                    list="category-options"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Ex: Cordas, Ritmo, Sopro..."
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
                  />
                  <datalist id="category-options">
                    <option value="Ritmo" />
                    <option value="Harmonia" />
                    <option value="Cordas" />
                    <option value="Sopro" />
                    <option value="Amps" />
                    <option value="PA" />
                    <option value="Voz" />
                    <option value="Infra" />
                    <option value="Estrutura" />
                  </datalist>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#ccff00]">Tamanho CSS (Opcional)</label>
                  <input
                    type="text"
                    value={formData.widthClass}
                    onChange={(e) => setFormData({...formData, widthClass: e.target.value})}
                    placeholder="Ex: w-32 h-32"
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-[#ccff00]">Conteúdo SVG (XML Raw)</label>
                      <div className="text-[10px] text-zinc-500 font-mono mb-2">Cole o código do &lt;svg&gt; puro. Ele será mascarado.</div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleSuggestIcon}
                      disabled={suggesting}
                      className="bg-black border border-[#ccff00] text-[#ccff00] text-[10px] px-3 py-1 font-mono uppercase tracking-widest hover:bg-[#ccff00] hover:text-black transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {suggesting ? "Buscando..." : "Sugerir Ícone"}
                    </button>
                  </div>
                  <textarea
                    value={formData.svgContent}
                    onChange={(e) => setFormData({...formData, svgContent: e.target.value})}
                    rows={4}
                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-zinc-300 font-mono text-xs focus:outline-none focus:border-[#ccff00] transition-colors resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#ccff00]">Upload de Imagem (PNG/SVG)</label>
                  <div className="text-[10px] text-zinc-500 font-mono mb-2">Selecione um arquivo para subir diretamente para o Supabase Storage.</div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 border border-dashed border-white/20 px-4 py-3 text-zinc-300 font-mono text-xs cursor-pointer transition-colors">
                      {isUploading ? <Upload className="animate-bounce" /> : <ImageIcon />}
                      <span>{isUploading ? 'Fazendo upload...' : formData.imageUrl ? 'Substituir Imagem' : 'Escolher Arquivo'}</span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/svg+xml"
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder='https://sua-url-do-supabase.com/.../imagem.png'
                      className="w-full bg-zinc-900 border border-white/10 px-4 py-2 text-zinc-400 font-mono text-[10px] focus:outline-none focus:border-[#ccff00] transition-colors"
                    />
                    {uploadError && <div className="text-red-500 text-[10px] mt-1 font-mono">{uploadError}</div>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-900/50 p-4 border border-white/5">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 accent-[#ccff00]"
                />
                <label htmlFor="isActive" className="text-xs font-mono text-zinc-400 cursor-pointer">
                  Habilitar est item no construtor de mapa de palco global.
                </label>
              </div>

            </form>
            
            <div className="p-6 border-t border-white/5 bg-black flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 font-black uppercase tracking-widest text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#ccff00] text-black px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? "Salvando..." : (
                  <>
                    <Save className="w-4 h-4" /> Salvar Ativo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import { Camera, Plus, Image as ImageIcon } from "lucide-react";

export default async function MediaPage() {
    const { band } = await getActiveBand();

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Camera className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                Central <span className="text-zinc-600"> de Mídia</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">GALERIA DE ARQUIVOS</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">KIT DE IMPRENSA ATIVO</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-4 font-heading">
                    <Plus className="h-4 w-4" />
                    ENVIAR ARQUIVOS
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-zinc-900/40 border border-white/5 p-10 flex flex-col items-center group hover:bg-[#ccff00]/10 transition-all cursor-pointer shadow-xl">
                    <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center text-white group-hover:text-[#ccff00] mb-8 transition-colors shadow-2xl">
                        <Camera className="h-8 w-8" />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white underline decoration-[#ccff00]/30 decoration-2 underline-offset-8">FOTOS DE DIVULGAÇÃO</h4>
                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest text-center mt-10 leading-relaxed max-w-[180px]">Fotos oficiais da banda em alta resolução para imprensa.</p>
                </div>
                
                <div className="bg-zinc-900/40 border border-white/5 p-10 flex flex-col items-center group hover:bg-[#ccff00]/10 transition-all cursor-pointer shadow-xl">
                    <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center text-white group-hover:text-[#ccff00] mb-8 transition-colors shadow-2xl">
                        <ImageIcon className="h-8 w-8" />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white underline decoration-[#ccff00]/30 decoration-2 underline-offset-8">CONTEÚDO PARA LED</h4>
                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest text-center mt-10 leading-relaxed max-w-[180px]">Vídeos, Loops e Mapas de LED para o show ao vivo.</p>
                </div>

                <div className="bg-black border border-dashed border-white/10 p-10 flex flex-col items-center group hover:border-[#ccff00]/40 transition-all cursor-pointer shadow-2xl">
                    <div className="w-16 h-16 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-800 group-hover:text-white mb-8 transition-colors shadow-2xl">
                        <Plus className="h-8 w-8" />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-800 group-hover:text-white transition-colors">NOVA COLEÇÃO</h4>
                    <p className="text-[8px] font-black text-zinc-900 group-hover:text-zinc-700 uppercase tracking-widest text-center mt-10 leading-relaxed max-w-[180px]">Organize seus arquivos de mídia em novas pastas.</p>
                </div>
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { StageAssetManager } from "@/components/super-admin/StageAssetManager";

export const metadata = {
  title: "Ativos de Palco | Super Admin | BandFlow",
};

export default async function StageAssetsPage() {
  let assets: any[] = [];
  try {
    assets = await prisma.stageAssetDefinition.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (e) {
    console.error("Erro ao carregar Stage Assets:", e);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter font-heading text-white">
          Configuração do <span className="text-[#ccff00]">Mapa de Palco</span>
        </h1>
        <p className="text-zinc-500 font-mono text-sm mt-2 max-w-2xl">
          Adicione, edite ou remova os instrumentos e ativos SVG que os usuários podem arrastar no módulo construtor de mapas de palco. Estes itens são injetados diretamente na renderização.
        </p>
      </div>

      <div className="border border-[#ccff00]/10 bg-[#ccff00]/5 p-6 border-l-4 border-l-[#ccff00]">
        <h4 className="text-[#ccff00] font-black uppercase tracking-widest text-xs mb-2">IMPORTANTE: FORMATO DOS ARQUIVOS</h4>
        <p className="text-zinc-400 font-mono text-xs">
          O sistema BandFlow utiliza tecnologias de "Masking CSS" para injetar o tema (Neon Verde ou Branco) nas imagens. Para uma melhor precisão, apenas cole o código de SVGs puros formatados com a cor base "currentColor".
        </p>
      </div>

      <StageAssetManager initialAssets={assets} />
    </div>
  );
}

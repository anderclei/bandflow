import { prisma } from './src/lib/prisma';

const ELEMENT_CONFIG: Record<string, { label: string; spriteId: string; width: string; category: string }> = {
    'drum': { label: 'BATERIA', spriteId: 'drum', width: 'w-32 h-32', category: 'Ritmo' },
    'percussion': { label: 'PERCUSSÃO', spriteId: 'percussion', width: 'w-24 h-24', category: 'Ritmo' },
    'congas': { label: 'SET CONGAS', spriteId: 'congas', width: 'w-20 h-24', category: 'Ritmo' },
    'keyboard': { label: 'TECLADO / SYNTH', spriteId: 'keyboard', width: 'w-32 h-16', category: 'Harmonia' },
    'piano': { label: 'PIANO DIGITAL', spriteId: 'piano', width: 'w-32 h-20', category: 'Harmonia' },
    'bass': { label: 'BAIXO ELÉTRICO', spriteId: 'bass', width: 'w-12 h-32', category: 'Cordas' },
    'guitar': { label: 'GTR ELÉTRICA', spriteId: 'guitar', width: 'w-12 h-32', category: 'Cordas' },
    'guitar-acoustic': { label: 'GTR ACÚSTICA', spriteId: 'guitar-acoustic', width: 'w-14 h-32', category: 'Cordas' },
    'sax': { label: 'SAXOFONE', spriteId: 'sax', width: 'w-14 h-24', category: 'Sopro' },
    'trumpet': { label: 'TROMPETE', spriteId: 'trumpet', width: 'w-16 h-12', category: 'Sopro' },
    'bass-amp': { label: 'AMP BAIXO STACK', spriteId: 'amp-bass', width: 'w-20 h-24', category: 'Amps' },
    'guitar-amp': { label: 'AMP GTR STACK', spriteId: 'amp-guitar', width: 'w-20 h-24', category: 'Amps' },
    'side': { label: 'SIDE FILL', spriteId: 'speaker', width: 'w-20 h-20', category: 'PA' },
    'monitor': { label: 'RETORNO (WEDGE)', spriteId: 'monitor', width: 'w-16 h-12', category: 'PA' },
    'drum-sub': { label: 'SUB BATERA', spriteId: 'subwoofer', width: 'w-16 h-16', category: 'PA' },
    'mic': { label: 'VOZ (PEDESTAL)', spriteId: 'mic-stand', width: 'w-16 h-16', category: 'Voz' },
    'mic-handheld': { label: 'VOZ (MÃO)', spriteId: 'mic', width: 'w-8 h-12', category: 'Voz' },
    'di': { label: 'DI BOX / DIRECT', spriteId: 'di', width: 'w-14 h-10', category: 'Infra' },
    'power': { label: 'PONTO ENERGIA', spriteId: 'power', width: 'w-14 h-14', category: 'Infra' },
    'riser': { label: 'PRATICÁVEL', spriteId: 'riser', width: 'w-32 h-20', category: 'Estrutura' },
    'stand': { label: 'STAND INSTRUM.', spriteId: 'stand', width: 'w-24 h-16', category: 'Estrutura' },
    'backdrop': { label: 'BACKDROP / BANNER', spriteId: 'backdrop', width: 'w-48 h-16', category: 'Estrutura' },
};

async function seed() {
  for (const [key, value] of Object.entries(ELEMENT_CONFIG)) {
    const existing = await prisma.stageAssetDefinition.findUnique({
      where: { type: key }
    });

    if (!existing) {
      await prisma.stageAssetDefinition.create({
        data: {
          type: key,
          label: value.label,
          category: value.category,
          widthClass: value.width,
          isActive: true
        }
      });
      console.log("Created: ", key);
    }
  }
}

seed().then(() => {
  console.log("Seeding complete!");
  process.exit(0);
}).catch(console.error);

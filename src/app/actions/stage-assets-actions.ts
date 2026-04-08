"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStageAsset(data: {
  type: string;
  label: string;
  category: string;
  widthClass: string;
  svgContent?: string;
  imageUrl?: string;
  isActive: boolean;
}) {
  try {
    const asset = await prisma.stageAssetDefinition.create({
      data,
    });
    revalidatePath("/super-admin/stage-assets");
    return { success: true, asset };
  } catch (error: any) {
    console.error("Error creating stage asset:", error);
    return { success: false, error: error.message };
  }
}

export async function updateStageAsset(id: string, data: {
  type: string;
  label: string;
  category: string;
  widthClass: string;
  svgContent?: string;
  imageUrl?: string;
  isActive: boolean;
}) {
  try {
    const asset = await prisma.stageAssetDefinition.update({
      where: { id },
      data,
    });
    revalidatePath("/super-admin/stage-assets");
    return { success: true, asset };
  } catch (error: any) {
    console.error("Error updating stage asset:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteStageAsset(id: string) {
  try {
    await prisma.stageAssetDefinition.delete({
      where: { id },
    });
    revalidatePath("/super-admin/stage-assets");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting stage asset:", error);
    return { success: false, error: error.message };
  }
}

export async function seedDefaultStageAssets() {
  try {
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

    let added = 0;
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
        added++;
      }
    }
    revalidatePath("/super-admin/stage-assets");
    return { success: true, count: added };
  } catch (error: any) {
    console.error("Error seeding assets:", error);
    return { success: false, error: error.message };
  }
}

export async function suggestSvgIcon(label: string, skipIndex: number = 0) {
  try {
    const dictionary: Record<string, string> = {
      'bateria': 'drum',
      'baixo': 'guitar bass',
      'guitarra': 'electric guitar',
      'violino': 'violin',
      'violao': 'acoustic guitar',
      'teclado': 'piano',
      'piano': 'piano',
      'sax': 'saxophone',
      'voz': 'microphone',
      'vocal': 'microphone',
      'mic': 'microphone',
      'sopro': 'trumpet',
      'trompete': 'trumpet',
      'congas': 'drum',
      'percussao': 'percussion',
      'retorno': 'speaker',
      'amp': 'amplifier',
      'amplificador': 'amplifier',
      'monitor': 'speaker',
      'luz': 'light',
      'praticavel': 'stage',
      'dj': 'turntable',
      'stand': 'music stand',
      'sub': 'subwoofer',
      'caixa': 'speaker'
    };

    const normalizedLabel = label.toLowerCase();
    let query = 'music instrument';

    for (const [key, value] of Object.entries(dictionary)) {
      if (normalizedLabel.includes(key)) {
        query = value;
        break;
      }
    }

    const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=40`);
    if (!res.ok) throw new Error('Falha na API de Icones');
    
    const json = await res.json();
    
    if (json.icons && json.icons.length > 0) {
      const selected = json.icons[skipIndex % json.icons.length];
      const svgRes = await fetch(`https://api.iconify.design/${selected}.svg`);
      let svgText = await svgRes.text();
      
      // Limpa para currentColor 
      svgText = svgText.replace(/(fill|stroke)="(?!(none|transparent))[^"]+"/g, '$1="currentColor"');
      
      return { success: true, svg: svgText, name: selected };
    }
    
    return { success: false, error: 'Infelizmente não há sugestões visuais para esse termo.' };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

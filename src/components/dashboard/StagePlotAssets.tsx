"use client"

import React from 'react';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type StageItemType =
    | 'drum' | 'keyboard' | 'piano' | 'bass' | 'guitar' | 'guitar-acoustic' | 'sax' | 'trumpet' | 'congas'
    | 'bass-amp' | 'guitar-amp' | 'side' | 'monitor' | 'drum-sub' | 'mic' | 'mic-handheld'
    | 'di' | 'power' | 'riser' | 'stand' | 'backdrop' | 'percussion';

export interface StageItem {
    id: string;
    type: string; // Changed from StageItemType to support database IDs
    x: number;
    y: number;
    label: string;
    rotation: number;
    scale: number;
    svgContent?: string | null;
    imageUrl?: string | null;
}

// ----------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------

export interface ElementConfig {
    label: string;
    spriteId: string;
    width: string;
    category: string;
}

export const ELEMENT_CONFIG: Record<StageItemType, ElementConfig> = {
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

// ----------------------------------------------------------------------
// Svg Component (mask-based to inherit text color)
// ----------------------------------------------------------------------
export const SvgInstrument = ({ name, className }: { name: string, className?: string }) => {
  return (
    <div 
      className={`bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(/icons/instruments/${name}.svg)`,
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskImage: `url(/icons/instruments/${name}.svg)`,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
      }}
    />
  );
};

export const StageItemIcon = ({ 
    type, 
    className, 
    svgContent, 
    imageUrl 
}: { 
    type: string, 
    className?: string,
    svgContent?: string | null,
    imageUrl?: string | null
}) => {
    // If we have explicit database content, use it
    if (svgContent) {
        // Safe Base64 encoding for SVG
        const svgNormalized = svgContent.includes('xmlns=') 
            ? svgContent 
            : svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        
        const svgBase64 = typeof window === 'undefined' 
            ? Buffer.from(svgNormalized).toString('base64') 
            : btoa(unescape(encodeURIComponent(svgNormalized)));
        
        const dataUriTarget = `data:image/svg+xml;base64,${svgBase64}`;

        return (
            <div 
                className={`bg-current ${className || 'w-20 h-20'}`}
                style={{
                    WebkitMaskImage: `url("${dataUriTarget}")`,
                    WebkitMaskPosition: 'center',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    maskImage: `url("${dataUriTarget}")`,
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                }}
            />
        );
    }

    if (imageUrl) {
        return <img src={imageUrl} alt={type} className={`object-contain ${className || 'w-20 h-20'}`} />;
    }

    // Fallback to hardcoded configuration
    const config = ELEMENT_CONFIG[type as StageItemType];
    if (!config) return <div className={`bg-zinc-800 rounded ${className || 'w-10 h-10'}`} />;

    const iconClassName = className || config.width;
    return <SvgInstrument name={config.spriteId} className={iconClassName} />;
};

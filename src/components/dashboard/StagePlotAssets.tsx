"use client"

import React from 'react';
import { InstrumentIcon } from './InstrumentIcon';
import * as NewIcons from './StagePlotIcons';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type StageItemType =
    | 'drum' | 'keyboard' | 'piano' | 'bass' | 'guitar' | 'guitar-acoustic' | 'sax' | 'trumpet' | 'congas'
    | 'bass-amp' | 'guitar-amp' | 'side' | 'monitor' | 'drum-sub' | 'mic' | 'mic-handheld'
    | 'di' | 'power' | 'riser' | 'stand' | 'backdrop' | 'percussion';

export interface StageItem {
    id: string;
    type: StageItemType;
    x: number;
    y: number;
    label: string;
    rotation: number;
    scale: number;
}

// ----------------------------------------------------------------------
// Configuration (Using Sprite Center)
// ----------------------------------------------------------------------

export interface ElementConfig {
    label: string;
    spriteId: string;
    width: string;
    category: string;
}

export const ELEMENT_CONFIG: Record<StageItemType, ElementConfig> = {
    'drum': { label: 'BATERIA COMPLETE', spriteId: 'drum', width: 'w-32 h-32', category: 'Ritmo' },
    'percussion': { label: 'PERCUSSÃO', spriteId: 'drum', width: 'w-24 h-24', category: 'Ritmo' },
    'congas': { label: 'SET CONGAS', spriteId: 'drum', width: 'w-20 h-24', category: 'Ritmo' },
    'keyboard': { label: 'TECLADO / SYNTH', spriteId: 'keyboard', width: 'w-32 h-16', category: 'Harmonia' },
    'piano': { label: 'PIANO DIGITAL', spriteId: 'keyboard', width: 'w-32 h-20', category: 'Harmonia' },
    'bass': { label: 'BAIXO ELÉTRICO', spriteId: 'bass', width: 'w-12 h-32', category: 'Cordas' },
    'guitar': { label: 'GTR ELÉTRICA', spriteId: 'guitar', width: 'w-12 h-32', category: 'Cordas' },
    'guitar-acoustic': { label: 'GTR ACÚSTICA', spriteId: 'guitar-acoustic', width: 'w-14 h-32', category: 'Cordas' },
    'sax': { label: 'SAXOFONE', spriteId: 'guitar', width: 'w-14 h-24', category: 'Sopro' },
    'trumpet': { label: 'TROMPETE', spriteId: 'guitar', width: 'w-16 h-12', category: 'Sopro' },
    'bass-amp': { label: 'AMP BAIXO STACK', spriteId: 'amp', width: 'w-20 h-24', category: 'Amps' },
    'guitar-amp': { label: 'AMP GTR STACK', spriteId: 'amp', width: 'w-20 h-24', category: 'Amps' },
    'side': { label: 'SIDE FILL', spriteId: 'speaker', width: 'w-20 h-20', category: 'PA' },
    'monitor': { label: 'RETORNO (WEDGE)', spriteId: 'monitor', width: 'w-16 h-12', category: 'PA' },
    'drum-sub': { label: 'SUB BATERA', spriteId: 'speaker', width: 'w-16 h-16', category: 'PA' },
    'mic': { label: 'VOZ (PEDESTAL)', spriteId: 'mic', width: 'w-16 h-16', category: 'Voz' },
    'mic-handheld': { label: 'VOZ (MÃO)', spriteId: 'mic', width: 'w-8 h-12', category: 'Voz' },
    'di': { label: 'DI BOX / DIRECT', spriteId: 'di', width: 'w-14 h-10', category: 'Infra' },
    'power': { label: 'PONTO ENERGIA', spriteId: 'power', width: 'w-14 h-14', category: 'Infra' },
    'riser': { label: 'PRATICÁVEL', spriteId: 'riser', width: 'w-32 h-20', category: 'Estrutura' },
    'stand': { label: 'STAND INSTRUM.', spriteId: 'drum', width: 'w-24 h-16', category: 'Estrutura' },
    'backdrop': { label: 'BACKDROP / BANNER', spriteId: 'riser', width: 'w-48 h-16', category: 'Estrutura' },
};

export const StageItemIcon = ({ type, className }: { type: StageItemType, className?: string }) => {
    const config = ELEMENT_CONFIG[type];
    if (!config) return null;

    const iconClassName = className || config.width;

    switch (type) {
        case 'drum': return <NewIcons.DrumKitIcon className={iconClassName} />;
        case 'keyboard': 
        case 'piano': return <NewIcons.KeyboardIcon className={iconClassName} />;
        case 'guitar-amp': 
        case 'bass-amp': return <NewIcons.GuitarAmpIcon className={iconClassName} />;
        case 'monitor': return <NewIcons.MonitorIcon className={iconClassName} />;
        case 'mic': return <NewIcons.MicStandIcon className={iconClassName} />;
        case 'guitar': return <NewIcons.GuitarIcon className={iconClassName} />;
        case 'bass': return <NewIcons.BassIcon className={iconClassName} />;
        default: return <InstrumentIcon name={config.spriteId} className={iconClassName} />;
    }
};

"use client"

import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
}

/**
 * Super Brutalist UI Block component.
 * Replaces all 'drawn' or 'SVG' instruments with a professional architectural block.
 */
export const BrutalistBlock = ({ text, sub, className, size = "100%" }: { text: string, sub?: string, className?: string, size?: number | string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    {/* Fundo leve para o bloco */}
    <rect x="0" y="0" width="100" height="100" fill="currentColor" fillOpacity="0.05" />
    
    {/* Moldura rígida externa */}
    <rect x="2" y="2" width="96" height="96" fill="none" strokeWidth="4" />
    
    {/* Crosshairs de precisão nos cantos (estilo target/CAD) */}
    <path d="M2 20 L20 20 L20 2 M80 2 L80 20 L98 20 M2 80 L20 80 L20 98 M98 80 L80 80 L80 98" fill="none" strokeWidth="4" />
    
    {/* Center Typography (Block Text) */}
    <text 
      x="50" 
      y={sub ? "54" : "60"} 
      fontSize={sub ? "32" : "36"} 
      fontWeight="900" 
      fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" 
      textAnchor="middle" 
      fill="currentColor" 
      stroke="none" 
      letterSpacing="2"
    >
      {text}
    </text>
    
    {/* Subtexto técnico opcional */}
    {sub && (
      <text 
        x="50" 
        y="78" 
        fontSize="14" 
        fontWeight="bold" 
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" 
        textAnchor="middle" 
        fill="currentColor" 
        stroke="none" 
        opacity="0.8" 
        letterSpacing="4"
      >
        {sub}
      </text>
    )}
  </svg>
);

// We export named components so it doesn't break the current imports
export const DrumKitIcon: React.FC<IconProps> = (props) => <BrutalistBlock text="DRM" sub="KIT" {...props} />;
export const GuitarAmpIcon: React.FC<IconProps> = (props) => <BrutalistBlock text="AMP" sub="GTR" {...props} />;
export const MonitorIcon: React.FC<IconProps> = (props) => <BrutalistBlock text="MON" sub="WEDGE" {...props} />;
export const MicStandIcon: React.FC<IconProps> = (props) => (
  // O microfone ainda precisa ser notável por seu raio de alcance e base
  <svg viewBox="0 0 100 100" width={props.size || "100%"} height={props.size || "100%"} className={props.className} stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4" strokeDasharray="8 8" opacity="0.6" />
    <rect x="35" y="40" width="30" height="20" fill="currentColor" />
    <text x="50" y="56" fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle" fill="#0a0a0a" stroke="none">MIC</text>
  </svg>
);
export const KeyboardIcon: React.FC<IconProps> = (props) => <BrutalistBlock text="SYN" sub="KEYS" {...props} />;
export const GuitarIcon: React.FC<IconProps> = (props) => <BrutalistBlock text="GTR" sub="ELEC" {...props} />;
export const BassIcon: React.FC<IconProps> = (props) => <BrutalistBlock text="BASS" sub="ELEC" {...props} />;

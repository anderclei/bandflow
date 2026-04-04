"use client"

import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
}

/**
 * Drum Kit (Bateria Completa) - Vista Superior Técnica
 */
export const DrumKitIcon: React.FC<IconProps> = ({ className, size = "100%" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hardware Connectors */}
    <path d="M50 75 L30 55 M50 75 L70 65 M50 75 L45 42 M50 75 L55 42" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    
    {/* Throne (Seat) */}
    <circle cx="50" cy="92" r="7" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="50" cy="92" r="1.5" fill="currentColor" />
    
    {/* Bass Drum (Bumbo) */}
    <ellipse cx="50" cy="72" rx="22" ry="18" stroke="currentColor" strokeWidth="2.5" />
    <path d="M32 72 L68 72" stroke="currentColor" strokeWidth="0.5" opacity="0.4" strokeDasharray="2 1" />
    
    {/* Snare (Caixa) */}
    <circle cx="26" cy="55" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M19 55 L33 55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" /> 
    
    {/* Tom 1 & 2 */}
    <circle cx="40" cy="40" r="8" stroke="currentColor" strokeWidth="2" />
    <circle cx="60" cy="40" r="8" stroke="currentColor" strokeWidth="2" />
    
    {/* Floor Tom (Surdo) */}
    <circle cx="75" cy="62" r="12" stroke="currentColor" strokeWidth="2" />
    
    {/* Hi-hat */}
    <circle cx="12" cy="65" r="10" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="65" r="2" fill="currentColor" />
    
    {/* Left Crash */}
    <circle cx="10" cy="35" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
    <circle cx="10" cy="35" r="1.5" fill="currentColor" />
    
    {/* Right Ride */}
    <circle cx="85" cy="38" r="15" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
    <circle cx="85" cy="38" r="2.5" fill="currentColor" />
    
    {/* Kick Pedal */}
    <rect x="47" y="85" width="6" height="5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
  </svg>
);

/**
 * Guitar/Bass Amp - Vista Superior Detalhada
 */
export const GuitarAmpIcon: React.FC<IconProps> = ({ className, size = "100%" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cabinet main body */}
    <rect x="15" y="30" width="70" height="45" stroke="currentColor" strokeWidth="2.5" />
    {/* Front Grille detail */}
    <rect x="20" y="35" width="60" height="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.4" />
    {/* Control Panel Area */}
    <line x1="15" y1="38" x2="85" y2="38" stroke="currentColor" strokeWidth="1" />
    <circle cx="25" cy="34" r="1.5" fill="currentColor" />
    <circle cx="32" cy="34" r="1.2" fill="currentColor" opacity="0.6" />
    <circle cx="39" cy="34" r="1.2" fill="currentColor" opacity="0.6" />
    {/* Top Handle */}
    <rect x="42" y="50" width="16" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/**
 * Mic Stand (Pedestal Boom) - Vista Superior Técnica
 */
export const MicStandIcon: React.FC<IconProps> = ({ className, size = "100%" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tripod base */}
    <path d="M50 50 L35 75 M50 50 L65 75 M50 50 L50 25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="1.5" fill="currentColor" />
    {/* Boom Arm */}
    <line x1="50" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Counter-weight */}
    <rect x="35" y="48" width="6" height="4" fill="currentColor" opacity="0.4" />
    {/* The Microphone */}
    <rect x="85" y="46" width="12" height="8" rx="2" fill="currentColor" />
    <rect x="87" y="48" width="8" height="4" stroke="black" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

/**
 * Keyboard / Synth - Vista Superior
 */
export const KeyboardIcon: React.FC<IconProps> = ({ className, size = "100%" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="35" width="80" height="30" stroke="currentColor" strokeWidth="2" />
    {/* White keys markings */}
    <line x1="10" y1="45" x2="90" y2="45" stroke="currentColor" strokeWidth="1" />
    <path d="M20 45 L20 65 M30 45 L30 65 M40 45 L40 65 M50 45 L50 65 M60 45 L60 65 M70 45 L70 65 M80 45 L80 65" 
          stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    {/* Control Panel Area */}
    <rect x="15" y="38" width="20" height="4" stroke="currentColor" strokeWidth="1" />
  </svg>
);

/**
 * Stage Monitor (Wedge) - Vista Superior Técnica
 */
export const MonitorIcon: React.FC<IconProps> = ({ className, size = "100%" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Technical Wedge Shape */}
    <path d="M15 75 L40 25 L85 45 L60 85 Z" stroke="currentColor" strokeWidth="2.5" />
    {/* Speaker grille details */}
    <path d="M35 55 L50 42 M45 68 L65 52" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
    <circle cx="50" cy="58" r="8" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    {/* Port detail */}
    <rect x="68" y="65" width="6" height="6" stroke="currentColor" strokeWidth="1" opacity="0.4" />
  </svg>
);

/**
 * Electric Guitar - Vista Superior Técnica
 */
export const GuitarIcon: React.FC<IconProps> = ({ className, size = "100%" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <path d="M35 60 C35 85 65 85 65 60 C65 45 58 40 50 40 C42 40 35 45 35 60" stroke="currentColor" strokeWidth="2.5" />
    {/* Pickups */}
    <rect x="42" y="55" width="16" height="5" stroke="currentColor" strokeWidth="1" />
    <rect x="42" y="65" width="16" height="5" stroke="currentColor" strokeWidth="1" />
    {/* Neck */}
    <rect x="47" y="5" width="6" height="35" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    {/* Headstock */}
    <path d="M45 5 L55 5 L58 0 L42 0 Z" fill="currentColor" />
  </svg>
);

/**
 * Bass Guitar - Vista Superior Técnica
 */
export const BassIcon: React.FC<IconProps> = ({ className, size = "100%" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body - Larger than guitar */}
    <path d="M30 65 C30 90 70 90 70 65 C70 45 60 40 50 40 C40 40 30 45 30 65" stroke="currentColor" strokeWidth="2.5" />
    {/* P-Bass Style Pickups */}
    <rect x="40" y="58" width="10" height="5" stroke="currentColor" strokeWidth="1" />
    <rect x="50" y="63" width="10" height="5" stroke="currentColor" strokeWidth="1" />
    {/* Neck - Longer and thicker */}
    <rect x="46" y="-5" width="8" height="45" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    {/* Headstock */}
    <path d="M44 -5 L56 -5 L60 -12 L40 -12 Z" fill="currentColor" />
  </svg>
);

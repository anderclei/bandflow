import React from 'react';

/**
 * StageIcons - Professional Top-View (TecRider Style)
 * These icons are designed to be used in technical stage plots.
 * Colors are inherited from 'currentColor' to allow branding integration.
 */
export const StageIcons = {
  // --- DRUMS ---
  DRUM_KICK: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <rect x="42" y="8" width="16" height="4" rx="1" fill="currentColor" opacity="0.8"/>
      <rect x="42" y="88" width="16" height="4" rx="1" fill="currentColor" opacity="0.8"/>
      <text x="50" y="54" fontSize="12" textAnchor="middle" fill="currentColor" fontWeight="bold" letterSpacing="1">KICK</text>
    </svg>
  ),
  DRUM_SNARE: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="4"/>
      <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6"/>
      <rect x="35" y="48" width="30" height="4" rx="1" fill="currentColor" opacity="0.2"/>
      <text x="50" y="55" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="900">SNARE</text>
    </svg>
  ),
  DRUM_TOM: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <text x="50" y="54" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">TOM</text>
    </svg>
  ),
  DRUM_FLOOR_TOM: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="50" r="31" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="20" cy="30" r="2" fill="currentColor"/>
      <circle cx="80" cy="30" r="2" fill="currentColor"/>
      <circle cx="50" cy="85" r="2" fill="currentColor"/>
      <text x="50" y="54" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">F-TOM</text>
    </svg>
  ),
  DRUM_HIHAT: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="4"/>
      <circle cx="50" cy="50" r="22" fill="currentColor" fillOpacity="0.1"/>
      <circle cx="50" cy="50" r="4" fill="currentColor"/>
      <path d="M50 24V40M50 60V76M24 50H40M60 50H76" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <text x="50" y="90" fontSize="9" textAnchor="middle" fill="currentColor" fontWeight="bold">H-HAT</text>
    </svg>
  ),
  DRUM_CYMBAL: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1"/>
      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      <path d="M50 15L50 85M15 50L85 50" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
      <text x="50" y="92" fontSize="9" textAnchor="middle" fill="currentColor" fontWeight="bold">CYMBAL</text>
    </svg>
  ),

  // --- AMPLIFIERS & CABS ---
  GUITAR_AMP: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="35" width="80" height="30" rx="2" stroke="currentColor" strokeWidth="4"/>
      <rect x="15" y="39" width="70" height="4" fill="currentColor" fillOpacity="0.1"/>
      <circle cx="25" cy="41" r="2" fill="currentColor"/>
      <circle cx="35" cy="41" r="2" fill="currentColor"/>
      <circle cx="45" cy="41" r="2" fill="currentColor"/>
      <text x="50" y="85" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="900">GTR AMP</text>
    </svg>
  ),
  BASS_AMP: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="15" y="30" width="70" height="40" rx="2" stroke="currentColor" strokeWidth="4"/>
      <rect x="25" y="35" width="50" height="30" fill="currentColor" fillOpacity="0.1"/>
      <rect x="75" y="35" width="6" height="30" rx="1" fill="currentColor" opacity="0.2"/>
      <text x="50" y="90" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="900">BASS AMP</text>
    </svg>
  ),

  // --- AUDIO GEAR ---
  MONITOR_WEDGE: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 25H95L85 75H15L5 25Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
      <rect x="25" y="35" width="50" height="25" rx="1" fill="currentColor" fillOpacity="0.1"/>
      <text x="50" y="90" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">MONITOR</text>
    </svg>
  ),
  MONITOR_SIDE_FILL: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="20" y="20" width="60" height="60" rx="2" stroke="currentColor" strokeWidth="4"/>
      <circle cx="50" cy="40" r="15" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <circle cx="50" cy="65" r="8" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <text x="50" y="95" fontSize="9" textAnchor="middle" fill="currentColor" fontWeight="black text-xs">SIDEFILL</text>
    </svg>
  ),
  MIC_STAND: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="3"/>
      <path d="M50 50L85 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="90" cy="50" r="3" fill="currentColor"/>
      <path d="M50 50L30 35M50 50L30 65" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <text x="50" y="90" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">MIC</text>
    </svg>
  ),
  DI_BOX: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="25" y="40" width="50" height="20" rx="1" stroke="currentColor" strokeWidth="3"/>
      <circle cx="35" cy="50" r="3" fill="currentColor"/>
      <circle cx="65" cy="50" r="3" fill="currentColor"/>
      <text x="50" y="85" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="black">DI BOX</text>
    </svg>
  ),

  // --- INSTRUMENTS ---
  KEYBOARD: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="5" y="38" width="90" height="24" rx="1" stroke="currentColor" strokeWidth="3"/>
      <rect x="10" y="42" width="80" height="16" fill="currentColor" fillOpacity="0.05"/>
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={8 + i * 4.3} y="42" width="0.5" height="16" fill="currentColor" opacity="0.2"/>
      ))}
      <rect x="15" y="42" width="2" height="10" fill="currentColor"/>
      <rect x="19" y="42" width="2" height="10" fill="currentColor"/>
      <rect x="26" y="42" width="2" height="10" fill="currentColor"/>
      <text x="50" y="85" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="900">KEYS</text>
    </svg>
  ),
  PIANO_GRAND: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 20H40C70 20 90 40 90 60V70C90 75 85 80 80 80H10V20Z" stroke="currentColor" strokeWidth="4"/>
      <rect x="15" y="24" width="2" height="52" fill="currentColor" opacity="0.3"/>
      <text x="45" y="55" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="900">GRAND PIANO</text>
    </svg>
  ),

  // --- LOGISTICS ---
  POWER_AC: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="35" y="35" width="30" height="30" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="45" cy="50" r="3" fill="currentColor"/>
      <circle cx="55" cy="50" r="3" fill="currentColor"/>
      <path d="M40 20H60V35H40V20Z" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <text x="50" y="85" fontSize="9" textAnchor="middle" fill="currentColor" fontWeight="black">POWER</text>
    </svg>
  ),
  MUSIC_STAND: (props: any) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="25" y="35" width="50" height="30" rx="1" stroke="currentColor" strokeWidth="3" transform="rotate(-15 50 50)"/>
      <line x1="50" y1="65" x2="50" y2="90" stroke="currentColor" strokeWidth="2"/>
      <text x="50" y="25" fontSize="9" textAnchor="middle" fill="currentColor" fontWeight="bold">STAND</text>
    </svg>
  ),
};

export type StageIconType = keyof typeof StageIcons;

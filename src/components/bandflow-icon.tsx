"use client"

import React from "react"
import Image from "next/image"

interface BandFlowIconProps {
  className?: string
  size?: number | string
  glow?: boolean
}

const LOGO_PATH = "/logos/bandflow_logo_icon_v1_1775358497227.png"

export function BandFlowIcon({ className = "", size, glow = true }: BandFlowIconProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const style = pixelSize ? { width: pixelSize, height: pixelSize } : {};

  return (
    <div 
      className={`relative ${className} flex items-center justify-center aspect-[100/130]`} 
      style={style}
    >
      <Image 
        src={LOGO_PATH}
        alt="BandFlow Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}


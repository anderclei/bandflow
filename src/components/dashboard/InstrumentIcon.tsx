import type { FC } from 'react'

type InstrumentIconProps = {
  name: string
  size?: number | string
  color?: string
  className?: string
}

export const InstrumentIcon: FC<InstrumentIconProps> = ({ name, size = "100%", color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    className={className}
    style={{ color }}
    aria-hidden="true"
  >
    <use href={`/icons/instruments.svg#${name}`} />
  </svg>
)

import { useId } from 'react'
import type { EmblemDesign, EmblemMetal, EmblemSymbol } from '../game/types'

const METALS: Record<EmblemMetal, { dark: string; mid: string; light: string }> = {
  bronze: { dark: '#6f4f2c', mid: '#b48854', light: '#e4c48d' },
  gold: { dark: '#8a652f', mid: '#c9a25c', light: '#f4dca7' },
  ivory: { dark: '#93866e', mid: '#d6c8ad', light: '#fbf4e6' },
  emerald: { dark: '#2c5b46', mid: '#6f9c7f', light: '#c4dfc9' },
}

export function Emblem({
  design,
  className = '',
  label,
}: {
  design: EmblemDesign
  className?: string
  label?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const metal = METALS[design.metal]
  const shapeId = `emblem_shape_${uid}`
  const innerId = `emblem_inner_${uid}`
  const metalId = `emblem_metal_${uid}`
  const glowId = `emblem_glow_${uid}`

  const outline =
    design.shape === 'circle'
      ? 'M60 12a48 48 0 1 1 0 96 48 48 0 1 1 0-96Z'
      : design.shape === 'shield'
        ? 'M60 10 103 25v37c0 28-18 43-43 51-25-8-43-23-43-51V25Z'
        : star8Path(60, 60, 50, 34)

  const inner =
    design.shape === 'circle'
      ? 'M60 21a39 39 0 1 1 0 78 39 39 0 1 1 0-78Z'
      : design.shape === 'shield'
        ? 'M60 20 94 32v30c0 22-14 35-34 42-20-7-34-20-34-42V32Z'
        : star8Path(60, 60, 41, 28)

  return (
    <svg
      viewBox="0 0 120 120"
      className={`emblem ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="42%" stopColor={metal.mid} />
          <stop offset="100%" stopColor={metal.dark} />
        </linearGradient>
        <radialGradient id={innerId} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#1c4032" />
          <stop offset="55%" stopColor="#10291f" />
          <stop offset="100%" stopColor="#081811" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={metal.light} stopOpacity="0.2" />
          <stop offset="100%" stopColor={metal.light} stopOpacity="0" />
        </radialGradient>
        <path id={shapeId} d={outline} />
      </defs>
      <circle cx="60" cy="62" r="55" fill="url(#emblem_glow)" opacity="0.6" />
      <path d={outline} fill="url(#emblem_metal)" />
      <path d={outline} fill="none" stroke={metal.light} strokeOpacity="0.5" strokeWidth="1" />
      <path d={inner} fill="url(#emblem_inner)" />
      <path d={inner} fill="url(#emblem_glow)" />
      <path d={inner} fill="none" stroke={metal.mid} strokeWidth="1.6" strokeOpacity="0.9" />
      <g opacity="0.72" fill={metal.mid}>
        <Laurel side="left" />
        <Laurel side="right" />
      </g>
      <g transform="translate(60 61) scale(1.55)" fill={`url(#${metalId})`} stroke="none">
        <EmblemSymbolArt symbol={design.symbol} metal={metal} />
      </g>
      <circle cx="60" cy="18" r="1.8" fill={metal.light} opacity="0.85" />
    </svg>
  )
}

function Laurel({ side }: { side: 'left' | 'right' }) {
  const mirror = side === 'right' ? 'translate(120 0) scale(-1 1)' : undefined
  return (
    <g transform={mirror}>
      <path d="M45 78c-8-8-12-18-11-28" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx={36 + i * 1.7}
          cy={70 - i * 5.4}
          rx="4"
          ry="1.7"
          transform={`rotate(${-42 + i * 4} ${36 + i * 1.7} ${70 - i * 5.4})`}
          fill="currentColor"
        />
      ))}
    </g>
  )
}

function EmblemSymbolArt({ symbol, metal }: { symbol: EmblemSymbol; metal: { dark: string; light: string } }) {
  switch (symbol) {
    case 'star':
      return <polygon points={starPoints(5, 14, 5.8)} />
    case 'crescent':
      return (
        <path d="M7-15a16 16 0 1 0 0 30A13 13 0 1 1 7-15Z" />
      )
    case 'sun':
      return (
        <g>
          <circle r="9" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="-0.9" y="-17" width="1.8" height="5" rx="0.9" transform={`rotate(${i * 30})`} />
          ))}
        </g>
      )
    case 'tree':
      return (
        <g>
          <polygon points="0,-16 9,-3 2.5,-3 12,8 2,8 2,15 -2,15 -2,8 -12,8 -2.5,-3 -9,-3" />
        </g>
      )
    case 'eagle':
      return (
        <g>
          <path d="M0-12c3.8 0 6 2.8 6 6.4 0 2.1-.8 3.7-2 5.1 4.1-.5 11.3-4 15.4-10.9 0 9-4.1 16-10 19.4l3.9 6.9-3.6-1.3-2.3 5.6-2.6-5.3-2.5 5.3-2.3-5.6-3.6 1.3 3.9-6.9C4.1 5.7 0 .4 0-9.4c4.1 6.9 11.3 10.4 15.4 10.9-1.2-1.4-2-3-2-5.1C13.4-9.2 11.2-12 7.4-12Z" transform="scale(0.9)" />
          <circle cx="-2.5" cy="-4.2" r="1.1" fill={metal.dark} />
          <circle cx="2.5" cy="-4.2" r="1.1" fill={metal.dark} />
        </g>
      )
    case 'lion':
      return (
        <g>
          <circle r="15" opacity="0.55" />
          <circle r="10.5" fill={metal.dark} />
          <path d="M-7-3c0-4.4 3.2-7.8 7-7.8s7 3.4 7 7.8c0 4.9-3 7.3-7 7.3S-7 1.9-7-3Z" fill={metal.light} />
          <circle cx="-2.8" cy="-3.8" r="0.95" fill={metal.dark} />
          <circle cx="2.8" cy="-3.8" r="0.95" fill={metal.dark} />
          <path d="M-2 0.8h4M0 0.8v2.4" stroke={metal.dark} strokeWidth="0.9" />
        </g>
      )
    case 'wheat':
      return (
        <g>
          <rect x="-0.9" y="-8" width="1.8" height="24" rx="0.9" />
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse key={i} cx="-4.5" cy={-5 + i * 3.4} rx="2.4" ry="3.6" transform={`rotate(-28 -4.5 ${-5 + i * 3.4})`} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse key={`r${i}`} cx="4.5" cy={-5 + i * 3.4} rx="2.4" ry="3.6" transform={`rotate(28 4.5 ${-5 + i * 3.4})`} />
          ))}
          <ellipse cx="0" cy="-13" rx="2.2" ry="3.6" />
        </g>
      )
    case 'mountain':
      return (
        <g>
          <polygon points="-16,10 -6,-6 2,5 7,-2 16,10" />
          <circle cx="8" cy="-10" r="3.4" />
        </g>
      )
    case 'ship':
      return (
        <g>
          <path d="M-15 4h30l-4 7h-22Z" />
          <rect x="-1" y="-14" width="2" height="18" />
          <path d="M1-13h11l-4 8H1Z" />
          <path d="M-1-10h-9l3 7h6Z" />
          <path d="M-14 13c4 3 8 3 12 0 4 3 8 3 12 0" fill="none" stroke={metal.light} strokeWidth="1.4" />
        </g>
      )
    case 'crown':
      return (
        <polygon points="-15,8 -15,-8 -8,-2 -1,-12 6,-2 14,-8 14,8" />
      )
    default:
      return null
  }
}

function Star() {
  return <polygon points={starPoints(8, 15, 7)} />
}

function starPoints(points: number, outer: number, inner: number): string {
  const coords: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / points) * i - Math.PI / 2
    coords.push(`${(Math.cos(angle) * r).toFixed(2)},${(Math.sin(angle) * r).toFixed(2)}`)
  }
  return coords.join(' ')
}

function star8Path(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = []
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / 8) * i - Math.PI / 2
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(2)} ${(cy + Math.sin(angle) * r).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
}

export { Star }

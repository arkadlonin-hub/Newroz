import { useId } from 'react'
import type { CountryIdentity, FlagDesign, FlagSymbol } from '../game/types'

const FLAG_RATIO = 3 / 4

export function Flag({
  identity,
  className = '',
  label,
}: {
  identity: CountryIdentity
  className?: string
  label?: string
}) {
  const useOfficial = identity.kind === 'real' && identity.flag.preset === 'official' && identity.cca2
  if (useOfficial) {
    return (
      <span className={`flag ${className}`} aria-label={label ?? `علم ${identity.nameAr}`} role="img">
        <img
          src={`/flags/${identity.cca2!.toLowerCase()}.svg`}
          alt=""
          loading="lazy"
          draggable={false}
        />
      </span>
    )
  }
  return (
    <span className={`flag ${className}`} aria-label={label ?? `علم ${identity.nameAr}`} role="img">
      <FlagArt design={identity.flag} />
    </span>
  )
}

export function FlagArt({ design, className = '' }: { design: FlagDesign; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const clip = `flagclip_${uid}`
  const [a, b, c] = design.colors
  return (
    <svg
      viewBox="0 0 60 40"
      className={`flag-art ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width="60" height="40" rx="1.5" />
        </clipPath>
        <linearGradient id={`sheen_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {design.pattern === 'solid' && <rect width="60" height="40" fill={a} />}
        {design.pattern === 'horizontal' && (
          <>
            <rect width="60" height="13.34" fill={a} />
            <rect y="13.33" width="60" height="13.34" fill={b} />
            <rect y="26.66" width="60" height="13.34" fill={c} />
          </>
        )}
        {design.pattern === 'vertical' && (
          <>
            <rect width="20" height="40" fill={a} />
            <rect x="20" width="20" height="40" fill={b} />
            <rect x="40" width="20" height="40" fill={c} />
          </>
        )}
        {design.pattern === 'triband' && (
          <>
            <rect width="60" height="40" fill={a} />
            <rect y="15" width="60" height="10" fill={b} />
            <rect y="13.8" width="60" height="1.2" fill={c} />
            <rect y="25" width="60" height="1.2" fill={c} />
          </>
        )}
        {design.pattern === 'canton' && (
          <>
            <rect width="60" height="40" fill={a} />
            <rect y="27" width="60" height="13" fill={c} />
            <rect y="25.6" width="60" height="1.4" fill={b} />
            <rect width="24" height="17" fill={b} />
          </>
        )}
        {design.pattern === 'diagonal' && (
          <>
            <rect width="60" height="40" fill={a} />
            <polygon points="0,40 60,0 60,14 14,40" fill={b} />
            <polygon points="0,40 8,40 60,3 60,0" fill={c} />
          </>
        )}
        {design.pattern === 'chevron' && (
          <>
            <rect width="60" height="40" fill={a} />
            <rect width="9" height="40" fill={c} />
            <polygon points="9,0 26,20 9,40 9,31 16,20 9,9" fill={b} />
            <rect x="9" width="1.4" height="40" fill={c} opacity="0.9" />
          </>
        )}
        {design.symbol !== 'none' && (
          <FlagSymbolArt symbol={design.symbol} color={design.symbolColor} />
        )}
        <rect width="60" height="40" fill={`url(#sheen_${uid})`} />
      </g>
    </svg>
  )
}

function FlagSymbolArt({ symbol, color }: { symbol: FlagSymbol; color: string }) {
  return (
    <g transform="translate(30 20)" fill={color} stroke="none">
      {symbol === 'star' && <Star points={5} outer={7.4} inner={3.1} />}
      {symbol === 'star8' && <Star points={8} outer={8} inner={3.6} />}
      {symbol === 'crescent' && (
        <path
          d="M4.6 -8.8A9.4 9.4 0 1 0 4.6 8.8A7.6 7.6 0 1 1 4.6 -8.8Z"
          transform="translate(1 0)"
        />
      )}
      {symbol === 'sun' && (
        <g>
          <circle r="5.4" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="-0.55"
              y="-10.4"
              width="1.1"
              height="3.4"
              rx="0.55"
              transform={`rotate(${i * 30})`}
            />
          ))}
        </g>
      )}
      {symbol === 'tree' && (
        <g>
          <polygon points="0,-10 5.6,-2.4 1.6,-2.4 7,4.6 1.4,4.6 1.4,10 -1.4,10 -1.4,4.6 -7,4.6 -1.6,-2.4 -5.6,-2.4" />
        </g>
      )}
      {symbol === 'eagle' && (
        <g>
          <path d="M0 -7.4c2.3 0 3.7 1.7 3.7 3.9 0 1.3-.5 2.3-1.2 3.2 2.5-.3 6.9-2.5 9.4-6.7 0 5.5-2.5 9.8-6.1 11.9l2.4 4.2-2.2-.8-1.4 3.4-1.6-3.2-1.5 3.2-1.4-3.4-2.2.8 2.4-4.2C2.9 2.8.4-1.5.4-7c2.5 4.2 6.9 6.4 9.4 6.7-.7-.9-1.2-1.9-1.2-3.2 0-2.2 1.4-3.9 1.4-3.9Z" />
          <circle cx="-1.5" cy="-3.6" r="0.7" fill="#12241d" />
          <circle cx="1.5" cy="-3.6" r="0.7" fill="#12241d" />
        </g>
      )}
      {symbol === 'lion' && (
        <g>
          <circle r="8.6" opacity="0.75" />
          <circle r="5.8" fill="#12241d" />
          <path
            d="M-4.2-1.8c0-2.6 1.9-4.6 4.2-4.6s4.2 2 4.2 4.6c0 2.9-1.8 4.3-4.2 4.3S-4.2 1.1-4.2-1.8Z"
            fill={color}
          />
          <circle cx="-1.6" cy="-2.3" r="0.55" fill="#12241d" />
          <circle cx="1.6" cy="-2.3" r="0.55" fill="#12241d" />
          <path d="M-1.2 0.6h2.4M0 0.6v1.4" stroke="#12241d" strokeWidth="0.55" />
        </g>
      )}
      {symbol === 'wheat' && (
        <g>
          <rect x="-0.55" y="-4.5" width="1.1" height="15" rx="0.55" />
          {Array.from({ length: 5 }).map((_, i) => (
            <ellipse
              key={i}
              cx="-2.6"
              cy={-3 + i * 2.2}
              rx="1.5"
              ry="2.3"
              transform={`rotate(-28 -2.6 ${-3 + i * 2.2})`}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <ellipse
              key={`r${i}`}
              cx="2.6"
              cy={-3 + i * 2.2}
              rx="1.5"
              ry="2.3"
              transform={`rotate(28 2.6 ${-3 + i * 2.2})`}
            />
          ))}
          <ellipse cx="0" cy="-8.4" rx="1.4" ry="2.4" />
        </g>
      )}
      {symbol === 'mountain' && (
        <g>
          <polygon points="-10,7 -3.6,-4 1.6,3.6 4.4,-1 10,7" />
          <circle cx="5.6" cy="-6.6" r="2.1" />
        </g>
      )}
      {symbol === 'flame' && (
        <path d="M0-10c2.4 4.3 5.6 5.8 5.6 9.5C5.6 3.6 3.1 6 0 6S-5.6 3.6-5.6-.5c0-2.4 1.3-4 2.6-5.7C-2.2-2.7-1-1.8-.2-1.8.9-1.8 1.2-4.6 0-10Z" />
      )}
    </g>
  )
}

function Star({ points, outer, inner }: { points: number; outer: number; inner: number }) {
  const coords: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / points) * i - Math.PI / 2
    coords.push(`${(Math.cos(angle) * r).toFixed(2)},${(Math.sin(angle) * r).toFixed(2)}`)
  }
  return <polygon points={coords.join(' ')} />
}

export { FLAG_RATIO }

export function Logo({ size = 54, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`logo-mark ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="newrozLogoMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7ca96" />
          <stop offset="48%" stopColor="#b48854" />
          <stop offset="100%" stopColor="#7c5a34" />
        </linearGradient>
        <radialGradient id="newrozLogoField" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#204836" />
          <stop offset="100%" stopColor="#0a1b14" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#newrozLogoField)" stroke="url(#newrozLogoMetal)" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="25.5" fill="none" stroke="#d9bd8c" strokeOpacity="0.22" strokeWidth="0.8" />
      <g fill="url(#newrozLogoMetal)">
        <path d="M19 40.5c3.1-3.2 6.4-4.8 9.7-4.8 2.4 0 4.1 1 6.1 1 2.3 0 4.5-1.2 6.9-3.4-1 6.4-4.4 9.7-8.9 9.7-2.7 0-4.5-1-6.5-1-2.2 0-4.3 1.2-6.1 3.5Z" />
        <path d="M21 46.2h22l-1.3 2.6H22.3Z" opacity="0.9" />
        <path d="M24.8 51.4h14.4l-.9 1.8h-12.6Z" opacity="0.6" />
        <path d="M32 13.4c2.2 3.6 5.1 4.5 5.1 7.6 0 2.4-2.2 4.2-5.1 4.2s-5.1-1.8-5.1-4.2c0-3.1 2.9-4 5.1-7.6Z" />
      </g>
      <circle cx="32" cy="9" r="1.3" fill="#e7ca96" />
    </svg>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <Logo size={compact ? 38 : 50} />
      <div className="brand__text">
        <span className="brand__name">نيـروز</span>
        {!compact && <span className="brand__sub">NEWROZ · محاكاة عالم حي</span>}
      </div>
    </div>
  )
}

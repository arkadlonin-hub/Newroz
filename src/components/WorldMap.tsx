import { useEffect, useMemo, useRef, useState } from 'react'
import {
  geoGraticule10,
  geoNaturalEarth1,
  geoPath,
  type GeoProjection,
} from 'd3-geo'
import { feature } from 'topojson-client'
import countriesTopoRaw from 'world-atlas/countries-110m.json'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Topology, GeometryCollection } from 'topojson-specification'
import { COUNTRY_BY_CCN3 } from '../data/countries'
import type { CountryRecord } from '../game/types'
import { formatPopulation } from '../lib/format'
import { LocateFixed, Minus, Plus, RotateCcw } from 'lucide-react'
import { IconButton } from './ui/Controls'

const topo = countriesTopoRaw as unknown as Topology<{ countries: GeometryCollection }>
const COUNTRIES = feature(topo, topo.objects.countries) as FeatureCollection<Geometry>
const graticule = geoGraticule10()

const WIDTH = 960
const HEIGHT = 500

function makeProjection(): GeoProjection {
  return geoNaturalEarth1().fitExtent(
    [
      [8, 6],
      [WIDTH - 8, HEIGHT - 6],
    ],
    { type: 'Sphere' },
  )
}

interface WorldMapProps {
  selectedCode?: string | null
  focusCode?: string | null
  onSelect?: (record: CountryRecord) => void
  picking?: boolean
  location?: [number, number] | null
  onLocationChange?: (coords: [number, number]) => void
  compact?: boolean
  markerLabel?: string
  className?: string
}

export function WorldMap({
  selectedCode,
  focusCode,
  onSelect,
  picking = false,
  location,
  onLocationChange,
  compact = false,
  markerLabel,
  className = '',
}: WorldMapProps) {
  const projection = useMemo(makeProjection, [])
  const path = useMemo(() => geoPath(projection), [projection])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<{ record: CountryRecord | null; x: number; y: number } | null>(null)
  const [transform, setTransform] = useState('translate(0 0) scale(1)')
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (picking || !focusCode) {
      setTransform('translate(0 0) scale(1)')
      setZoom(1)
      return
    }
    const f = COUNTRIES.features.find((c) => COUNTRY_BY_CCN3.get(String(c.id))?.cca2 === focusCode)
    if (!f) return
    const bounds = path.bounds(f)
    const w = bounds[1][0] - bounds[0][0]
    const h = bounds[1][1] - bounds[0][1]
    if (w <= 0 || h <= 0) return
    const cx = (bounds[0][0] + bounds[1][0]) / 2
    const cy = (bounds[0][1] + bounds[1][1]) / 2
    const scale = Math.max(1.05, Math.min(7, Math.min((WIDTH * 0.55) / w, (HEIGHT * 0.6) / h)))
    setZoom(scale)
    setTransform(`translate(${WIDTH / 2 - cx * scale} ${HEIGHT / 2 - cy * scale}) scale(${scale})`)
  }, [focusCode, path, picking])

  const records = useMemo(() => {
    const map = new Map<string, CountryRecord | null>()
    for (const f of COUNTRIES.features) {
      map.set(String(f.id), COUNTRY_BY_CCN3.get(String(f.id)) ?? null)
    }
    return map
  }, [])

  const selectedFeatureCode = selectedCode
  const markerPoint = !picking && location ? projection(location) : picking && location ? projection(location) : null

  const handleMove = (e: React.MouseEvent<SVGPathElement>, record: CountryRecord | null) => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return
    setHover({ record, x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!picking || !onLocationChange) return
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const local = pt.matrixTransform(ctm.inverse())
    const inverted = projection.invert?.([local.x, local.y])
    if (!inverted) return
    const [lng, lat] = inverted
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return
    if (Math.abs(lat) > 78) return
    onLocationChange([Math.round(lat * 10) / 10, Math.round(lng * 10) / 10])
  }

  const zoomBy = (factor: number) => {
    setZoom((prev) => {
      const next = Math.max(1, Math.min(7, prev * factor))
      if (next === 1) setTransform('translate(0 0) scale(1)')
      else {
        const cx = WIDTH / 2
        const cy = HEIGHT / 2
        setTransform(`translate(${cx - cx * next} ${cy - cy * next}) scale(${next})`)
      }
      return next
    })
  }

  return (
    <div
      ref={wrapperRef}
      className={`world-map ${compact ? 'world-map--compact' : ''} ${className}`}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={`world-map__svg ${picking ? 'is-picking' : ''}`}
        role="group"
        aria-label="خريطة العالم الحقيقية"
        onClick={handleSvgClick}
      >
        <defs>
          <radialGradient id="mapOcean" cx="42%" cy="36%" r="80%">
            <stop offset="0%" stopColor="#1c3d30" />
            <stop offset="65%" stopColor="#122b21" />
            <stop offset="100%" stopColor="#0a1c15" />
          </radialGradient>
          <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#mapOcean)" rx="18" />
        <g transform={transform} className="world-map__layer">
          <path d={path({ type: 'Sphere' }) ?? ''} fill="none" stroke="rgba(196,214,194,0.16)" strokeWidth="1" />
          <path d={path(graticule) ?? ''} fill="none" stroke="rgba(190,209,190,0.08)" strokeWidth="0.6" />
          {COUNTRIES.features.map((f) => {
            const key = String(f.id)
            const record = records.get(key)
            const isSelected = !!record && record.cca2 === selectedFeatureCode
            const isHovered = !!record && hover?.record?.cca2 === record.cca2
            return (
              <path
                key={key}
                d={path(f) ?? ''}
                className={`world-map__country ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''} ${record ? '' : 'is-territory'}`}
                vectorEffect="non-scaling-stroke"
                onMouseEnter={(e) => handleMove(e, record ?? null)}
                onMouseMove={(e) => handleMove(e, record ?? null)}
                onMouseLeave={() => setHover(null)}
                onClick={(e) => {
                  if (picking) return
                  e.stopPropagation()
                  if (record && onSelect) onSelect(record)
                }}
                tabIndex={record && !picking ? 0 : -1}
                role={record && !picking ? 'button' : undefined}
                aria-label={record ? `اختيار ${record.nameAr}` : undefined}
                onKeyDown={(e) => {
                  if (!record || !onSelect || picking) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(record)
                  }
                }}
              >
                <title>{record?.nameAr ?? ''}</title>
              </path>
            )
          })}
          {selectedFeatureCode &&
            COUNTRIES.features.map((f) => {
              const record = records.get(String(f.id))
              if (!record || record.cca2 !== selectedFeatureCode) return null
              return (
                <path
                  key={`outline-${f.id}`}
                  d={path(f) ?? ''}
                  fill="none"
                  stroke="#f0d6a4"
                  strokeWidth="1.8"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#mapGlow)"
                  opacity="0.65"
                />
              )
            })}
          {markerPoint && (
            <g transform={`translate(${markerPoint[0]} ${markerPoint[1]})`} className="world-map__marker">
              <circle r="15" fill="rgba(220,185,124,0.12)" />
              <circle r="7" fill="rgba(220,185,124,0.22)" />
              <circle r="3.2" fill="#e9cf9e" stroke="#10241b" strokeWidth="1" />
              <line x1="0" y1="-11" x2="0" y2="-22" stroke="rgba(233,207,158,0.65)" strokeWidth="1" />
              {markerLabel && (
                <text
                  y="-27"
                  textAnchor="middle"
                  className="world-map__marker-label"
                  fill="#f2e6cf"
                  fontSize="10"
                >
                  {markerLabel}
                </text>
              )}
            </g>
          )}
        </g>
      </svg>

      {picking && (
        <div className="world-map__hint">
          <LocateFixed size={15} />
          <span>انقر على الموقع التقريبي لدولتك على الخريطة</span>
        </div>
      )}
      {!picking && !compact && (
        <div className="world-map__legend">
          <span className="world-map__dot" /> دولة قابلة للاختيار
          {selectedCode && (
            <span className="world-map__selected-label">
              <span className="world-map__dot world-map__dot--gold" /> المحددة
            </span>
          )}
        </div>
      )}
      {!picking && zoom > 1.05 && (
        <button
          type="button"
          className="world-map__reset"
          onClick={() => {
            setZoom(1)
            setTransform('translate(0 0) scale(1)')
          }}
        >
          <RotateCcw size={13} /> إعادة ضبط العرض
        </button>
      )}
      {hover && hover.record && !picking && (
        <div
          className="world-map__tooltip glass"
          style={{ left: hover.x, top: hover.y }}
        >
          <span className="world-map__tooltip-flag flag">
            <img src={`/flags/${hover.record.cca2.toLowerCase()}.svg`} alt="" />
          </span>
          <span>
            <strong>{hover.record.nameAr}</strong>
            <small>
              {hover.record.regionAr} · {formatPopulation(hover.record.population ?? 0)}
            </small>
          </span>
        </div>
      )}
      {!picking && !compact && (
        <div className="world-map__zoomread" aria-hidden>
          <IconButton label="تصغير الخريطة" onClick={() => zoomBy(1 / 1.6)}>
            <Minus size={13} />
          </IconButton>
          <span>{zoom.toFixed(1)}×</span>
          <IconButton label="تكبير الخريطة" onClick={() => zoomBy(1.6)}>
            <Plus size={13} />
          </IconButton>
        </div>
      )}
    </div>
  )
}

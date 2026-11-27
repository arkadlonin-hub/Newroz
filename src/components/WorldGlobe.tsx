import { useEffect, useRef } from 'react'
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from 'd3-geo'
import { feature } from 'topojson-client'
import landTopoRaw from 'world-atlas/land-110m.json'
import countriesTopoRaw from 'world-atlas/countries-110m.json'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Topology, GeometryCollection } from 'topojson-specification'

const landTopo = landTopoRaw as unknown as Topology<{ land: GeometryCollection }>
const countriesTopo = countriesTopoRaw as unknown as Topology<{ countries: GeometryCollection }>

const LAND = feature(landTopo, landTopo.objects.land) as Feature<Geometry> | FeatureCollection<Geometry>
const COUNTRIES = feature(
  countriesTopo,
  countriesTopo.objects.countries,
) as FeatureCollection<Geometry>

const CITIES: { name: string; coords: [number, number]; accent?: boolean }[] = [
  { name: 'الرياض', coords: [46.7, 24.7], accent: true },
  { name: 'القاهرة', coords: [31.2, 30], accent: true },
  { name: 'إسطنبول', coords: [29, 41] },
  { name: 'لندن', coords: [-0.1, 51.5] },
  { name: 'نيويورك', coords: [-74, 40.7] },
  { name: 'طوكيو', coords: [139.7, 35.7] },
  { name: 'نيروبي', coords: [36.8, -1.3] },
  { name: 'ساو باولو', coords: [-46.6, -23.5] },
  { name: 'دلهي', coords: [77.2, 28.6] },
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function WorldGlobe({
  className = '',
  motionEnabled = true,
  interactive = true,
}: {
  className?: string
  motionEnabled?: boolean
  interactive?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<number>(0)
  const rotationRef = useRef<[number, number]>([-30, -18])
  const dragRef = useRef<{ active: boolean; x: number; y: number; moved: number }>({
    active: false,
    x: 0,
    y: 0,
    moved: 0,
  })
  const idleRef = useRef(0)
  const visibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 0
    let height = 0
    let dpr = 1
    const stars = Array.from({ length: 180 }, (_, i) => {
      const rand = seededRandom(91 + i * 37)
      return {
        x: rand(),
        y: rand(),
        r: 0.4 + rand() * 1.3,
        a: 0.08 + rand() * 0.5,
        phase: rand() * Math.PI * 2,
      }
    })
    const projection = geoOrthographic().clipAngle(90).precision(0.6)
    const path = geoPath(projection, ctx)
    const graticule = geoGraticule10()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.8)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    let lastFrame = 0
    const draw = (time: number) => {
      frameRef.current = requestAnimationFrame(draw)
      if (!visibleRef.current) return
      if (time - lastFrame < 30) return
      const delta = lastFrame ? Math.min(60, time - lastFrame) : 16
      lastFrame = time

      if (motionEnabled && !dragRef.current.active && time - idleRef.current > 2200) {
        rotationRef.current[0] += delta * 0.0028
      }

      const [lambda, phi] = rotationRef.current
      projection
        .scale(Math.min(width, height) * 0.405)
        .translate([width * 0.5, height * 0.5])
        .rotate([lambda, phi])
      const radius = projection.scale()
      const cx = width * 0.5
      const cy = height * 0.5

      ctx.clearRect(0, 0, width, height)

      // Star field
      for (const star of stars) {
        const twinkle = motionEnabled ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.0006 + star.phase)) : 1
        ctx.globalAlpha = star.a * twinkle
        ctx.fillStyle = '#d9e6d9'
        ctx.beginPath()
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Orbital ring
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-0.28)
      ctx.beginPath()
      ctx.ellipse(0, 0, radius * 1.34, radius * 0.36, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(196,164,112,0.16)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(0, 0, radius * 1.5, radius * 0.44, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(196,164,112,0.06)'
      ctx.stroke()
      ctx.restore()

      // Atmosphere
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.26)
      glow.addColorStop(0, 'rgba(89,140,112,0.0)')
      glow.addColorStop(0.36, 'rgba(98,150,121,0.15)')
      glow.addColorStop(0.62, 'rgba(168,180,143,0.06)')
      glow.addColorStop(1, 'rgba(20,46,35,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.26, 0, Math.PI * 2)
      ctx.fill()

      // Ocean sphere
      const ocean = ctx.createRadialGradient(
        cx - radius * 0.4,
        cy - radius * 0.45,
        radius * 0.08,
        cx,
        cy,
        radius,
      )
      ocean.addColorStop(0, '#2b5b47')
      ocean.addColorStop(0.45, '#1b4133')
      ocean.addColorStop(0.8, '#102d23')
      ocean.addColorStop(1, '#081b14')
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = ocean
      ctx.fill()

      // Graticule
      ctx.beginPath()
      path(graticule)
      ctx.strokeStyle = 'rgba(190,209,190,0.12)'
      ctx.lineWidth = 0.6
      ctx.stroke()

      // Countries
      for (const country of COUNTRIES.features) {
        ctx.beginPath()
        path(country)
        const id = Number(country.id ?? 0)
        const shade = 0.82 + ((id * 37) % 17) / 100
        ctx.fillStyle = `rgba(43,82,63,${0.55 * shade})`
        ctx.fill()
        ctx.strokeStyle = 'rgba(120,157,130,0.24)'
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      // Land silhouette highlight
      ctx.beginPath()
      path(LAND)
      ctx.fillStyle = 'rgba(120,164,133,0.06)'
      ctx.fill()

      // Daylight and night shading clipped to sphere
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()
      const light = ctx.createRadialGradient(
        cx - radius * 0.48,
        cy - radius * 0.52,
        radius * 0.05,
        cx - radius * 0.2,
        cy - radius * 0.2,
        radius * 1.5,
      )
      light.addColorStop(0, 'rgba(246,235,207,0.2)')
      light.addColorStop(0.42, 'rgba(246,235,207,0.03)')
      light.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = light
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      const night = ctx.createRadialGradient(
        cx + radius * 0.65,
        cy + radius * 0.7,
        radius * 0.05,
        cx + radius * 0.4,
        cy + radius * 0.4,
        radius * 1.2,
      )
      night.addColorStop(0, 'rgba(3,10,7,0.55)')
      night.addColorStop(1, 'rgba(3,10,7,0)')
      ctx.fillStyle = night
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)

      // Weather haze
      const hazeTime = motionEnabled ? time * 0.00002 : 0
      for (let i = 0; i < 3; i++) {
        const hx = cx - radius * 0.6 + ((i * 0.7 + hazeTime) % 1.6) * radius
        const hy = cy - radius * 0.45 + i * radius * 0.42
        const haze = ctx.createRadialGradient(hx, hy, 0, hx, hy, radius * 0.62)
        haze.addColorStop(0, 'rgba(226,236,222,0.05)')
        haze.addColorStop(1, 'rgba(226,236,222,0)')
        ctx.fillStyle = haze
        ctx.beginPath()
        ctx.ellipse(hx, hy, radius * 0.62, radius * 0.2, -0.25, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // City pulses
      const center: [number, number] = [-lambda, -phi]
      for (const city of CITIES) {
        const distance = geoDistance(city.coords, center)
        if (distance > Math.PI / 2 - 0.09) continue
        const point = projection(city.coords)
        if (!point) continue
        const fade = Math.min(1, (Math.PI / 2 - distance) * 4)
        const pulse = motionEnabled ? 0.5 + 0.5 * Math.sin(time * 0.002 + city.coords[0]) : 1
        ctx.globalAlpha = fade
        ctx.beginPath()
        ctx.arc(point[0], point[1], city.accent ? 2.2 : 1.5, 0, Math.PI * 2)
        ctx.fillStyle = city.accent ? '#e5c590' : '#c7d8c6'
        ctx.fill()
        if (city.accent) {
          ctx.beginPath()
          ctx.arc(point[0], point[1], 4 + pulse * 5, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(229,197,144,${0.34 * (1 - pulse)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1

      // Edge vignette
      const vignette = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.18)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(4,12,9,0.5)')
      ctx.fillStyle = vignette
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.18, 0, Math.PI * 2)
      ctx.fill()

      // Rim light
      ctx.beginPath()
      ctx.arc(cx, cy, radius - 0.5, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(205,220,200,0.22)'
      ctx.lineWidth = 1.1
      ctx.stroke()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.02 },
    )
    visibilityObserver.observe(canvas)
    frameRef.current = requestAnimationFrame(draw)

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frameRef.current)
      observer.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [motionEnabled])

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return
    dragRef.current = { active: true, x: e.clientX, y: e.clientY, moved: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.x
    const dy = e.clientY - dragRef.current.y
    dragRef.current.x = e.clientX
    dragRef.current.y = e.clientY
    dragRef.current.moved += Math.abs(dx) + Math.abs(dy)
    rotationRef.current[0] += dx * 0.28
    rotationRef.current[1] = Math.max(-62, Math.min(62, rotationRef.current[1] + dy * 0.2))
    idleRef.current = performance.now()
  }
  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false
    idleRef.current = performance.now()
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className={`world-globe ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label="كرة أرضية تفاعلية لخريطة العالم الحقيقية"
      role="img"
    />
  )
}

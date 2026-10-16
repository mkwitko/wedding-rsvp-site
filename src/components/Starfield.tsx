import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  a: number
  tw: number
  depth: number // 0.3 far .. 1 near — drives parallax + drift speed
  vx: number // slow horizontal drift ("passando")
  vy: number
}

interface Shooting {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  len: number
}

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0
    let h = 0
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const N = Math.min(320, Math.floor((w * h) / 4200))
    const mk = (): Star => {
      const depth = 0.3 + Math.random() * 0.7
      const dir = Math.random() < 0.5 ? -1 : 1
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.4 + Math.random() * 1.5) * depth,
        a: 0.25 + Math.random() * 0.55,
        tw: 0.004 + Math.random() * 0.02,
        depth,
        vx: dir * (0.05 + Math.random() * 0.18) * depth,
        vy: (0.01 + Math.random() * 0.05) * depth,
      }
    }
    const stars: Star[] = Array.from({ length: N }, mk)

    // pointer / tilt parallax, smoothed
    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      tx = Math.max(-1, Math.min(1, e.gamma / 30))
      ty = Math.max(-1, Math.min(1, e.beta / 30))
    }

    const shooters: Shooting[] = []

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(240, 224, 170, ${s.a})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (reduce) {
      drawStatic()
      const onResizeStatic = () => {
        resize()
        drawStatic()
      }
      window.addEventListener('resize', onResizeStatic)
      return () => window.removeEventListener('resize', onResizeStatic)
    }

    let raf = 0
    let t = 0
    const draw = () => {
      t += 1
      px += (tx - px) * 0.05
      py += (ty - py) * 0.05
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        // drift + wrap
        s.x += s.vx
        s.y += s.vy
        if (s.x < -4) s.x = w + 4
        else if (s.x > w + 4) s.x = -4
        if (s.y > h + 4) {
          s.y = -4
          s.x = Math.random() * w
        }

        const alpha = Math.max(0, s.a + Math.sin(t * s.tw + s.x) * 0.3)
        const sx = s.x + px * 16 * s.depth
        const sy = s.y + py * 16 * s.depth
        ctx.beginPath()
        ctx.fillStyle = `rgba(240, 224, 170, ${alpha})`
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2)
        ctx.fill()
        if (s.depth > 0.82) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(230, 201, 118, ${alpha * 0.12})`
          ctx.arc(sx, sy, s.r * 4.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // shooting stars — a touch more frequent
      if (shooters.length < 3 && Math.random() < 0.009) {
        const fromLeft = Math.random() < 0.5
        shooters.push({
          x: fromLeft ? -40 : w + 40,
          y: Math.random() * h * 0.6,
          vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 5),
          vy: 2 + Math.random() * 2.5,
          life: 1,
          len: 100 + Math.random() * 100,
        })
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i]
        sh.x += sh.vx
        sh.y += sh.vy
        sh.life -= 0.011
        const norm = Math.hypot(sh.vx, sh.vy)
        const tailX = sh.x - (sh.vx / norm) * sh.len
        const tailY = sh.y - (sh.vy / norm) * sh.len
        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 246, 223, ${Math.max(0, sh.life) * 0.95})`)
        grad.addColorStop(1, 'rgba(255, 246, 223, 0)')
        ctx.beginPath()
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.moveTo(sh.x, sh.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()
        if (sh.life <= 0 || sh.x < -80 || sh.x > w + 80 || sh.y > h + 80) {
          shooters.splice(i, 1)
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('deviceorientation', onTilt)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

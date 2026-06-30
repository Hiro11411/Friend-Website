import { useEffect, useRef, useState } from 'react'

export interface Tilt {
  x: number  // rotateX (vertical mouse)
  y: number  // rotateY (horizontal mouse)
  z: number  // rotateZ (Dutch angle)
}

const ZERO: Tilt = { x: 0, y: 0, z: 0 }

export function useCameraTilt(enabled: boolean): Tilt {
  const target = useRef<Tilt>(ZERO)
  const current = useRef<Tilt>(ZERO)
  const [tilt, setTilt] = useState<Tilt>(ZERO)
  const rafId = useRef<number>(0)

  useEffect(() => {
    if (!enabled) {
      setTilt(ZERO)
      return
    }

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5   // -0.5 → 0.5
      const ny = e.clientY / window.innerHeight - 0.5  // -0.5 → 0.5
      target.current = {
        x: ny * -7,    // tilt toward vertical mouse (rack-focus feel)
        y: nx * 5,     // tilt toward horizontal mouse
        z: nx * 1.3,   // subtle Dutch angle
      }
    }

    const onLeave = () => {
      target.current = ZERO
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const FACTOR = 0.055  // lag = camera weight

    const tick = () => {
      const c = current.current
      const t = target.current
      current.current = {
        x: lerp(c.x, t.x, FACTOR),
        y: lerp(c.y, t.y, FACTOR),
        z: lerp(c.z, t.z, FACTOR),
      }
      setTilt({ ...current.current })
      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId.current)
    }
  }, [enabled])

  return tilt
}

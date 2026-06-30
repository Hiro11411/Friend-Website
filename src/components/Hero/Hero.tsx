import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useCameraTilt } from '../../hooks/useCameraTilt'
import styles from './Hero.module.css'

const HeroScene = lazy(() =>
  import('./HeroScene').then(m => ({ default: m.HeroScene }))
)

export function Hero() {
  const reduced = useReducedMotion()

  // Camera tilt starts after the entry slam finishes
  const [tiltOn, setTiltOn] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setTiltOn(true), 850)
    return () => clearTimeout(t)
  }, [])
  const tilt = useCameraTilt(!reduced && tiltOn)

  // Scroll exit: content tilts back as hero leaves viewport
  const heroRef = useRef<HTMLElement>(null)
  const [scrollTilt, setScrollTilt] = useState(0)
  const [exitOpacity, setExitOpacity] = useState(1)

  useEffect(() => {
    if (reduced) return
    const hero = heroRef.current
    if (!hero) return
    const onScroll = () => {
      const p = window.scrollY / hero.offsetHeight
      setScrollTilt(Math.min(p * 16, 12))
      setExitOpacity(Math.max(1 - p * 2.8, 0))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])

  const innerStyle: React.CSSProperties = reduced ? {} : {
    transform: `rotateX(${tilt.x - scrollTilt}deg) rotateY(${tilt.y}deg) rotateZ(${tilt.z}deg)`,
    opacity: exitOpacity,
  }

  return (
    <section ref={heroRef} className={styles.hero} id="top">
      {!reduced && (
        <div className={styles.canvas} style={{ opacity: exitOpacity }} aria-hidden="true">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      )}
      <div className={styles.spotlight} aria-hidden="true" />

      <div className={styles.inner} style={innerStyle}>
        <p className={`${styles.eye} mono`}
           style={{ '--di': '0.36s' } as React.CSSProperties}>
          HKAPA &nbsp;·&nbsp; BFA FILM &amp; TV
        </p>

        <h1 className={styles.title}>
          <span className={styles.line}
                style={{ '--di': '0s' } as React.CSSProperties}>
            MARCO
          </span>
          <span className={`${styles.line} ${styles.indent}`}
                style={{ '--di': '0.08s' } as React.CSSProperties}>
            LO
          </span>
        </h1>

        <p className={`${styles.role} mono`}
           style={{ '--di': '0.46s' } as React.CSSProperties}>
          Film Editor &amp; Cinematographer
        </p>

        <Link to="/work" className={styles.viewWork}
              style={{ '--di': '0.58s' } as React.CSSProperties}>
          View the Work →
        </Link>
      </div>

      <div className={styles.foot}>
        <span className="mono" style={{ color: 'var(--gray-700)' }}>EN · 粵 · 普</span>
      </div>
    </section>
  )
}

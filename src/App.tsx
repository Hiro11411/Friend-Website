import { useState } from 'react'
import { MainScene } from './scene/MainScene'
import { Nav } from './components/Nav/Nav'
import { useReducedMotion } from './hooks/useReducedMotion'
import type { SectionName } from './scene/types'
import Slideshow from './components/ui/slideshow'

export default function App() {
  const [section, setSection] = useState<SectionName>('hero')
  const reducedMotion = useReducedMotion()

  return (
    <>
      {/* 1 — Canvas (z:1, opaque black). Background for non-hero sections. */}
      <MainScene
        activeSection={section}
        onNavigate={setSection}
        reducedMotion={reducedMotion}
      />

      {/*
        2 — Slideshow (z:2, above canvas).
        Visible only at hero; fades out when camera leaves.
        pointer-events:auto so the ← → buttons are always tappable.
        NO canvas transparency tricks needed — just z-index layering.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          opacity: section === 'hero' ? 1 : 0,
          pointerEvents: section === 'hero' ? 'auto' : 'none',
          transition: 'opacity 0.7s ease',
          background: '#080808',
        }}
      >
        <Slideshow />
      </div>

      {/* 3 — Vignette (z:55, pointer-events:none) */}
      <div className="vignette" aria-hidden="true" />

      {/* 4 — Nav (z:100) — transparent, no background, sees slideshow through */}
      <Nav activeSection={section} onNavigate={setSection} />
    </>
  )
}

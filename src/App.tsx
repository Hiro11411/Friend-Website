import { useState } from 'react'
import { MainScene } from './scene/MainScene'
import { Nav } from './components/Nav/Nav'
import { HeroOverlay } from './components/HeroOverlay'
import { useReducedMotion } from './hooks/useReducedMotion'
import type { SectionName } from './scene/types'
import Slideshow from './components/ui/slideshow'

export default function App() {
  const [section, setSection] = useState<SectionName>('hero')
  const reducedMotion = useReducedMotion()

  return (
    <>
      {/* z:1 — Canvas (opaque black background) */}
      <MainScene
        activeSection={section}
        onNavigate={setSection}
        reducedMotion={reducedMotion}
      />

      {/* z:2 — Slideshow images (hero only, fades out on navigate) */}
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

      {/* z:55 — Vignette */}
      <div className="vignette" aria-hidden="true" />

      {/* z:60 — Hero text (plain fixed DOM, no drei stacking issues) */}
      {section === 'hero' && (
        <HeroOverlay onNavigate={setSection} />
      )}

      {/* z:100 — Nav */}
      <Nav activeSection={section} onNavigate={setSection} />
    </>
  )
}

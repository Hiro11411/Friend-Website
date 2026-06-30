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
      {/*
        Slideshow lives BEHIND the canvas as a real DOM element.
        The canvas is now transparent (alpha:true), so whatever is
        here shows straight through to the nav and everywhere else.
        Fades out when the camera leaves the hero.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#080808',
          opacity: section === 'hero' ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}
      >
        <Slideshow />
      </div>

      <div className="vignette" aria-hidden="true" />

      <MainScene
        activeSection={section}
        onNavigate={setSection}
        reducedMotion={reducedMotion}
      />

      <Nav activeSection={section} onNavigate={setSection} />
    </>
  )
}

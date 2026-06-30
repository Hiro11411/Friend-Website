import { useState } from 'react'
import { MainScene } from './scene/MainScene'
import { Nav } from './components/Nav/Nav'
import { useReducedMotion } from './hooks/useReducedMotion'
import type { SectionName } from './scene/types'

export default function App() {
  const [section, setSection] = useState<SectionName>('hero')
  const reducedMotion = useReducedMotion()

  return (
    <>
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

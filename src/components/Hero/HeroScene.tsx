import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PresentationControls } from '@react-three/drei'
import { FilmSculpture } from './FilmSculpture'

/* ---- Lights: one hard key + minimal fill ---- */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.04} />
      {/* Single hard key light — the Whiplash spotlight */}
      <directionalLight position={[5, 7, 3]} intensity={5.0} color="#ffffff" />
      {/* Dim fill from below to barely lift deep shadows */}
      <directionalLight position={[-4, -3, -1]} intensity={0.5} color="#888888" />
    </>
  )
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 6.5], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      /* frameloop="always" needed for FilmSculpture's slow idle rotation */
      frameloop="always"
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#080808']} />

      <Lights />

      <Suspense fallback={null}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 420, friction: 38 }}
          snap={{ mass: 4, tension: 280, friction: 48 }}
          polar={[-Math.PI / 3.5, Math.PI / 3.5]}
          azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
          rotation={[0.14, 0.22, 0]}
        >
          <FilmSculpture />
        </PresentationControls>
      </Suspense>
    </Canvas>
  )
}

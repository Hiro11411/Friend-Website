/**
 * InfiniteGallery — 3D tunnel that streams images toward the camera.
 * Images are arranged along the Z axis; the camera drifts forward
 * continuously. When a plane passes the near clip threshold it wraps
 * back to the far end, creating an infinite loop.
 *
 * Props intentionally mirror the 21st.dev API:
 *   speed       — base auto-play speed in world units/s  (default 1.2)
 *   zSpacing    — world units between each plane          (default 3)
 *   visibleCount— number of simultaneous planes           (default 12)
 *   falloff     — opacity fade { near, far } in units     (default {0.8, 14})
 */

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Public types ─────────────────────────────────────────────── */
export interface GalleryImage {
  src: string
  alt: string
}

export interface InfiniteGalleryProps {
  images: GalleryImage[]
  speed?: number
  zSpacing?: number
  visibleCount?: number
  falloff?: { near: number; far: number }
  className?: string
  style?: React.CSSProperties
}

/* ─── Constants ─────────────────────────────────────────────────── */
// Camera sits at Z = 5, looks toward −Z.
// CLIP_Z: Z threshold at which a plane wraps back to far end.
const CLIP_Z = 4.0
const AUTO_RESUME_MS = 3000

/* ─── Per-plane offsets for a hand-held, non-mechanical feel ─────── */
function planeOffset(i: number): [number, number, number] {
  const x = ((i * 137.508) % 2 - 1) * 0.38   // ±0.38 horizontal jitter
  const y = ((i * 97.411)  % 2 - 1) * 0.22   // ±0.22 vertical jitter
  const z = ((i * 57.293)  % 2 - 1) * 0.018  // ±1° subtle Dutch roll
  return [x, y, z]
}

/* ─── Scene — renders inside Canvas, owns the rAF loop ──────────── */
interface SceneProps {
  images: GalleryImage[]
  autoSpeed: number
  zSpacing: number
  visibleCount: number
  falloff: { near: number; far: number }
  velocityRef: React.MutableRefObject<number>
  lastActivityRef: React.MutableRefObject<number>
}

function TunnelPlanes({
  images,
  autoSpeed,
  zSpacing,
  visibleCount,
  falloff,
  velocityRef,
  lastActivityRef,
}: SceneProps) {
  // Load all unique textures once; Suspense handles the wait.
  const urls = images.map(img => img.src)
  const textures = useTexture(urls)

  // Refs to all meshes and materials — updated imperatively in useFrame
  // for maximum performance (no React re-renders per frame).
  const meshRefs  = useRef<(THREE.Mesh | null)[]>(Array(visibleCount).fill(null))
  const matRefs   = useRef<(THREE.MeshBasicMaterial | null)[]>(Array(visibleCount).fill(null))
  const camOffset = useRef(0)

  const totalLoop = visibleCount * zSpacing

  useFrame(({ camera, clock }, delta) => {
    const t = clock.getElapsedTime()
    const clamped = Math.min(delta, 0.1) // guard against tab-switch spikes

    /* ── Velocity: auto-play or manual scroll ── */
    const isAuto = Date.now() - lastActivityRef.current > AUTO_RESUME_MS
    if (isAuto) {
      // Smooth lerp back toward base auto-play speed
      velocityRef.current += (autoSpeed - velocityRef.current) * Math.min(clamped * 1.8, 0.14)
    } else {
      // Manual: apply friction so the scroll inertia decays naturally
      velocityRef.current *= Math.pow(0.86, clamped * 60)
    }

    camOffset.current += velocityRef.current * clamped

    /* ── Subtle handheld camera micro-drift ── */
    camera.position.x = Math.sin(t * 0.09) * 0.055
    camera.position.y = Math.sin(t * 0.13) * 0.038

    /* ── Update every plane ── */
    meshRefs.current.forEach((mesh, i) => {
      const mat = matRefs.current[i]
      if (!mesh || !mat) return

      // Wrap Z position within the loop
      const relZ = -(i * zSpacing) + camOffset.current
      const z = ((relZ - CLIP_Z) % totalLoop + totalLoop) % totalLoop + CLIP_Z - totalLoop

      mesh.position.z = z

      // Opacity: fade near (rushes past camera) and far (materialises from dark)
      let opacity = 1
      if (z > CLIP_Z - falloff.near) {
        opacity *= Math.max(0, (CLIP_Z - z) / Math.max(falloff.near, 0.001))
      }
      const farThreshold = CLIP_Z - totalLoop + falloff.far
      if (z < farThreshold) {
        opacity *= Math.max(0, (z - (CLIP_Z - totalLoop)) / Math.max(falloff.far, 0.001))
      }

      mat.opacity = Math.max(0, Math.min(1, opacity))
    })
  })

  return (
    <group>
      {Array.from({ length: visibleCount }, (_, i) => {
        const [xOff, yOff, zRot] = planeOffset(i)
        return (
          <mesh
            key={i}
            ref={el => { meshRefs.current[i] = el }}
            position={[xOff, yOff, -(i * zSpacing)]}
            rotation={[0, 0, zRot]}
          >
            {/* 4.8 × 3.0 ≈ 16:10 — fills ~95% of view at 3 units distance */}
            <planeGeometry args={[4.8, 3.0]} />
            <meshBasicMaterial
              ref={el => { matRefs.current[i] = el }}
              map={textures[i % textures.length]}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ─── Default export ─────────────────────────────────────────────── */
export default function InfiniteGallery({
  images,
  speed = 1.2,
  zSpacing = 3,
  visibleCount = 12,
  falloff = { near: 0.8, far: 14 },
  className,
  style,
}: InfiniteGalleryProps) {
  const containerRef   = useRef<HTMLDivElement>(null)
  // Start at auto speed; wheel/key/touch overrides it temporarily
  const velocityRef    = useRef<number>(speed)
  const lastActivityRef = useRef<number>(0)  // 0 = no recent interaction → auto-play

  /* ── Input handlers ──────────────────────────────────────────── */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const markActive = () => { lastActivityRef.current = Date.now() }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      velocityRef.current += e.deltaY * 0.005
      markActive()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        velocityRef.current += 0.35; markActive()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        velocityRef.current -= 0.35; markActive()
      }
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const dy = touchY - (e.touches[0]?.clientY ?? touchY)
      velocityRef.current += dy * 0.012
      touchY = e.touches[0]?.clientY ?? touchY
      markActive()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      aria-label="Infinite photography gallery — use scroll or arrow keys to navigate"
      role="region"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        frameloop="always"
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#080808']} />

        <Suspense fallback={null}>
          <TunnelPlanes
            images={images}
            autoSpeed={speed}
            zSpacing={zSpacing}
            visibleCount={visibleCount}
            falloff={falloff}
            velocityRef={velocityRef}
            lastActivityRef={lastActivityRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

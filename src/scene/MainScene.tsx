/**
 * MainScene — the single continuous 3D world.
 *
 * Layout (all at Z = 0):
 *   Hero    [  0,   0, 0]  camera: [  0, -0.6, 9] looking at [  0,  0.5, 0]
 *   Work    [ 32,   0, 0]  camera: [ 32,  0,   9] looking at [ 32,  0,   0]
 *   About   [-32,   0, 0]  camera: [-32,  0,   9] looking at [-32,  0,   0]
 *   Contact [  0, -20, 0]  camera: [  0, -20,  9] looking at [  0, -20,  0]
 *
 * The image tunnel lives at the hero origin; as the camera dollies to Work the
 * tunnel drifts left in the background — natural cinematographic parallax.
 *
 * Camera animation: cubic ease-in-out over 2.4 s.
 * Reduced-motion: instant jump with no tween.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  SectionName, FRAMINGS, WORLD,
  PAN_DURATION, easeInOutCubic,
} from './types'
import { VideoPlayer } from '../components/ui/video-thumbnail-player'
import styles from './scene.module.css'

/* ─── camera rig ──────────────────────────────────────────────── */
interface TweenState {
  fromPos: THREE.Vector3; fromTarget: THREE.Vector3
  toPos: THREE.Vector3;   toTarget: THREE.Vector3
  progress: number; active: boolean
  /** +1 / -1 / 0 — direction of X travel, drives the Dutch roll */
  rollDir: number
}

function CameraRig({
  target, reducedMotion, onArrival,
}: {
  target: SectionName
  reducedMotion: boolean
  onArrival: (s: SectionName) => void
}) {
  const { camera } = useThree()
  const lookAt    = useRef(new THREE.Vector3(...FRAMINGS.hero.target))
  const lastTarget = useRef<SectionName>('hero')

  const tween = useRef<TweenState>({
    fromPos:    new THREE.Vector3(...FRAMINGS.hero.position),
    fromTarget: new THREE.Vector3(...FRAMINGS.hero.target),
    toPos:      new THREE.Vector3(...FRAMINGS.hero.position),
    toTarget:   new THREE.Vector3(...FRAMINGS.hero.target),
    progress: 1, active: false, rollDir: 0,
  })
  // Stable ref so the closure in useFrame never goes stale
  const onArrivalRef = useRef(onArrival)
  onArrivalRef.current = onArrival

  useFrame((_, delta) => {
    if (target !== lastTarget.current) {
      lastTarget.current = target
      const f = FRAMINGS[target]
      if (reducedMotion) {
        camera.position.set(...f.position)
        lookAt.current.set(...f.target)
        camera.lookAt(lookAt.current)
        onArrivalRef.current(target)
      } else {
        // Dutch roll direction: camera tilts INTO the horizontal travel
        const dx = f.position[0] - camera.position.x
        tween.current = {
          fromPos:    camera.position.clone(),
          fromTarget: lookAt.current.clone(),
          toPos:      new THREE.Vector3(...f.position),
          toTarget:   new THREE.Vector3(...f.target),
          progress: 0,
          active: true,
          rollDir:    Math.abs(dx) > 4 ? Math.sign(dx) : 0,
        }
      }
    }

    if (!tween.current.active) return

    tween.current.progress = Math.min(1, tween.current.progress + delta / PAN_DURATION)
    const t = easeInOutCubic(tween.current.progress)
    const { fromPos, toPos, fromTarget, toTarget, rollDir } = tween.current

    /*
     * XY — standard lerp (direct path between sections)
     * Z  — sine arc: camera dips TOWARD the content at the midpoint.
     *      With both endpoints at Z=9, sin(πt) peaks at t=0.5 and goes
     *      negative (toward content). Magnitude -3: Z goes 9 → 6 → 9.
     *      This creates genuine depth traversal — you feel the world open
     *      up as the camera pushes toward the scene between sections.
     */
    const x    = THREE.MathUtils.lerp(fromPos.x, toPos.x, t)
    const y    = THREE.MathUtils.lerp(fromPos.y, toPos.y, t)
    const baseZ = THREE.MathUtils.lerp(fromPos.z, toPos.z, t)
    const arcZ  = baseZ + Math.sin(Math.PI * t) * -3.2   // swoop in
    camera.position.set(x, y, arcZ)

    /* LookAt also interpolates — camera re-angles toward the new depth */
    lookAt.current.lerpVectors(fromTarget, toTarget, t)
    camera.lookAt(lookAt.current)

    /*
     * Dutch roll — camera tilts INTO the direction of travel, peaking at
     * the midpoint of the arc. Applied AFTER lookAt so it's a pure roll
     * around the camera's local Z (horizon tilt), not a scene rotation.
     * 0.09 rad ≈ 5° at peak. Only fires for horizontal pans.
     */
    if (rollDir !== 0) {
      camera.rotateZ(rollDir * Math.sin(Math.PI * t) * 0.09)
    }

    if (tween.current.progress >= 1) {
      tween.current.active = false
      onArrivalRef.current(target)
    }
  })

  return null
}

/* ─── hero content ───────────────────────────────────────────── */
function HeroContent({ onNavigate }: { onNavigate: (s: SectionName) => void }) {
  return (
    <div className={styles.hero}>
      <p className={styles.heroEye}>HKAPA &nbsp;·&nbsp; BFA Film &amp; TV</p>

      {/* Clicking the title is the primary CTA — pans to Work */}
      <h1 className={styles.heroTitle} onClick={() => onNavigate('work')}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onNavigate('work')}>
        MARCO<br />LO
      </h1>

      <p className={styles.heroSub}>Film Editor &amp; Cinematographer</p>

    </div>
  )
}

/* ─── work content ───────────────────────────────────────────── */
/* ── Edit these to change the three featured projects ─────────────
   ytId     : YouTube video ID (part after "v=" or "youtu.be/")
   title    : display name — CJK characters fully supported
   embedUrl : privacy-enhanced embed URL that plays inline on click
              use youtube-nocookie.com + ?autoplay=1 (+ &start=N for timestamps)
   ──────────────────────────────────────────────────────────────── */
interface FeaturedProject {
  readonly ytId:     string
  readonly title:    string
  readonly embedUrl: string
}

const FEATURED: FeaturedProject[] = [
  {
    ytId:     'Lp5EitGfI7w',
    title:    '紙紮錄',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Lp5EitGfI7w?autoplay=1',
  },
  {
    ytId:     'PYn619MR76g',
    title:    'Hong Kong Boys',
    embedUrl: 'https://www.youtube-nocookie.com/embed/PYn619MR76g?autoplay=1&start=470',
  },
  {
    ytId:     '6M6RXFChYZI',
    title:    '上落平安',
    embedUrl: 'https://www.youtube-nocookie.com/embed/6M6RXFChYZI?autoplay=1',
  },
]

const MORE_VIDEOS_URL = 'https://docs.google.com/document/d/1biRc5xV7ka9ZqMh5PuJqgNCDAd3nKk34lOpRpcorJWM/edit?tab=t.0'

function WorkContent({ onNavigate }: { onNavigate: (s: SectionName) => void }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionIndex}>02 — SELECTED WORK</span>
        <span className={styles.sectionRule} />
      </div>

      <div className={styles.featGrid}>
        {FEATURED.map(p => (
          <div key={p.ytId} className={styles.featItem}>
            <VideoPlayer
              thumbnailUrl={`https://img.youtube.com/vi/${p.ytId}/mqdefault.jpg`}
              videoUrl={p.embedUrl}
              title={p.title}
            />
            <h2 className={styles.featTitle}>{p.title}</h2>
          </div>
        ))}
      </div>

      <div className={styles.viewMoreRow}>
        <a
          href={MORE_VIDEOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewMore}
        >
          Want to view more →
        </a>
      </div>

      <button className={styles.backBtn} onClick={() => onNavigate('hero')}>
        ← Return to main page
      </button>
    </div>
  )
}

/* ─── about content ──────────────────────────────────────────── */
/* ── Technical Toolkit ─────────────────────────────────────────── */
interface ToolItem {
  name: string
  level: string   // e.g. "Advanced–Intermediate" — shown as muted label
  note: string    // parenthetical context — shown even more muted
  pct: number     // bar fill 0–100
}

const TOOLKIT: ToolItem[] = [
  { name: 'DaVinci Resolve',              level: 'Advanced–Intermediate', note: 'Primary Post-Production Ecosystem',             pct: 78 },
  { name: 'Pro Tools',                    level: 'Intermediate',          note: 'Sound Design & Mixing',                        pct: 60 },
  { name: 'Premiere Pro',                 level: 'Intermediate',          note: 'Video Editing',                                pct: 60 },
  { name: 'Photoshop & Lightroom Classic',level: 'Intermediate',          note: 'Visual Design & Color Grading',                pct: 62 },
  { name: 'Avid Media Composer',          level: 'Entry Level',           note: 'Foundation',                                   pct: 35 },
  { name: 'Canva',                        level: '',                      note: 'Graphic Layout & Pitch Deck Presentation Design', pct: 70 },
]

function ToolRow({ name, level, note, pct, active }: ToolItem & { active: boolean }) {
  const barRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    el.style.setProperty('--fill', active ? `${pct}%` : '0%')
  }, [active, pct])
  return (
    <div className={styles.toolRow}>
      <div className={styles.toolMeta}>
        <span className={styles.toolName}>{name}</span>
        {level && <span className={styles.toolLevel}>{level}</span>}
        <span className={styles.toolNote}>{note}</span>
      </div>
      <span
        ref={barRef}
        className={styles.skillBar}
        style={{ '--fill': '0%' } as React.CSSProperties}
      />
    </div>
  )
}

function AboutContent({ onNavigate }: { onNavigate: (s: SectionName) => void }) {
  const activated = useRef(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (activated.current) return
    activated.current = true
    const t = setTimeout(() => setActive(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.section}>

      {/* ── Top row: image left | about text right ── */}
      <div className={styles.aboutTop}>
        <img
          src="/media/profile.jpeg"
          alt="Marco Lo"
          className={styles.profileImg}
        />
        <div>
          <div className={styles.sectionHead}>
            <span className={styles.sectionIndex}>01 — ABOUT</span>
            <span className={styles.sectionRule} />
          </div>
          <p className={styles.aboutTagline}>Biography</p>
          <div className={styles.aboutBio}>
            <p>I am a Year 3 Film and Television student at the Hong Kong
               Academy for Performing Arts (HKAPA), majoring in editing and
               sound design. Driven by a passion to make audiences deeply feel
               through the screen, I view post-production as the ultimate tool
               for emotional and sensory storytelling.</p>
            <p>My foundation is built on hands-on experience across diverse
               genres, having honed my structural precision and narrative pacing
               through numerous school projects, including documentaries and
               short dramas. I recently completed an industry internship as a
               sound assistant on the feature film <em>Twilight of the Warriors:
               The Final Chapter</em>, gaining invaluable insight into high-end
               professional post-production workflows.</p>
            <p>Armed with technical precision and a creative ear, I am dedicated
               to elevating local cinema — and ultimately bringing my craft to
               global screens.</p>
          </div>
        </div>
      </div>

      {/* ── Bottom row: full-width toolkit ── */}
      <div className={styles.toolkitSection}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionIndex}>TECHNICAL TOOLKIT</span>
          <span className={styles.sectionRule} />
        </div>
        <div className={styles.toolGrid}>
          {TOOLKIT.map(t => (
            <ToolRow key={t.name} {...t} active={active} />
          ))}
        </div>
      </div>

      <button className={styles.backBtn} onClick={() => onNavigate('hero')}>
        ← Return to main page
      </button>
    </div>
  )
}

/* ─── contact content ────────────────────────────────────────── */
function ContactContent({ onNavigate }: { onNavigate: (s: SectionName) => void }) {
  return (
    <div className={styles.contactBody}>
      <h2 className={styles.contactTitle}>
        Let&apos;s cut something<br />
        <span className={styles.contactDim}>unforgettable.</span>
      </h2>
      <p className={styles.contactCopy}>
        Available for editing, cinematography, and design.
        Email is the fastest way in.
      </p>
      <a href="mailto:marcoltc719@gmail.com" className={styles.contactEmail}>
        marcoltc719@gmail.com
      </a>
      <div className={styles.contactLinks}>
        <a href="https://www.linkedin.com/in/mltcmedia/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
          <span className={styles.contactArrow}>→</span> LinkedIn
        </a>
        <a href="mailto:marcoltc719@gmail.com" className={styles.contactLink}>
          <span className={styles.contactArrow}>→</span> Email
        </a>
        <a href="tel:+85291455462" className={styles.contactLink}>
          <span className={styles.contactArrow}>→</span> +852 9145 5462
        </a>
      </div>
      <button className={styles.backBtn} onClick={() => onNavigate('hero')}>
        ← Return to main page
      </button>
    </div>
  )
}

/* ─── exported scene component ──────────────────────────────── */
interface MainSceneProps {
  activeSection: SectionName
  onNavigate: (s: SectionName) => void
  reducedMotion: boolean
}

function SceneContent({ activeSection, onNavigate, reducedMotion }: MainSceneProps) {
  /*
   * arrivedAt: the section we most recently *finished* panning to.
   * Starts as 'hero' (we're already there on load).
   *
   * A section is mounted when:
   *   - it is the current pan DESTINATION (activeSection), OR
   *   - it is where the camera just came from (arrivedAt) — so it's
   *     still visible sliding out during the pan.
   *
   * The moment onArrival fires (pan done), arrivedAt === activeSection,
   * so only the destination is mounted. The source unmounts cleanly.
   */
  const [arrivedAt, setArrivedAt] = useState<SectionName>('hero')
  const handleArrival = useCallback((s: SectionName) => setArrivedAt(s), [])

  const show = (s: SectionName) => s === activeSection || s === arrivedAt

  return (
    <>
      <CameraRig
        target={activeSection}
        reducedMotion={reducedMotion}
        onArrival={handleArrival}
      />

      {/* Hero — [0, 0, 0] */}
      {show('hero') && (
        <group position={WORLD.hero}>
          <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'auto' }}>
            <HeroContent onNavigate={onNavigate} />
          </Html>
        </group>
      )}

      {/* Work — [32, 0, 0] */}
      {show('work') && (
        <group position={WORLD.work}>
          <Html center style={{ pointerEvents: 'auto' }}>
            <WorkContent onNavigate={onNavigate} />
          </Html>
        </group>
      )}

      {/* About — [-32, 0, 0] */}
      {show('about') && (
        <group position={WORLD.about}>
          <Html center style={{ pointerEvents: 'auto' }}>
            <AboutContent onNavigate={onNavigate} />
          </Html>
        </group>
      )}

      {/* Contact — [0, -20, 0] */}
      {show('contact') && (
        <group position={WORLD.contact}>
          <Html center style={{ pointerEvents: 'auto' }}>
            <ContactContent onNavigate={onNavigate} />
          </Html>
        </group>
      )}
    </>
  )
}

export function MainScene({ activeSection, onNavigate, reducedMotion }: MainSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, -0.6, 9], fov: 50 }}
      dpr={[1, 1]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      frameloop="always"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      onCreated={({ camera }) => {
        /* Apply the hero lookAt immediately so Html transforms are correct
           on the very first frame — before CameraRig's useFrame fires. */
        camera.lookAt(
          FRAMINGS.hero.target[0],
          FRAMINGS.hero.target[1],
          FRAMINGS.hero.target[2],
        )
      }}
    >
      <SceneContent
        activeSection={activeSection}
        onNavigate={onNavigate}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  )
}

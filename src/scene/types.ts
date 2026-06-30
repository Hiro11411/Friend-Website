import * as THREE from 'three'

export type SectionName = 'hero' | 'work' | 'about' | 'contact'

export interface Framing {
  position: THREE.Vector3Tuple   // camera position
  target: THREE.Vector3Tuple     // lookAt point
}

/*
 * World positions for each section's content anchor.
 *
 * Sections are NOT all at Z=0 — they sit at different depths so the camera
 * must genuinely point INTO the scene at each framing. This creates real
 * 3D parallax and forces the camera to change its look-angle, not just slide.
 *
 *   hero    — at the origin (Z = 0), the "stage"
 *   work    — deeper into the scene (Z = -3)
 *   about   — deeper into the scene (Z = -3)
 *   contact — deepest (Z = -5), feels like descending into a pit
 */
export const WORLD: Record<SectionName, THREE.Vector3Tuple> = {
  hero:    [0,   0,    0],
  work:    [32,  0,   -3],
  about:   [-32, 0,   -3],
  contact: [0,  -20,  -5],
}

/*
 * Camera framings — camera stays at Z = 9, but looks toward different depths.
 * Hero looks at Z = 0; others look at Z = -3 / -5.
 * This means the camera truly changes its viewing angle between sections,
 * not just its position.
 */
export const FRAMINGS: Record<SectionName, Framing> = {
  hero:    { position: [0,   -0.6,  9],  target: [0,    0.5,  0]  },
  work:    { position: [32,   0,    9],  target: [32,   0,   -3]  },
  about:   { position: [-32,  0,    9],  target: [-32,  0,   -3]  },
  contact: { position: [0,  -20,    9],  target: [0,  -20,   -5]  },
}

/* Camera pan duration in seconds. */
export const PAN_DURATION = 1.7

/*
 * Quintic ease-in-out (5th power) — far more aggressive than cubic.
 * The camera barely moves for the first 20%, then LAUNCHES through the
 * middle, then brakes sharply. Feels like a camera operator committing
 * hard to a dolly push — Whiplash-style intentional violence.
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

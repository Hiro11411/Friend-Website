import InfiniteGallery from '@/components/ui/3d-gallery-photography'
import styles from './Home.module.css'

// Placeholder images — swap in Marco's real work stills here.
// Each src should be 1600×1000 or larger for best quality.
const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1754769440490-2eb64d715775?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 2',
  },
  {
    src: 'https://images.unsplash.com/photo-1758640920659-0bb864175983?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 3',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1758367454070-731d3cc11774?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 4',
  },
  {
    src: 'https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 5',
  },
  {
    src: 'https://images.unsplash.com/photo-1741715661559-6149723ea89a?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 6',
  },
  {
    src: 'https://images.unsplash.com/photo-1725878746053-407492aa4034?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 7',
  },
  {
    src: 'https://images.unsplash.com/photo-1752588975168-d2d7965a6d64?w=1200&auto=format&fit=crop&q=80',
    alt: 'Film still 8',
  },
]

export function Home() {
  return (
    <main className={styles.home}>
      {/* ── Full-screen 3D tunnel ── */}
      <InfiniteGallery
        images={IMAGES}
        speed={0.32}          /* cinematic slow drift — was 1.2 in the demo */
        zSpacing={3}
        visibleCount={12}
        falloff={{ near: 0.9, far: 16 }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* ── Letterbox: cinematic 2.39:1 crop bars ── */}
      <div className={styles.letterbox} aria-hidden="true" />

      {/* ── Center title — mix-blend-mode: exclusion inverts against images ── */}
      <div className={styles.overlay} aria-hidden="true">
        <p className={styles.eyebrow}>HKAPA &nbsp;·&nbsp; BFA FILM &amp; TV</p>
        <h1 className={styles.title}>MARCO&nbsp;LO</h1>
        <p className={styles.sub}>Film Editor &amp; Cinematographer</p>
      </div>

    </main>
  )
}

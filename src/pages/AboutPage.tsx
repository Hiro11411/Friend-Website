import { useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './pages.module.css'
import a from './about.module.css'

const STATS = [
  { n: '3.55', l: "CGPA · Dean's List" },
  { n: 'EN',   l: 'English' },
  { n: '粵',   l: 'Cantonese' },
  { n: '普',   l: 'Mandarin' },
  { n: '2D',   l: 'Graphic Design' },
]

const SKILLS: { cat: string; items: { name: string; pct: number }[] }[] = [
  {
    cat: 'POST & EDIT',
    items: [
      { name: 'Premiere Pro', pct: 95 },
      { name: 'DaVinci Resolve', pct: 90 },
      { name: 'Sound Design & Mix', pct: 82 },
    ],
  },
  {
    cat: 'DESIGN & PHOTO',
    items: [
      { name: 'Photoshop', pct: 88 },
      { name: 'Lightroom', pct: 85 },
      { name: 'Canva (Advanced)', pct: 92 },
    ],
  },
  {
    cat: 'ON SET',
    items: [
      { name: 'Videography', pct: 90 },
      { name: 'Photography', pct: 86 },
      { name: 'Sound Editing', pct: 80 },
    ],
  },
]

function SkillBar({ name, pct, active }: { name: string; pct: number; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--fill', active ? `${pct}%` : '0%')
  }, [active, pct])
  return (
    <li className={a.skillRow}>
      <span className={a.skillName}>{name}</span>
      <span ref={ref} className={a.bar} />
    </li>
  )
}

export function AboutPage() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>()
  const year = new Date().getFullYear()

  return (
    <div className="page">
      <div className={styles.wrap}>

        {/* ── About ── */}
        <div className={styles.head}>
          <span className={styles.headIndex}>01 — ABOUT</span>
          <span className={styles.rule} />
        </div>

        <div className={a.about}>
          <h1 className={a.statement}>
            Film&#8209;Academy&nbsp;Trained.{' '}
            <em>Obsessive</em>{' '}about timing.{' '}
            Built to make teams sharper.
          </h1>
          <div className={a.bio}>
            <p>I am a Year 3 Film and Television student at the Hong Kong Academy for Performing Arts 
              (HKAPA), majoring in editing and sound design. Driven by a passion to make audiences 
              deeply feel through the screen, I view post-production as the ultimate tool 
              for emotional and sensory storytelling.</p>
            <p>My foundation is built on hands-on experience across diverse genres, having 
              honed my structural precision and narrative pacing through numerous school 
              projects, including documentaries and short dramas. Elevating my craft beyond 
              the classroom, I recently completed an industry internship as a sound 
              assistant on the feature film Twilight of the Warriors: The Final Chapter, 
              gaining invaluable insight into high-end professional post-production 
              workflows.</p>
            <p>Armed with technical precision and a creative ear, I am dedicated to 
              elevating local cinema while working toward my ultimate dream: bringing 
                npx shadcn@latest add "https://21st.dev/r/[component-url]"my craft to global screens and landing in Hollywood.</p>
          </div>
        </div>
        <ul className={a.stats}>
          {STATS.map(({ n, l }) => (
            <li key={l} className={a.stat}>
              <span className={a.statNum}>{n}</span>
              <span className={`${a.statLabel} mono`}>{l}</span>
            </li>
          ))}
        </ul>

        {/* ── Skills ── */}
        <div className={styles.head} style={{ marginTop: 'clamp(4rem,10vw,7rem)' }}>
          <span className={styles.headIndex}>03 — TOOLKIT</span>
          <span className={styles.rule} />
        </div>

        <div className={a.skillGrid} ref={ref}>
          {SKILLS.map(col => (
            <div key={col.cat} className={a.skillCol}>
              <h2 className={`${a.skillCat} mono`}>{col.cat}</h2>
              <ul className={a.skillList}>
                {col.items.map(s => (
                  <SkillBar key={s.name} name={s.name} pct={s.pct} active={visible} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer className={styles.foot}>
          <span className={styles.footName}>MARCO LO · 盧子聰</span>
          <span className="mono" style={{ color: 'var(--gray-600)', fontSize: '0.7rem' }}>
            © {year} · HKAPA · HONG KONG
          </span>
        </footer>
      </div>
    </div>
  )
}

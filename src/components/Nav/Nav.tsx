import { useState } from 'react'
import type { SectionName } from '../../scene/types'
import styles from './Nav.module.css'

const LINKS: { section: SectionName; num: string; label: string }[] = [
  { section: 'work',    num: '01', label: 'Work'    },
  { section: 'about',  num: '02', label: 'About'   },
  { section: 'contact',num: '03', label: 'Contact' },
]

// CV PDF served from public/media/
const CV_URL = '/media/CV & Creative Portfolios_Lo Tsz Chung, Marco (1).pdf'

interface NavProps {
  activeSection: SectionName
  onNavigate: (s: SectionName) => void
}

export function Nav({ activeSection, onNavigate }: NavProps) {
  const [open, setOpen] = useState(false)

  const go = (s: SectionName) => {
    onNavigate(s)
    setOpen(false)
  }

  return (
    <header className={`${styles.nav} ${open ? styles.open : ''}`}>
      {/* Brand → hero */}
      <button className={styles.brand} onClick={() => go('hero')}>
        <span className={styles.mark}>ML</span>
        <span className={styles.name}>MARCO&nbsp;LO</span>
      </button>

      <nav className={styles.links} aria-label="Primary">
        {LINKS.map(({ section, num, label }) => (
          <button
            key={section}
            className={[styles.link, activeSection === section ? styles.active : ''].join(' ')}
            onClick={() => go(section)}
          >
            <span className={styles.num}>{num}</span>
            {label}
          </button>
        ))}

        {/* CV download — opens the PDF in a new tab */}
        <a
          href={CV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          onClick={() => setOpen(false)}
        >
          <span className={styles.num}>CV</span>
          Résumé
        </a>
      </nav>

      <button
        className={styles.toggle}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>
    </header>
  )
}

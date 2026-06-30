import styles from './pages.module.css'
import work from './work.module.css'

interface Item {
  id: string
  title: string
  sub?: string
  cat: string
  tc: string
  span: 'half' | 'full' | 'wide'
}

const ITEMS: Item[] = [
  { id: '01', title: 'Pulse', sub: '— Noir Mage', cat: 'Music Video · Editing & Color', tc: '00:03:42:18', span: 'full' },
  { id: '02', title: '9th Anniversary Banquet', cat: 'Event Highlight · Editing', tc: '00:02:05:11', span: 'half' },
  { id: '03', title: 'Short Films', cat: 'Short Film · Editing & DP', tc: '00:11:27:00', span: 'half' },
  { id: '04', title: 'Cinematography Reel', cat: 'Cinematography · Camera', tc: '00:01:58:04', span: 'half' },
  { id: '05', title: 'BTS Reports', cat: 'Behind-the-Scenes', tc: '00:06:13:22', span: 'half' },
  { id: '06', title: 'Reviews & Social Cuts', cat: 'Film Reviews · Social Content', tc: '00:00:47:09', span: 'wide' },
]

export function WorkPage() {
  const year = new Date().getFullYear()

  return (
    <div className="page">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <span className={styles.headIndex}>02 — SELECTED WORK</span>
          <span className={styles.rule} />
        </div>

        <div className={work.grid}>
          {ITEMS.map(item => (
            <article key={item.id} className={`${work.card} ${work[item.span]}`}>
              {/* NOTE: drop a real <video> or <img> into .media for production */}
              <a href="#" className={work.link}
                 aria-label={`${item.title}${item.sub ?? ''} — ${item.cat}`}>
                <div className={work.media}>
                  <span className={`${work.tc} mono`}>{item.tc}</span>
                  <span className={work.play} aria-hidden="true" />
                  <span className={work.still}>{item.id}</span>
                </div>
                <div className={work.meta}>
                  <span className={`${work.cat} mono`}>{item.cat}</span>
                  <h2 className={work.title}>
                    {item.title}
                    {item.sub && <span className={work.sub}>{item.sub}</span>}
                  </h2>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Portfolio links */}
        <div className={work.folios}>
          <p className={`${work.folioEye} mono`}>THE FULL DOSSIER</p>
          <div className={work.folioBtns}>
            {/* TODO(marco): replace href="#" with your Creative Portfolio Google Doc URL */}
            <a href="#" className="btn btnPrimary" target="_blank" rel="noopener noreferrer">
              Creative Portfolio <span className="btnArrow">↗</span>
            </a>
            {/* TODO(marco): replace href="#" with your Side-Project Portfolio Google Doc URL */}
            <a href="#" className="btn btnGhost" target="_blank" rel="noopener noreferrer">
              Side-Project Portfolio <span className="btnArrow">↗</span>
            </a>
          </div>
        </div>

        <footer className={styles.foot}>
          <span className={styles.footName}>MARCO LO · 盧子聰</span>
          <span className="mono" style={{ color: 'var(--gray-600)', fontSize: '0.7rem' }}>
            © {year} · BUILT FOR THE CUT
          </span>
        </footer>
      </div>
    </div>
  )
}

import styles from './pages.module.css'
import c from './contact.module.css'

export function ContactPage() {
  const year = new Date().getFullYear()

  return (
    <div className="page">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <span className={styles.headIndex}>04 — CONTACT</span>
          <span className={styles.rule} />
        </div>

        <div className={c.body}>
          <h1 className={c.title}>
            Create&apos;s something
            <br />
            <span className={c.dim}>original.</span>
          </h1>

          <p className={c.copy}>
            Available for editing, cinematography, and design.
            Email is the fastest way in.
          </p>

          <a className={c.email} href="mailto:marcoltc719@gmail.com">
            marcoltc719@gmail.com
          </a>

          <div className={c.links}>
            <a href="https://www.linkedin.com/in/mltcmedia/" className={`${c.link} mono`}
               target="_blank" rel="noopener noreferrer">
              <span className={c.arrow}>→</span> LinkedIn
            </a>
            <a href="mailto:marcoltc719@gmail.com" className={`${c.link} mono`}>
              <span className={c.arrow}>→</span> Email
            </a>
            <a href="tel:+85291455462" className={`${c.link} mono`}>
              <span className={c.arrow}>→</span> +852 9145 5462
            </a>
          </div>
        </div>

        <footer className={styles.foot}>
          <span className={styles.footName}>MARCO LO · 盧子聰</span>
          <span className="mono" style={{ color: 'var(--gray-600)', fontSize: '0.7rem' }}>
            © {year} · HONG KONG · HKAPA
          </span>
        </footer>
      </div>
    </div>
  )
}

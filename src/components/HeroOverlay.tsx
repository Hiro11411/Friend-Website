import type { SectionName } from '../scene/types'

interface Props {
  onNavigate: (s: SectionName) => void
}

export function HeroOverlay({ onNavigate }: Props) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: 'clamp(4rem, 20vw, 22rem)',
      paddingTop: '12vh',
      paddingBottom: '4rem',
    }}>

      {/* Eyebrow */}
      <p style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.72rem',
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: '#888888',
        marginBottom: '1.4rem',
      }}>
        HKAPA &nbsp;·&nbsp; BFA Film &amp; TV
      </p>

      {/* Title */}
      <h1
        onClick={() => onNavigate('work')}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onNavigate('work')}
        style={{
          fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
          fontWeight: 400,
          lineHeight: 0.82,
          letterSpacing: '-0.005em',
          textTransform: 'uppercase',
          color: '#f0ece7',
          margin: '0 0 1.4rem 0',
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'opacity 0.25s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.55')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        <span style={{ display: 'block', fontSize: 'clamp(4rem, 15vw, 14rem)' }}>
          MARCO
        </span>
        <span style={{
          display: 'block',
          fontSize: 'clamp(4rem, 15vw, 14rem)',
          marginLeft: 'clamp(1.5rem, 8vw, 8rem)',
        }}>
          LO
        </span>
      </h1>

      {/* Role */}
      <p style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 'clamp(0.68rem, 1.4vw, 0.95rem)',
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: '#aaaaaa',
        marginBottom: '2rem',
      }}>
        Film Editor &amp; Cinematographer
      </p>

      {/* CTA */}
      <a
        href="#"
        onClick={e => { e.preventDefault(); onNavigate('work') }}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.78rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#aaaaaa',
          pointerEvents: 'auto',
          textDecoration: 'none',
        }}
      >
        View the Work →
      </a>

    </div>
  )
}

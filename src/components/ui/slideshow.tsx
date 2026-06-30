import { useState } from 'react'
import styles from './slideshow.module.css'

/*
 * ── Edit slides here ─────────────────────────────────────────────
 * img  : path to image in public/media/ (or any URL)
 * text : two-line atmospheric overlay — leave arrays empty to hide
 * ─────────────────────────────────────────────────────────────────
 */
const slides = [
  { img: '/media/still-01.png', text: [] },
  { img: '/media/still-02.png', text: [] },
  { img: '/media/still-03.png', text: [] },
  { img: '/media/still-04.jpg', text: [] },
  { img: '/media/still-05.jpg', text: [] },
  { img: '/media/still-06.jpg', text: [] },
  { img: '/media/still-07.jpg', text: [] },
  { img: '/media/still-08.jpg', text: [] },
  { img: '/media/still-09.jpg', text: [] },
]

export default function Component() {
  const [current, setCurrent] = useState(0)

  const nextSlide = () => setCurrent(p => (p + 1) % slides.length)
  const prevSlide = () => setCurrent(p => (p - 1 + slides.length) % slides.length)

  return (
    <div className={styles.slideshow}>
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          {slide.text.length > 0 && (
            <div className={styles.slideText}>
              {slide.text.map((t, j) => <span key={j}>{t}</span>)}
            </div>
          )}
        </div>
      ))}

      <button className={`${styles.nav} ${styles.left}`}  onClick={prevSlide}>←</button>
      <button className={`${styles.nav} ${styles.right}`} onClick={nextSlide}>→</button>

      <div className={styles.counter}>
        0{current + 1}&nbsp;/&nbsp;0{slides.length}
      </div>
    </div>
  )
}

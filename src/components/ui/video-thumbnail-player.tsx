import { useState } from 'react'
import styles from './video-thumbnail-player.module.css'

export interface VideoPlayerProps {
  thumbnailUrl: string
  /** YouTube embed URL — use youtube-nocookie.com for privacy.
   *  e.g. "https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1" */
  videoUrl: string
  title?: string
  className?: string
}

export function VideoPlayer({
  thumbnailUrl,
  videoUrl,
  title,
  className = '',
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`${styles.player} ${className}`}>
      {playing ? (
        <iframe
          className={styles.iframe}
          src={videoUrl}
          title={title ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className={styles.thumb}
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title ?? 'video'}`}
        >
          <img src={thumbnailUrl} alt={title ?? ''} className={styles.img} />
          <div className={styles.scrim} aria-hidden="true" />
          <div className={styles.play} aria-hidden="true">
            <div className={styles.triangle} />
          </div>
        </button>
      )}
    </div>
  )
}

export default VideoPlayer

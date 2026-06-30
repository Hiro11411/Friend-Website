# Marco Lo — Portfolio v2 (React)

A complete rebuild of the portfolio for **Marco Lo (LO Tsz Chung)** — Film-Academy-trained video editor & cinematographer, BFA Film & Television at HKAPA.

**Stack:** Vite + React 18 + TypeScript (strict) + @react-three/fiber + @react-three/drei

---

## Quick start

```bash
# Install dependencies (Node 18+ required)
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build locally
npm run preview
# → http://localhost:4173

# TypeScript check only (no build)
npm run typecheck
```

> **Do not open `index.html` directly.** ES modules require a local server — use `npm run dev` or `npm run preview`.

---

## Project structure

```
src/
  components/
    Loader/       Film-leader countdown (React rAF loop)
    Nav/          Fixed nav, scroll-aware glassmorphism, mobile overlay
    Hero/
      Hero.tsx        Layout + text overlay
      HeroScene.tsx   R3F Canvas: lights, camera rig, dust particles
      FilmSculpture.tsx  The draggable 3D gyroscope sculpture
    About/        Statement, bio, stats grid
    Work/         6-card project grid (placeholder stills)
    Skills/       Three-column bars + marquee ticker
    Folios/       Two portfolio link CTAs
    Contact/      Typographic CTA + email + social links
    Footer/       Live timecode clock
  hooks/
    useReducedMotion.ts   Reads prefers-reduced-motion, live-updates
    useScrollReveal.ts    IntersectionObserver → fade-in on scroll
  styles/
    globals.css   Design tokens, reset, base styles, utilities
  App.tsx         Loader → site fade-in shell
  main.tsx        React root mount
```

---

## Design decisions

**Aesthetic — "Precision Instrument":** Pure monotone cinema. Zero colour — all luminance contrast. Near-black backgrounds, warm off-white text (`#f0ece7`), deep charcoal surfaces. The mood stays Whiplash-adjacent (focus, tension, restraint) but achieved through monochrome contrast, not colour.

**Typography (3 voices):**
- `Bebas Neue` — heavy condensed display. Percussive. Used at large scale for the name, section titles, contact.
- `DM Sans` — clean, modern body text (weight 200–400).
- `JetBrains Mono` — every label, timecode, eyebrow, nav number. The "film" authenticity motif.

**The 3D centerpiece — "Orrery" sculpture:**
- Three interlocking torus rings at different axes (gyroscope / film-canister / watch-movement abstraction)
- Central precision lens disc
- Sprocket accent dots at two radii
- `MeshPhysicalMaterial`: `metalness: 0.96`, `roughness: 0.07` → near-black chrome with spectacular specular highlights
- Lit by one hard key light (upper-right, intensity 4.8) + dim fill + subtle bounce — maximum cinematic contrast
- Wrapped in `<PresentationControls global>` from drei — drag from anywhere on the page to rotate; springs back with mass/tension config
- Wrapped in `<Float>` — organic floating motion when idle
- Camera rig: subtle mouse parallax (lerp 0.04) for depth/rack-focus feel
- 650 dust particles (reduced to 350 on mobile) slowly rotating through the scene
- Lazy-loaded via `React.lazy` so it doesn't block initial paint
- Completely disabled for `prefers-reduced-motion` users (CSS spotlight shown instead)

**Loader:** Film-leader countdown (3→2→1) implemented in React using `requestAnimationFrame`. White ring (monotone), crosshairs, running timecode. Safety-net `setTimeout` guarantees dismissal even if rAF stalls (headless, offline, very slow device).

**Scroll reveals:** `IntersectionObserver` in `useScrollReveal` — fade + translate + blur-to-sharp on entry. Stagger via `--delay` CSS custom property. Fully disabled for reduced-motion users.

**Skills section:** Three-column layout with animated fill bars (`transition: width 1.2s`) + marquee ticker — carried over from v1, adapted to monotone. `useEffect` drives the bar CSS variable when section enters view.

---

## Swapping in real content

### Portfolio link URLs — `src/components/Folios/Folios.tsx`

```tsx
// TODO(marco): replace href="#" with your "Creative Portfolio" Google Doc URL
<a href="#" ...>Creative Portfolio</a>

// TODO(marco): replace href="#" with your "Side-Project Portfolio" Google Doc URL
<a href="#" ...>Side-Project Portfolio</a>
```

### LinkedIn URL — `src/components/Contact/Contact.tsx`

```tsx
// TODO(marco): replace href="#" with your LinkedIn profile URL
<a href="#" ...>LinkedIn</a>
```

### Work thumbnails / reels — `src/components/Work/Work.tsx`

Each `WorkCard` renders a `.media` div with a placeholder gradient. Drop a real image or video into it:

```tsx
// Inside the <div className={styles.media}> element:
<img src="/media/pulse-still.jpg" alt="Pulse — Noir Mage" />
// or for a silent preview loop:
<video src="/media/pulse.mp4" muted loop playsInline preload="metadata" />
```

The `.media` div already sets `overflow: hidden` and the aspect ratio — images/videos drop in with `object-fit: cover` added to their CSS.

**Embedding YouTube/Vimeo?** Use privacy-enhanced domains (`youtube-nocookie.com` / `player.vimeo.com`). Add a `frame-src` directive to the CSP (see Security below).

---

## Accessibility

- Semantic HTML5 landmarks (`header`, `main`, `section`, `footer`), one `<h1>`, logical heading order
- `aria-label` on icon-only / media links; `aria-hidden` on decorative 3D canvas and overlays
- `aria-expanded` on mobile menu toggle
- Color contrast: `--white` (#f0ece7) on `--black` (#080808) exceeds WCAG AA at all text sizes
- `prefers-reduced-motion`: WebGL scene, grain overlay, and scroll animations disabled; loader dismisses instantly; marquee paused
- Mobile nav: keyboard-accessible, focus visible, closes on link click

---

## Security

The site is **fully static** — no server, no secrets, minimal attack surface.

**Applied:**
- `rel="noopener noreferrer"` on all `target="_blank"` links (prevents reverse-tabnabbing)
- No `dangerouslySetInnerHTML` anywhere — all dynamic text is via React's safe rendering
- No hardcoded secrets; `.env` git-ignored; `.env.example` documents optional future integrations only
- No tracking or analytics included
- Three.js and R3F bundled at build time (no CDN runtime scripts) → no runtime CSP `script-src` exceptions needed beyond `'self'`
- Google Fonts loaded via `<link>` in `index.html` (no inline styles) — `style-src` needs `fonts.googleapis.com`

**Recommended production headers** (add at your host/CDN):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;

Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Remaining `// TODO` security items (before going live):**
1. **Portfolio/LinkedIn URLs** — wire the real URLs (currently `href="#"`). Keep `rel="noopener noreferrer"`.
2. **Contact form** — the current contact is a plain `mailto:` link (no backend, nothing to secure). If you add a real form later:
   - Use [Formspree](https://formspree.io) — POST to their endpoint, no API key in the client.
   - Add a visually-hidden honeypot `<input>` field.
   - Validate + sanitize all inputs both client and server side.
   - Never stand up a custom email-sending server without rate limiting and spam protection.
3. **Run `npm audit`** before each deploy to catch newly-disclosed vulnerabilities in dependencies.
4. **Self-host fonts** to remove `fonts.googleapis.com` and `fonts.gstatic.com` from the CSP entirely (tightest possible policy).

---

## Dependency audit (as shipped)

```
npm audit
```

4 known vulnerabilities (3 moderate, 1 high) at time of build:
- **esbuild ≤0.24.2** (Vite dev server): dev-only, does not affect the production build or deployed site
- **uuid <11.1.1** (@react-three/drei): used internally for object identity, not exposed to end users

Both can be fixed by `npm audit fix --force` which will upgrade Vite and drei to newer patch versions. Review the changes before deploying to a staging environment.

---

## Browser support

Modern evergreen (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+). WebGL2 required for the 3D hero; the CSS spotlight fallback is always rendered beneath it. The site is fully readable and functional without JavaScript (all content is in the HTML) and without WebGL.

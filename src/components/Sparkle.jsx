import { useMemo } from 'react'
import { makeStars } from '../lib/visual.js'

// L'étincelle — l'étoile d'or à quatre branches, élément signature.
// Réutilisée partout : carte, cartes-merveilles, chaque découverte.
const STAR_PATH = 'M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z'

export function Etoile({ size = 22, color = 'var(--or)', spark = true, glow = false, className = '', style }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      className={`etoile ${spark ? 'm-spark' : ''} ${className}`}
      style={{ display: 'block', filter: glow ? 'drop-shadow(0 0 12px rgba(245,198,107,.7))' : undefined, ...style }}
    >
      <path d={STAR_PATH} fill={color} />
    </svg>
  )
}

// Champ d'étoiles déterministe (scintillement en boucles décalées 2,6–7,1 s).
// En reduced-motion, le CSS fige les étoiles à mi-éclat.
export function Starfield({ count = 26, seed = 3, color = 'var(--creme-clair)', glow = true }) {
  const stars = useMemo(() => makeStars(count, seed), [count, seed])
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((st, i) => (
        <span
          key={i}
          className="star"
          style={{
            top: st.top, left: st.left,
            width: st.size + 'px', height: st.size + 'px',
            background: color,
            opacity: st.op,
            boxShadow: glow ? '0 0 6px var(--or)' : 'none',
            '--tw-dur': st.dur + 's',
            '--tw-delay': st.delay + 's',
          }}
        />
      ))}
    </div>
  )
}

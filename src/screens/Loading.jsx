import { useEffect } from 'react'
import { Starfield } from '../components/Sparkle.jsx'
import './Loading.css'

// Première ouverture · « l'atelier s'éveille » — la constellation se trace,
// puis on entre. Sous prefers-reduced-motion, tout apparaît d'emblée.
export default function Loading({ onDone, delay = 1900 }) {
  useEffect(() => {
    const t = setTimeout(onDone, delay)
    return () => clearTimeout(t)
  }, [onDone, delay])

  return (
    <section className="screen no-nav loading-screen accent-nombres" aria-label="Eurêka s'ouvre">
      <Starfield count={16} seed={5} />
      <div className="loading-center">
        <svg viewBox="0 0 200 200" width="170" height="170" aria-hidden="true" className="loading-constellation">
          <g stroke="var(--or)" strokeWidth="1.5" fill="none" strokeLinecap="round"
             strokeDasharray="320" strokeDashoffset="320" style={{ animation: 'dash 2.2s ease-out forwards' }}>
            <path d="M40 120 L70 60 L120 75 L150 130 L90 150 L40 120" />
            <path d="M120 75 L165 50" />
          </g>
          <g fill="var(--creme-clair)">
            <circle cx="40" cy="120" r="3.5" /><circle cx="70" cy="60" r="4" /><circle cx="120" cy="75" r="5" />
            <circle cx="150" cy="130" r="4" /><circle cx="90" cy="150" r="3.5" /><circle cx="165" cy="50" r="4" />
          </g>
          <path d="M100 28 l1.6 5 5 1.6 -5 1.6 -1.6 5 -1.6 -5 -5 -1.6 5 -1.6Z" fill="var(--or)"
                className="m-spark" style={{ transformOrigin: '100px 35px' }} />
        </svg>
        <div className="loading-word">
          <div className="display loading-title">Eurêka</div>
          <div className="hand loading-sub">l'atelier s'éveille…</div>
        </div>
        <div className="loading-bar"><span /></div>
      </div>
      <div className="loading-foot">fonctionne hors-ligne</div>
    </section>
  )
}

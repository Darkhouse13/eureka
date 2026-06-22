import { useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { sound } from '../../../audio/sound.js'
import './nombres-games.css'

// « Le grain de blé qui double » — l'échiquier de Sissa.
// Un grain sur la 1re case, deux sur la 2e, quatre sur la 3e… on double à chaque
// case. La somme s'emballe : un seul échiquier dépasse tout le blé du monde.
const REVEAL_AT = 20 // case où l'on bascule dans le vertige

function fmt(b) {
  // groupe les milliers avec une fine espace
  return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
function line(c) {
  if (c <= 1) return 'Pose le premier grain. Puis double, encore et encore.'
  if (c < 8) return 'Un, deux, quatre, huit… ça monte gentiment, non ?'
  if (c < 14) return 'Tu sens l’accélération ? Chaque case vaut toutes les précédentes réunies… plus une.'
  if (c < REVEAL_AT) return 'Le roi a déjà perdu : il n’y a pas tant de blé dans tout le royaume.'
  return 'Et il reste 44 cases ! En doublant, on dépasse absolument tout.'
}

export default function GrainBle({ onSolve }) {
  const [c, setC] = useState(1) // numéro de case
  const grains = 1n << BigInt(c - 1)      // 2^(c-1)
  const total = (1n << BigInt(c)) - 1n     // 2^c - 1
  const next = () => { if (c >= REVEAL_AT) return; sound.hop(c / 2); setC((v) => Math.min(v + 1, REVEAL_AT)) }
  const reset = () => { sound.tap(); setC(1) }
  const done = c >= REVEAL_AT
  const barW = Math.min(100, (c / REVEAL_AT) * 100)

  return (
    <div className="ng">
      <div className="ng-stage">
        <div className="ng-eyebrow eyebrow">Case n° {c} sur 64</div>
        <div className="ng-grains">{fmt(grains)}</div>
        <div className="ng-sub">grains sur cette case</div>
        <div className="ng-double-bar"><i style={{ width: barW + '%' }} /></div>
        <div className="ng-total">Total posé : <b>{fmt(total)}</b> grains</div>
      </div>

      <div className="ng-fox">{line(c)}</div>

      <div className="ng-controls">
        <button className="btn-or" onClick={next} disabled={done}>Doubler · case suivante</button>
        <button className="iconbtn" onClick={reset} aria-label="Recommencer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3M3 4v4h4" /></svg>
        </button>
      </div>

      {done && (
        <div className="ng-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display ng-reveal-title">En doublant, on dépasse tout.</div>
          <button className="btn-or" style={{ maxWidth: 300, margin: '12px auto 0' }} onClick={() => { sound.chime(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

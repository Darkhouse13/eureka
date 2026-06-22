import { useState } from 'react'
import { Fennec } from '../../../components/Fennec.jsx'
import { Etoile } from '../../../components/Sparkle.jsx'
import { sound } from '../../../audio/sound.js'
import './SautPuce.css'

// « Le saut de la puce » — le paradoxe de Zénon, jouable.
// La puce bondit la moitié du chemin restant à chaque tape (ressort élastique),
// la barre se remplit, le renard commente en direct. Après 8 sauts, la merveille
// se révèle. Jamais « raté » : « il reste 100 % → … toujours une moitié de plus ».
const REVEAL_AT = 8
const MAX = 12

function foxLine(p) {
  if (p === 0) return 'Touche « Sauter ! » : la puce bondit jusqu’à la moitié du chemin qui reste.'
  if (p < 3) return 'Encore un saut ! À chaque fois, elle franchit la moitié de ce qui reste.'
  if (p < 6) return 'Tu remarques ? Les sauts deviennent minuscules… mais il y en a toujours un de plus.'
  if (p < REVEAL_AT) return 'Presque arrivée ! Mais « presque », ça veut dire… jamais tout à fait.'
  return 'Voilà le secret : une infinité de sauts tiennent dans ce petit espace.'
}

function Flea() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.4))' }}>
      <ellipse cx="20" cy="26" rx="11" ry="8.5" fill="#F5C66B" stroke="#3a2606" strokeWidth="1.6" />
      <circle cx="15" cy="24" r="1.7" fill="#3a2606" />
      <path d="M12 14l4 7M28 14l-4 7" stroke="#3a2606" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11.5" cy="13" r="1.4" fill="#F5C66B" /><circle cx="28.5" cy="13" r="1.4" fill="#F5C66B" />
      <path d="M22 30l4 6M26 31l4 4" stroke="#3a2606" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function Flower() {
  return (
    <svg viewBox="0 0 60 60" width="56" height="56" aria-hidden="true">
      <g stroke="#3a2606" strokeWidth="1.4">
        <circle cx="30" cy="22" r="7" fill="#F5C66B" />
        <ellipse cx="30" cy="10" rx="5" ry="8" fill="#E8718A" /><ellipse cx="30" cy="34" rx="5" ry="8" fill="#E8718A" />
        <ellipse cx="18" cy="22" rx="8" ry="5" fill="#E8718A" /><ellipse cx="42" cy="22" rx="8" ry="5" fill="#E8718A" />
      </g>
      <circle cx="30" cy="22" r="4" fill="#fff8ec" />
      <path d="M30 30 Q28 46 30 56" stroke="#5aa888" strokeWidth="2.5" fill="none" />
    </svg>
  )
}

export default function SautPuce({ onSolve }) {
  const [jumps, setJumps] = useState(0)
  const reached = 1 - Math.pow(0.5, jumps)
  const fillPct = reached * 100
  const fleaLeft = 5 + reached * 80
  const sumLabel = jumps === 0 ? '0' : `${Math.pow(2, jumps) - 1}/${Math.pow(2, jumps)}`
  const remPctTxt = (Math.pow(0.5, jumps) * 100).toFixed(jumps < 4 ? 1 : 3) + ' %'
  const discovered = jumps >= REVEAL_AT

  const jump = () => {
    if (jumps >= MAX) return
    sound.hop(jumps)
    setJumps((j) => Math.min(j + 1, MAX))
  }
  const reset = () => { sound.tap(); setJumps(0) }

  return (
    <div className="flea">
      <div className="flea-play">
        {/* piste + contrôles */}
        <div className="flea-main">
          <div className="flea-track">
            <div className="flea-ground" aria-hidden="true" />
            <span className="flea-tick" style={{ left: '50%' }} aria-hidden="true" />
            <span className="flea-tick faint" style={{ left: '72%' }} aria-hidden="true" />
            <span className="flea-tick faintest" style={{ left: '83%' }} aria-hidden="true" />
            <span className="flea-leaf" aria-hidden="true">🍃</span>
            <span className="flea-flower m-floaty" aria-hidden="true"><Flower /></span>
            <span className="flea-creature" style={{ left: fleaLeft + '%' }}>
              <span className="flea-bob"><Flea /></span>
            </span>
            <div className="flea-cover">
              <div className="bar"><i style={{ width: fillPct + '%' }} /></div>
              <div className="flea-cover-labels"><span>départ</span><span>la fleur (1)</span></div>
            </div>
          </div>

          <div className="flea-controls">
            <button className="btn-or flea-jump" onClick={jump} disabled={jumps >= MAX}>Sauter !</button>
            <button className="iconbtn flea-reset" onClick={reset} aria-label="Recommencer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3M3 4v4h4" /></svg>
            </button>
          </div>
        </div>

        {/* renard + relevé */}
        <div className="flea-rail">
          <div className="flea-fox">
            <div className="flea-fox-av"><Fennec size={58} expression={discovered ? 'celebrant' : (jumps > 2 ? 'curieux' : 'repos')} /></div>
            <div className="flea-bubble">{foxLine(jumps)}</div>
          </div>
          <div className="flea-readout">
            <div className="eyebrow">Le compte des sauts</div>
            <div className="flea-stat">
              <div className="flea-stat-k">Chemin parcouru</div>
              <div className="flea-stat-v">{sumLabel}</div>
            </div>
            <div className="flea-hr" />
            <div className="flea-stat">
              <div className="flea-stat-k">Il reste encore</div>
              <div className="flea-stat-v small">{remPctTxt}</div>
              <div className="flea-stat-note">… toujours une moitié de plus.</div>
            </div>
            <div className="flea-count">Saut n° <b>{jumps}</b></div>
          </div>
        </div>
      </div>

      {/* révélation douce → mène à la découverte (jamais « raté ») */}
      {discovered && (
        <div className="flea-reveal m-rise">
          <Etoile size={34} glow />
          <div className="hand flea-reveal-lead">tu y es…</div>
          <div className="display flea-reveal-title">Une infinité de sauts tiennent dans un seul pas.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '14px auto 0' }} onClick={() => { sound.chime(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

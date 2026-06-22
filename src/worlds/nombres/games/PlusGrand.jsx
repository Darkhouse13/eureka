import { useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { sound } from '../../../audio/sound.js'
import './nombres-games.css'

// « Plus grand que tout » — compter ne s'arrête jamais.
// Chaque tape ajoute trois zéros (×1000). Les noms finissent par manquer…
// et pourtant on peut toujours en ajouter un de plus.
const NAMES = {
  0: 'un', 3: 'mille', 6: 'un million', 9: 'un milliard', 12: 'un billion',
  15: 'un billiard', 18: 'un trillion', 21: 'un trilliard', 24: 'un quadrillion',
  27: 'un quadrilliard', 30: 'un quintillion',
}
const REVEAL_AT = 30

function line(n) {
  if (n === 0) return 'Commence à compter. Jusqu’où peux-tu aller ?'
  if (n < 12) return 'Encore plus grand ! Ajoute trois zéros d’un coup.'
  if (n < 24) return 'Ces nombres ont encore un nom… pour l’instant.'
  if (n < REVEAL_AT) return 'Les noms vont bientôt manquer. Mais le nombre, lui, continue.'
  return 'Plus aucun nom — et pourtant, on peut encore ajouter un zéro.'
}

export default function PlusGrand({ onSolve }) {
  const [n, setN] = useState(0) // exposant de 10
  const grow = () => { if (n >= REVEAL_AT) return; sound.hop(n / 3); setN((v) => Math.min(v + 3, REVEAL_AT)) }
  const reset = () => { sound.tap(); setN(0) }
  const done = n >= REVEAL_AT
  const name = NAMES[n]

  return (
    <div className="ng">
      <div className="ng-stage">
        <div className="ng-big">
          10<sup>{n}</sup>
        </div>
        <div className="ng-name">{name ? name : 'un nombre sans nom'}</div>
        <div className="ng-sub">1 suivi de <b>{n}</b> zéro{n > 1 ? 's' : ''}</div>
        <div className="ng-zeros" aria-hidden="true">
          {n === 0 ? '1' : '1' + ' ' + Array.from({ length: Math.min(n, 30) }).map(() => '0').join('')}
          {n > 30 ? '…' : ''}
        </div>
      </div>

      <div className="ng-fox">{line(n)}</div>

      <div className="ng-controls">
        <button className="btn-or" onClick={grow} disabled={done}>Encore plus grand <span aria-hidden="true">×1000</span></button>
        <button className="iconbtn" onClick={reset} aria-label="Recommencer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3M3 4v4h4" /></svg>
        </button>
      </div>

      {done && (
        <div className="ng-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display ng-reveal-title">Il n’y a pas de dernier nombre.</div>
          <button className="btn-or" style={{ maxWidth: 300, margin: '12px auto 0' }} onClick={() => { sound.chime(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

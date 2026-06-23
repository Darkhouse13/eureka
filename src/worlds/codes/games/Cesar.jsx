import { useEffect, useMemo, useState } from 'react'
import { caesar } from '../../../lib/caesar.js'
import { makeSession } from '../session.js'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './codes-games.css'

// Rung 1 — « La clé de César ». On réutilise le décodeur historique, re-thémé nuit.
// Un message intercepté + un cadran : tourne le décalage jusqu'à ce que ça se lise.
// Message + décalage aléatoires à chaque partie, indice adaptatif, jamais « raté ».
export default function Cesar({ onSolve }) {
  const { plain, key, enc } = useMemo(() => makeSession(), [])
  const [dial, setDial] = useState(0)
  const [solved, setSolved] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Décoder, c'est simplement décaler dans l'autre sens.
  const decoded = caesar(enc, -dial)

  useEffect(() => {
    if (!solved && decoded === plain) { setSolved(true); sound.chime() }
  }, [decoded, plain, solved])

  const change = (v) => { if (solved) return; sound.tap(); setDial(Math.max(0, Math.min(25, v))) }

  // L'indice reste honnête, même avec un décalage aléatoire.
  const hintLow = Math.max(1, key - 2)
  const hintHigh = Math.min(25, key + 2)

  const fox = solved
    ? 'Des mots ! Tu viens de casser le code de César.'
    : dial === 0
      ? 'Tourne le cadran : à chaque cran, toutes les lettres se décalent ensemble.'
      : 'Continue à tourner… cherche le moment où des vrais mots apparaissent.'

  return (
    <div className="cg">
      <div className="cg-fox">
        <Fennec size={50} expression={solved ? 'celebrant' : dial > 0 ? 'curieux' : 'repos'} />
        <span>{fox}</span>
      </div>

      <div className="cg-panel">
        <div className="eyebrow">Message intercepté</div>
        <div className={`cg-msg ${solved ? 'is-solved' : ''}`} aria-live="polite">
          {[...decoded].map((ch, i) =>
            ch === ' '
              ? <span key={i} className="cg-sp" />
              : <span key={i} className="cg-tile">{ch}</span>,
          )}
        </div>
      </div>

      <div className="cg-dial">
        <button className="cg-dialbtn" onClick={() => change(dial - 1)} disabled={solved} aria-label="Diminuer le décalage">−</button>
        <div className="cg-dial-core">
          <span className="eyebrow">Décalage</span>
          <span className="cg-dial-val">{dial}</span>
        </div>
        <button className="cg-dialbtn" onClick={() => change(dial + 1)} disabled={solved} aria-label="Augmenter le décalage">+</button>
      </div>
      <input type="range" className="cg-range" min="0" max="25" value={dial} disabled={solved}
             onChange={(e) => change(parseInt(e.target.value, 10))} aria-label="Décalage" />

      <div className="cg-hint">
        {!showHint
          ? <button className="cg-link" onClick={() => setShowHint(true)} disabled={solved}>Besoin d'un indice&nbsp;?</button>
          : <span>Le bon décalage est entre <b>{hintLow}</b> et <b>{hintHigh}</b>.</span>}
      </div>

      {solved && (
        <div className="cg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display cg-reveal-title">Tu as cassé le plus vieux code de l'Histoire.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={onSolve}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

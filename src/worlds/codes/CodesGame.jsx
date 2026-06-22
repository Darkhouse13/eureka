// "Le jeu" for Les codes secrets: the Caesar decoder dial.
// Turn the shift until the intercepted message reads as French. When the
// decoded text matches the secret, celebrate and let the player continue —
// which calls onSolve() (the engine then awards the card + advances the loop).
import { useEffect, useState } from 'react'
import { caesar } from '../../lib/caesar.js'
import Fox from '../../components/Fox.jsx'
import { useConfetti } from '../../components/Confetti.jsx'

export default function CodesGame({ session, onSolve }) {
  const { plain, enc, key } = session
  const [dial, setDial] = useState(0)
  const [solved, setSolved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const fire = useConfetti()

  // Decoding is just shifting back by the dial amount.
  const decoded = caesar(enc, -dial)

  useEffect(() => {
    if (!solved && decoded === plain) {
      setSolved(true)
      fire()
    }
  }, [decoded, plain, solved, fire])

  const change = (v) => {
    if (solved) return
    setDial(Math.max(0, Math.min(25, v)))
  }

  // Keep the hint honest about where the answer is, even with a random shift.
  const hintLow = Math.max(1, key - 2)
  const hintHigh = Math.min(25, key + 2)

  return (
    <>
      <h2 className="h2">Casse le code</h2>
      <p className="body">
        Voici le message intercepté. Tourne le décalage jusqu'à ce qu'il veuille
        dire quelque chose.
      </p>

      <div className="decoder">
        <div className={`msg${solved ? ' solved' : ''}`} aria-live="polite">
          {[...decoded].map((ch, i) =>
            ch === ' '
              ? <span key={i} className="sp" />
              : <span key={i} className="ltile">{ch}</span>,
          )}
        </div>
      </div>

      <div className="dial">
        <button className="dial-btn" onClick={() => change(dial - 1)} disabled={solved} aria-label="Diminuer le décalage">−</button>
        <div className="dial-core">
          <span className="dial-label">Décalage</span>
          <span className="dial-value">{dial}</span>
        </div>
        <button className="dial-btn" onClick={() => change(dial + 1)} disabled={solved} aria-label="Augmenter le décalage">+</button>
      </div>

      <input
        type="range" className="dial-range" min="0" max="25" value={dial}
        disabled={solved} onChange={(e) => change(parseInt(e.target.value, 10))}
        aria-label="Décalage"
      />

      <div className="hint-row">
        {!showHint ? (
          <button className="link" onClick={() => setShowHint(true)}>Besoin d'un indice ?</button>
        ) : (
          <span className="hint-text">
            Tourne jusqu'à voir apparaître des mots français. Le bon nombre est
            entre {hintLow} et {hintHigh}.
          </span>
        )}
      </div>

      {solved && (
        <div className="solved-box">
          <Fox size="sm" mood="happy" />
          <p className="solved-msg">Tu l'as cassé ! Bravo.</p>
          <button className="btn btn-block" onClick={onSolve}>Continuer</button>
        </div>
      )}
    </>
  )
}

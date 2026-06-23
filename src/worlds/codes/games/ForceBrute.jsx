import { useMemo, useState } from 'react'
import { caesar } from '../../../lib/caesar.js'
import { pick, randInt } from '../../../lib/random.js'
import { BRUTE_MESSAGES } from '../messages.js'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './codes-games.css'

// Rung 2 — « L'attaque par force brute ». Le message intercepté est décodé aux 25
// décalages possibles, empilés. Elle scanne et touche la SEULE ligne qui se lit en
// français → elle se verrouille avec une lueur → onSolve. Jamais « raté » : toucher
// une ligne illisible donne un petit coup de pouce (« cherche les vrais mots »).
export default function ForceBrute({ onSolve }) {
  const { plain, enc, key } = useMemo(() => {
    const plain = pick(BRUTE_MESSAGES)
    const key = randInt(3, 23)
    return { plain, enc: caesar(plain, key), key }
  }, [])

  const candidates = useMemo(
    // 25 candidats : un par décalage de 1 à 25. Un seul redonne le vrai message.
    () => Array.from({ length: 25 }, (_, i) => {
      const shift = i + 1
      const text = caesar(enc, -shift)
      return { shift, text, correct: text === plain }
    }),
    [enc, plain],
  )

  const [solvedShift, setSolvedShift] = useState(null)
  const [tried, setTried] = useState({})
  const [nudge, setNudge] = useState(false)
  const solved = solvedShift !== null

  const tap = (c) => {
    if (solved) return
    if (c.correct) {
      sound.chime()
      setSolvedShift(c.shift)
    } else {
      sound.tap()
      setTried((t) => ({ ...t, [c.shift]: true }))
      setNudge(true)
    }
  }

  const fox = solved
    ? 'Vingt-cinq essais, et le secret tombe. Voilà pourquoi César ne suffit pas.'
    : nudge
      ? 'Pas encore des mots… cherche une ligne où tu reconnais du français.'
      : 'L\'espion ne connaît pas la clé — alors il les essaie TOUTES. Trouve celle qui parle.'

  return (
    <div className="cg">
      <div className="cg-fox">
        <Fennec size={50} expression={solved ? 'celebrant' : nudge ? 'encourageant' : 'curieux'} />
        <span>{fox}</span>
      </div>

      <div className="eyebrow" style={{ textAlign: 'center' }}>Les 25 décalages possibles</div>
      <ol className="cg-brute" aria-label="Les 25 décodages possibles">
        {candidates.map((c) => {
          const isSolved = c.shift === solvedShift
          const isTried = !!tried[c.shift]
          return (
            <li key={c.shift}>
              <button
                type="button"
                className={`cg-brute-row ${isSolved ? 'is-solved' : ''} ${isTried ? 'is-tried' : ''}`}
                onClick={() => tap(c)}
                disabled={solved && !isSolved}
                aria-label={`Décalage ${c.shift} : ${c.text}`}
              >
                <span className="cg-brute-n">{c.shift}</span>
                <span className="cg-brute-txt">{c.text}</span>
                {isSolved && <span className="cg-brute-check" aria-hidden="true">✓</span>}
              </button>
            </li>
          )
        })}
      </ol>

      {solved && (
        <div className="cg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display cg-reveal-title">«&nbsp;{plain}&nbsp;» — décalage&nbsp;{key}.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

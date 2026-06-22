// "Le jeu" for Le grand hasard: "Le défi des deux dés".
// She picks the sum she thinks will win, then we roll two dice 100× and draw the
// tally as a bar chart with her pick highlighted. The 7 tops the chart — and
// whatever she picked, the reveal stays positive (never "wrong"). She can replay,
// then Continue, which calls onSolve() (engine awards the dés card + advances).
import { useRef, useState } from 'react'
import Fox from '../../components/Fox.jsx'
import { useConfetti } from '../../components/Confetti.jsx'
import { SUMS, ROLLS, rollBatch, prefersReducedMotion } from './dice.js'

export default function HasardGame({ onSolve }) {
  const [pick, setPick] = useState(null)
  const [counts, setCounts] = useState(null) // { sum: count } once rolled
  const [runs, setRuns] = useState(0) // bumps each roll so the bars re-animate
  const fire = useConfetti()
  const reduced = useRef(prefersReducedMotion())

  const roll = () => {
    if (pick == null) return
    setCounts(rollBatch())
    setRuns((r) => r + 1)
    fire()
  }

  const rolled = counts != null
  const max = rolled ? Math.max(...SUMS.map((s) => counts[s])) : 1

  return (
    <>
      <h2 className="h2">Le défi des deux dés</h2>

      {!rolled && (
        <p className="body">
          À ton avis, quelle somme sortira le plus souvent en {ROLLS} lancers ?
          Choisis ton champion.
        </p>
      )}

      {/* The sum picker. After rolling it stays visible (disabled) so she can still
          see which one she had chosen. */}
      <div className="hsd-sumrow" role="group" aria-label="Choisis ton champion, une somme entre 2 et 12">
        {SUMS.map((s) => (
          <button
            key={s}
            type="button"
            className={`hsd-sumbtn${pick === s ? ' on' : ''}`}
            aria-pressed={pick === s}
            disabled={rolled}
            onClick={() => setPick(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {!rolled ? (
        <button className="btn btn-block" onClick={roll} disabled={pick == null}>
          Lancer {ROLLS} fois
        </button>
      ) : (
        <>
          <div
            key={runs}
            className={`hsd-chart${reduced.current ? ' no-anim' : ''}`}
            aria-hidden="true"
          >
            {SUMS.map((s) => {
              const h = Math.round((counts[s] / max) * 100)
              return (
                <div key={s} className="hsd-col">
                  <span className="hsd-bar-count">{counts[s]}</span>
                  <div className="hsd-bar-track">
                    <div
                      className={`hsd-bar${s === 7 ? ' fav' : ''}${s === pick ? ' mine' : ''}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <span className={`hsd-bar-label${s === pick ? ' mine' : ''}`}>{s}</span>
                </div>
              )
            })}
          </div>

          <p className="hsd-legend">
            <span className="hsd-key hsd-key-mine" /> ton champion ({pick})
            <span className="hsd-key hsd-key-fav" /> le favori&nbsp;: 7
          </p>

          <div className="hsd-reveal">
            <Fox size="sm" mood="happy" />
            <p className="hsd-reveal-msg" aria-live="polite">
              {pick === 7
                ? 'Beau choix ! '
                : `Ton champion, le ${pick}, a tenté sa chance. `}
              Les sommes du milieu — et le 7 surtout — reviennent bien plus souvent
              que les extrêmes, parce qu'elles ont plus de façons d'apparaître.
            </p>
            <p className="hsd-reveal-sub">
              Appuie sur « Relancer » : les barres dansent un peu à chaque fois, mais
              la montagne — toujours la plus haute au milieu — revient à tous les
              coups. C'est ça, la vraie magie du hasard.
            </p>
            <div className="hsd-reveal-actions">
              <button className="btn-soft" onClick={roll}>Relancer</button>
              <button className="btn" onClick={onSolve}>Continuer</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

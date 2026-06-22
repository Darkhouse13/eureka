// Content for three of the four loop steps of "Le monde des motifs".
// (Le jeu lives in Game.jsx.) The engine wraps each in the loop chrome and
// supplies the eyebrow label; these render the heading, copy and button.
import { useEffect, useState } from 'react'
import { CARDS } from '../../cards/index.js'
import { WonderCard } from '../../components/WonderCard.jsx'

// --- L'étincelle: the walls that repeat ---
export function Etincelle({ onNext }) {
  return (
    <>
      <h2 className="h2">Les murs qui se répètent</h2>
      <p className="body">
        Tu as déjà vu ces magnifiques mosaïques sur les murs et les fontaines,
        faites de milliers de petites pièces colorées ? Ce ne sont pas que de jolis
        dessins. Les artisans qui créent les zelliges sont, sans toujours le savoir,
        parmi les plus grands mathématiciens du monde. Leur secret tient en un mot :
        la symétrie.
      </p>
      <button className="btn btn-block" onClick={onNext}>Continuer</button>
    </>
  )
}

// --- L'idée: a small grid with a vertical mirror axis. Tapping any cell fills it
// AND its mirror across the centre column, so the reflection appears on its own.
const COLS = 5
const ROWS = 5
const AXIS = (COLS - 1) / 2 // centre column (2): its own mirror

function MirrorDemo({ onReady }) {
  const [on, setOn] = useState(() => new Set())

  // A single tap always lights both sides: the cell and its mirror across the axis.
  // Functional update so fast / repeated taps accumulate correctly.
  const toggle = (r, c) =>
    setOn((prev) => {
      const next = new Set(prev)
      next.add(`${r}-${c}`)
      next.add(`${r}-${COLS - 1 - c}`)
      return next
    })

  // Ready once she has placed a few and watched the reflections appear.
  useEffect(() => {
    if (on.size >= 4) onReady()
  }, [on, onReady])

  return (
    <div className="mtf-demo">
      <div
        className="mtf-grid mtf-grid-demo"
        style={{ '--cols': COLS }}
        role="group"
        aria-label="Grille avec un miroir au milieu : touche une case, son reflet apparaît"
      >
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const r = Math.floor(i / COLS)
          const c = i % COLS
          const lit = on.has(`${r}-${c}`)
          return (
            <button
              key={i}
              type="button"
              className={`mtf-cell${lit ? ' lit' : ''}${c === AXIS ? ' axis-col' : ''}`}
              aria-label={`Ligne ${r + 1}, colonne ${c + 1}`}
              aria-pressed={lit}
              onClick={() => toggle(r, c)}
            />
          )
        })}
        <span className="mtf-axis mtf-axis-v" aria-hidden="true" />
      </div>
      <p className="mtf-hint">
        Touche une case : son reflet apparaît tout seul de l'autre côté du miroir.
      </p>
    </div>
  )
}

export function Idee({ onNext }) {
  const [ready, setReady] = useState(false)
  return (
    <>
      <h2 className="h2">Le miroir magique</h2>
      <p className="body">
        La symétrie, c'est quand une figure est identique de part et d'autre d'une
        ligne, comme dans un miroir. Pose une forme d'un côté, l'autre apparaît tout
        seul.
      </p>
      <MirrorDemo onReady={() => setReady(true)} />
      <button className="btn btn-block" onClick={onNext} disabled={!ready}>
        À moi de créer
      </button>
    </>
  )
}

// --- La découverte: the zellige card reveal + the door to what's next ---
export function Decouverte({ onFinish }) {
  return (
    <>
      <h2 className="h2">Une merveille pour toi !</h2>
      <WonderCard card={CARDS.zellige} pop />
      <div className="door">
        <p className="body">
          <b>Et le monde s'agrandit :</b> certains motifs recouvrent un mur à
          l'infini sans jamais laisser le moindre trou. Les mathématiciens en
          découvrent encore de nouveaux aujourd'hui.
        </p>
      </div>
      <button className="btn btn-block" onClick={onFinish}>Ajouter à ma collection</button>
    </>
  )
}

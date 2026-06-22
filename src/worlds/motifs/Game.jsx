// "Le jeu" for Le monde des motifs: "L'atelier de zellige".
// A square grid with two mirror axes (vertical + horizontal) → 4-fold symmetry.
// Whatever cell she taps is reflected across both axes, so one tap fills up to
// four cells and builds a symmetric rosette. There is no losing: every tap is
// valid. After a handful of placements the "Terminé" button activates; finishing
// calls onSolve() (the engine awards the zellige card + advances the loop).
import { useState } from 'react'
import Fox from '../../components/Fox.jsx'
import { useConfetti } from '../../components/Confetti.jsx'

const SIZE = 6 // 6×6 grid: even, so both mirror axes fall between cells (clean 4-fold)
const NEEDED = 6 // taps before "Terminé" activates

// Jewel tones to paint with — the classic zellige palette.
const PAINTS = [
  { id: 'emeraude', label: 'Émeraude', color: '#15A98A' },
  { id: 'saphir', label: 'Saphir', color: '#2E6FD6' },
  { id: 'rubis', label: 'Rubis', color: '#D6356F' },
]

export default function MotifsGame({ onSolve }) {
  const [grid, setGrid] = useState(() => Array(SIZE * SIZE).fill(null))
  const [paint, setPaint] = useState(PAINTS[0].id)
  const [taps, setTaps] = useState(0)
  const [done, setDone] = useState(false)
  const fire = useConfetti()

  const color = PAINTS.find((p) => p.id === paint).color

  const place = (r, c) => {
    if (done) return
    const rr = SIZE - 1 - r
    const cc = SIZE - 1 - c
    // One tap paints the cell and its three mirror images (4-fold symmetry).
    // Functional update so fast / repeated taps accumulate correctly.
    setGrid((prev) => {
      const next = prev.slice()
      for (const [y, x] of [[r, c], [r, cc], [rr, c], [rr, cc]]) {
        next[y * SIZE + x] = color
      }
      return next
    })
    setTaps((t) => t + 1)
  }

  const finish = () => {
    if (taps < NEEDED || done) return
    setDone(true)
    fire()
  }

  if (done) {
    return (
      <>
        <h2 className="h2">L'atelier de zellige</h2>
        <div className="mtf-done">
          <div className="mtf-grid mtf-grid-final" style={{ '--cols': SIZE }} aria-hidden="true">
            {grid.map((cell, i) => (
              <span
                key={i}
                className="mtf-cell"
                style={cell ? { background: cell } : undefined}
              />
            ))}
          </div>
          <Fox size="sm" mood="happy" />
          <p className="mtf-done-msg">
            Regarde : tout ce que tu poses d'un côté apparaît partout. Tu viens de
            créer une symétrie, exactement comme les artisans du zellige.
          </p>
          <button className="btn btn-block" onClick={onSolve}>Continuer</button>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="h2">L'atelier de zellige</h2>
      <p className="body">
        Crée ton zellige : touche la grille et regarde ton motif se répéter dans
        tous les sens. Chaque touche dessine quatre fois — c'est ça, la symétrie.
      </p>

      <div className="mtf-paints" role="group" aria-label="Choisis une couleur">
        {PAINTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`mtf-swatch${paint === p.id ? ' on' : ''}`}
            style={{ '--swatch': p.color }}
            aria-label={p.label}
            aria-pressed={paint === p.id}
            onClick={() => setPaint(p.id)}
          />
        ))}
      </div>

      <div className="mtf-board">
        <div
          className="mtf-grid mtf-grid-game"
          style={{ '--cols': SIZE }}
          role="group"
          aria-label="Grille du zellige : touche une case pour la peindre, son motif se répète"
        >
          {grid.map((cell, i) => {
            const r = Math.floor(i / SIZE)
            const c = i % SIZE
            return (
              <button
                key={i}
                type="button"
                className="mtf-cell"
                style={cell ? { background: cell } : undefined}
                aria-label={`Ligne ${r + 1}, colonne ${c + 1}`}
                onClick={() => place(r, c)}
              />
            )
          })}
          {/* The two mirror axes, drawn over the grid. */}
          <span className="mtf-axis mtf-axis-v" aria-hidden="true" />
          <span className="mtf-axis mtf-axis-h" aria-hidden="true" />
        </div>
      </div>

      <div className="mtf-status">
        <p className="mtf-count" aria-live="polite">
          {taps === 0
            ? 'Touche la grille pour commencer.'
            : `Touches : ${taps}`}
        </p>
      </div>

      <button className="btn btn-block" onClick={finish} disabled={taps < NEEDED}>
        Terminé
      </button>
    </>
  )
}

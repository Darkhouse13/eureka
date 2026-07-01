import { useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './motifs-games.css'

// Rung 1 — « Le miroir » (l'atelier de symétrie, réutilisé puis ré-habillé céladon).
// Une grille traversée par UN axe-miroir vertical. Chaque case qu'elle peint
// apparaît AUSSI de l'autre côté de l'axe : son reflet exact. La figure est donc
// toujours symétrique — il n'y a pas d'échec, chaque geste est juste. Après une
// poignée de touches, « Terminé » s'active et la révélation mène à la découverte.
const SIZE = 6 // grille paire → l'axe tombe pile entre deux colonnes (miroir net)
const NEEDED = 6 // touches avant que « Terminé » s'active

// Trois teintes céladon & or pour peindre — la palette douce du monde des motifs.
const PAINTS = [
  { id: 'celadon', label: 'Céladon', color: '#7FC9A8' },
  { id: 'jade', label: 'Jade profond', color: '#2E8B74' },
  { id: 'or', label: 'Or de bougie', color: '#E8A14C' },
]

export default function Miroir({ onSolve }) {
  const [grid, setGrid] = useState(() => Array(SIZE * SIZE).fill(null))
  const [paint, setPaint] = useState(PAINTS[0].id)
  const [taps, setTaps] = useState(0)
  const [done, setDone] = useState(false)

  const color = PAINTS.find((p) => p.id === paint).color

  const place = (r, c) => {
    if (done) return
    const cc = SIZE - 1 - c // colonne miroir de l'autre côté de l'axe vertical
    // Une touche peint la case ET son reflet. Mise à jour fonctionnelle pour que
    // des touches rapides / répétées s'accumulent correctement.
    setGrid((prev) => {
      const next = prev.slice()
      next[r * SIZE + c] = color
      next[r * SIZE + cc] = color
      return next
    })
    setTaps((t) => t + 1)
    sound.tap()
  }

  const finish = () => {
    if (taps < NEEDED || done) return
    setDone(true)
    sound.chime()
  }

  return (
    <div className="mg">
      <div className="mg-fox">
        <Fennec size={50} expression={done ? 'celebrant' : 'curieux'} />
        <span>
          {done
            ? 'Regarde : tout ce que tu as posé d\'un côté est revenu de l\'autre. Une symétrie parfaite.'
            : 'Touche une case : son reflet apparaît tout seul de l\'autre côté du miroir.'}
        </span>
      </div>

      {!done && (
        <div className="mg-paints" role="group" aria-label="Choisis une couleur">
          {PAINTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`mg-swatch${paint === p.id ? ' on' : ''}`}
              style={{ '--swatch': p.color }}
              aria-label={p.label}
              aria-pressed={paint === p.id}
              onClick={() => setPaint(p.id)}
            />
          ))}
        </div>
      )}

      <div className="mg-board">
        <div
          className={`mg-grid${done ? ' is-final' : ''}`}
          style={{ '--cols': SIZE }}
          role="group"
          aria-label="Grille avec un miroir au milieu : touche une case, son reflet apparaît de l'autre côté"
        >
          {grid.map((cell, i) => {
            const r = Math.floor(i / SIZE)
            const c = i % SIZE
            return (
              <button
                key={i}
                type="button"
                className="mg-cell"
                style={cell ? { background: cell } : undefined}
                aria-label={`Ligne ${r + 1}, colonne ${c + 1}`}
                disabled={done}
                onClick={() => place(r, c)}
              />
            )
          })}
          <span className="mg-axis mg-axis-v" aria-hidden="true" />
        </div>
      </div>

      {!done && (
        <>
          <p className="mg-hint" aria-live="polite">
            {taps === 0 ? 'Touche la grille pour commencer.' : `Touches : ${taps}`}
          </p>
          <button className="btn-or" onClick={finish} disabled={taps < NEEDED}>
            {taps < NEEDED ? `Encore ${NEEDED - taps}…` : 'Terminé ✦'}
          </button>
        </>
      )}

      {done && (
        <div className="mg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display mg-reveal-title">Tu viens de dompter le miroir.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

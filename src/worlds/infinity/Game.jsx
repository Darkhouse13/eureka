// "Le jeu" for Les nombres sans fin: "Le zoom infini".
// Place a number strictly between the two ends, then Zoom — the chosen value
// becomes the new left end and the gap fills the screen, gaining a decimal every
// time. There is no losing: any placement is valid and every zoom succeeds.
// After the last level it reveals that you could zoom like this forever, then
// calls onSolve() (the engine awards the π card + advances the loop).
import { useRef, useState } from 'react'
import Fox from '../../components/Fox.jsx'
import { useConfetti } from '../../components/Confetti.jsx'
import { clampInside, fr, midpoint, prefersReducedMotion } from './numbers.js'

const TARGET = 5 // how many zooms before the reveal
const MICRO = [
  'Place ton nombre, puis appuie sur Zoom.',
  'Encore plus près !',
  "Tu plonges dans l'infiniment petit !",
  'Et il reste toujours de la place...',
  'Encore une infinité de nombres ici-dedans !',
  'Encore une infinité de nombres ici-dedans !',
]

export default function InfinityGame({ onSolve }) {
  const b = 1 // the right end never moves: the interval is always [a, 1]
  const [a, setA] = useState(0)
  const [zooms, setZooms] = useState(0)
  const [chosen, setChosen] = useState(() => midpoint(0, 1, 1))
  const [zooming, setZooming] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [dragging, setDragging] = useState(false)

  const lineRef = useRef(null)
  const reduced = useRef(prefersReducedMotion())
  const fire = useConfetti()

  const decimals = zooms + 1
  const pct = (v) => `${((v - a) / (b - a)) * 100}%`

  // Map a pointer x to the nearest valid (strictly-interior) value on the line.
  const valueFromX = (clientX) => {
    const r = lineRef.current.getBoundingClientRect()
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    return clampInside(a + f * (b - a), a, b, decimals)
  }

  const locked = zooming || revealed
  const onDown = (e) => {
    if (locked) return
    lineRef.current.setPointerCapture?.(e.pointerId)
    setDragging(true)
    setChosen(valueFromX(e.clientX))
  }
  const onMove = (e) => {
    if (dragging && !locked) setChosen(valueFromX(e.clientX))
  }
  const onUp = (e) => {
    setDragging(false)
    lineRef.current.releasePointerCapture?.(e.pointerId)
  }
  const onKey = (e) => {
    if (locked) return
    const step = 10 ** -decimals
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      setChosen((c) => clampInside(c + step, a, b, decimals))
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      setChosen((c) => clampInside(c - step, a, b, decimals))
      e.preventDefault()
    } else if (e.key === 'Home') {
      setChosen(clampInside(a, a, b, decimals))
      e.preventDefault()
    } else if (e.key === 'End') {
      setChosen(clampInside(b, a, b, decimals))
      e.preventDefault()
    }
  }

  const zoom = () => {
    if (locked) return
    const c = chosen
    const nz = zooms + 1
    setZooming(true)
    setA(c) // [c, 1] fills the width; the thumb glides to the left edge
    setZooms(nz)

    const finish = () => {
      setZooming(false)
      if (nz >= TARGET) {
        setRevealed(true)
        fire()
      } else {
        setChosen(midpoint(c, b, nz + 1)) // recentre for the next dive
      }
    }
    if (reduced.current) finish()
    else setTimeout(finish, 560)
  }

  if (revealed) {
    return (
      <>
        <h2 className="h2">Le zoom infini</h2>
        <div className="zoom-done">
          <Fox size="sm" mood="happy" />
          <p className="zoom-done-msg">
            Tu pourrais zoomer comme ça pour toujours. Entre deux nombres, aussi
            proches soient-ils, il y a une infinité d'autres nombres.
          </p>
          <button className="btn btn-block" onClick={onSolve}>Continuer</button>
        </div>
      </>
    )
  }

  const micro = MICRO[Math.min(zooms, MICRO.length - 1)]

  return (
    <>
      <h2 className="h2">Le zoom infini</h2>
      <p className="body">
        Place un nombre entre les deux bouts, puis appuie sur Zoom. Tu verras : il y
        aura toujours de la place pour un autre.
      </p>

      <div className="zoom-status">
        <p className="zoom-micro" aria-live="polite">{micro}</p>
        {zooms > 0 && <span className="zoom-depth">Zoom ×{zooms}</span>}
      </div>

      <div
        ref={lineRef}
        className={`numline game${zooming ? ' zooming' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="Place un nombre entre les deux bouts"
        aria-valuemin={a}
        aria-valuemax={b}
        aria-valuenow={chosen}
        aria-valuetext={fr(chosen, decimals)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
      >
        <div className="nl-rail" />
        <div className="nl-fill" style={{ left: pct(chosen), right: 0 }} />
        {!zooming && (
          <span className="nl-value" style={{ left: pct(chosen) }}>{fr(chosen, decimals)}</span>
        )}
        <span className="nl-thumb" style={{ left: pct(chosen) }} />
      </div>
      <div className="nl-ends">
        <span className="nl-end">{fr(a, zooms)}</span>
        <span className="nl-end">{fr(b, 0)}</span>
      </div>

      <div className="zoom-actions">
        <button className="btn btn-block" onClick={zoom} disabled={zooming}>Zoom</button>
      </div>
    </>
  )
}

// "Le jeu" for Les formes impossibles: "Le grand découpage".
// She predicts what happens if you cut the ribbon down the middle, all the way
// along. Then we "cut" it (a point travels the dashed mid-line) and the ribbon
// becomes one single, longer loop — never two pieces. Whatever she predicted, the
// reveal stays positive. "Continuer" calls onSolve() (engine awards the card +
// advances the loop). The morph is a stylized 2D cross-fade, not a physical
// simulation — which the brief allows.
import { useEffect, useRef, useState } from 'react'
import Fox from '../../components/Fox.jsx'
import { useConfetti } from '../../components/Confetti.jsx'
import { MobiusRibbon, ResultLoop, prefersReducedMotion } from './Ribbon.jsx'

const OPTIONS = [
  { id: 'two', label: 'Deux boucles séparées' },
  { id: 'one', label: 'Une seule boucle, plus grande' }, // what actually happens
  { id: 'knot', label: 'Un nœud' },
]

export default function FormesGame({ onSolve }) {
  const [pred, setPred] = useState(null)
  const [phase, setPhase] = useState('before') // 'before' | 'cutting' | 'done'
  const pathRef = useRef(null)
  const dotRef = useRef(null)
  const rafRef = useRef(0)
  const reduced = useRef(prefersReducedMotion())
  const fire = useConfetti()

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const finishCut = () => {
    setPhase('done')
    fire()
  }

  const cut = () => {
    if (pred == null || phase !== 'before') return

    if (reduced.current) {
      finishCut() // snap straight to the result
      return
    }

    setPhase('cutting')
    // The cutting dot travels the mid-line; the result appears when it gets home.
    requestAnimationFrame(() => {
      const path = pathRef.current
      if (!path) return finishCut()
      const L = path.getTotalLength()
      const dur = 1600
      let start = null
      const tick = (ts) => {
        if (start == null) start = ts
        const t = Math.min(1, (ts - start) / dur)
        const p = path.getPointAtLength(t * L)
        if (dotRef.current) dotRef.current.setAttribute('transform', `translate(${p.x}, ${p.y})`)
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
        else finishCut()
      }
      rafRef.current = requestAnimationFrame(tick)
    })
  }

  if (phase === 'done') {
    return (
      <>
        <h2 className="h2">Le grand découpage</h2>
        <div className={`fms-result${reduced.current ? ' no-anim' : ''}`}>
          <ResultLoop />
        </div>
        <div className="fms-reveal">
          <Fox size="sm" mood="happy" />
          {pred === 'one' && (
            <p className="fms-good">Bien vu, c'était la bonne intuition !</p>
          )}
          <p className="fms-reveal-msg">
            Surprise ! On n'obtient pas deux morceaux, mais une seule boucle, deux
            fois plus longue. C'est la magie d'une forme à un seul côté.
          </p>
          <button className="btn btn-block" onClick={onSolve}>Continuer</button>
        </div>
      </>
    )
  }

  const cutting = phase === 'cutting'

  return (
    <>
      <h2 className="h2">Le grand découpage</h2>
      <p className="body">
        Si on coupe ce ruban tout du long, au milieu, qu'obtient-on ? Fais ta
        prédiction, puis coupe pour voir.
      </p>

      <div className="fms-stage">
        <MobiusRibbon ref={pathRef} showCut>
          {cutting && (
            <g ref={dotRef} className="fms-cutdot" aria-hidden="true">
              <circle r="6.5" fill="#fff" stroke="#0C6B56" strokeWidth="2.5" />
            </g>
          )}
        </MobiusRibbon>
      </div>

      <div className="fms-options" role="group" aria-label="Ta prédiction">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`fms-opt${pred === o.id ? ' on' : ''}`}
            aria-pressed={pred === o.id}
            disabled={cutting}
            onClick={() => setPred(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <button className="btn btn-block" onClick={cut} disabled={pred == null || cutting}>
        {cutting ? 'On coupe...' : 'Couper'}
      </button>
    </>
  )
}

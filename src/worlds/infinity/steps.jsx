// Content for three of the four loop steps of "Les nombres sans fin".
// (Le jeu lives in Game.jsx.) The engine wraps each in the loop chrome and
// supplies the eyebrow label; these render the heading, copy and button.
import { useRef, useState } from 'react'
import { CARDS } from '../../cards/index.js'
import { WonderCard } from '../../components/WonderCard.jsx'
import { fr, midpoint, prefersReducedMotion } from './numbers.js'

// --- L'étincelle: there is no biggest number ---
export function Etincelle({ onNext }) {
  return (
    <>
      <h2 className="h2">Le plus grand nombre du monde</h2>
      <p className="body">
        Quel est le plus grand nombre du monde ? Un million ? Un milliard ? Un
        milliard de milliards ? La réponse va te surprendre : il n'existe pas. Quel
        que soit le nombre que tu écris, tu peux toujours ajouter 1. Et encore 1.
        Pour toujours. Les nombres ne s'arrêtent jamais... et ce n'est que le début
        de l'histoire.
      </p>
      <button className="btn btn-block" onClick={onNext}>Continuer</button>
    </>
  )
}

// --- L'idée: a tiny number line that keeps finding room between two numbers ---
// Each tap drops the midpoint of the current interval and zooms into its right
// half, so the labels gain a decimal each time (0–1 → 0,5–1 → 0,75–1 → ...).
function NumberLineDemo({ onReady }) {
  const b = 1
  const [a, setA] = useState(0)
  const [taps, setTaps] = useState(0)
  const [dot, setDot] = useState(null) // the just-placed midpoint, mid-zoom
  const [zooming, setZooming] = useState(false)
  const reduced = useRef(prefersReducedMotion())

  const pct = (v) => `${((v - a) / (b - a)) * 100}%`

  const findAnother = () => {
    if (zooming || taps >= 6) return
    const t0 = taps
    const c = midpoint(a, b, t0 + 1)
    setDot(c) // appears at the centre first (no .zooming → instant)

    const run = () => {
      setZooming(true)
      setA(c) // view becomes [c, 1]; the dot glides to the new left edge
      setTaps(t0 + 1)
      if (t0 + 1 >= 3) onReady()
      const finish = () => {
        setZooming(false)
        setDot(null)
      }
      if (reduced.current) finish()
      else setTimeout(finish, 560)
    }
    if (reduced.current) run()
    else requestAnimationFrame(() => requestAnimationFrame(run))
  }

  return (
    <div className="nl-demo">
      <div className={`numline${zooming ? ' zooming' : ''}`} aria-hidden="true">
        <div className="nl-rail" />
        {dot != null && <div className="nl-fill" style={{ left: pct(dot), right: 0 }} />}
        {dot != null && <span className="nl-dot" style={{ left: pct(dot) }} />}
      </div>
      <div className="nl-ends">
        <span className="nl-end">{fr(a, taps)}</span>
        <span className="nl-end">{fr(b, 0)}</span>
      </div>
      <button className="btn-soft" onClick={findAnother} disabled={zooming || taps >= 6}>
        Trouve-en un autre
      </button>
      {taps >= 3 && <p className="nl-note">...et on pourrait continuer à l'infini.</p>}
    </div>
  )
}

export function Idee({ onNext }) {
  const [ready, setReady] = useState(false)
  return (
    <>
      <h2 className="h2">Toujours de la place</h2>
      <p className="body">
        Voici une idée vertigineuse : entre deux nombres, il y a toujours de la place
        pour un autre. Entre 0 et 1, il y a 0,5. Entre 0,5 et 1, il y a 0,7. Entre
        0,7 et 0,8, il y a 0,75... On peut continuer sans jamais s'arrêter.
      </p>
      <NumberLineDemo onReady={() => setReady(true)} />
      <button className="btn btn-block" onClick={onNext} disabled={!ready}>
        À moi de jouer
      </button>
    </>
  )
}

// --- La découverte: the π card reveal + the door to what's next ---
export function Decouverte({ onFinish }) {
  return (
    <>
      <h2 className="h2">Une merveille pour toi !</h2>
      <WonderCard card={CARDS.pi} pop />
      <div className="door">
        <p className="body">
          <b>Et le monde s'agrandit encore :</b> il existe même plusieurs infinis...
          et certains sont plus grands que d'autres. Mais ça, c'est une histoire pour
          un autre jour.
        </p>
      </div>
      <button className="btn btn-block" onClick={onFinish}>Ajouter à ma collection</button>
    </>
  )
}

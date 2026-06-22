// Content for three of the four loop steps of "Les formes impossibles".
// (Le jeu lives in Game.jsx.) The engine wraps each in the loop chrome and
// supplies the eyebrow label; these render the heading, copy and button.
import { useEffect, useRef, useState } from 'react'
import { CARDS } from '../../cards/index.js'
import { WonderCard } from '../../components/WonderCard.jsx'
import { MobiusRibbon, prefersReducedMotion } from './Ribbon.jsx'

// --- L'étincelle: a shape with a single side ---
export function Etincelle({ onNext }) {
  return (
    <>
      <h2 className="h2">Une forme à un seul côté</h2>
      <p className="body">
        Une feuille de papier a deux faces : devant et derrière. Évident, non ? Et
        pourtant, il existe une forme toute simple, qu'on fabrique en dix secondes,
        qui n'a qu'un seul côté. Impossible ? Regarde.
      </p>
      <button className="btn btn-block" onClick={onNext}>Continuer</button>
    </>
  )
}

// --- L'idée: a small ant walks the whole ribbon and ends back at the start. ---
function AntDemo({ onWalked }) {
  const pathRef = useRef(null)
  const antRef = useRef(null)
  const reduced = useRef(prefersReducedMotion())
  const rafRef = useRef(0)
  const [walking, setWalking] = useState(false)
  const [walked, setWalked] = useState(false)
  const [traced, setTraced] = useState(false)

  const placeAnt = (len) => {
    const path = pathRef.current
    const ant = antRef.current
    if (!path || !ant) return
    const p = path.getPointAtLength(len)
    ant.setAttribute('transform', `translate(${p.x}, ${p.y})`)
  }

  // Park the ant at the start as soon as the path is measurable.
  useEffect(() => {
    placeAnt(0)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const walk = () => {
    const path = pathRef.current
    if (!path || walking) return

    if (reduced.current) {
      // Reduced motion: show the full traced path statically, no animation.
      setTraced(true)
      placeAnt(0)
      setWalked(true)
      onWalked()
      return
    }

    setWalking(true)
    const L = path.getTotalLength()
    const dur = 2600
    let start = null
    const tick = (ts) => {
      if (start == null) start = ts
      const t = Math.min(1, (ts - start) / dur)
      placeAnt(t * L)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setWalking(false)
        setWalked(true)
        onWalked()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div className="fms-demo">
      <button
        type="button"
        className="fms-tap"
        onClick={walk}
        aria-label="Faire avancer la fourmi tout autour du ruban"
      >
        <MobiusRibbon ref={pathRef} traced={traced}>
          <g ref={antRef} className="fms-ant" aria-hidden="true">
            <circle cx="4" cy="0" r="3.4" fill="#3B2A18" />
            <circle cx="-1" cy="0" r="2.8" fill="#3B2A18" />
            <circle cx="-5.5" cy="0" r="2.6" fill="#3B2A18" />
            <line x1="-7.5" y1="-1.5" x2="-10" y2="-4.5" stroke="#3B2A18" strokeWidth="1" strokeLinecap="round" />
            <line x1="-7.5" y1="-1" x2="-9.5" y2="-3.5" stroke="#3B2A18" strokeWidth="1" strokeLinecap="round" />
          </g>
        </MobiusRibbon>
      </button>
      {walked ? (
        <p className="fms-tag">un seul côté !</p>
      ) : (
        <p className="fms-hint">Touche le ruban : la fourmi en fait le tour complet.</p>
      )}
    </div>
  )
}

export function Idee({ onNext }) {
  const [ready, setReady] = useState(false)
  return (
    <>
      <h2 className="h2">Le ruban de Möbius</h2>
      <p className="body">
        Prends une bande de papier, fais-lui une demi-torsion, colle les deux bouts :
        tu obtiens un ruban de Möbius. Une fourmi qui s'y promène peut parcourir tout
        le ruban et revenir à son point de départ, sans jamais passer par-dessus le
        bord.
      </p>
      <AntDemo onWalked={() => setReady(true)} />
      <button className="btn btn-block" onClick={onNext} disabled={!ready}>
        À moi de jouer
      </button>
    </>
  )
}

// --- La découverte: the Möbius card reveal + the door to what's next ---
export function Decouverte({ onFinish }) {
  return (
    <>
      <h2 className="h2">Une merveille pour toi !</h2>
      <WonderCard card={CARDS.mobius} pop />
      <div className="door">
        <p className="body">
          <b>Il existe des formes encore plus folles :</b> la bouteille de Klein n'a
          ni intérieur ni extérieur — elle se traverse elle-même. La construire
          vraiment demanderait une quatrième dimension... une histoire pour un autre
          jour.
        </p>
      </div>
      <button className="btn btn-block" onClick={onFinish}>Ajouter à ma collection</button>
    </>
  )
}

import { useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './motifs-games.css'

// Rung 4 — « Le pavage impossible » (Penrose, cerf-volant & flèche).
// VERSION LIVRÉE : guidée / « snap ». Le patch Penrose est PRÉ-CALCULÉ par
// déflation exacte (subdivision des deux demi-triangles de Robinson — la moitié
// d'un cerf-volant, la moitié d'une flèche), puis révélé couronne par couronne
// quand elle touche. Chaque tuile « tombe » donc à une position toujours valide :
// elle réussit à coup sûr et voit le motif non-périodique grandir. (La pose libre
// avec règles d'emboîtement serait trop ardue vers 11 ans — la simplification est
// explicitement permise par le brief.)
//
// Déflation P2 vérifiée à la main (longueurs de côtés contrôlées) :
//   demi-cerf-volant AL (sommet 36°, côtés φ,φ,1) → 2 AL + 1 AS
//   demi-flèche      AS (sommet 108°, côtés 1,1,φ) → 1 AL + 1 AS
// On part du « soleil » (10 demi-cerfs-volants autour du centre = 5 cerfs-volants),
// configuration de Penrose légale ⇒ sa déflation est légale (sans trou ni
// chevauchement).
const PHI = (1 + Math.sqrt(5)) / 2
const INV = 1 / PHI // = φ − 1
const lerp = (p, q, f) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]

function subdivide(tris) {
  const out = []
  for (const t of tris) {
    const { k, a, b, c } = t
    if (k === 'AL') {
      const d = lerp(a, b, INV) // D sur AB, à |AB|/φ du sommet
      const e = lerp(a, c, INV) // E sur AC
      out.push({ k: 'AL', a, b: d, c: e }, { k: 'AL', a: c, b, c: d }, { k: 'AS', a: e, b: d, c })
    } else {
      const f = lerp(b, c, INV) // F sur la base QR
      out.push({ k: 'AL', a: b, b: a, c: f }, { k: 'AS', a: f, b: a, c })
    }
  }
  return out
}

// Le « soleil » : 10 demi-cerfs-volants, sommet au centre, base sur le cercle de
// rayon φ aux angles tous les 36°.
function buildPatch(levels) {
  let tris = []
  for (let i = 0; i < 10; i++) {
    const a0 = (Math.PI / 180) * (36 * i + 18)
    const a1 = (Math.PI / 180) * (36 * (i + 1) + 18)
    tris.push({
      k: 'AL', a: [0, 0],
      b: [PHI * Math.cos(a0), PHI * Math.sin(a0)],
      c: [PHI * Math.cos(a1), PHI * Math.sin(a1)],
    })
  }
  for (let n = 0; n < levels; n++) tris = subdivide(tris)
  // tri par rayon du centre de gravité → révélation en couronnes successives
  return tris
    .map((t) => ({ ...t, r: Math.hypot((t.a[0] + t.b[0] + t.c[0]) / 3, (t.a[1] + t.b[1] + t.c[1]) / 3) }))
    .sort((x, y) => x.r - y.r)
}

const PATCH = buildPatch(3) // ~210 demi-tuiles dans le disque de rayon φ
const S = 56 // échelle (φ·56 ≈ 90, tient dans le viewBox 200)
const px = (p) => `${(100 + p[0] * S).toFixed(2)},${(100 + p[1] * S).toFixed(2)}`

const RINGS = 5
const NEEDED = 3 // couronnes avant que « Terminé » s'active

const KITE = '#7FC9A8'
const DART = '#E8A14C'

export default function Penrose({ onSolve }) {
  const [step, setStep] = useState(1) // couronnes révélées (1..5)
  const [done, setDone] = useState(false)

  const shown = Math.ceil((PATCH.length * step) / RINGS)
  const tiles = PATCH.slice(0, shown)

  const grow = () => {
    if (done) return
    if (step < RINGS) { setStep((s) => s + 1); sound.tap() }
  }

  const finish = () => {
    if (step < NEEDED || done) return
    setDone(true)
    sound.chime()
  }

  return (
    <div className="mg">
      <div className="mg-fox">
        <Fennec size={50} expression={done ? 'celebrant' : 'curieux'} />
        <span>
          {done
            ? 'Regarde bien : le motif s\'étend, mais il ne se répète jamais à l\'identique. De l\'ordre, sans répétition.'
            : 'Deux formes suffisent — le cerf-volant et la flèche. Touche pour les laisser s\'emboîter, couronne après couronne.'}
        </span>
      </div>

      <div className="mg-legend" aria-hidden="true">
        <span className="mg-legend-item"><span className="mg-legend-sw" style={{ background: KITE }} /> cerf-volant</span>
        <span className="mg-legend-item"><span className="mg-legend-sw" style={{ background: DART }} /> flèche</span>
      </div>

      <div className="mg-board">
        <svg className="mg-canvas mg-penrose" viewBox="0 0 200 200" role="img"
             aria-label={`Pavage de Penrose — ${tiles.length} tuiles posées`}>
          {tiles.map((t, i) => (
            <polygon
              key={i}
              className="mg-pen-tile"
              points={`${px(t.a)} ${px(t.b)} ${px(t.c)}`}
              fill={t.k === 'AL' ? KITE : DART}
              stroke="#0c1813"
              strokeWidth="0.6"
            />
          ))}
        </svg>
      </div>

      {!done && (
        <>
          <p className="mg-hint" aria-live="polite">
            {step < RINGS ? `${tiles.length} tuiles posées` : 'Le motif est complet — et il ne s\'est jamais répété.'}
          </p>
          <div className="mg-actions">
            <button className="btn-soft accent-motifs" onClick={grow} disabled={step >= RINGS}>
              Ajouter une couronne ✦
            </button>
            <button className="btn-or" onClick={finish} disabled={step < NEEDED}>
              {step < NEEDED ? `Encore ${NEEDED - step}…` : 'Terminé ✦'}
            </button>
          </div>
        </>
      )}

      {done && (
        <div className="mg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display mg-reveal-title">Un motif infini qui ne se répète jamais.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

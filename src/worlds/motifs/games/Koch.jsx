import { useMemo, useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './motifs-games.css'

// Rung 5 — « La forme sans fin » (le flocon de Koch).
// À chaque touche, on ajoute un niveau de détail : chaque segment se remplace par
// quatre, et le bord se hérisse. Un compteur vivant montre la merveille : le
// PÉRIMÈTRE grimpe sans borne (×4/3 à chaque pas) pendant que l'AIRE, elle, reste
// contenue (elle tend vers ×1,6, jamais plus). Chaque niveau se dessine d'un coup
// sur la touche — rien à animer, donc sûr en « mouvement réduit ». Résolu après
// quelques niveaux.
const MAX = 5
const NEEDED = 3
const C = 100
const Rb = 74 // rayon du triangle de départ (viewBox 0 0 200 200)

// Sommets du triangle équilatéral de départ (pointe en haut).
const BASE = [-90, 150, 30].map((deg) => {
  const a = (Math.PI / 180) * deg
  return [C + Rb * Math.cos(a), C + Rb * Math.sin(a)]
})

const rot = (v, deg) => {
  const a = (Math.PI / 180) * deg
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]
}
const lerp = (p, q, f) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]

// Un pas de Koch : chaque arête (p→q) devient p · b · sommet · c · q, où le sommet
// est l'apex de la bosse équilatérale posée sur le tiers du milieu (vers l'extérieur).
function kochStep(pts) {
  const out = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % n]
    const b = lerp(p, q, 1 / 3)
    const c = lerp(p, q, 2 / 3)
    const m = [c[0] - b[0], c[1] - b[1]]
    const r = rot(m, -60) // bosse vers l'extérieur (sens du tracé du triangle)
    const apex = [b[0] + r[0], b[1] + r[1]]
    out.push(p, b, apex, c)
  }
  return out
}

const fr = (x, d = 2) => x.toFixed(d).replace('.', ',')

export default function Koch({ onSolve }) {
  const [level, setLevel] = useState(0)
  const [done, setDone] = useState(false)

  const pts = useMemo(() => {
    let p = BASE
    for (let i = 0; i < level; i++) p = kochStep(p)
    return p
  }, [level])

  const perim = Math.pow(4 / 3, level) // périmètre / périmètre de départ
  const area = 1 + (3 / 5) * (1 - Math.pow(4 / 9, level)) // aire / aire de départ → 8/5
  const areaPct = (area / 1.6) * 100

  const add = () => {
    if (done) return
    if (level < MAX) { setLevel((l) => l + 1); sound.hop(level) }
  }

  const finish = () => {
    if (level < NEEDED || done) return
    setDone(true)
    sound.chime()
  }

  const path = `M${pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' L')} Z`

  return (
    <div className="mg">
      <div className="mg-fox">
        <Fennec size={50} expression={done ? 'celebrant' : 'curieux'} />
        <span>
          {done
            ? 'Un tour de périmètre infini… autour d\'une surface que tu pourrais peindre. L\'infini se cache aussi dans les formes.'
            : 'Touche pour ajouter un niveau de détail. Surveille les deux compteurs : ils ne font pas la même chose.'}
        </span>
      </div>

      <div className="mg-board">
        <svg className="mg-canvas mg-koch" viewBox="0 0 200 200" role="img"
             aria-label={`Flocon de Koch, niveau ${level} — périmètre ×${fr(perim)}, aire ×${fr(area)}`}>
          <path d={path} className="mg-koch-shape" />
        </svg>
      </div>

      <div className="mg-meters">
        <div className="mg-meter">
          <div className="mg-meter-top">
            <span className="mg-meter-lbl">Périmètre ↑</span>
            <span className="mg-meter-val rising">×{fr(perim)}</span>
          </div>
          <div className="bar"><i style={{ width: `${Math.min(100, (perim / Math.pow(4 / 3, MAX)) * 100)}%` }} /></div>
          <span className="mg-meter-note">il monte sans fin</span>
        </div>
        <div className="mg-meter">
          <div className="mg-meter-top">
            <span className="mg-meter-lbl">Aire</span>
            <span className="mg-meter-val">×{fr(area)}</span>
          </div>
          <div className="bar mg-bar-celadon"><i style={{ width: `${areaPct}%` }} /></div>
          <span className="mg-meter-note">elle reste contenue (vers ×1,6)</span>
        </div>
      </div>

      {!done && (
        <>
          <p className="mg-hint" aria-live="polite">
            {level === 0 ? 'Un simple triangle… pour l\'instant.' : `Niveau ${level} : ${pts.length} côtés`}
          </p>
          <div className="mg-actions">
            <button className="btn-soft accent-motifs" onClick={add} disabled={level >= MAX}>
              {level >= MAX ? 'Détail au maximum' : 'Ajouter un niveau de détail ✦'}
            </button>
            <button className="btn-or" onClick={finish} disabled={level < NEEDED}>
              {level < NEEDED ? `Encore ${NEEDED - level}…` : 'Terminé ✦'}
            </button>
          </div>
        </>
      )}

      {done && (
        <div className="mg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display mg-reveal-title">Un périmètre infini autour d'une aire finie.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

import { useRef, useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './motifs-games.css'

// Rung 2 — « La rosace » (kaléidoscope à symétrie tournante).
// Un disque avec une symétrie de rotation d'ordre N : chaque marque qu'elle pose
// est aussitôt recopiée par rotation en N exemplaires autour du centre. D'un seul
// geste naît tout un ornement. Elle choisit le « pli » (4, 6 ou 8) et le voit
// multiplier ses marques. Sans échec, créatif ; résolu après quelques poses.
const C = 100 // centre du disque (viewBox 0 0 200 200)
const NEEDED = 5 // marques avant que « Terminé » s'active
const FOLDS = [4, 6, 8]

// Teintes céladon, jade & or — chaque marque prend la suivante.
const COLORS = ['#7FC9A8', '#E8A14C', '#2E8B74', '#BFE3D2', '#F5C66B']

// Position déterministe d'une marque ajoutée au bouton (sans hasard) : l'angle d'or
// répartit joliment les marques, le rayon ondule pour étager l'ornement.
const autoMark = (i) => {
  const ang = (i * 137.5 * Math.PI) / 180
  const rad = 34 + (i % 4) * 13
  return { x: C + rad * Math.cos(ang), y: C + rad * Math.sin(ang), c: COLORS[i % COLORS.length] }
}

export default function Rosace({ onSolve }) {
  const [fold, setFold] = useState(6)
  const [marks, setMarks] = useState([])
  const [done, setDone] = useState(false)
  const svgRef = useRef(null)

  const addMark = (x, y) => {
    if (done) return
    // Garde la marque dans le disque (rayon ≤ 92) — sinon on la ramène vers le bord.
    const dx = x - C, dy = y - C
    const r = Math.hypot(dx, dy)
    const k = r > 92 ? 92 / r : 1
    const m = { x: C + dx * k, y: C + dy * k, c: COLORS[marks.length % COLORS.length] }
    setMarks((prev) => [...prev, m])
    sound.tap()
  }

  // Tap sur le disque → coordonnées SVG (viewBox 200 sur une zone carrée).
  const onCanvas = (e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 200
    const y = ((e.clientY - rect.top) / rect.height) * 200
    addMark(x, y)
  }

  const finish = () => {
    if (marks.length < NEEDED || done) return
    setDone(true)
    sound.chime()
  }

  // Une marque → N pétales par rotation autour du centre.
  const petals = []
  marks.forEach((m, mi) => {
    for (let k = 0; k < fold; k++) {
      const a = (360 / fold) * k
      petals.push(
        <g key={`${mi}-${k}`} className="mg-petal" transform={`rotate(${a} ${C} ${C})`}>
          <line x1={C} y1={C} x2={m.x} y2={m.y} stroke={m.c} strokeWidth="2.2" strokeLinecap="round" opacity=".55" />
          <circle cx={m.x} cy={m.y} r="7" fill={m.c} />
          <circle cx={m.x} cy={m.y} r="3" fill="#0c1813" opacity=".35" />
        </g>
      )
    }
  })

  return (
    <div className="mg">
      <div className="mg-fox">
        <Fennec size={50} expression={done ? 'celebrant' : 'curieux'} />
        <span>
          {done
            ? 'D\'un seul geste, tout un ornement. La symétrie tournante a multiplié chacune de tes marques.'
            : 'Pose une marque : elle se répète tout autour du centre. Change le nombre de miroirs et regarde !'}
        </span>
      </div>

      {!done && (
        <div className="mg-folds" role="group" aria-label="Choisis le nombre de copies">
          {FOLDS.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip${fold === f ? ' active' : ''}`}
              aria-pressed={fold === f}
              onClick={() => { sound.foxCue(); setFold(f) }}
            >
              ×{f}
            </button>
          ))}
        </div>
      )}

      <div className="mg-board">
        <svg
          ref={svgRef}
          className="mg-canvas mg-rosace"
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Rosace à ${fold} branches — ${marks.length} marque${marks.length > 1 ? 's' : ''} posée${marks.length > 1 ? 's' : ''}`}
          onPointerDown={onCanvas}
        >
          <circle cx={C} cy={C} r="96" className="mg-rosace-bg" />
          {/* repères des axes de symétrie — discrets */}
          {Array.from({ length: fold }, (_, k) => {
            const a = ((360 / fold) * k * Math.PI) / 180
            return <line key={k} x1={C} y1={C} x2={C + 96 * Math.cos(a)} y2={C + 96 * Math.sin(a)} className="mg-rosace-spoke" />
          })}
          {petals}
          <circle cx={C} cy={C} r="4.5" fill="#7FC9A8" />
        </svg>
      </div>

      {!done && (
        <>
          <p className="mg-hint" aria-live="polite">
            {marks.length === 0 ? 'Touche le disque (ou « ajouter un éclat »).' : `Marques : ${marks.length} → ${marks.length * fold} pétales`}
          </p>
          <div className="mg-actions">
            <button className="btn-soft accent-motifs" onClick={() => addMark(autoMark(marks.length).x, autoMark(marks.length).y)}>
              Ajouter un éclat ✦
            </button>
            <button className="btn-or" onClick={finish} disabled={marks.length < NEEDED}>
              {marks.length < NEEDED ? `Encore ${NEEDED - marks.length}…` : 'Terminé ✦'}
            </button>
          </div>
        </>
      )}

      {done && (
        <div className="mg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display mg-reveal-title">Tout un ornement, d'un seul geste.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

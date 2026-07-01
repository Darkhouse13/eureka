import { useMemo, useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './motifs-games.css'

// Rung 3 — « Le secret du zellige » (pavage / tessellation).
// Elle choisit une tuile ; le mur se couvre du motif répété. Certaines formes
// s'emboîtent à l'infini SANS le moindre trou (carré, triangle, hexagone, et une
// tuile zellige emboîtable) ; d'autres, comme le pentagone régulier, laissent
// fatalement des trous — l'« aha ». Sans échec : un choix à trous montre les trous
// et invite gentiment à essayer autre chose ; jamais « raté ». Résolu quand elle a
// couvert le mur d'une tuile qui pave vraiment.
const W = 240
const H = 160
// Palette zellige marocain : jade, céladon, terre cuite, safran, bleu de Fès.
const ZPAL = ['#2E8B74', '#7FC9A8', '#C75B39', '#E8A14C', '#1F6F8B']
const col = (n) => ZPAL[((n % ZPAL.length) + ZPAL.length) % ZPAL.length]
const STROKE = '#0c1813'

function squares() {
  const s = 34
  const els = []
  for (let j = -1; j * s < H + s; j++)
    for (let i = -1; i * s < W + s; i++)
      els.push(<rect key={`s${i},${j}`} x={i * s} y={j * s} width={s} height={s} fill={col(i + j)} stroke={STROKE} strokeWidth="1.2" />)
  return els
}

function triangles() {
  const s = 44
  const h = (s * Math.sqrt(3)) / 2
  const els = []
  for (let j = -1; j * h < H + h; j++) {
    const y = j * h
    for (let i = -1; i * (s / 2) < W + s; i++) {
      const x = i * (s / 2)
      const pts = (i + j) % 2 === 0
        ? `${x},${y + h} ${x + s / 2},${y} ${x + s},${y + h}`
        : `${x},${y} ${x + s / 2},${y + h} ${x + s},${y}`
      els.push(<polygon key={`t${i},${j}`} points={pts} fill={col(i * 3 + j)} stroke={STROKE} strokeWidth="1.2" />)
    }
  }
  return els
}

function hexagons() {
  const size = 24
  const hstep = size * 1.5
  const vstep = size * Math.sqrt(3)
  const els = []
  for (let i = -1; i * hstep < W + size; i++) {
    const cx = i * hstep + size
    const off = i % 2 === 0 ? 0 : vstep / 2
    for (let j = -1; j * vstep < H + vstep; j++) {
      const cy = j * vstep + off + size
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = (Math.PI / 180) * (60 * k)
        return `${(cx + size * Math.cos(a)).toFixed(2)},${(cy + size * Math.sin(a)).toFixed(2)}`
      }).join(' ')
      els.push(<polygon key={`h${i},${j}`} points={pts} fill={col(i + j * 2)} stroke={STROKE} strokeWidth="1.2" />)
    }
  }
  return els
}

// Tuile zellige emboîtable : un carré dont chaque bord porte une languette (en
// haut/à droite) qui s'enfonce exactement dans l'encoche du voisin (en bas/à
// gauche). C'est un pavage par translation — emboîtement EXACT, sans trou ni
// chevauchement, quelle que soit la tuile.
function zellige() {
  const T = 44
  const d = 11 // profondeur de la languette
  const w = 15 // largeur de la languette
  const a = (T - w) / 2
  const path = (x, y) =>
    `M${x},${y} L${x + a},${y} L${x + a},${y - d} L${x + a + w},${y - d} L${x + a + w},${y} L${x + T},${y} ` +
    `L${x + T},${y + a} L${x + T + d},${y + a} L${x + T + d},${y + a + w} L${x + T},${y + a + w} L${x + T},${y + T} ` +
    `L${x + a + w},${y + T} L${x + a + w},${y + T - d} L${x + a},${y + T - d} L${x + a},${y + T} L${x},${y + T} ` +
    `L${x},${y + a + w} L${x + d},${y + a + w} L${x + d},${y + a} L${x},${y + a} Z`
  const els = []
  for (let j = -1; j * T < H + T; j++)
    for (let i = -1; i * T < W + T; i++)
      els.push(<path key={`z${i},${j}`} d={path(i * T, j * T)} fill={col(i + j)} stroke={STROKE} strokeWidth="1.2" />)
  return els
}

// Pentagone régulier : aussi bien qu'on l'arrange, il reste TOUJOURS des trous —
// son angle (108°) ne divise pas 360°. On les pose en quinconce ; le mortier
// (le fond) reste visible entre eux : ce sont les trous.
function pentagons() {
  const R = 21
  const gx = 46
  const gy = 40
  const els = []
  const holes = []
  for (let j = -1; j * gy < H + gy; j++) {
    for (let i = -1; i * gx < W + gx; i++) {
      const cx = i * gx + (j % 2 ? gx / 2 : 0) + 24
      const cy = j * gy + 22
      const up = (i + j) % 2 === 0
      const pts = Array.from({ length: 5 }, (_, k) => {
        const ang = (Math.PI / 180) * (72 * k - 90 + (up ? 0 : 36))
        return `${(cx + R * Math.cos(ang)).toFixed(2)},${(cy + R * Math.sin(ang)).toFixed(2)}`
      }).join(' ')
      els.push(<polygon key={`p${i},${j}`} points={pts} fill={col(i + j)} stroke={STROKE} strokeWidth="1.2" />)
      if (i >= 0 && j >= 0 && cx < W && cy < H && (i + j) % 2 === 0)
        holes.push(<text key={`hole${i},${j}`} x={cx + gx / 2} y={cy + 4} className="mg-trou-mark" textAnchor="middle">trou</text>)
    }
  }
  return [...els, ...holes]
}

const TILES = [
  { id: 'carre', label: 'Carré', tessellates: true, gen: squares },
  { id: 'triangle', label: 'Triangle', tessellates: true, gen: triangles },
  { id: 'hexagone', label: 'Hexagone', tessellates: true, gen: hexagons },
  { id: 'zellige', label: 'Zellige', tessellates: true, gen: zellige },
  { id: 'pentagone', label: 'Pentagone', tessellates: false, gen: pentagons },
]

export default function Pavage({ onSolve }) {
  const [tileId, setTileId] = useState(null)
  const [done, setDone] = useState(false)
  const chosen = TILES.find((t) => t.id === tileId)
  const figure = useMemo(() => (chosen ? chosen.gen() : null), [tileId])

  const pick = (t) => {
    sound.foxCue()
    setTileId(t.id)
  }

  const finish = () => {
    if (!chosen?.tessellates || done) return
    setDone(true)
    sound.chime()
  }

  const status = !chosen
    ? 'Choisis une tuile et regarde-la couvrir le mur.'
    : chosen.tessellates
      ? 'Aucun trou ! Le mur est parfaitement couvert — cette tuile s\'emboîte à l\'infini.'
      : 'Regarde : des trous restent entre les pentagones. Cette forme ne s\'emboîte pas — essaie-en une autre.'

  return (
    <div className="mg">
      <div className="mg-fox">
        <Fennec size={50} expression={done ? 'celebrant' : 'curieux'} />
        <span>
          {done
            ? 'Tu as couvert le mur sans le moindre trou — exactement comme les artisans du zellige.'
            : 'Tout le secret tient dans une seule tuile, choisie pour s\'emboîter parfaitement.'}
        </span>
      </div>

      {!done && (
        <div className="mg-tiles" role="group" aria-label="Choisis une tuile">
          {TILES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip${tileId === t.id ? ' active' : ''}`}
              aria-pressed={tileId === t.id}
              onClick={() => pick(t)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="mg-board">
        <svg className="mg-canvas mg-wall" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={chosen ? `Mur pavé de ${chosen.label.toLowerCase()}s` : 'Mur vide'}>
          <defs>
            <clipPath id="mg-wall-clip"><rect x="0" y="0" width={W} height={H} rx="6" /></clipPath>
            <pattern id="mg-mortar" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="10" height="10" fill="#241a12" />
              <line x1="0" y1="0" x2="0" y2="10" stroke="#3a2c1d" strokeWidth="4" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={W} height={H} rx="6" fill="url(#mg-mortar)" />
          <g clipPath="url(#mg-wall-clip)">{figure}</g>
          <rect x="0.6" y="0.6" width={W - 1.2} height={H - 1.2} rx="6" fill="none" stroke="#4d7a63" strokeWidth="1.2" />
        </svg>
      </div>

      {!done && (
        <>
          <p className="mg-hint" aria-live="polite">{status}</p>
          <button className="btn-or" onClick={finish} disabled={!chosen?.tessellates}>
            {chosen?.tessellates ? 'Terminé ✦' : 'Trouve une tuile sans trou'}
          </button>
        </>
      )}

      {done && (
        <div className="mg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display mg-reveal-title">Un seul carreau, répété à l'infini.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

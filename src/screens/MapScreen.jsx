import { useApp } from '../state/AppContext.jsx'
import { Starfield, Etoile } from '../components/Sparkle.jsx'
import { FennecFace } from '../components/Fennec.jsx'
import WorldNode from '../components/WorldNode.jsx'
import { progressionOrder } from './mapOrder.js'
import './MapScreen.css'

// L'accueil · la carte des mondes — le cœur de l'app. Revenir doit faire du bien.
//
// Les orbes-mondes sont une constellation CONTENUE : chaque orbe est ancré par son
// CENTRE à une coordonnée normalisée (0–100 % de la toile), et le trait pointillé
// qui les relie est tracé orbe-à-orbe dans le MÊME repère. Le trait est dessiné en
// « non-scaling-stroke » : les points restent de fins ronds réguliers quelle que
// soit la taille de la toile (jamais de grosses tirets étirés). La disposition est
// choisie par la largeur de la scène (prop `layout`), jamais par l'orientation.
//
// Les positions sont des LISTES ORDONNÉES par ordre de LECTURE : l'index 0 est le
// premier point que l'œil atteint (le plus haut en pile, l'entrée gauche en
// panorama), puis on descend / on file vers la droite. Les mondes y sont posés
// dans l'ordre de PROGRESSION (cf. mapOrder.js) — position 1..5 = progression
// 1..5 — et non par un appariement figé monde→coordonnée (qui supposait « codes »
// en tête). On garde les jeux de coordonnées déjà réglés (ils remplissent le
// panneau) ; seul l'APPARIEMENT monde→position suit désormais la progression, si
// bien que le monde à commencer mène toujours et les « bientôt » ferment la file.

// Pile verticale (téléphone + tablette portrait) — du haut (y≈13) vers le bas (y≈88).
const STACK_POS = [[56, 13], [26, 32], [64, 51], [30, 70], [60, 88]]
// Panorama (paysage / bureau / ultralarge) — de l'entrée gauche (x≈9) vers la
// droite (x≈91), s'étalant sur ~13–87 % en hauteur pour remplir tout le panneau.
const PANO_POS = [[9, 30], [31, 62], [53, 13], [72, 87], [91, 45]]
const LAYOUT = {
  phone:    { pos: STACK_POS, base: 84,  active: 92 },
  portrait: { pos: STACK_POS, base: 104, active: 116 },
  wide:     { pos: PANO_POS,  base: 100, active: 124 },
}

// Trace une courbe douce (Catmull-Rom → Bézier cubiques) qui passe EXACTEMENT par
// chaque centre d'orbe, dans l'ordre donné. Coordonnées dans le repère 0–100.
function smoothPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0]} ${p2[1]}`
  }
  return d
}

function Banner({ tonight, onOpenLoop }) {
  if (!tonight.has) {
    return (
      <div className="map-calm">
        <div className="display map-calm-title">Tout est calme ce soir</div>
        <p className="map-calm-text">
          Tu as exploré tout ce qui est ouvert — bravo. De nouvelles merveilles arrivent bientôt.
          <span className="map-calm-soft"> Reviens quand l'envie te prend.</span>
        </p>
      </div>
    )
  }
  const fresh = tonight.fresh
  return (
    <button type="button" className={`map-banner ${fresh ? 'm-glowpulse' : 'is-resume'}`}
            onClick={() => onOpenLoop(tonight.worldId, tonight.challenge.id)}>
      <Etoile size={22} />
      <span className="map-banner-body">
        <span className="map-banner-title">{fresh ? 'Une nouvelle merveille t\'attend' : 'Reprends ton défi'}</span>
        <span className="map-banner-sub">dans {tonight.world.name} · {tonight.challenge.title.toLowerCase()}</span>
      </span>
      <span className="map-banner-arrow" aria-hidden="true">→</span>
    </button>
  )
}

export default function MapScreen({ layout = 'phone', onOpenWorld, onOpenLoop, onMenu }) {
  const { greetName, fennecStage, worldsView, tonight } = useApp()
  const cfg = LAYOUT[layout] || LAYOUT.phone
  // On pose les mondes sur les positions DANS L'ORDRE DE PROGRESSION : la i-ᵉ
  // position (déjà en ordre de lecture) reçoit le i-ᵉ monde de la file — l'actif
  // d'abord, les « bientôt » en queue. Le monde à commencer occupe donc l'index 0.
  const ordered = progressionOrder(worldsView)
  const posOf = {}
  ordered.forEach((entry, i) => { posOf[entry.world.id] = cfg.pos[i] || [50, 50] })
  // Le trait relie les positions DANS LEUR ORDRE (= l'ordre de lecture) : jamais
  // de lignes croisées, quel que soit le monde posé à chaque position.
  const pathD = smoothPath(cfg.pos.slice(0, ordered.length))

  return (
    <section className="screen map accent-nombres" aria-label="La carte des mondes">
      <Starfield count={22} seed={7} />
      <div className="map-layout">
        <div className="map-rail">
          <header className="map-header">
            <div className="map-avatar"><FennecFace size={38} stage={fennecStage} /></div>
            <div className="map-hello">
              <div className="map-hello-k">Bonsoir,</div>
              <div className="display map-hello-name">{greetName} veille sur toi</div>
            </div>
            <button type="button" className="iconbtn" aria-label="Profil & réglages" onClick={onMenu}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
          </header>
          <Banner tonight={tonight} onOpenLoop={onOpenLoop} />
        </div>

        <div className="map-canvas">
          <svg className="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={pathD} fill="none" stroke="var(--or)" strokeWidth="2"
                  strokeDasharray="2 9" strokeLinecap="round"
                  vectorEffect="non-scaling-stroke" />
          </svg>
          {worldsView.map((entry) => {
            const [x, y] = posOf[entry.world.id] || [50, 50]
            const isCurrent = tonight.has && tonight.worldId === entry.world.id
            return (
              <WorldNode
                key={entry.world.id}
                entry={entry}
                x={x} y={y}
                diameter={isCurrent ? cfg.active : cfg.base}
                isCurrent={isCurrent}
                labelAbove={layout === 'wide' && y >= 80}
                onOpen={onOpenWorld}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

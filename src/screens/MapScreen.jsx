import { useApp } from '../state/AppContext.jsx'
import { Starfield, Etoile } from '../components/Sparkle.jsx'
import { FennecFace } from '../components/Fennec.jsx'
import WorldNode from '../components/WorldNode.jsx'
import './MapScreen.css'

// L'accueil · la carte des mondes — le cœur de l'app. Revenir doit faire du bien.
const POSITIONS = {
  nombres: { left: '44%', top: '3%', size: 96 },
  codes:   { left: '10%', top: '23%', size: 84 },
  motifs:  { left: '58%', top: '40%', size: 84 },
  hasard:  { left: '16%', top: '57%', size: 84 },
  formes:  { left: '56%', top: '74%', size: 84 },
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

export default function MapScreen({ onOpenWorld, onOpenLoop, onMenu }) {
  const { greetName, fennecStage, worldsView, tonight } = useApp()

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
          <svg className="map-path" viewBox="0 0 360 600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M120 60 C 200 110, 210 150, 250 210 C 290 270, 120 270, 96 340 C 72 400, 240 410, 250 470 C 258 520, 150 520, 130 580"
                  fill="none" stroke="var(--or)" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" opacity=".42" />
          </svg>
          {worldsView.map((entry) => (
            <WorldNode
              key={entry.world.id}
              entry={entry}
              position={POSITIONS[entry.world.id]}
              isCurrent={tonight.has && tonight.worldId === entry.world.id}
              onOpen={onOpenWorld}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

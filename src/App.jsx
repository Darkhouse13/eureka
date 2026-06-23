import { useEffect, useRef, useState } from 'react'
import { AppProvider, useApp } from './state/AppContext.jsx'
import { getWorld } from './worlds/index.js'

import Loading from './screens/Loading.jsx'
import Welcome from './screens/Welcome.jsx'
import MapScreen from './screens/MapScreen.jsx'
import WorldScreen from './screens/WorldScreen.jsx'
import LoopScreen from './screens/LoopScreen.jsx'
import Collection from './screens/Collection.jsx'
import Profil from './screens/Profil.jsx'
import BottomNav from './components/BottomNav.jsx'
import './styles/toast.css'

// — petit toast local (un retour discret, jamais bloquant) —
function Toast({ message }) {
  if (!message) return null
  return <div className="toast" role="status" aria-live="polite">{message}</div>
}

// La disposition est choisie par la LARGEUR DE LA SCÈNE (la coquille .app), pas par
// l'orientation ni un caprice de fenêtre : < 640 téléphone · 640–1023 tablette
// portrait · ≥ 1024 paysage/bureau/ultralarge (carte panoramique bornée).
const layoutFor = (w) => (w >= 1024 ? 'wide' : w >= 640 ? 'portrait' : 'phone')
const initialWidth = () => (typeof window === 'undefined' ? 390 : Math.min(window.innerWidth, 1200))

function useStageLayout(ref) {
  const [layout, setLayout] = useState(() => layoutFor(initialWidth()))
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      // Mesurer la boîte de BORDURE (largeur posée par la mise en page, indépendante
      // de la bordure/padding) : sinon la bordure d'1px du mode « wide » ferait
      // osciller la disposition autour de 1024 px (wide ⇄ portrait à l'infini).
      const e = entries[0]
      const w = e?.borderBoxSize?.[0]?.inlineSize ?? e?.contentRect?.width
      if (w) setLayout(layoutFor(w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return layout
}

function Shell() {
  const { guideName } = useApp()
  const appRef = useRef(null)
  const layout = useStageLayout(appRef)
  const [phase, setPhase] = useState('loading')      // 'loading' | 'welcome' | 'app'
  const [tab, setTab] = useState('map')               // 'map' | 'collection' | 'profil'
  const [overlay, setOverlay] = useState(null)        // null | { type:'world'|'loop', worldId, challengeId }
  const [toast, setToast] = useState('')

  const flash = (m) => {
    setToast(m)
    window.clearTimeout(flash._t)
    flash._t = window.setTimeout(() => setToast(''), 2400)
  }
  useEffect(() => () => window.clearTimeout(flash._t), [])

  const afterLoading = () => setPhase(guideName ? 'app' : 'welcome')

  const openWorld = (world) => {
    if (world.status === 'bientot') { flash(`${world.name} s'éveille bientôt ✦`); return }
    setOverlay({ type: 'world', worldId: world.id })
  }
  const openLoop = (worldId, challengeId) => setOverlay({ type: 'loop', worldId, challengeId })
  const goTab = (t) => { setOverlay(null); setTab(t) }

  // — rendu —
  let content
  if (phase === 'loading') content = <Loading onDone={afterLoading} />
  else if (phase === 'welcome') content = <Welcome onDone={() => { setTab('map'); setPhase('app') }} />
  else if (overlay?.type === 'world') {
    const world = getWorld(overlay.worldId)
    content = <WorldScreen world={world} onBack={() => setOverlay(null)} onOpenLoop={openLoop} />
  } else if (overlay?.type === 'loop') {
    const world = getWorld(overlay.worldId)
    const challenge = world.challenges.find((c) => c.id === overlay.challengeId)
    content = (
      <LoopScreen
        world={world} challenge={challenge}
        onExit={() => setOverlay({ type: 'world', worldId: world.id })}
        onFinish={() => { setOverlay({ type: 'world', worldId: world.id }); flash('Une merveille rejoint ta collection ✦') }}
      />
    )
  } else if (tab === 'collection') content = <Collection onGoMap={() => goTab('map')} />
  else if (tab === 'profil') content = <Profil onRename={() => { setOverlay(null); setPhase('welcome') }} />
  else content = <MapScreen layout={layout} onOpenWorld={openWorld} onOpenLoop={openLoop} onMenu={() => goTab('profil')} />

  const showNav = phase === 'app' && !overlay

  return (
    <div className="app" id="app" ref={appRef} data-layout={layout}>
      {content}
      {showNav && <BottomNav active={tab} onNavigate={goTab} />}
      <Toast message={toast} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}

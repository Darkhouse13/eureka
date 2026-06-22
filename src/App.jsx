import { useEffect, useState } from 'react'
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

function Shell() {
  const { guideName } = useApp()
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
  else content = <MapScreen onOpenWorld={openWorld} onOpenLoop={openLoop} onMenu={() => goTab('profil')} />

  const showNav = phase === 'app' && !overlay

  return (
    <div className="app" id="app">
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

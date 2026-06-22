import { useState } from 'react'

import { AppProvider, useApp } from './state/AppContext.jsx'
import { ConfettiProvider, ConfettiLayer } from './components/Confetti.jsx'
import { ToastProvider, ToastLayer } from './components/Toast.jsx'

import Welcome from './components/Welcome.jsx'
import WorldMap from './components/WorldMap.jsx'
import Collection from './components/Collection.jsx'
import Profil from './components/Profil.jsx'
import WorldLoop from './components/WorldLoop.jsx'
import BottomNav from './components/BottomNav.jsx'

import { getWorld } from './worlds/index.js'

const NAV_SCREENS = ['home', 'collection', 'profil']

function Shell() {
  const { foxName, setLastOpened } = useApp()
  // First run (no name yet) starts on Welcome; otherwise the home map.
  const [view, setView] = useState(() => ({ name: foxName ? 'home' : 'welcome' }))

  const showNav = NAV_SCREENS.includes(view.name)

  const openWorld = (id) => {
    setLastOpened(id)
    setView({ name: 'loop', worldId: id })
  }

  return (
    <div className="stage">
      <div className="app" id="app">
        <ConfettiLayer />

        {view.name === 'welcome' && <Welcome onDone={() => setView({ name: 'home' })} />}
        {view.name === 'home' && <WorldMap onOpenWorld={openWorld} />}
        {view.name === 'collection' && <Collection />}
        {view.name === 'profil' && <Profil onRename={() => setView({ name: 'welcome' })} />}
        {view.name === 'loop' && (
          <WorldLoop world={getWorld(view.worldId)} onExit={() => setView({ name: 'home' })} />
        )}

        {showNav && <BottomNav active={view.name} onNavigate={(name) => setView({ name })} />}

        <ToastLayer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ConfettiProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </ConfettiProvider>
    </AppProvider>
  )
}

// Home — the "carte des mondes". Lists every registered world with its status:
// playable (pulse + "Commence ici"), done (✓ Terminé), or soon (locked, friendly
// toast on tap). Tapping a playable/done world opens its loop.
import { useApp } from '../state/AppContext.jsx'
import { useToast } from './Toast.jsx'
import { WORLDS } from '../worlds/index.js'
import { colorOf } from '../theme.js'
import { Star, Check, Play, LockSmall } from '../icons.jsx'
import Fox from './Fox.jsx'
import './WorldMap.css'

// Derive a world's display status from the saved progress.
function statusOf(world, completed) {
  if (world.status === 'soon') return 'soon'
  return completed.includes(world.id) ? 'done' : 'play'
}

export default function WorldMap({ onOpenWorld }) {
  const { cards, completed } = useApp()
  const { show } = useToast()

  const bubble = completed.length > 0
    ? 'Superbe ! Tu as trouvé ta première merveille. La suite arrive très bientôt.'
    : 'Salut ! On commence par les codes secrets ?'

  const onTile = (world, status) => {
    if (status === 'soon') {
      show('Ce monde arrive très bientôt !')
      return
    }
    onOpenWorld(world.id)
  }

  return (
    <section className="screen with-nav">
      <header className="topbar">
        <span className="brand">Eurêka</span>
        <span className="merv"><Star /><span>{cards.length}</span></span>
      </header>

      <div className="bubble-row">
        <Fox size="md" bob />
        <div className="bubble">{bubble}</div>
      </div>

      <div className="journey">
        {WORLDS.map((world) => {
          const col = colorOf(world.color)
          const status = statusOf(world, completed)
          const Icon = world.icon
          return (
            <button
              key={world.id}
              className={`tile${status === 'soon' ? ' soon' : ''}`}
              onClick={() => onTile(world, status)}
            >
              <span className="tile-ic-wrap">
                {status === 'play' && <span className="pulse-ring" style={{ borderColor: col.m }} />}
                <span className="tile-ic" style={{ background: col.l, color: col.d, borderColor: col.m }}>
                  <Icon />
                </span>
              </span>
              <span className="tile-text">
                <span className="tile-name">{world.name}</span>
                {status === 'done' && <span className="tile-status done"><Check /> Terminé</span>}
                {status === 'play' && <span className="tile-status play">Commence ici</span>}
                {status === 'soon' && <span className="tile-status soon">Bientôt</span>}
              </span>
              <span className="tile-arrow">
                {status === 'done' ? null : status === 'play' ? <Play /> : <LockSmall />}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

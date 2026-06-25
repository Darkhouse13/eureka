import { useApp } from '../state/AppContext.jsx'
import { WORLD_ICONS } from '../components/WorldIcons.jsx'
import { Etoile } from '../components/Sparkle.jsx'
import { displayNumberOf } from './mapOrder.js'
import './WorldScreen.css'

// Le voyage d'un monde · l'échelle des défis. Une montée, pas une leçon.
// fait / en cours / à venir · au bout, le trésor.
function CheckNode() {
  return (
    <span className="rung-node rung-done" aria-hidden="true">
      <svg width="13" viewBox="0 0 24 24" fill="none" stroke="var(--on-or)" strokeWidth="3.4"><path d="M5 12l5 5L20 6" /></svg>
    </span>
  )
}
function CurrentNode() {
  return <span className="rung-node rung-current m-glowpulse" aria-hidden="true"><Etoile size={14} color="var(--on-or)" spark={false} /></span>
}
function LockNode() {
  return (
    <span className="rung-node rung-lock" aria-hidden="true">
      <svg width="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400)" strokeWidth="2.4"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
    </span>
  )
}
function TreasureNode({ unlocked }) {
  return (
    <span className={`rung-node ${unlocked ? 'rung-current m-glowpulse' : 'rung-lock'}`} aria-hidden="true">
      <svg width="13" viewBox="0 0 24 24" fill="none" stroke={unlocked ? 'var(--on-or)' : 'var(--ink-400)'} strokeWidth="2"><path d="M12 2l2.5 6H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z" /></svg>
    </span>
  )
}

function MiniCardSpine() {
  return (
    <span className="rung-spine" aria-hidden="true"><Etoile size={14} color="var(--accent)" spark={false} /></span>
  )
}

export default function WorldScreen({ world, onBack, onOpenLoop }) {
  const { worldsView } = useApp()
  const entry = worldsView.find((e) => e.world.id === world.id)
  const Icon = WORLD_ICONS[world.id]
  const pct = entry.rungsTotal ? (entry.rungsDone / entry.rungsTotal) * 100 : 0
  const realCount = (world.challenges || []).filter((c) => c.kind !== 'treasure').length
  // Numéro affiché = rang dans l'ordre de progression (la même source que la carte),
  // jamais le champ figé du registre — voir displayNumberOf.
  const numero = displayNumberOf(worldsView, world.id)

  return (
    <section className={`screen no-nav world-screen accent-${world.id}`} aria-label={world.name}>
      <div className="ws-topbar">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Retour à la carte">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="eyebrow">Monde {numero} · {realCount} défis</span>
      </div>

      <div className="ws-inner">
        <div className="ws-banner">
          <span className="ws-banner-icon" aria-hidden="true"><Icon size={56} stroke="var(--accent)" /></span>
          <div className="display ws-title">{world.name}</div>
          <div className="ws-tagline">{world.tagline}</div>
          <div className="ws-progress">
            <div className="bar"><i style={{ width: pct + '%' }} /></div>
            <span className="ws-progress-n">{entry.rungsDone} / {entry.rungsTotal}</span>
          </div>
        </div>

        <ol className="ladder">
          {world.challenges.map((ch, i) => {
            const isDone = !!entry.done[ch.id]
            const unlocked = entry.isUnlocked(ch, i)
            const isCurrent = !isDone && unlocked
            const treasure = ch.kind === 'treasure'

            if (treasure) {
              return (
                <li key={ch.id} className={`rung rung-treasure ${unlocked && !isDone ? 'is-current' : isDone ? 'is-done' : 'is-locked'}`}>
                  <TreasureNode unlocked={unlocked && !isDone} />
                  {unlocked && !isDone ? (
                    <button type="button" className="rung-card rung-claim" onClick={() => onOpenLoop(world.id, ch.id)}>
                      <div className="rung-eyebrow">Trésor du monde</div>
                      <div className="rung-name">{ch.title}</div>
                      <span className="btn-or rung-cta">Réclamer le trésor ✦</span>
                    </button>
                  ) : (
                    <div className="rung-card rung-faint">
                      <div className="rung-eyebrow">Trésor du monde</div>
                      <div className="rung-name dim">{ch.title}</div>
                    </div>
                  )}
                </li>
              )
            }

            if (isDone) {
              return (
                <li key={ch.id} className="rung is-done">
                  <CheckNode />
                  <button type="button" className="rung-card rung-donerow" onClick={() => onOpenLoop(world.id, ch.id)}>
                    <div>
                      <div className="rung-eyebrow">Défi {ch.index} · fait</div>
                      <div className="rung-name">{ch.title}</div>
                    </div>
                    <MiniCardSpine />
                  </button>
                </li>
              )
            }

            if (isCurrent) {
              return (
                <li key={ch.id} className="rung is-current">
                  <CurrentNode />
                  <button type="button" className="rung-card rung-active" onClick={() => onOpenLoop(world.id, ch.id)}>
                    <div className="rung-eyebrow gold">Défi {ch.index} · à toi de jouer</div>
                    <div className="rung-name big">{ch.title}</div>
                    <div className="rung-teaser">{ch.etincelle?.text}</div>
                    <span className="btn-or rung-cta">Commencer le défi →</span>
                  </button>
                </li>
              )
            }

            return (
              <li key={ch.id} className="rung is-locked">
                <LockNode />
                <div className="rung-card rung-faint">
                  <div className="rung-eyebrow">Défi {ch.index} · à venir</div>
                  <div className="rung-name dim">{ch.title}</div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

import { WORLD_ICONS } from './WorldIcons.jsx'

// Un nœud-monde sur la carte : une planète tracée comme une constellation.
// Le nœud est ancré par le CENTRE de son orbe à (x %, y %) de la toile, pour que
// le trait pointillé passe exactement par les centres. Le libellé descend sous
// l'orbe, la pastille NOUVEAU monte au-dessus. Le monde « en cours » respire et
// porte un halo ; les mondes « bientôt » sont verrouillés, en retrait.

const SPHERE = {
  codes:   'radial-gradient(circle at 34% 28%, #aadcf6, #6FB7E0 55%, #3b7fa8)',
  nombres: 'radial-gradient(circle at 34% 28%, #ffd89a, #E8A14C 55%, #b06f24)',
  motifs:  'radial-gradient(circle at 34% 28%, #b6ecd4, #7FC9A8 55%, #4d9277)',
  hasard:  'radial-gradient(circle at 34% 28%, #f6b3c1, #E8718A 55%, #b04a60)',
  formes:  'radial-gradient(circle at 34% 28%, #c9b6ec, #A98BD9 55%, #6d558f)',
}
const GLOW = {
  codes: 'rgba(111,183,224,.55)', nombres: 'rgba(232,161,76,.7)', motifs: 'rgba(127,201,168,.5)',
  hasard: 'rgba(232,113,138,.5)', formes: 'rgba(169,139,217,.5)',
}

function statusLabel({ status, rungsDone, rungsTotal }) {
  if (status === 'bientot') return 'bientôt'
  if (status === 'complete') return `${rungsTotal} / ${rungsTotal} ✦`
  if (status === 'in-progress') return `reprendre · ${rungsDone}/${rungsTotal}`
  return 'commencer'
}

export default function WorldNode({ entry, x, y, diameter = 88, isCurrent, labelAbove = false, onOpen }) {
  const { world, status, isNew } = entry
  const Icon = WORLD_ICONS[world.id]
  const locked = status === 'bientot'
  const breathe = isCurrent && !locked

  return (
    <div
      className="wnode"
      data-world={world.id}
      style={{ left: `${x}%`, top: `${y}%`, '--d': `${diameter}px` }}
    >
      {isNew && !locked && <span className="wnode-new">NOUVEAU</span>}
      <span className="wnode-orb-wrap">
        <button
          type="button"
          className={`wnode-orb ${locked ? 'is-locked' : ''} ${breathe ? 'm-breathe' : ''}`}
          style={{
            background: SPHERE[world.id],
            boxShadow: locked
              ? 'inset 0 -6px 14px rgba(0,0,0,.3)'
              : `0 0 ${Math.round(diameter * 0.4)}px ${GLOW[world.id]}, inset 0 -6px 14px rgba(0,0,0,.25)`,
          }}
          onClick={() => onOpen(world)}
          aria-label={`${world.name} — ${statusLabel(entry)}`}
        >
          <Icon size={Math.round(diameter * 0.42)} />
          {breathe && <span className="wnode-halo" aria-hidden="true" />}
          {locked && (
            <span className="wnode-lockveil" aria-hidden="true">
              <svg width="20" viewBox="0 0 24 24" fill="none" stroke="#cfd4ee" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" />
              </svg>
            </span>
          )}
        </button>
      </span>
      <span className={`wnode-label ${labelAbove ? 'is-above' : ''}`}>
        <span className="wnode-name">{world.shortName[0]}<br />{world.shortName[1]}</span>
        <span className="wnode-status" style={{ color: locked ? 'var(--ink-400)' : `var(--w-${world.id})` }}>
          {statusLabel(entry)}
        </span>
      </span>
    </div>
  )
}

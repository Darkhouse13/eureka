import { useMemo, useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { WonderCard, CardTile, LockedTile } from '../components/WonderCard.jsx'
import { Fennec, FennecFace } from '../components/Fennec.jsx'
import { Etoile } from '../components/Sparkle.jsx'
import { WORLDS } from '../worlds/index.js'
import { getCard, allCards } from '../cards/registry.jsx'
import { sound } from '../audio/sound.js'
import './Collection.css'

const RARITY_ORDER = ['legendaire', 'rare', 'commune']
const RARITY_TITLE = { commune: 'Communes', rare: 'Rares', legendaire: 'Légendaires' }
const WORLD_NAME = Object.fromEntries(WORLDS.map((w) => [w.id, w.name]))

export default function Collection({ onGoMap }) {
  const { collection, hasCard } = useApp()
  const [filter, setFilter] = useState('monde')
  const [open, setOpen] = useState(null) // carte affichée en grand

  const empty = collection.earnedCount === 0
  const pct = collection.total ? (collection.earnedCount / collection.total) * 100 : 0
  const featured = collection.latestId ? getCard(collection.latestId) : null

  const groups = useMemo(() => {
    if (filter === 'rarete') {
      return RARITY_ORDER.map((r) => ({
        key: r, title: RARITY_TITLE[r],
        cards: allCards().filter((c) => c.rarity === r && WORLD_NAME[c.worldId]),
      })).filter((g) => g.cards.length)
    }
    // par monde (et « tous » = ordre des mondes)
    return Object.entries(collection.byWorld).map(([wid, cards]) => ({
      key: wid, title: WORLD_NAME[wid], cards,
    }))
  }, [filter, collection.byWorld])

  if (empty) {
    return (
      <section className="screen collection accent-nombres collection-empty" aria-label="Ma collection">
        <div className="empty-wrap">
          <Fennec size={120} expression="curieux" sparkle />
          <div className="display empty-title">Ton ciel est encore vierge.</div>
          <p className="empty-text">Chaque énigme résolue y accroche une étoile. La première étincelle t'attend, juste là.</p>
          <button type="button" className="btn-or" style={{ maxWidth: 320 }} onClick={onGoMap}>Trouver ma première merveille →</button>
        </div>
      </section>
    )
  }

  return (
    <section className="screen collection accent-nombres" aria-label="Ma collection">
      <div className="screen-inner">
        <h1 className="display coll-title">Mes merveilles</h1>
        <div className="coll-progress">
          <div className="bar"><i style={{ width: pct + '%' }} /></div>
          <span className="coll-progress-n">{collection.earnedCount} / {collection.total}</span>
        </div>

        {featured && (
          <button type="button" className="coll-featured" onClick={() => { sound.tap(); setOpen(featured) }}>
            <span className="coll-featured-tag">NOUVELLE ✦</span>
            <span className={`coll-featured-spine accent-${featured.worldId} ${featured.rarity !== 'commune' ? 'shiny' : ''}`}>
              {featured.rarity !== 'commune' && <span className="wc-sweep" aria-hidden="true" />}
              <Etoile size={26} color={featured.rarity === 'legendaire' ? 'var(--legendaire)' : 'var(--or)'} spark={false} />
            </span>
            <span className="coll-featured-body">
              <span className="coll-featured-k">Ta dernière trouvaille</span>
              <span className="coll-featured-name">{featured.name}</span>
              <span className="coll-featured-sub">{featured.subtitle} · {featured.rarity}</span>
            </span>
          </button>
        )}

        <div className="coll-filters" role="group" aria-label="Filtrer les cartes">
          {[['monde', 'par monde'], ['rarete', 'par rareté']].map(([id, label]) => (
            <button key={id} type="button" className={`chip ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>

        {groups.map((g) => {
          const earnedInGroup = g.cards.filter((c) => hasCard(c.id)).length
          return (
            <div className="coll-group" key={g.key}>
              <div className="eyebrow coll-group-head">{g.title} · {earnedInGroup} / {g.cards.length}</div>
              <div className="coll-grid">
                {g.cards.map((c) => hasCard(c.id)
                  ? <CardTile key={c.id} card={c} onClick={() => { sound.tap(); setOpen(c) }} />
                  : <LockedTile key={c.id} label={c.subtitle} />)}
              </div>
            </div>
          )
        })}
      </div>

      {open && (
        <div className="coll-modal" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={`Carte ${open.name}`}>
          <div className="coll-modal-inner" onClick={(e) => e.stopPropagation()}>
            <WonderCard card={open} big />
            <div className="coll-modal-hint">touche la carte pour la retourner</div>
            <button type="button" className="btn-soft accent-nombres" style={{ maxWidth: 200, margin: '4px auto 0' }} onClick={() => setOpen(null)}>Fermer</button>
          </div>
        </div>
      )}
    </section>
  )
}

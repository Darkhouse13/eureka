import { useState } from 'react'
import { Etoile } from './Sparkle.jsx'
import './WonderCard.css'

const RARITY_LABEL = { commune: 'Commune', rare: 'Rare', legendaire: 'Légendaire' }
const RARITY_PIPS = { commune: 1, rare: 2, legendaire: 3 }
const WORLD_NAME = {
  codes: 'Codes secrets', nombres: 'Nombres sans fin', motifs: 'Le monde des motifs',
  hasard: 'Le grand hasard', formes: 'Formes impossibles',
}
const RARITY_COLOR = { commune: 'var(--accent)', rare: 'var(--rare)', legendaire: 'var(--legendaire)' }

function Pips({ rarity }) {
  const n = RARITY_PIPS[rarity] || 1
  const c = RARITY_COLOR[rarity]
  return (
    <span className="wc-pips">
      {Array.from({ length: n }).map((_, i) => <Etoile key={i} size={12} color={c} spark={false} />)}
    </span>
  )
}

// La carte-merveille, retournable (recto ↔ « fait-merveille »).
export function WonderCard({ card, flippable = true, big = false }) {
  const [flipped, setFlipped] = useState(false)
  if (!card) return null
  const Art = card.Art
  const rare = card.rarity === 'rare'
  const legend = card.rarity === 'legendaire'

  return (
    <button
      type="button"
      className={`wc accent-${card.worldId} ${rare ? 'wc-rare' : ''} ${legend ? 'wc-legend' : ''} ${big ? 'wc-big' : ''} ${flipped ? 'is-flipped' : ''}`}
      onClick={() => flippable && setFlipped((f) => !f)}
      aria-label={`Carte ${card.name}. ${card.subtitle}. ${RARITY_LABEL[card.rarity]}.${flippable ? ' Touche pour la retourner.' : ''}`}
      aria-pressed={flipped}
    >
      <span className="wc-inner">
        {/* recto */}
        <span className="wc-face wc-front">
          {legend && <span className="wc-holo" aria-hidden="true" />}
          {(rare || legend) && <span className="wc-sweep" aria-hidden="true" />}
          <span className="wc-top">
            <Pips rarity={card.rarity} />
            <span className="wc-rarity" style={{ color: RARITY_COLOR[card.rarity] }}>{RARITY_LABEL[card.rarity]}</span>
          </span>
          <span className="wc-art"><Art /></span>
          <span className="wc-id">
            <span className="wc-name">{card.name}</span>
            <span className="wc-sub">{card.subtitle}</span>
            <span className="wc-foot">
              <span className="wc-world">{WORLD_NAME[card.worldId]}</span>
              <span className="wc-num">#{card.num}</span>
            </span>
          </span>
        </span>
        {/* verso — le fait-merveille */}
        <span className="wc-face wc-back">
          <span className="wc-back-lead hand">la merveille au dos</span>
          <span className="wc-back-title">{card.back.title}</span>
          <p className="wc-back-text">{card.back.text}</p>
          <span className="wc-foot">
            <span className="wc-world">{WORLD_NAME[card.worldId]}</span>
            <span className="wc-num">{RARITY_LABEL[card.rarity].toLowerCase()} · #{card.num}</span>
          </span>
        </span>
      </span>
    </button>
  )
}

// Vignette compacte pour la grille de collection.
export function CardTile({ card, onClick }) {
  const Art = card.Art
  const rare = card.rarity === 'rare'
  const legend = card.rarity === 'legendaire'
  return (
    <button type="button" className={`ctile accent-${card.worldId} ${rare ? 'ctile-rare' : ''} ${legend ? 'ctile-legend' : ''}`}
            onClick={onClick} aria-label={`${card.name} — ${RARITY_LABEL[card.rarity]}`}>
      {legend && <span className="wc-holo" aria-hidden="true" />}
      {(rare || legend) && <span className="wc-sweep" aria-hidden="true" />}
      <span className="ctile-art"><Art /></span>
      <span className="ctile-name">{card.name}</span>
    </button>
  )
}

// Silhouette en pointillé — une merveille qu'il reste à trouver (mystère, sans pression).
export function LockedTile({ label }) {
  return (
    <span className="ctile ctile-locked" aria-label={label ? `Carte à découvrir : ${label}` : 'Carte à découvrir'}>
      <svg width="18" viewBox="0 0 24 24" fill="none" stroke="#5a6390" strokeWidth="2" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
    </span>
  )
}

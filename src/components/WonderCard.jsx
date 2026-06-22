// A collectible "merveille" card. Two variants:
//   <WonderCard />  — the big reveal in la découverte (pop animation, long fact)
//   <MiniCard />    — the compact row in the Collection (short fact)
// The header tints from the card's `color`.
import { colorOf } from '../theme.js'
import './WonderCard.css'

export function WonderCard({ card, pop = false }) {
  const col = colorOf(card.color)
  return (
    <div className={`merveille-card${pop ? ' pop' : ''}`}>
      <div className="mc-top" style={{ background: col.m }}>
        <span className="mc-rarity">{card.rarity}</span>
        <span className="mc-sym">{card.sym}</span>
      </div>
      <div className="mc-body">
        <h3 className="mc-title">{card.title}</h3>
        <p className="mc-fact">{card.factLong || card.fact}</p>
      </div>
    </div>
  )
}

export function MiniCard({ card }) {
  const col = colorOf(card.color)
  return (
    <div className="mini-card">
      <div className="mini-top" style={{ background: col.m }}>
        <span className="mini-rar">{card.rarity}</span>
        <span className="mini-sym">{card.sym}</span>
      </div>
      <div className="mini-body">
        <div className="mini-title">{card.title}</div>
        <div className="mini-fact">{card.fact}</div>
      </div>
    </div>
  )
}

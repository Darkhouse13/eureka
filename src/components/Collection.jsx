// "Mes merveilles" — the earned wonder cards. Empty state encourages play.
import { useApp } from '../state/AppContext.jsx'
import { getCard } from '../cards/index.js'
import { MiniCard } from './WonderCard.jsx'
import { Star } from '../icons.jsx'
import Fox from './Fox.jsx'
import './Collection.css'

export default function Collection() {
  const { cards } = useApp()
  const earned = cards.map(getCard).filter(Boolean)

  return (
    <section className="screen with-nav">
      <header className="topbar">
        <span className="brand">Mes merveilles</span>
        <span className="merv"><Star /><span>{cards.length}</span></span>
      </header>

      {earned.length === 0 ? (
        <div className="empty">
          <Fox size="empty" bob />
          <p className="empty-title">Pas encore de merveille</p>
          <p className="muted small empty-sub">Joue à un monde pour gagner ta première carte !</p>
        </div>
      ) : (
        <div className="cards-grid">
          {earned.map((card) => (
            <MiniCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </section>
  )
}

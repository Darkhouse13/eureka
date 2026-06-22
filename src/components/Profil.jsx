// Profil — the guide's name and a couple of friendly stats. The name can be
// changed from here (re-opens Welcome).
import { useApp } from '../state/AppContext.jsx'
import Fox from './Fox.jsx'
import './Profil.css'

export default function Profil({ onRename }) {
  const { foxName, cards, completed } = useApp()

  return (
    <section className="screen with-nav">
      <header className="topbar">
        <span className="brand">Profil</span>
      </header>

      <div className="profil-card">
        <Fox size="lg" bob />
        <p>Ton guide : <b>{foxName}</b></p>
        <div className="stat">Merveilles trouvées : <b>{cards.length}</b></div>
        <div className="stat">Mondes terminés : <b>{completed.length}</b></div>
        <p className="muted small">Plus tu explores, plus le monde s'agrandit.</p>
        <button className="link" onClick={onRename}>Changer le nom de mon guide</button>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { sound } from '../../../audio/sound.js'
import './nombres-games.css'

// « L'hôtel toujours complet » — l'hôtel de Hilbert.
// Une infinité de chambres, toutes occupées. Un voyageur arrive : chacun avance
// d'une chambre, la 1re se libère. Un car de l'infini arrive : chacun passe au
// double, toutes les chambres impaires se libèrent d'un coup.
const START = [1, 2, 3, 4, 5, 6].map((n) => ({ key: 'g' + n, label: '' + n, isNew: false }))

export default function HotelHilbert({ onSolve }) {
  const [rooms, setRooms] = useState(START)
  const [served, setServed] = useState(0)
  const [bus, setBus] = useState(false)

  const arrive = () => {
    sound.hop(served)
    setServed((s) => s + 1)
    setRooms((r) => [{ key: 'n' + Date.now(), label: '✦', isNew: true }, ...r].slice(0, 6))
  }
  const busArrive = () => {
    sound.hop(4)
    setBus(true)
    // chacun n → 2n : les chambres impaires accueillent de nouveaux voyageurs
    setRooms((r) => r.map((g, i) => (i % 2 === 1 ? g : { key: 'b' + i, label: '✦', isNew: true })))
  }
  const reset = () => { sound.tap(); setRooms(START); setServed(0); setBus(false) }
  const done = bus

  const fox = bus
    ? 'Une infinité de nouveaux clients — et tout le monde a une chambre. Magique, non ?'
    : served === 0
      ? 'L’hôtel est plein. Et pourtant… fais arriver un voyageur.'
      : served < 3
        ? 'Chacun avance d’une chambre. La chambre 1 se libère à chaque fois.'
        : 'Et s’il en arrivait une infinité d’un coup ? Essaie le car.'

  return (
    <div className="ng">
      <div className="hotel">
        <div className="hotel-roof"><span className="eyebrow">Hôtel ∞ · complet</span><span className="hotel-served">accueillis : <b>{bus ? '∞' : served}</b></span></div>
        <div className="hotel-rooms">
          {rooms.map((g, i) => (
            <div key={g.key} className={`hroom ${g.isNew ? 'is-new' : ''}`}>
              <span className="hroom-no">{i + 1}</span>
              <span className="hroom-guest">{g.label}</span>
            </div>
          ))}
          <div className="hroom hroom-more">…</div>
        </div>
      </div>

      <div className="ng-fox">{fox}</div>

      <div className="ng-controls hotel-controls">
        <button className="btn-soft accent-nombres" onClick={arrive} disabled={done}>Un voyageur arrive</button>
        <button className="btn-or" onClick={busArrive} disabled={done}>Le car de l’infini</button>
        <button className="iconbtn" onClick={reset} aria-label="Recommencer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3M3 4v4h4" /></svg>
        </button>
      </div>

      {done && (
        <div className="ng-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display ng-reveal-title">Dans l’infini, il y a toujours de la place.</div>
          <button className="btn-or" style={{ maxWidth: 300, margin: '12px auto 0' }} onClick={() => { sound.chime(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

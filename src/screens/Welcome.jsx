import { useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { Fennec } from '../components/Fennec.jsx'
import { Starfield } from '../components/Sparkle.jsx'
import { sound } from '../audio/sound.js'
import './Welcome.css'

// Bienvenue · nomme ton guide. Aucun nom prérempli ; si elle valide sans choisir,
// le guide s'appelle « Étoile ». Le nom est le seul élément personnel — stocké en
// local, réutilisé dynamiquement partout où l'on s'adresse au guide.
const SUGGESTIONS = ['Étoile', 'Noor', 'Sirius', 'Lyra']
const DEFAULT_NAME = 'Étoile'

export default function Welcome({ onDone }) {
  const { setGuideName } = useApp()
  const [name, setName] = useState('')

  const pick = (n) => { sound.foxCue(); setName(n) }
  const confirm = () => {
    const final = name.trim() || DEFAULT_NAME
    sound.chime()
    setGuideName(final)
    onDone()
  }
  const greet = name.trim() || DEFAULT_NAME

  return (
    <section className="screen no-nav welcome accent-nombres" aria-label="Nomme ton guide">
      <Starfield count={16} seed={2} />
      <div className="welcome-grid">
        <div className="welcome-fox">
          <div className="welcome-fox-glow" aria-hidden="true" />
          <Fennec size={172} expression="repos" sparkle animated />
        </div>

        <div className="welcome-body">
          <p className="hand welcome-lead">un petit fennec sort de la nuit…</p>
          <h1 className="display welcome-greeting">
            « Bonsoir. Je connais des secrets immenses.{' '}
            <i className="welcome-q">Comment m'appelles-tu&nbsp;?</i> »
          </h1>

          <div className="welcome-form">
            <label htmlFor="guide-name" className="sr-only">Le nom de ton guide</label>
            <input
              id="guide-name" className="field" value={name} placeholder="son nom…"
              maxLength={18} autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirm() }}
            />
            <div className="welcome-chips" role="group" aria-label="Quelques idées de noms">
              {SUGGESTIONS.map((n) => (
                <button key={n} type="button" className={`chip ${name.trim() === n ? 'active' : ''}`} onClick={() => pick(n)}>{n}</button>
              ))}
            </div>
            <button type="button" className="btn-or" onClick={confirm}>
              Enchantée, {greet}&nbsp;→
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { Starfield, Etoile } from '../components/Sparkle.jsx'
import { Fennec } from '../components/Fennec.jsx'
import { WonderCard } from '../components/WonderCard.jsx'
import { WORLD_ICONS } from '../components/WorldIcons.jsx'
import { getCard } from '../cards/registry.jsx'
import { sound } from '../audio/sound.js'
import './LoopScreen.css'

// La boucle d'un niveau · quatre temps :
//   l'étincelle → l'idée → le jeu → la découverte.
// Le moteur attribue les cartes, célèbre, mémorise. Le monde ne fournit que le
// contenu et le jeu. Pour un trésor (sans jeu), on va droit à la découverte.
const BEAT = { ETINCELLE: 0, IDEE: 1, JEU: 2, DECOUVERTE: 3 }

export default function LoopScreen({ world, challenge, onExit, onFinish }) {
  const { awardCards, markChallengeDone, markSeen, setLastOpened } = useApp()
  const treasure = challenge.kind === 'treasure'
  const [beat, setBeat] = useState(treasure ? BEAT.DECOUVERTE : BEAT.ETINCELLE)
  const awarded = useRef(false)
  const Icon = WORLD_ICONS[world.id]
  const Game = challenge.Game

  useEffect(() => {
    markSeen(challenge.id)
    setLastOpened(world.id, challenge.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const complete = () => {
    if (!awarded.current) {
      awarded.current = true
      awardCards(challenge.cards || [])
      markChallengeDone(world.id, challenge.id)
      sound.eureka()
    }
    setBeat(BEAT.DECOUVERTE)
  }

  // trésor : on attribue dès l'ouverture (la découverte est la célébration)
  useEffect(() => {
    if (treasure) complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const back = () => {
    if (beat === BEAT.IDEE) setBeat(BEAT.ETINCELLE)
    else if (beat === BEAT.JEU) setBeat(BEAT.IDEE)
    else onExit()
  }

  const card = getCard((challenge.cards || [])[0])
  const Demo = challenge.idee?.Demo

  const beatClass = ['b-etincelle', 'b-idee', 'b-jeu', 'b-decouverte'][beat]

  return (
    <section className={`screen no-nav loop accent-${world.id} ${beatClass}`} aria-label={`${challenge.title} — ${world.name}`}>
      {(beat === BEAT.ETINCELLE || beat === BEAT.DECOUVERTE) && (
        <Starfield count={beat === BEAT.DECOUVERTE ? 24 : 14} seed={beat === BEAT.DECOUVERTE ? 21 : 3}
                   color={beat === BEAT.DECOUVERTE ? 'var(--or)' : 'var(--creme-clair)'} />
      )}

      <div className="loop-top">
        <button type="button" className="iconbtn" onClick={back} aria-label="Retour">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="loop-chip"><Icon size={18} stroke="var(--accent)" /><span>{world.name}</span></span>
        <span className="loop-chal">{challenge.title}</span>
        {!treasure && (
          <span className="loop-dots" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => <span key={i} className={`loop-dot ${i === beat ? 'on' : ''} ${i < beat ? 'past' : ''}`} />)}
          </span>
        )}
      </div>

      <div className="loop-stage" key={beat}>
        {/* — Temps 1 : l'étincelle — */}
        {beat === BEAT.ETINCELLE && (
          <div className="beat beat-etincelle m-rise">
            <Etoile size={50} glow />
            <div className="hand beat-lead amber">{challenge.etincelle.lead}</div>
            <div className="display beat-spark-text">{challenge.etincelle.text}</div>
            <button type="button" className="btn-or beat-next" onClick={() => { sound.foxCue(); setBeat(BEAT.IDEE) }}>
              Découvrir l'idée →
            </button>
          </div>
        )}

        {/* — Temps 2 : l'idée — */}
        {beat === BEAT.IDEE && (
          <div className="beat beat-idee m-rise">
            <div className="hand beat-lead teal">{challenge.idee.lead}</div>
            <div className="display beat-idee-title">{challenge.idee.title}</div>
            {Demo && <div className="beat-demo"><Demo /></div>}
            {challenge.idee.text && <p className="beat-idee-text">{challenge.idee.text}</p>}
            <button type="button" className="btn-or beat-next" onClick={() => { sound.foxCue(); setBeat(BEAT.JEU) }}>
              À toi de jouer →
            </button>
          </div>
        )}

        {/* — Temps 3 : le jeu — */}
        {beat === BEAT.JEU && Game && (
          <div className="beat beat-jeu m-rise">
            <div className="hand beat-lead amber">à toi de jouer</div>
            <div className="display beat-jeu-title">{challenge.title}</div>
            <Game onSolve={complete} />
          </div>
        )}

        {/* — Temps 4 : la découverte (célébration « Eurêka ! ») — */}
        {beat === BEAT.DECOUVERTE && (
          <div className="beat beat-decouverte m-rise">
            <div className="celebrate-fox"><Fennec size={104} expression="celebrant" sparkle /></div>
            <div className="hand beat-lead violet">{challenge.decouverte.lead}</div>
            <div className="display eureka-word">Eurêka&nbsp;!</div>
            <div className="display beat-disc-title">{challenge.decouverte.title}</div>
            <p className="beat-disc-text">{challenge.decouverte.text}</p>
            {card && <div className="beat-card"><WonderCard card={card} /></div>}
            <button type="button" className="btn-or beat-next" onClick={() => { sound.chime(); onFinish() }}>
              Ajouter à ma collection ✦
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

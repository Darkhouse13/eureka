import { useEffect, useRef, useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { Starfield, Etoile } from '../components/Sparkle.jsx'
import { Fennec } from '../components/Fennec.jsx'
import { WonderCard } from '../components/WonderCard.jsx'
import PredictionFlow from '../components/Prediction.jsx'
import { WORLD_ICONS } from '../components/WorldIcons.jsx'
import { getCard } from '../cards/registry.jsx'
import { fennecStageFor, STAGE_LABEL, GROWTH_LINE } from '../components/fennecStages.js'
import { sound } from '../audio/sound.js'
import './LoopScreen.css'

// La boucle d'un niveau · quatre temps :
//   l'étincelle → l'idée → le jeu → la découverte.
// Le moteur attribue les cartes, célèbre, mémorise. Le monde ne fournit que le
// contenu et le jeu. Pour un trésor (sans jeu), on va droit à la découverte.
// Si la carte gagnée fait FRANCHIR un seuil de croissance du fennec, un cinquième
// temps « ton guide grandit » suit la découverte — additif, jamais bloquant.
const BEAT = { ETINCELLE: 0, IDEE: 1, JEU: 2, DECOUVERTE: 3, GRANDIT: 4 }

export default function LoopScreen({ world, challenge, onExit, onFinish }) {
  const { awardCards, markChallengeDone, markSeen, setLastOpened, cardCount, hasCard, fennecStage } = useApp()
  const treasure = challenge.kind === 'treasure'
  const [beat, setBeat] = useState(treasure ? BEAT.DECOUVERTE : BEAT.ETINCELLE)
  // Stade montré par le renard de la célébration (celui d'AVANT le gain, pour que
  // la croissance se révèle ensuite), et stade ATTEINT si un seuil est franchi.
  const [celebStage, setCelebStage] = useState(fennecStage)
  const [grewTo, setGrewTo] = useState(null)
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
      // Détecte un franchissement de seuil à partir des cartes RÉELLEMENT ajoutées
      // (avant ≠ après). Si plusieurs seuils tombent d'un coup, fennecStageFor(après)
      // donne naturellement le plus haut atteint. Purement transitoire : rien n'est
      // mémorisé, donc le beat ne se rejoue jamais à un simple rechargement.
      const newIds = (challenge.cards || []).filter((id) => !hasCard(id))
      const before = cardCount
      const after = before + newIds.length
      const from = fennecStageFor(before)
      const to = fennecStageFor(after)
      setCelebStage(from)
      if (to !== from) setGrewTo(to)
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

  const beatClass = ['b-etincelle', 'b-idee', 'b-jeu', 'b-decouverte', 'b-grandit'][beat]

  return (
    <section className={`screen no-nav loop accent-${world.id} ${beatClass}`} aria-label={`${challenge.title} — ${world.name}`}>
      {(beat === BEAT.ETINCELLE || beat === BEAT.DECOUVERTE || beat === BEAT.GRANDIT) && (
        <Starfield count={beat === BEAT.ETINCELLE ? 14 : 24} seed={beat === BEAT.GRANDIT ? 27 : beat === BEAT.DECOUVERTE ? 21 : 3}
                   color={beat === BEAT.ETINCELLE ? 'var(--creme-clair)' : 'var(--or)'} />
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

        {/* — Temps 3 : le jeu — un défi peut s'ouvrir sur une PRÉDICTION (« à ton
             avis… ») : dans ce cas, PredictionFlow orchestre prédiction → bac à
             sable → révélation autour du même jeu, sinon le jeu se joue seul. */}
        {beat === BEAT.JEU && Game && (
          challenge.predict ? (
            <PredictionFlow predict={challenge.predict} Game={Game} title={challenge.title} onSolve={complete} fennecStage={fennecStage} />
          ) : (
            <div className="beat beat-jeu m-rise">
              <div className="hand beat-lead amber">à toi de jouer</div>
              <div className="display beat-jeu-title">{challenge.title}</div>
              <Game onSolve={complete} />
            </div>
          )
        )}

        {/* — Temps 4 : la découverte (célébration « Eurêka ! ») — */}
        {beat === BEAT.DECOUVERTE && (
          <div className="beat beat-decouverte m-rise">
            <div className="celebrate-fox"><Fennec size={104} expression="celebrant" sparkle stage={celebStage} /></div>
            <div className="hand beat-lead violet">{challenge.decouverte.lead}</div>
            <div className="display eureka-word">Eurêka&nbsp;!</div>
            <div className="display beat-disc-title">{challenge.decouverte.title}</div>
            <p className="beat-disc-text">{challenge.decouverte.text}</p>
            {card && <div className="beat-card"><WonderCard card={card} /></div>}
            <button type="button" className="btn-or beat-next" onClick={() => { sound.chime(); grewTo ? setBeat(BEAT.GRANDIT) : onFinish() }}>
              Ajouter à ma collection ✦
            </button>
          </div>
        )}

        {/* — Temps 5 (bonus) : ton guide grandit — n'apparaît qu'au franchissement
             d'un seuil ; suit la récompense, ne la remplace jamais. Une tape pour
             continuer. */}
        {beat === BEAT.GRANDIT && grewTo && (
          <div className="beat beat-grandit m-rise">
            <div className="grandit-fox">
              <span className="grandit-shimmer" aria-hidden="true" />
              <Fennec size={120} expression="encourageant" sparkle flourish stage={grewTo} />
            </div>
            <div className="eyebrow grandit-eyebrow">ton guide grandit</div>
            <div className="display grandit-title">niveau {STAGE_LABEL[grewTo]}</div>
            <p className="hand grandit-line">«&nbsp;{GROWTH_LINE[grewTo]}&nbsp;»</p>
            <button type="button" className="btn-or beat-next" onClick={() => { sound.chime(); onFinish() }}>
              Continuer ✦
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

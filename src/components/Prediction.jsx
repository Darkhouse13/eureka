import { useState } from 'react'
import { Fennec } from './Fennec.jsx'
import { sound } from '../audio/sound.js'
import './Prediction.css'

// « À ton avis… » — l'ouverture de prédiction, RÉUTILISABLE sur n'importe quel défi.
//
// Elle se joue comme la PREMIÈRE phase du « jeu » (temps 3), autour du bac à sable
// existant, sans le réécrire. Trois phases internes :
//   1. la prédiction — une question « à ton avis… » + 2 à 4 grands choix tapables.
//      Elle en tape UN : c'est un ENGAGEMENT, pas une porte — n'importe quel choix
//      fait avancer, rien ne la bloque, il n'y a pas de « mauvaise » réponse.
//   2. le jeu (bac à sable) — le Game existant tourne tel quel ; elle manipule et
//      observe (sa logique de résolution est intacte : on intercepte juste onSolve).
//   3. la révélation — au moment naturel de résolution, un mot qui NOMME sa prédiction
//      et réagit avec chaleur (juste OU intuitive-mais-fausse : toujours une jolie
//      surprise, jamais « raté / faux »). Puis onSolve() → la découverte, inchangée.
//
// Aucun score, aucune série, aucune mémoire de « juste/faux » : la révélation est
// purement dans l'instant. Contrat d'un défi : une config `predict` optionnelle —
//   predict: { question, options:[{id,label}], correctId, revealRight, revealWrong }
// D'autres mondes pourront l'adopter en ajoutant simplement cette config à un défi.
export default function PredictionFlow({ predict, Game, title, onSolve, fennecStage = 'ne' }) {
  const [phase, setPhase] = useState('predict') // 'predict' → 'play' → 'reveal'
  const [choice, setChoice] = useState(null)

  const pick = (opt) => {
    sound.foxCue()
    setChoice(opt)
    setPhase('play')
  }

  // — phase 1 : la prédiction —
  if (phase === 'predict') {
    return (
      <div className="beat beat-predict m-rise" key="predict">
        <div className="hand predict-lead">à ton avis…</div>
        <h2 className="display predict-q" id="predict-q">{predict.question}</h2>
        <ul className="predict-opts" role="group" aria-labelledby="predict-q">
          {predict.options.map((opt) => (
            <li key={opt.id}>
              <button type="button" className="predict-opt" onClick={() => pick(opt)}>
                <span className="predict-opt-dot" aria-hidden="true" />
                <span>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="predict-hint">Choisis ce que tu ressens — il n’y a pas de mauvaise réponse.</p>
      </div>
    )
  }

  // — phase 3 : la révélation (nomme son choix, réagit avec chaleur) —
  if (phase === 'reveal') {
    const right = choice?.id === predict.correctId
    return (
      <div className="beat beat-reveal m-rise" key="reveal">
        <div className="predict-reveal-fox">
          <Fennec size={78} expression={right ? 'celebrant' : 'encourageant'} sparkle stage={fennecStage} />
        </div>
        <div className="hand predict-reveal-lead">tu avais prédit…</div>
        <div className="display predict-reveal-choice">«&nbsp;{choice?.label}&nbsp;»</div>
        <p className="predict-reveal-text">{right ? predict.revealRight : predict.revealWrong}</p>
        <button type="button" className="btn-or predict-reveal-next" onClick={() => { sound.chime(); onSolve() }}>
          Voir la merveille ✦
        </button>
      </div>
    )
  }

  // — phase 2 : le bac à sable — en-tête préservé, jeu inchangé ; sa résolution
  //   mène à la révélation (on intercepte onSolve, sans toucher au jeu).
  return (
    <div className="beat beat-jeu m-rise" key="play">
      <div className="hand beat-lead amber">à toi de jouer</div>
      <div className="display beat-jeu-title">{title}</div>
      <Game onSolve={() => setPhase('reveal')} />
    </div>
  )
}

// The 4-step world engine: l'étincelle → l'idée → le jeu → la découverte.
// It owns the loopbar, step progress, transitions, confetti and navigation.
// A world only supplies its content components + its Game.
//
// Mini-game contract: the Game receives onSolve(). When the player finishes it
// calls onSolve(), which awards the world's wonder card(s), marks the world
// complete, and advances the loop to la découverte.
import { useEffect, useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { useConfetti } from './Confetti.jsx'
import { useToast } from './Toast.jsx'
import { colorOf } from '../theme.js'
import LoopBar from './LoopBar.jsx'
import './WorldLoop.css'

const STEP_LABELS = ["L'étincelle", "L'idée", 'Le jeu', 'La découverte']

export default function WorldLoop({ world, onExit }) {
  const { awardCards, completeWorld } = useApp()
  const fire = useConfetti()
  const { show } = useToast()

  const [step, setStep] = useState(0)
  // One session per visit, shared across the steps (e.g. the secret message).
  const [session] = useState(() => (world.createSession ? world.createSession() : null))

  const col = colorOf(world.color)

  // Back: idée → étincelle, jeu → idée, and the ends (étincelle/découverte) exit.
  const back = () => {
    if (step === 1) setStep(0)
    else if (step === 2) setStep(1)
    else onExit()
  }

  const onSolve = () => {
    awardCards(world.cards || [])
    completeWorld(world.id)
    setStep(3)
  }

  const onFinish = () => {
    onExit()
    show('Merveille ajoutée à ta collection !')
  }

  // Celebrate when the découverte appears.
  useEffect(() => {
    if (step !== 3) return
    const t = setTimeout(() => fire(), 160)
    return () => clearTimeout(t)
  }, [step, fire])

  const Etincelle = world.etincelle
  const Idee = world.idee
  const Game = world.Game
  const Decouverte = world.decouverte

  let content = null
  if (step === 0) content = <Etincelle session={session} onNext={() => setStep(1)} />
  else if (step === 1) content = <Idee session={session} onNext={() => setStep(2)} />
  else if (step === 2) content = <Game session={session} onSolve={onSolve} />
  else content = <Decouverte session={session} onFinish={onFinish} />

  // The colour vars are inherited by the loopbar and the loop button accent.
  const themeVars = {
    '--accent': col.m,
    '--loop-m': col.m,
    '--loop-d': col.d,
    '--loop-l': col.l,
  }

  return (
    // `world-<id>` is the scoping hook: each world namespaces its own CSS under
    // this class (e.g. `.world-infinity .numline`) so a world's styles can never
    // leak into the rest of the app. Adding it here (one class, derived from the
    // world id) keeps the worlds themselves free of layout-shifting wrapper divs.
    <div className={`world-loop world-${world.id}`} style={themeVars}>
      <LoopBar title={world.name} stepIndex={step} onBack={back} />
      {/* keyed by step so the entrance animation replays on each step */}
      <section className="screen loop" key={step}>
        <div className="loop-content">
          <span className="eyebrow">{STEP_LABELS[step]}</span>
          {content}
        </div>
      </section>
    </div>
  )
}

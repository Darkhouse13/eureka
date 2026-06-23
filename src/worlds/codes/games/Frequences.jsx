import { useMemo, useState } from 'react'
import { pick } from '../../../lib/random.js'
import { FREQ_MESSAGES } from '../messages.js'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './codes-games.css'

// Rung 3 — « L'analyse des fréquences ».
// VERSION LIVRÉE : la simplification autorisée (cf. consigne). Plutôt qu'un mappeur
// libre (trop fiddly pour ~11 ans), on GUIDE le placement des 3–4 lettres les plus
// fréquentes en touchant les barres les plus hautes : chaque pose révèle ces lettres
// dans le message, puis « le code se fissure » et tout apparaît. Le cœur de l'idée
// est gardé : un code cache QUELLE lettre c'est, pas COMBIEN de fois elle revient.
// Guidé + sans échec : on ne peut poser que la barre proposée → convergence garantie.
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function shuffled() {
  const a = ALPHA.split('')
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Frequences({ onSolve }) {
  const data = useMemo(() => {
    const plain = pick(FREQ_MESSAGES)
    const subs = shuffled()
    const map = {}                       // clair → symbole chiffré
    ALPHA.split('').forEach((p, i) => { map[p] = subs[i] })
    const inv = {}                       // symbole chiffré → clair
    Object.entries(map).forEach(([p, c]) => { inv[c] = p })
    const counts = {}
    for (const ch of plain) if (ch !== ' ') counts[map[ch]] = (counts[map[ch]] || 0) + 1
    // Symboles chiffrés triés par fréquence décroissante (= les lettres claires les
    // plus fréquentes ; en français le E mène toujours — vérifié sur FREQ_MESSAGES).
    const order = Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
      .map((sym) => ({ sym, count: counts[sym], plain: inv[sym] }))
    return { plain, map, order, max: Math.max(...Object.values(counts)) }
  }, [])

  const TOP_N = Math.min(4, data.order.length)
  const [step, setStep] = useState(0)          // combien de lettres déjà posées
  const placed = useMemo(() => new Set(data.order.slice(0, step).map((o) => o.plain)), [data, step])
  const fissured = step >= TOP_N
  const target = fissured ? null : data.order[step]

  const place = (sym) => {
    if (fissured || !target || sym !== target.sym) { if (!fissured) sound.tap(); return }
    sound.chime()
    setStep((s) => s + 1)
  }

  const fox = fissured
    ? 'Le code se fissure : la fréquence des lettres a tout trahi.'
    : step === 0
      ? 'En français, la lettre la plus fréquente est le E. La barre la plus haute, c\'est sûrement lui.'
      : `La plus haute qui reste se cache derrière le ${target.plain}. Pose-le.`

  return (
    <div className="cg">
      <div className="cg-fox">
        <Fennec size={50} expression={fissured ? 'celebrant' : 'curieux'} />
        <span>{fox}</span>
      </div>

      <div className="cg-panel">
        <div className="eyebrow">Message chiffré</div>
        <div className={`cg-msg cg-msg-sub ${fissured ? 'is-solved' : ''}`} aria-live="polite">
          {[...data.plain].map((ch, i) => {
            if (ch === ' ') return <span key={i} className="cg-sp" />
            const revealed = fissured || placed.has(ch)
            return (
              <span key={i} className={`cg-tile ${revealed ? 'is-revealed' : ''}`}>
                {revealed ? ch : data.map[ch]}
              </span>
            )
          })}
        </div>
      </div>

      <div className="eyebrow" style={{ textAlign: 'center' }}>Combien de fois chaque symbole revient</div>
      <div className="cg-bars">
        {data.order.map((o, i) => {
          const done = i < step
          const isTarget = !fissured && i === step
          return (
            <button
              key={o.sym}
              type="button"
              className={`cg-bar ${done ? 'is-done' : ''} ${isTarget ? 'is-target m-glowpulse' : ''}`}
              onClick={() => place(o.sym)}
              disabled={fissured || (!isTarget)}
              aria-label={`Symbole ${o.sym}, ${o.count} fois${done ? `, posé : ${o.plain}` : isTarget ? `, à poser : ${o.plain}` : ''}`}
            >
              <span className="cg-bar-fill" style={{ height: 18 + (o.count / data.max) * 70 + 'px' }} />
              <span className="cg-bar-lbl">{done ? o.plain : o.sym}</span>
            </button>
          )
        })}
      </div>

      {!fissured && target && (
        <button className="btn-or" onClick={() => place(target.sym)}>
          Poser le&nbsp;<b style={{ fontSize: 20 }}>{target.plain}</b>&nbsp;sur la barre la plus haute
        </button>
      )}

      {fissured && (
        <div className="cg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display cg-reveal-title">Même un code à des milliards de clés laisse une trace.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

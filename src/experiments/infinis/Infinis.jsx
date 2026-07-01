import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './infinis.css'

/* ============================================================================
   « Y a-t-il des infinis plus grands que d'autres ? »
   Une explication TACTILE autonome — une seule idée, prouvée à la main.

   Elle ne lit jamais une conclusion qu'elle n'a pas déjà construite elle-même.
   Aucun score, aucun « faux / raté », aucun minuteur, aucune barre de progression.
   Se tromper dans une prédiction est une jolie surprise, jamais un échec.

   Identité visuelle héritée (Encre de Minuit, Or de Bougie, Cormorant pour les
   grandes lignes, Hanken pour l'interface, Caveat pour les apartés). Pas de renard,
   pas de cartes. Tout est préfixé .inf- et isolé du reste de l'app.
   ============================================================================ */

/* — la disposition suit la LARGEUR de la scène (même logique que l'app) — */
const layoutFor = (w) => (w >= 1024 ? 'wide' : w >= 640 ? 'portrait' : 'phone')
function useStageLayout(ref) {
  const [layout, setLayout] = useState('phone')
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setLayout(layoutFor(el.getBoundingClientRect().width))
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      const w = e?.borderBoxSize?.[0]?.inlineSize ?? e?.contentRect?.width
      if (w) setLayout(layoutFor(w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return layout
}

function usePrefersReducedMotion() {
  const read = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
  const [rm, setRm] = useState(read)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setRm(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return rm
}

/* — petits astres dessinés (or), jamais des emojis — */
function Star({ className = '', size = 34 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M12 2.6l2.5 5.9 6.4.5-4.9 4.1 1.5 6.2L12 15.9 6 19.3l1.5-6.2L2.6 9l6.4-.5z"
        fill="currentColor" stroke="rgba(58,38,6,.35)" strokeWidth="0.8" strokeLinejoin="round"
      />
    </svg>
  )
}
function Moon({ className = '', size = 34 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M17.6 3.4a9.4 9.4 0 100 17.2A8 8 0 0117.6 3.4z"
        fill="currentColor" stroke="rgba(58,38,6,.35)" strokeWidth="0.8" strokeLinejoin="round"
      />
    </svg>
  )
}

/* — un champ d'étoiles très discret, pour l'ambiance de minuit (statique si
   mouvement réduit, via la règle globale de motion.css) — */
function AmbientStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: `${(i * 61.8) % 100}%`,
        top: `${(i * 37.5) % 100}%`,
        size: 1.5 + ((i * 7) % 3),
        dur: `${3 + (i % 4)}s`,
        delay: `${(i % 5) * 0.4}s`,
      })),
    [],
  )
  return (
    <div className="starfield inf-stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i} className="star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, '--tw-dur': s.dur, '--tw-delay': s.delay }}
        />
      ))}
    </div>
  )
}

/* — grands choix tapables (prédiction) : un engagement, jamais une porte — */
function Choices({ options, onPick, labelId }) {
  return (
    <ul className="inf-opts" role="group" aria-labelledby={labelId}>
      {options.map((opt) => (
        <li key={opt.id}>
          <button type="button" className="inf-opt" onClick={() => onPick(opt)}>
            <span className="inf-opt-dot" aria-hidden="true" />
            <span>{opt.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ============================================================================
   OUVERTURE
   ============================================================================ */
function Opening({ onNext }) {
  return (
    <div className="inf-beat inf-open m-rise">
      <p className="hand inf-open-hand">une question…</p>
      <h1 className="display inf-open-line">
        Tu crois que l’infini, c’est l’infini ?<br />
        <span className="inf-gold">Attends de voir.</span>
      </h1>
      <button type="button" className="btn-or inf-cta" onClick={onNext}>Commence</button>
    </div>
  )
}

/* ============================================================================
   BEAT 1 — L'OUTIL
   Construire, avec ses mains, la règle : relier deux à deux ; s'il ne reste
   personne, c'est le même nombre. (Doit sembler presque trop simple.)
   ============================================================================ */
const B1_N = 5

function Beat1({ onNext }) {
  // phases internes : 'count' → 'pair' → 'tool'
  const [phase, setPhase] = useState('count')
  const [countAns, setCountAns] = useState(null) // 'oui' | 'non'

  // appariement
  const [pairs, setPairs] = useState([]) // { star, moon }
  const [selStar, setSelStar] = useState(null)
  const [selMoon, setSelMoon] = useState(null)
  const [lines, setLines] = useState([])
  const [dragPt, setDragPt] = useState(null)

  const stageRef = useRef(null)
  const starRefs = useRef([])
  const moonRefs = useRef([])
  const dragRef = useRef(null)
  const suppressClick = useRef(false)

  const starPaired = (i) => pairs.some((p) => p.star === i)
  const moonPaired = (j) => pairs.some((p) => p.moon === j)
  const allPaired = pairs.length === B1_N

  const complete = (s, m) => {
    setPairs((ps) => (ps.some((p) => p.star === s || p.moon === m) ? ps : [...ps, { star: s, moon: m }]))
    setSelStar(null)
    setSelMoon(null)
  }
  const tapStar = (i) => {
    if (suppressClick.current) { suppressClick.current = false; return }
    if (starPaired(i)) return
    if (selMoon != null) complete(i, selMoon)
    else setSelStar((s) => (s === i ? null : i))
  }
  const tapMoon = (j) => {
    if (moonPaired(j)) return
    if (selStar != null) complete(selStar, j)
    else setSelMoon((m) => (m === j ? null : j))
  }

  // — mesurer les liens (repères en px, relatifs à la scène) —
  const measure = () => {
    const stage = stageRef.current
    if (!stage) return
    const sb = stage.getBoundingClientRect()
    const center = (el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left - sb.left + r.width / 2, y: r.top - sb.top + r.height / 2 }
    }
    const ls = pairs
      .filter((p) => starRefs.current[p.star] && moonRefs.current[p.moon])
      .map((p) => {
        const a = center(starRefs.current[p.star])
        const b = center(moonRefs.current[p.moon])
        return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
      })
    setLines(ls)
  }
  useLayoutEffect(() => { measure() }, [pairs, phase])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measure())
    ro.observe(stage)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs])

  // — glisser (avec repli tap-puis-tap) — au niveau de la scène —
  const onPointerDown = (e) => {
    if (phase !== 'pair') return
    const el = e.target.closest?.('[data-star]')
    if (!el) return
    const i = Number(el.dataset.star)
    if (starPaired(i)) return
    dragRef.current = { star: i, x0: e.clientX, y0: e.clientY, active: false }
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    if (!d.active) {
      if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 8) return
      d.active = true
      setSelStar(d.star)
      setSelMoon(null)
    }
    const sb = stageRef.current.getBoundingClientRect()
    setDragPt({ x: e.clientX - sb.left, y: e.clientY - sb.top })
  }
  const onPointerUp = (e) => {
    const d = dragRef.current
    dragRef.current = null
    setDragPt(null)
    if (!d || !d.active) return
    suppressClick.current = true // le clic de fin (même astre) ne doit pas dé-sélectionner
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const moonEl = el?.closest?.('[data-moon]')
    if (moonEl) {
      const j = Number(moonEl.dataset.moon)
      if (!moonPaired(j)) complete(d.star, j)
    }
    // sinon : l'astre reste sélectionné → elle peut taper une lune ensuite
  }

  return (
    <div className="inf-beat inf-b1 m-rise">
      <p className="hand inf-lead">l’outil secret</p>

      {phase === 'count' && (
        <>
          <div className="inf-rows inf-rows-count" aria-hidden="false">
            <div className="inf-row">
              {Array.from({ length: B1_N }, (_, i) => (
                <span className="inf-astre inf-astre-star" key={i}>
                  <Star size={30} /><b className="inf-num">{i + 1}</b>
                </span>
              ))}
            </div>
            <div className="inf-row">
              {Array.from({ length: B1_N }, (_, i) => (
                <span className="inf-astre inf-astre-moon" key={i}>
                  <Moon size={28} /><b className="inf-num">{i + 1}</b>
                </span>
              ))}
            </div>
          </div>
          <h2 className="display inf-q">Y en a-t-il autant ?</h2>
          {countAns == null ? (
            <div className="inf-yn">
              <button type="button" className="inf-opt inf-opt-inline" onClick={() => setCountAns('oui')}>Oui</button>
              <button type="button" className="inf-opt inf-opt-inline" onClick={() => setCountAns('non')}>Non</button>
            </div>
          ) : (
            <div className="inf-after m-rise">
              <p className="inf-warm">
                {countAns === 'oui'
                  ? 'Facile. Tu les as comptées.'
                  : 'Recompte doucement… cinq, et cinq. Tu les as comptées, non ?'}
              </p>
              <p className="inf-pivot">
                Mais… et si tu ne <em>pouvais pas</em> compter ?<br />
                Si c’était trop grand pour compter ?
              </p>
              <button type="button" className="btn-or inf-cta" onClick={() => setPhase('pair')}>
                Alors, essaie autrement →
              </button>
            </div>
          )}
        </>
      )}

      {phase === 'pair' && (
        <>
          <p className="inf-instr">
            Relie chaque étoile à une lune — glisse, ou tape l’une puis l’autre.
          </p>
          <div
            className="inf-pair-stage"
            ref={stageRef}
            data-complete={allPaired ? 'true' : 'false'}
            data-paired={pairs.length}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <svg className="inf-links" aria-hidden="true">
              {lines.map((l, i) => (
                <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="inf-link-line" />
              ))}
              {dragPt && selStar != null && starRefs.current[selStar] && (() => {
                const sb = stageRef.current.getBoundingClientRect()
                const r = starRefs.current[selStar].getBoundingClientRect()
                return (
                  <line
                    x1={r.left - sb.left + r.width / 2} y1={r.top - sb.top + r.height / 2}
                    x2={dragPt.x} y2={dragPt.y} className="inf-link-line inf-link-temp"
                  />
                )
              })()}
            </svg>

            <div className="inf-row inf-row-stars">
              {Array.from({ length: B1_N }, (_, i) => (
                <button
                  key={i} type="button" data-star={i}
                  ref={(el) => (starRefs.current[i] = el)}
                  className={`inf-astre inf-astre-star inf-tap${starPaired(i) ? ' is-paired' : ''}${selStar === i ? ' is-sel' : ''}`}
                  aria-label={`Étoile ${i + 1}${starPaired(i) ? ' (reliée)' : ''}`}
                  aria-pressed={selStar === i}
                  disabled={starPaired(i)}
                  onClick={() => tapStar(i)}
                >
                  <Star size={32} />
                </button>
              ))}
            </div>
            <div className="inf-row inf-row-moons">
              {Array.from({ length: B1_N }, (_, j) => (
                <button
                  key={j} type="button" data-moon={j}
                  ref={(el) => (moonRefs.current[j] = el)}
                  className={`inf-astre inf-astre-moon inf-tap${moonPaired(j) ? ' is-paired' : ''}${selMoon === j ? ' is-sel' : ''}`}
                  aria-label={`Lune ${j + 1}${moonPaired(j) ? ' (reliée)' : ''}`}
                  aria-pressed={selMoon === j}
                  disabled={moonPaired(j)}
                  onClick={() => tapMoon(j)}
                >
                  <Moon size={30} />
                </button>
              ))}
            </div>
          </div>

          {allPaired ? (
            <div className="inf-after m-rise">
              <p className="inf-warm inf-gold-soft">
                Regarde : chaque étoile a sa lune. Personne tout seul.<br />
                Donc c’est pareil — <em>sans compter</em>.
              </p>
              <button type="button" className="btn-or inf-cta" onClick={() => setPhase('tool')}>
                Continuer →
              </button>
            </div>
          ) : (
            <p className="inf-count-note">{pairs.length} / {B1_N} reliées</p>
          )}
        </>
      )}

      {phase === 'tool' && (
        <div className="inf-tool m-rise">
          <Star className="inf-tool-star inf-gold" size={40} />
          <p className="hand inf-lead">ton outil secret</p>
          <h2 className="display inf-tool-line">
            Pour savoir si deux groupes sont pareils,<br />
            relie-les deux par deux.
          </h2>
          <p className="inf-tool-sub">S’il ne reste personne, c’est le même nombre.</p>
          <button type="button" className="btn-or inf-cta" onClick={onNext}>J’ai compris →</button>
        </div>
      )}
    </div>
  )
}

/* ============================================================================
   BEAT 2 — LE CHOC
   Tous les nombres vs seulement les pairs. Elle prédit, puis prouve, par sa
   propre règle, que c'est le MÊME infini. (Fin complète et triomphale à elle
   seule si le Beat 3 disparaissait.)
   ============================================================================ */
const B2_TOTAL = 10   // lignes n → 2n rendues
const B2_MANUAL = 4   // elle en relie 4 à la main, puis « continue tout seul »

const B2_OPTS = [
  { id: 'tous', label: 'Tous les nombres' },
  { id: 'pairs', label: 'Les pairs' },
  { id: 'pareils', label: 'Ils sont pareils' },
]

function Beat2({ onNext }) {
  const rm = usePrefersReducedMotion()
  const [phase, setPhase] = useState('predict') // 'predict' → 'pair' → 'reveal'
  const [choice, setChoice] = useState(null)
  const [paired, setPaired] = useState([]) // indices de lignes reliées (0-based, n = i+1)
  const [sel, setSel] = useState(null)     // ligne dont le nombre est sélectionné
  const [racing, setRacing] = useState(false)
  const [done, setDone] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const isPaired = (i) => paired.includes(i)
  const manualDone = paired.length >= B2_MANUAL

  const pairRow = (i) => setPaired((p) => (p.includes(i) ? p : [...p, i].sort((a, b) => a - b)))

  const tapLeft = (i) => {
    if (isPaired(i) || racing || done) return
    setSel((s) => (s === i ? null : i))
  }
  const tapRight = (i) => {
    if (isPaired(i) || racing || done) return
    if (sel === i) { pairRow(i); setSel(null) }   // le partenaire de la ligne i, c'est la ligne i
    // taper un autre partenaire ne fait rien (jamais un « faux »)
  }

  const continueAlone = () => {
    const rest = []
    for (let i = 0; i < B2_TOTAL; i++) if (!paired.includes(i)) rest.push(i)
    if (rm) { setPaired(Array.from({ length: B2_TOTAL }, (_, i) => i)); setDone(true); setSel(null); return }
    setRacing(true)
    setSel(null)
    rest.forEach((i, k) => {
      const t = setTimeout(() => {
        setPaired((p) => (p.includes(i) ? p : [...p, i].sort((a, b) => a - b)))
        if (k === rest.length - 1) {
          const t2 = setTimeout(() => { setRacing(false); setDone(true) }, 380)
          timers.current.push(t2)
        }
      }, 240 * (k + 1))
      timers.current.push(t)
    })
  }

  // — PRÉDICTION —
  if (phase === 'predict') {
    return (
      <div className="inf-beat inf-b2 m-rise">
        <EndlessColumns />
        <p className="hand inf-lead">à ton avis…</p>
        <h2 className="display inf-q" id="b2q">
          Deux infinis. Tous les nombres d’un côté, seulement les nombres pairs de l’autre.
          Lequel est le plus grand ?
        </h2>
        <Choices options={B2_OPTS} labelId="b2q" onPick={(o) => { setChoice(o); setPhase('pair') }} />
        <p className="inf-hint">Choisis ce que tu ressens — il n’y a pas de mauvaise réponse.</p>
      </div>
    )
  }

  // — RÉVÉLATION (réagit à sa prédiction) —
  if (phase === 'reveal') {
    const react =
      choice?.id === 'tous'
        ? 'Tu avais dit « plus grand ». Presque tout le monde le dit — même les grandes personnes. Mais tu viens de prouver le contraire, toi-même.'
        : choice?.id === 'pairs'
        ? 'Surprise — ni l’un ni l’autre. Tu viens de prouver qu’ils sont pareils.'
        : 'Tu l’avais senti ! Et maintenant tu peux le prouver, pas juste le deviner.'
    return (
      <div className="inf-beat inf-b2-reveal m-rise">
        <p className="hand inf-lead">tu avais prédit…</p>
        <div className="display inf-choice">«&nbsp;{choice?.label}&nbsp;»</div>
        <p className="inf-proof">
          Chaque nombre a trouvé son partenaire pair. Pour toujours. Personne tout seul.
        </p>
        <h2 className="display inf-hammer inf-gold">Par ta propre règle… c’est le même infini.</h2>
        <p className="inf-react">{react}</p>
        <button type="button" className="btn-or inf-cta" onClick={onNext}>Encore plus fort →</button>
      </div>
    )
  }

  // — APPARIEMENT (le bac à sable) —
  return (
    <div className="inf-beat inf-b2 m-rise">
      <div className="inf-b2-head">
        <span>tous les nombres</span>
        <span>seulement les pairs</span>
      </div>
      <div className={`inf-b2-list${racing ? ' is-racing' : ''}${done ? ' is-done' : ''}`}
           data-complete={done ? 'true' : 'false'} data-paired={paired.length}>
        <div className="inf-b2-ell" aria-hidden="true">⋮</div>
        {Array.from({ length: B2_TOTAL }, (_, i) => {
          const n = i + 1
          const p = isPaired(i)
          const auto = racing || done
          return (
            <div className={`inf-b2-row${p ? ' is-paired' : ''}${!p && sel == null && i === paired.length && !auto ? ' is-next' : ''}`} key={i}>
              <button
                type="button"
                className={`inf-chip inf-chip-n${sel === i ? ' is-sel' : ''}`}
                aria-label={`Nombre ${n}${p ? ' (relié)' : ''}`}
                aria-pressed={sel === i}
                disabled={p || auto}
                onClick={() => tapLeft(i)}
              >{n}</button>
              <span className={`inf-b2-link${p ? ' is-lit' : ''}`} aria-hidden="true" />
              <button
                type="button"
                className={`inf-chip inf-chip-p${p ? ' is-paired' : ''}`}
                aria-label={`Pair ${2 * n}${p ? ' (relié)' : ''}`}
                disabled={p || auto || sel == null}
                onClick={() => tapRight(i)}
              >{2 * n}</button>
            </div>
          )
        })}
        <div className="inf-b2-ell" aria-hidden="true">⋮</div>
      </div>

      {done ? (
        <div className="inf-after m-rise">
          <p className="inf-warm inf-gold-soft">
            Chaque nombre a trouvé son partenaire pair. <b>Pour toujours.</b> Personne tout seul.
          </p>
          <button type="button" className="btn-or inf-cta" onClick={() => setPhase('reveal')}>
            Alors… lequel est le plus grand ? →
          </button>
        </div>
      ) : manualDone ? (
        <button type="button" className="btn-or inf-cta inf-cta-wide" onClick={continueAlone} disabled={racing}>
          {racing ? 'ça continue…' : 'continue tout seul →'}
        </button>
      ) : (
        <p className="inf-instr inf-instr-sm">
          Tape un nombre, puis son partenaire pair. {paired.length} / {B2_MANUAL} pour commencer.
        </p>
      )}
    </div>
  )
}

/* colonnes qui montent doucement, pour « sentir » l'infini (statiques si
   mouvement réduit — la règle globale coupe l'animation) */
function EndlessColumns() {
  const left = Array.from({ length: 14 }, (_, i) => i + 1)
  const right = left.map((n) => 2 * n)
  return (
    <div className="inf-cols" aria-hidden="true">
      <div className="inf-col">
        <div className="inf-col-cap">tous les nombres</div>
        <div className="inf-col-scroll"><div className="inf-col-inner">
          {[...left, ...left].map((n, i) => <span key={i}>{n}</span>)}
        </div></div>
      </div>
      <div className="inf-col">
        <div className="inf-col-cap">seulement les pairs</div>
        <div className="inf-col-scroll"><div className="inf-col-inner">
          {[...right, ...right].map((n, i) => <span key={i}>{n}</span>)}
        </div></div>
      </div>
    </div>
  )
}

/* ============================================================================
   BEAT 3 — LA RÉVÉLATION
   Un infini vraiment plus grand : la diagonale. Le nombre manquant apparaît
   de ses propres tapes.
   ============================================================================ */
const B3_OPTS = [
  { id: 'oui', label: 'Oui, sûrement' },
  { id: 'non', label: 'Non, impossible' },
]
// exemple fixe, taillé à la main (jamais aléatoire)
const B3_ROWS = [
  { n: 1, digits: [3, 1, 4] }, // diagonale : position 0 → 3
  { n: 2, digits: [1, 5, 9] }, // diagonale : position 1 → 5
  { n: 3, digits: [2, 6, 5] }, // diagonale : position 2 → 5
]
const B3_DIAG = B3_ROWS.map((r, i) => r.digits[i])       // [3, 5, 5]
const B3_NEW = B3_DIAG.map((d) => (d + 1) % 10)          // [4, 6, 6]

function Beat3({ onNext }) {
  const rm = usePrefersReducedMotion()
  const [phase, setPhase] = useState('intro') // 'intro' → 'predict' → 'build' → 'walk' → 'summit'
  const [choice, setChoice] = useState(null)
  const [assembled, setAssembled] = useState(false)
  const [walk, setWalk] = useState(0) // 0..4 lignes de conclusion révélées

  // — intro —
  if (phase === 'intro') {
    return (
      <div className="inf-beat inf-b3 m-rise">
        <h2 className="display inf-q inf-soft">Alors… tous les infinis sont pareils ?</h2>
        <p className="inf-pivot">
          Regardons un autre infini. <b>Tous les nombres entre 0 et 1.</b>
        </p>
        <div className="inf-b3-samples">
          <span>0,1</span><span>0,5</span><span>0,7</span><span>0,03</span><span>0,42</span><span>…</span>
        </div>
        <p className="inf-warm">Il y en a une infinité, eux aussi.</p>
        <button type="button" className="btn-or inf-cta" onClick={() => setPhase('predict')}>Continuer →</button>
      </div>
    )
  }

  // — prédiction —
  if (phase === 'predict') {
    return (
      <div className="inf-beat inf-b3 m-rise">
        <p className="hand inf-lead">à ton avis…</p>
        <h2 className="display inf-q" id="b3q">
          Celui-ci — peux-tu le relier aux nombres 1, 2, 3… comme avant ?
        </h2>
        <Choices options={B3_OPTS} labelId="b3q" onPick={(o) => { setChoice(o); setPhase('build') }} />
        <p className="inf-hint">Choisis ce que tu ressens — il n’y a pas de mauvaise réponse.</p>
      </div>
    )
  }

  // — sommet / final —
  if (phase === 'summit') {
    return (
      <div className="inf-beat inf-summit m-rise">
        <p className="inf-summit-line">
          Peu importe comment tu ranges ces nombres… <b>il en manquera toujours un.</b>
        </p>
        <p className="inf-summit-line">Tu ne peux pas les relier.</p>
        <h2 className="display inf-hammer inf-gold">Cet infini est vraiment plus grand.</h2>
        <button type="button" className="btn-or inf-cta" onClick={onNext}>→</button>
      </div>
    )
  }

  // — construction + marche de la conclusion —
  const rowDiffLabels = ['le 1ᵉʳ chiffre est différent', 'le 2ᵉ chiffre est différent', 'le 3ᵉ chiffre est différent']
  const walkLines = [
    `Ce nombre est-il le n° 1 ? Non — ${rowDiffLabels[0]}.`,
    `Le n° 2 ? Non — ${rowDiffLabels[1]}.`,
    `Le n° 3 ? Non — ${rowDiffLabels[2]}.`,
    'Il ne peut être NULLE PART dans ta liste.',
  ]
  const walking = phase === 'walk'

  return (
    <div className="inf-beat inf-b3 m-rise">
      <p className="hand inf-lead">une liste… et un intrus</p>
      <p className="inf-instr inf-instr-sm">
        Voici une liste de ces nombres, bien rangée. Chaque ligne a un numéro.
      </p>

      <div className="inf-diag" data-assembled={assembled ? 'true' : 'false'}>
        {B3_ROWS.map((r, ri) => (
          <div className="inf-diag-row" data-index={r.n} key={r.n}>
            <span className="inf-diag-idx">{r.n}</span>
            <span className="inf-diag-arrow">→</span>
            <span className="inf-diag-num">
              <span className="inf-diag-lead">0,</span>
              {r.digits.map((d, di) => {
                const onDiag = di === ri
                const lit = walking && walk >= 1 && di === ri && ri === walk - 1
                return (
                  <span
                    key={di}
                    className={`inf-diag-d${onDiag ? ' inf-diag-hi' : ''}${lit ? ' is-compare' : ''}`}
                    data-diag={onDiag ? d : undefined}
                  >{d}</span>
                )
              })}
            </span>
          </div>
        ))}

        {/* le nombre construit — apparaît de ses tapes */}
        <div className={`inf-diag-new-wrap${assembled ? ' is-in' : ''}`}>
          <span className="inf-diag-newlabel">ton nombre</span>
          <span className="inf-diag-num inf-diag-new">
            <span className="inf-diag-lead">0,</span>
            {B3_NEW.map((d, di) => {
              const lit = walking && walk >= 1 && di === walk - 1
              return assembled
                ? <span
                    key={di}
                    className={`inf-diag-d inf-diag-newd${lit ? ' is-compare' : ''}`}
                    style={{ animationDelay: rm ? '0s' : `${di * 0.28}s` }}
                    data-d={d}
                  >{d}</span>
                : <span key={di} className="inf-diag-d inf-diag-blank" data-d={d}>·</span>
            })}
          </span>
        </div>
      </div>

      {!assembled ? (
        <>
          <p className="inf-instr inf-instr-sm">
            Les chiffres en or sont sur la <b>diagonale</b> — un par ligne.
          </p>
          <button type="button" className="btn-or inf-cta inf-cta-wide" onClick={() => setAssembled(true)}>
            change chaque chiffre sur la diagonale
          </button>
        </>
      ) : !walking && walk === 0 ? (
        <div className="inf-after m-rise">
          <p className="inf-warm inf-gold-soft">
            Un nombre tout neuf, fait de tes chiffres changés.<br />Cherchons-le dans la liste…
          </p>
          <button type="button" className="btn-or inf-cta" onClick={() => { setPhase('walk'); setWalk(1) }}>Cherchons →</button>
        </div>
      ) : (
        <div className="inf-walk">
          <ul className="inf-walk-lines">
            {walkLines.slice(0, walk).map((t, i) => (
              <li key={i} className={`m-rise${i === 3 ? ' inf-walk-final' : ''}`}>{t}</li>
            ))}
          </ul>
          {walk < walkLines.length ? (
            <button type="button" className="btn-or inf-cta" onClick={() => setWalk((w) => w + 1)}>continue →</button>
          ) : (
            <button type="button" className="btn-or inf-cta" onClick={() => setPhase('summit')}>Le sommet →</button>
          )}
        </div>
      )}
    </div>
  )
}

/* ============================================================================
   FINAL
   ============================================================================ */
function Final({ onRestart }) {
  return (
    <div className="inf-beat inf-final m-rise">
      <Star className="inf-gold inf-final-star" size={46} />
      <h1 className="display inf-final-line inf-gold">
        Certains infinis sont plus grands que d’autres.
      </h1>
      <p className="inf-final-sub">Et maintenant, tu sais <em>pourquoi</em>.</p>
      <button type="button" className="btn-soft inf-final-cta" onClick={onRestart}>Montre à quelqu’un</button>
    </div>
  )
}

/* ============================================================================
   ORCHESTRATION
   ============================================================================ */
function Experience() {
  const [beat, setBeat] = useState('opening') // opening | b1 | b2 | b3 | final
  const screenRef = useRef(null)

  // remonter en haut à chaque changement de beat
  useEffect(() => { screenRef.current?.scrollTo?.({ top: 0 }) }, [beat])

  let content
  if (beat === 'opening') content = <Opening onNext={() => setBeat('b1')} />
  else if (beat === 'b1') content = <Beat1 onNext={() => setBeat('b2')} />
  else if (beat === 'b2') content = <Beat2 onNext={() => setBeat('b3')} />
  else if (beat === 'b3') content = <Beat3 onNext={() => setBeat('final')} />
  else content = <Final onRestart={() => setBeat('opening')} />

  return (
    <div className="inf-screen" ref={screenRef}>
      <AmbientStars />
      <div className="inf-stage-inner" key={beat}>{content}</div>
    </div>
  )
}

export default function Infinis() {
  const appRef = useRef(null)
  const layout = useStageLayout(appRef)
  return (
    <div className="app inf-app" data-layout={layout} ref={appRef}>
      <Experience />
    </div>
  )
}

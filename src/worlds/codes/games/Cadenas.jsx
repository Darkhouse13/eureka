import { useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './codes-games.css'

// Rung 5 — « Le cadenas à sens unique ». Deux directions qu'elle conduit :
//  (a) le sens facile : voir deux premiers, toucher pour multiplier → grand nombre
//      instantané, le cadenas claque.
//  (b) le sens difficile : devant un AUTRE grand nombre, essayer de trouver ses deux
//      facteurs premiers (toucher des diviseurs) ; ça résiste ; après quelques essais,
//      on dévoile l'échelle (« plus de temps que l'âge de l'univers »).
// Sans échec : le sens difficile est un jouet « à ressentir », pas une résolution.
const P = 61, Q = 53
const PRODUCT = P * Q            // 3233 — clic instantané
const N = 60499                  // = 101 × 599 ; aucun petit premier ne le divise
const CANDIDATES = [3, 7, 11, 13, 17, 23]   // aucun ne divise 60499 (vérifié)
// Un nombre « cadenas » géant, pour l'effet d'échelle (illustratif — comme RSA).
const GIANT =
  '2519590847565789349402718324004839857142928212620403202777713783604366202070759555626401852588078440691829064124951508218929855914917618450280848912007284499268739280728777673597141834727026189637501497182469116507761337985909570009733045974880842840179742910064245869181719511874612151517265463228221686998754918242243363725908514186546204357679842338718477444792073993423658482382428119816381501067481045166037730605620161967625613384414360383390441495263443219011465754445417842402092461651572335077870774981712577246796292638635637328991215483143816789988504044536402352738195137863656439121201039712282212072245'

export default function Cadenas({ onSolve }) {
  const [phase, setPhase] = useState('mult')   // 'mult' | 'factor'
  const [multiplied, setMultiplied] = useState(false)
  const [tried, setTried] = useState({})
  const triesN = Object.keys(tried).length
  const revealed = triesN >= 3

  const doMultiply = () => { sound.chime(); setMultiplied(true) }
  const toFactor = () => { sound.foxCue(); setPhase('factor') }
  const tryFactor = (d) => {
    if (revealed) return
    sound.tap()
    setTried((t) => ({ ...t, [d]: true }))
  }

  // — sens facile —
  if (phase === 'mult') {
    return (
      <div className="cg">
        <div className="cg-fox">
          <Fennec size={50} expression={multiplied ? 'celebrant' : 'curieux'} />
          <span>{multiplied
            ? 'Instantané ! Multiplier deux premiers, c\'est l\'enfance de l\'art.'
            : 'Le petit cadenas des sites web tient sur des nombres premiers géants. D\'abord, le sens facile.'}</span>
        </div>

        <div className="cg-lockwrap">
          <svg viewBox="0 0 80 92" width="76" className={`cg-lock ${multiplied ? 'is-shut' : ''}`} aria-hidden="true">
            <path className="cg-shackle" d="M24 46 V30 a16 16 0 0 1 32 0 V46" fill="none" stroke="var(--w-codes)" strokeWidth="5" strokeLinecap="round" />
            <rect x="16" y="46" width="48" height="40" rx="9" fill="none" stroke="var(--or)" strokeWidth="4" />
            <circle cx="40" cy="62" r="5" fill="var(--or)" /><path d="M40 62 V74" stroke="var(--or)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <div className="cg-primes">
          <span className="cg-prime">{P}</span>
          <span className="cg-op">×</span>
          <span className="cg-prime">{Q}</span>
          <span className="cg-op">=</span>
          <span className={`cg-product ${multiplied ? 'is-on' : ''}`}>{multiplied ? PRODUCT.toLocaleString('fr-FR') : '?'}</span>
        </div>

        {!multiplied
          ? <button className="btn-or" onClick={doMultiply}>Multiplier les deux nombres premiers</button>
          : <button className="btn-or" onClick={toFactor}>Maintenant, essaie l'autre sens →</button>}
      </div>
    )
  }

  // — sens difficile —
  return (
    <div className="cg">
      <div className="cg-fox">
        <Fennec size={50} expression={revealed ? 'celebrant' : 'encourageant'} />
        <span>{revealed
          ? 'Tu sens comme ça résiste ? Voilà tout le secret du cadenas.'
          : 'Et dans l\'autre sens ? Ce grand nombre cache deux premiers. Trouve-les… si tu peux.'}</span>
      </div>

      <div className="cg-panel cg-factor">
        <div className="eyebrow">Retrouve les deux premiers cachés dans</div>
        <div className="cg-bignum">{N.toLocaleString('fr-FR')}</div>
        <div className="cg-divs">
          {CANDIDATES.map((d) => (
            <button key={d} type="button"
                    className={`chip ${tried[d] ? 'cg-div-tried' : ''}`}
                    onClick={() => tryFactor(d)} disabled={revealed}
                    aria-label={`Essayer le diviseur ${d}`}>
              {d}{tried[d] ? ' ✗' : ''}
            </button>
          ))}
        </div>
        <div className="cg-resist" aria-live="polite">
          {triesN === 0 ? 'Touche un nombre pour voir s\'il divise.'
            : revealed ? 'Aucun ne tombe juste. Et il y a des millions de premiers à tester…'
            : `« ${Object.keys(tried).slice(-1)[0]} » ne divise pas. Le cadenas résiste.`}
        </div>
      </div>

      {revealed && (
        <div className="cg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="eyebrow">Le vrai cadenas du Web, c'est un nombre comme</div>
          <div className="cg-giant">{GIANT.slice(0, 90)}…</div>
          <div className="display cg-reveal-title">
            Le retrouver ? Tous les ordinateurs du monde y passeraient plus de temps que l'âge de l'univers.
          </div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

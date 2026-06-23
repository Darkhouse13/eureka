import { useState } from 'react'
import { Etoile } from '../../../components/Sparkle.jsx'
import { Fennec } from '../../../components/Fennec.jsx'
import { sound } from '../../../audio/sound.js'
import './codes-games.css'

// Rung 4 — « Le secret partagé » (Diffie–Hellman par mélange de couleurs).
// Une couleur PUBLIQUE de départ. Chacune garde une couleur secrète. On mélange
// secret + base → un mélange public ; on échange les mélanges à voix haute ; puis
// chacune rajoute SON secret → toutes deux obtiennent la même couleur finale, que
// l'espion — qui n'a que les deux mélanges publics — ne sait pas refaire.
// Guidé, sans échec, converge toujours. Mélange = addition de lumière (commutative,
// donc base+toi+amie est identique des deux côtés ; l'espion, lui, a une base en trop).
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))
const css = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`
const mix = (a, b) => [clamp(a[0] + b[0]), clamp(a[1] + b[1]), clamp(a[2] + b[2])]
const mix3 = (a, b, c) => [clamp(a[0] + b[0] + c[0]), clamp(a[1] + b[1] + c[1]), clamp(a[2] + b[2] + c[2])]

const BASE = [42, 92, 120]     // couleur publique (cyan lunaire)
const FRIEND = [40, 112, 52]   // secret de l'amie — fixe
const OPTIONS = [
  { id: 'rose', rgb: [150, 46, 66] },
  { id: 'or', rgb: [156, 116, 26] },
  { id: 'violet', rgb: [92, 44, 150] },
]

function Disk({ color, hidden, ring }) {
  return (
    <span className={`cg-disk ${ring ? 'is-ring' : ''}`}
          style={{ background: hidden ? 'repeating-linear-gradient(45deg,#222a48 0 6px,#171c34 6px 12px)' : css(color) }}>
      {hidden && <span className="cg-disk-q">?</span>}
    </span>
  )
}

export default function SecretPartage({ onSolve }) {
  const [mine, setMine] = useState(null)
  const [step, setStep] = useState(0)   // 0 intro · 1 choisir · 2 mélanger · 3 échanger · 4 ajouter · 5 fini

  const tonMix = mine ? mix(BASE, mine) : null
  const sonMix = mix(BASE, FRIEND)
  const finale = mine ? mix3(BASE, mine, FRIEND) : null
  const eaves = mine ? mix(tonMix, sonMix) : null   // base EN TROP → couleur différente
  const done = step >= 5

  const choose = (opt) => { sound.chime(); setMine(opt.rgb); setStep(2) }
  const advance = () => { sound.tap(); setStep((s) => s + 1) }

  const fox = [
    'Pour te lire, ton amie a besoin de la clé. Mais l\'espion écoute tout. Comment se mettre d\'accord sur un secret… devant lui ?',
    'Choisis une couleur : ce sera TON secret. Tu ne le diras à personne.',
    'Vous avez chacune un secret. Mélangez-le avec la couleur publique, que tout le monde voit.',
    'Échangez vos mélanges à voix haute. L\'espion les entend… mais ça ne lui suffira pas.',
    'Ajoute ta couleur secrète au mélange reçu. Ton amie fait pareil de son côté.',
    'Même couleur ! Et l\'espion, lui, n\'arrive pas à la refaire.',
  ][step]

  return (
    <div className="cg">
      <div className="cg-fox">
        <Fennec size={50} expression={done ? 'celebrant' : 'curieux'} />
        <span>{fox}</span>
      </div>

      <div className="cg-public">
        <Disk color={BASE} />
        <span><b>Couleur publique</b><br />tout le monde la voit</span>
      </div>

      {step === 1 && (
        <div className="cg-choose">
          {OPTIONS.map((o) => (
            <button key={o.id} type="button" className="cg-choose-btn" onClick={() => choose(o)} aria-label={`Choisir la couleur ${o.id}`}>
              <Disk color={o.rgb} />
            </button>
          ))}
        </div>
      )}

      {step >= 2 && (
        <div className="cg-duo">
          <div className="cg-side">
            <div className="eyebrow">Toi</div>
            <div className="cg-side-row">
              <Disk color={mine} ring /><span className="cg-mini">ton secret</span>
            </div>
            {step >= 3 && <div className="cg-side-row"><Disk color={tonMix} /><span className="cg-mini">ton mélange public</span></div>}
            {step >= 5 && <div className="cg-side-row"><Disk color={finale} ring /><span className="cg-mini">couleur finale</span></div>}
          </div>
          <div className="cg-side">
            <div className="eyebrow">Ton amie</div>
            <div className="cg-side-row">
              <Disk color={FRIEND} ring /><span className="cg-mini">son secret</span>
            </div>
            {step >= 3 && <div className="cg-side-row"><Disk color={sonMix} /><span className="cg-mini">son mélange public</span></div>}
            {step >= 5 && <div className="cg-side-row"><Disk color={finale} ring /><span className="cg-mini">couleur finale</span></div>}
          </div>
        </div>
      )}

      {step >= 4 && (
        <div className="cg-spy">
          <div className="eyebrow">L'espion qui écoute</div>
          <div className="cg-spy-row">
            <Disk color={tonMix} /><span className="cg-plus">+</span><Disk color={sonMix} />
            <span className="cg-plus">→</span>
            {step >= 5
              ? <><Disk color={eaves} /><span className="cg-mini cg-fail">≠ la bonne couleur</span></>
              : <span className="cg-mini">il n'a que les deux mélanges…</span>}
          </div>
          {step >= 5 && <div className="cg-mini">Il ne peut pas « dé-mélanger » la peinture pour retirer la couleur publique en trop.</div>}
        </div>
      )}

      {step >= 5 && (
        <div className="cg-same">Vous obtenez la <b>même</b> couleur — un secret commun, fabriqué à voix haute. ✦</div>
      )}

      {!done && step !== 1 && (
        <button className="btn-or" onClick={advance}>
          {['Choisis ta couleur secrète', '', 'Mélanger avec la couleur publique', 'Échanger les mélanges à voix haute', 'Ajouter ta couleur secrète'][step]}
        </button>
      )}

      {done && (
        <div className="cg-reveal m-rise">
          <Etoile size={30} glow />
          <div className="display cg-reveal-title">Un secret commun, fabriqué devant un espion impuissant.</div>
          <button className="btn-or" style={{ maxWidth: 320, margin: '12px auto 0' }} onClick={() => { sound.foxCue(); onSolve() }}>
            Découvrir la merveille ✦
          </button>
        </div>
      )}
    </div>
  )
}

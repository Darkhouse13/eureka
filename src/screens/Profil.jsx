import { useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { FennecFace } from '../components/Fennec.jsx'
import { Starfield, Etoile } from '../components/Sparkle.jsx'
import { WORLDS } from '../worlds/index.js'
import { sound } from '../audio/sound.js'
import './Profil.css'

// Profil · sa constellation. Son voyage, raconté comme un ciel — pas un bulletin
// de notes. Aucune série, aucun jour manqué : retour récompensé par de l'ajout.
const RING_C = 2 * Math.PI * 22

function Ring({ frac, color, label, locked }) {
  const off = RING_C * (1 - frac)
  return (
    <div className="ring">
      <svg viewBox="0 0 56 56" width="52" aria-hidden="true">
        <circle cx="28" cy="28" r="22" fill="none" stroke="#1b2340" strokeWidth="5" />
        {locked
          ? <path d="M28 20v16M20 28h16" stroke={color} strokeWidth="3" strokeLinecap="round" opacity=".5" />
          : <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={RING_C} strokeDashoffset={off} transform="rotate(-90 28 28)" />}
      </svg>
      <span className="ring-pct" style={{ color }}>{locked ? '∙' : Math.round(frac * 100) + '%'}</span>
      <span className="ring-label">{label}</span>
    </div>
  )
}

export default function Profil({ onRename }) {
  const { greetName, childName, cardCount, fennecStage, fennecStageLabel, worldsView, sound: snd, setSound, setChildName } = useApp()
  const [editName, setEditName] = useState(false)
  const [draft, setDraft] = useState(childName || '')

  const identity = childName || 'exploratrice de minuit'
  const learned = cardCount > 0
    ? <>{greetName} a appris à <b>chuchoter l'infini</b>. Reviens quand tu veux — il sera là.</>
    : <>{greetName} t'attend pour te confier des secrets immenses. Reviens quand l'envie te prend.</>

  const toggleSound = () => { sound.ensure(); setSound({ enabled: !snd.enabled }) }
  const toggleMusic = () => { sound.ensure(); setSound({ music: !snd.music }) }
  const saveName = () => { setChildName(draft.trim() || null); setEditName(false) }

  return (
    <section className="screen profil accent-nombres" aria-label="Profil">
      <div className="screen-inner">
        {/* avatar + identité */}
        <div className="pf-head">
          <div className="pf-avatar">
            <FennecFace size={64} stage={fennecStage} />
            <Etoile size={16} className="pf-avatar-spark" style={{ position: 'absolute', top: -4, right: -2 }} />
          </div>
          <div className="pf-id">
            <div className="display pf-name">{identity}</div>
            <div className="pf-sub">avec {greetName} · niveau {fennecStageLabel}</div>
            <button type="button" className="pf-rename" onClick={onRename}>renommer {greetName}</button>
          </div>
          <div className="pf-count">
            <div className="display pf-count-n">{cardCount}</div>
            <div className="pf-count-k">{cardCount === 1 ? 'merveille' : 'merveilles'}</div>
          </div>
        </div>

        {/* constellation */}
        <div className="pf-constellation">
          <Starfield count={10} seed={3} glow={false} />
          <div className="eyebrow">Ta constellation de découvertes</div>
          <svg viewBox="0 0 320 120" className="pf-sky" aria-hidden="true">
            <g stroke="var(--or)" strokeWidth="1.2" fill="none" opacity=".7">
              <path d="M30 80 L70 40 L120 60 L160 30 L210 64 L250 44 L290 74" />
            </g>
            <g fill="var(--creme-clair)">
              {[[30, 80], [70, 40], [120, 60], [160, 30], [210, 64], [250, 44], [290, 74]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i < cardCount ? 4 : 2.4} opacity={i < cardCount ? 1 : 0.35} />
              ))}
            </g>
          </svg>
          <div className="hand pf-sky-note">
            {cardCount > 0 ? `${cardCount} merveille${cardCount > 1 ? 's relient' : ' relie'} déjà ton ciel.` : 'ton ciel s\'ouvre — la première étoile t\'attend.'}
          </div>
        </div>

        {/* anneaux par monde */}
        <div className="pf-rings">
          {worldsView.map((e) => {
            const frac = e.rungsTotal ? e.rungsDone / e.rungsTotal : 0
            return <Ring key={e.world.id} frac={frac} color={`var(--w-${e.world.id})`} label={e.world.shortName[0]} locked={e.status === 'bientot'} />
          })}
        </div>

        {/* le guide a appris */}
        <div className="pf-learned">
          <Etoile size={22} color="var(--w-motifs)" spark={false} />
          <div>{learned}</div>
        </div>

        {/* réglages */}
        <div className="pf-settings">
          <div className="eyebrow pf-set-head">Sons</div>
          <button type="button" className="pf-row" onClick={toggleSound} aria-pressed={snd.enabled}>
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-200)" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15 9a3 3 0 010 6M18 6a7 7 0 010 12" /></svg>
            <span className="pf-row-body"><span className="pf-row-k">Sons &amp; musique</span><span className="pf-row-s">ambiances nocturnes &amp; effets</span></span>
            <span className={`toggle ${snd.enabled ? 'on' : ''}`} aria-hidden="true"><span /></span>
          </button>
          <button type="button" className={`pf-row pf-row-sub ${!snd.enabled ? 'is-disabled' : ''}`} onClick={snd.enabled ? toggleMusic : undefined} aria-pressed={snd.music} disabled={!snd.enabled}>
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-200)" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
            <span className="pf-row-body"><span className="pf-row-k">Musique d'ambiance</span><span className="pf-row-s">une veillée douce, en fond</span></span>
            <span className={`toggle ${snd.music ? 'on' : ''}`} aria-hidden="true"><span /></span>
          </button>

          <div className="eyebrow pf-set-head">L'app</div>
          {editName ? (
            <div className="pf-row pf-name-edit">
              <input className="field pf-name-field" value={draft} placeholder="ton prénom (optionnel)" maxLength={18}
                     onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saveName() }} autoFocus />
              <button type="button" className="btn-soft accent-nombres pf-name-save" onClick={saveName}>OK</button>
            </div>
          ) : (
            <button type="button" className="pf-row" onClick={() => { setDraft(childName || ''); setEditName(true) }}>
              <svg width="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-200)" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span className="pf-row-body"><span className="pf-row-k">Ton prénom</span><span className="pf-row-s">{childName || 'optionnel · gardé sur l\'appareil'}</span></span>
              <span className="pf-row-arrow">›</span>
            </button>
          )}
          <div className="pf-row pf-row-static">
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-200)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 010 18" /></svg>
            <span className="pf-row-body"><span className="pf-row-k">Thème · nuit</span></span>
            <span className="pf-row-arrow">›</span>
          </div>
          <div className="pf-row pf-row-static">
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-200)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>
            <span className="pf-row-body"><span className="pf-row-k">À propos d'Eurêka</span><span className="pf-row-s">hors-ligne · sans compte · sans pub</span></span>
            <span className="pf-row-arrow">›</span>
          </div>
        </div>
      </div>
    </section>
  )
}

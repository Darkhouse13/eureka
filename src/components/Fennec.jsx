// Le fennec — le guide, « l'élément attache-toi ».
// Lignes d'or affinées, oreilles expressives, regard vif. Quatre EXPRESSIONS
// (repos · curieux · encourageant · célébrant) et SEPT STADES de croissance,
// cumulatifs (nouveau-né → éveillé → complice → curieux du ciel → veilleur →
// sage → gardien). Les ornements sont des CALQUES additifs posés sur la même
// base — on ne redessine jamais le renard, on n'enlève jamais rien.
// La table des stades vit dans fennecStages.js (source unique). Le mouvement est
// coupé par prefers-reduced-motion : chaque calque animé garde un état de base
// VISIBLE, l'animation n'étant qu'un supplément (voir motion.css).
//
// Chaque pas doit se LIRE « il a changé » d'un coup d'œil, même petit (médaillon
// ~40-56 px). On charge donc surtout les premiers stades (1-4), là où vit l'enfant.
import { layersFor } from './fennecStages.js'

const EAR_L = 'M44 64 L22 14 L66 46 Z'
const EAR_R = 'M96 64 L118 14 L74 46 Z'
const EAR_L_IN = 'M44 60 L31 28 L60 47 Z'
const EAR_R_IN = 'M96 60 L109 28 L80 47 Z'
const HEAD = 'M70 40 C100 40 108 66 104 86 C100 108 86 120 70 120 C54 120 40 108 36 86 C32 66 40 40 70 40 Z'
const MUZZLE = 'M70 80 C79 80 86 87 86 96 C86 107 79 113 70 113 C61 113 54 107 54 96 C54 87 61 80 70 80Z'
// Queue : une vraie brosse de fennec en bas à gauche — assez ample pour que sa
// LEVÉE (curieux) se voie nettement en silhouette.
const TAIL = 'M50 124 C40 152 20 158 13 149 C26 146 35 135 43 119 Z'
const NOSE = 'M65 89 H75 L70 96 Z'
const STAR4 = 'M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z'

const INK = '#1B2350'
const PINK = '#E8718A'
const CIEL = '#6FB7E0'      // foulard d'étoiles (cyan lunaire)
const AMETHYSTE = '#A98BD9' // couronne

// Petite étincelle à quatre branches, centrée sur (cx,cy), de taille `s` px.
function MiniStar({ cx, cy, s = 10, color = 'var(--or)', opacity = 1 }) {
  const k = s / 24
  return <path d={STAR4} fill={color} opacity={opacity}
               transform={`translate(${cx} ${cy}) scale(${k}) translate(-12 -12)`} />
}

// Une étoile d'or qui ÉCLAIRE (halo doux derrière) — pour qu'elle se lise petite.
function GlowStar({ cx, cy, s = 14, halo = 0.8 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={s * halo} fill="var(--or)" opacity=".22" />
      <MiniStar cx={cx} cy={cy} s={s} color="var(--or)" />
    </g>
  )
}

// Traits du visage par expression (système de coordonnées du corps complet).
function Face({ expression }) {
  switch (expression) {
    case 'curieux':
      return (
        <g>
          <ellipse cx="57" cy="73" rx="6" ry="7.5" fill={INK} />
          <ellipse cx="84" cy="73" rx="6.5" ry="8" fill={INK} />
          <circle cx="59" cy="70" r="2" fill="#fff" />
          <circle cx="86" cy="70" r="2.2" fill="#fff" />
          <path d={NOSE} fill={INK} />
          <circle cx="70" cy="104" r="3" fill="none" stroke={INK} strokeWidth="2" />
        </g>
      )
    case 'encourageant':
      return (
        <g>
          <path d="M51 73 Q57 68 63 73" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="83" cy="74" rx="5.5" ry="7" fill={INK} />
          <circle cx="85" cy="71" r="1.8" fill="#fff" />
          <path d={NOSE} fill={INK} />
          <path d="M62 100 Q70 108 78 100" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="93" r="4" fill={PINK} opacity=".32" />
          <circle cx="90" cy="93" r="4" fill={PINK} opacity=".32" />
        </g>
      )
    case 'celebrant':
      return (
        <g>
          <path d="M50 71 Q57 64 64 71" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M76 71 Q83 64 90 71" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M64 87 H76 L70 93 Z" fill={INK} />
          <path d="M59 99 Q70 113 81 99 Q70 105 59 99Z" fill={INK} />
          <path d="M62 103 Q70 107 78 103" fill={PINK} opacity=".6" />
          <circle cx="49" cy="92" r="4.5" fill={PINK} opacity=".4" />
          <circle cx="91" cy="92" r="4.5" fill={PINK} opacity=".4" />
        </g>
      )
    case 'repos':
    default:
      return (
        <g>
          <ellipse cx="57" cy="74" rx="5.5" ry="7" fill={INK} />
          <ellipse cx="83" cy="74" rx="5.5" ry="7" fill={INK} />
          <circle cx="59" cy="71" r="1.8" fill="#fff" />
          <circle cx="85" cy="71" r="1.8" fill="#fff" />
          <path d={NOSE} fill={INK} />
          <path d="M70 96 Q70 101 65 103" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M70 96 Q70 101 75 103" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )
  }
}

// Les expressions « calmes » où les retouches du regard (éveil, sagesse) ont du
// sens — les sourires (encourageant/célébrant) parlent déjà d'eux-mêmes.
const QUIET = (e) => e === 'repos' || e === 'curieux'

// Retouches du REGARD posées par-dessus le visage (calques cumulatifs).
// Le saut nouveau-né → éveillé est VOULU fort : d'endormi (paupières mi-closes)
// à grand éveil (regard large et brillant + joues chaudes).
function GazeExtras({ layers, expression }) {
  if (!QUIET(expression)) return null
  const alert = layers.has('alert')
  return (
    <g>
      {/* nouveau-né — encore tout ensommeillé : paupières mi-closes */}
      {!alert && (
        <g>
          <path d="M50 75 Q57 71 64 75 L64 64 L50 64 Z" fill="var(--creme-clair)" />
          <path d="M76 75 Q83 71 90 75 L90 64 L76 64 Z" fill="var(--creme-clair)" />
          <path d="M50 75 Q57 71 64 75" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M76 75 Q83 71 90 75" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* éveillé — il s'éveille : grands éclats de lumière + joues chaudes */}
      {alert && (
        <g>
          <circle cx="59" cy="70.5" r="2.9" fill="#fff" opacity=".95" />
          <circle cx="85.4" cy="70.5" r="3.1" fill="#fff" opacity=".95" />
          <circle cx="48.5" cy="92" r="5.4" fill={PINK} opacity=".32" />
          <circle cx="91.5" cy="92" r="5.4" fill={PINK} opacity=".32" />
        </g>
      )}
      {/* sage — paupières sereines : un regard qui sait */}
      {layers.has('wise') && (
        <g stroke={INK} strokeWidth="2.1" fill="none" strokeLinecap="round" opacity=".8">
          <path d="M51 70 Q57.5 67 64 70" />
          <path d="M77 70 Q83.5 67 90 70" />
        </g>
      )}
    </g>
  )
}

// Ornements POSÉS SUR LE CORPS (foulard, couronne) — peints par-dessus la tête.
function BodyOrnaments({ layers, flourish }) {
  const style = flourish
    ? { animation: 'popin .55s ease both', transformOrigin: '70px 84px' }
    : undefined
  return (
    <g style={style}>
      {/* foulard d'étoiles — céleste (complice) */}
      {layers.has('foulard') && (
        <g>
          <path d="M50 116 Q70 126 90 116 L86 125 Q70 133 54 125 Z" fill={CIEL} stroke="#0E1430" strokeWidth="1.5" />
          <circle cx="62" cy="122" r="1.1" fill="#FBE9C4" />
          <circle cx="78" cy="122" r="1.1" fill="#FBE9C4" />
          <circle cx="70" cy="124" r="1" fill="#FBE9C4" />
        </g>
      )}
      {/* veilleur — une SECONDE étoile, franche et lumineuse, rejoint le foulard */}
      {layers.has('foulard2') && <GlowStar cx={84} cy={117} s={13} halo={0.55} />}
      {/* gardien — la couronne d'améthyste + son étincelle (le sommet) */}
      {layers.has('couronne') && (
        <g>
          <path d="M48 44 Q70 30 92 44 L88 33 Q70 23 52 33 Z" fill={AMETHYSTE} stroke="#0E1430" strokeWidth="1.5" />
          <path d="M70 20 l1.3 4 4 1.3 -4 1.3 -1.3 4 -1.3 -4 -4 -1.3 4 -1.3Z" fill="var(--or)" />
        </g>
      )}
    </g>
  )
}

// Ciel autour de lui (orbite, constellation) — peint AU-DESSUS de tout.
function SkyOrnaments({ layers, animated, flourish }) {
  const style = flourish
    ? { animation: 'popin .55s ease both', transformOrigin: '70px 60px' }
    : undefined
  return (
    <g style={style}>
      {/* curieux — une étoile d'or, franche et lumineuse, orbite près de lui (au
           repos : à sa gauche, bien détachée). Animée, et statique-visible en
           mouvement réduit. */}
      {layers.has('orbit') && (
        <g style={{ transformOrigin: '70px 72px', animation: animated ? 'orbit 11s linear infinite' : 'none' }}>
          <GlowStar cx={24} cy={56} s={16} halo={0.7} />
        </g>
      )}
      {/* sage — une petite constellation se trace au-dessus de sa tête */}
      {layers.has('constellation') && (
        <g>
          <g stroke="var(--or)" strokeWidth="1" fill="none" opacity=".5" strokeLinecap="round">
            <path d="M44 12 L58 4 L74 9 L90 3" />
          </g>
          <g fill="#FBE9C4">
            {[[44, 12], [58, 4], [74, 9], [90, 3]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === 1 ? 2.1 : 1.7}
                      style={{ transformOrigin: `${x}px ${y}px`, animation: animated ? `twinkle ${2.8 + i * 0.5}s ease-in-out ${i * 0.4}s infinite` : 'none' }} />
            ))}
          </g>
        </g>
      )}
    </g>
  )
}

export function Fennec({
  expression = 'repos',
  stage = 'ne',
  size = 160,
  animated = true,
  sparkle = false,
  flourish = false,
  className = '',
}) {
  const w = size
  const h = size * (160 / 140)
  const layers = new Set(layersFor(stage))
  const bodyAnim = animated
    ? (expression === 'celebrant' ? 'floaty 2.4s ease-in-out infinite' : 'floaty 5s ease-in-out infinite')
    : 'none'
  const tilt = expression === 'curieux' ? 'rotate(-7deg)' : 'none'

  // Posture des oreilles : nouveau-né = nettement basses, flapies (timide,
  // ensommeillé) ; dès « éveillé » elles se DRESSENT bien haut et en avant.
  const alert = layers.has('alert')
  const earL = alert ? 'rotate(6 50 50)' : 'rotate(-18 50 50)'
  const earR = alert ? 'rotate(-6 90 50)' : 'rotate(18 90 50)'
  // curieux du ciel : la queue se relève franchement (visible en silhouette).
  const tail = layers.has('tailUp') ? 'rotate(-48 46 124)' : undefined

  return (
    <div className={`fennec ${className}`} style={{ position: 'relative', width: w, lineHeight: 0 }}>
      <div style={{ animation: bodyAnim, transformOrigin: '50% 80%' }}>
        <svg viewBox="0 0 140 160" width={w} height={h} role="img"
             aria-label="le fennec, ton guide"
             style={{ overflow: 'visible', transform: tilt, transformOrigin: '70px 80px' }}>
          <defs>
            <radialGradient id="fennecAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5C66B" stopOpacity=".55" />
              <stop offset="42%" stopColor="#F5C66B" stopOpacity=".22" />
              <stop offset="100%" stopColor="#F5C66B" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="70" cy="151" rx="33" ry="6.5" fill="#000" opacity=".22" />

          {/* veilleur — halo chaud, nettement perceptible, dans la nuit (derrière lui) */}
          {layers.has('aura') && (
            <circle cx="70" cy="84" r="66" fill="url(#fennecAura)"
                    style={{ transformOrigin: '70px 84px', animation: animated ? 'breathe 5.5s ease-in-out infinite' : 'none' }} />
          )}

          <g transform={tail}><path d={TAIL} fill="var(--or)" stroke="var(--encre)" strokeWidth="2" strokeLinejoin="round" /></g>
          {/* oreilles — posture (stade) + frémissement par à-coups (calque intérieur) */}
          <g transform={earL}>
            <path d={EAR_L} fill="var(--or)" stroke="var(--encre)" strokeWidth="2.5" strokeLinejoin="round"
                  style={{ transformOrigin: '50px 50px', animation: animated ? 'earwiggle 5s ease-in-out infinite' : 'none' }} />
          </g>
          <g transform={earR}>
            <path d={EAR_R} fill="var(--or)" stroke="var(--encre)" strokeWidth="2.5" strokeLinejoin="round"
                  style={{ transformOrigin: '90px 50px', animation: animated ? 'earwiggle 5s ease-in-out .25s infinite' : 'none' }} />
          </g>
          <g transform={earL}><path d={EAR_L_IN} fill={PINK} opacity=".5" /></g>
          <g transform={earR}><path d={EAR_R_IN} fill={PINK} opacity=".5" /></g>

          <path d={HEAD} fill="var(--creme-clair)" stroke="var(--encre)" strokeWidth="2.5" />
          <path d={MUZZLE} fill="#fff8ec" />
          <Face expression={expression} />
          <GazeExtras layers={layers} expression={expression} />
          <BodyOrnaments layers={layers} flourish={flourish} />
          <SkyOrnaments layers={layers} animated={animated} flourish={flourish} />
        </svg>
      </div>
      {sparkle && (
        <svg viewBox="0 0 24 24" width={size * 0.16} height={size * 0.16} aria-hidden="true"
             style={{ position: 'absolute', top: -4, right: -2, animation: animated ? 'spark 3s ease-in-out infinite' : 'none' }}>
          <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="var(--or)" />
        </svg>
      )}
    </div>
  )
}

// Visage seul, pour les médaillons (en-tête, avatar de profil). Reflète le stade
// avec des accents tenus À L'INTÉRIEUR du disque (les médaillons sont ronds), mais
// assez FRANCS pour se lire à ~40-56 px : oreilles, regard, joues, étoiles.
export function FennecFace({ size = 38, stage = 'ne' }) {
  const layers = new Set(layersFor(stage))
  const has = (k) => layers.has(k)
  const alert = has('alert')
  const earL = alert ? 'rotate(6 47 58)' : 'rotate(-17 47 58)'
  const earR = alert ? 'rotate(-6 93 58)' : 'rotate(17 93 58)'
  return (
    <svg viewBox="0 0 140 120" width={size} height={size * (120 / 140)} aria-hidden="true">
      <defs>
        <radialGradient id="fennecAuraMed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5C66B" stopOpacity=".5" />
          <stop offset="45%" stopColor="#F5C66B" stopOpacity=".18" />
          <stop offset="100%" stopColor="#F5C66B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* veilleur — halo chaud derrière le visage */}
      {has('aura') && <circle cx="70" cy="72" r="56" fill="url(#fennecAuraMed)" />}

      <path d="M44 60 L26 20 L62 44 Z" fill="var(--or)" transform={earL} />
      <path d="M96 60 L114 20 L78 44 Z" fill="var(--or)" transform={earR} />
      <path d="M70 38 C98 38 104 62 100 82 C96 102 84 112 70 112 C56 112 44 102 40 82 C36 62 42 38 70 38Z" fill="var(--creme-clair)" />

      {/* ciel intérieur — orbite (curieux+) puis constellation (sage+) */}
      {has('orbit') && !has('couronne') && <GlowStar cx={70} cy={17} s={15} halo={0.7} />}
      {has('constellation') && !has('couronne') && (
        <g fill="#FBE9C4"><circle cx="50" cy="20" r="2" /><circle cx="90" cy="19" r="2" /></g>
      )}

      {/* regalia : foulard céleste (complice→sage) ou couronne (gardien) */}
      {has('couronne') ? (
        <g>
          <path d="M50 40 Q70 26 90 40 L86 30 Q70 21 54 30 Z" fill={AMETHYSTE} />
          <MiniStar cx={70} cy={16} s={11} color="var(--or)" />
        </g>
      ) : has('foulard') ? (
        <g>
          <path d="M52 40 Q70 28 88 40 L84 31 Q70 23 56 31 Z" fill={CIEL} />
          {has('foulard2') && <GlowStar cx={80} cy={35} s={8} halo={0.6} />}
        </g>
      ) : null}

      {/* yeux — endormis (nouveau-né) vs grands et brillants + joues (éveillé+) */}
      <ellipse cx="58" cy="70" rx="5" ry="6" fill={INK} />
      <ellipse cx="82" cy="70" rx="5" ry="6" fill={INK} />
      {alert ? (
        <g>
          <g fill="#fff" opacity=".95"><circle cx="59.4" cy="67.5" r="2.2" /><circle cx="83.4" cy="67.5" r="2.2" /></g>
          <g fill={PINK} opacity=".3"><circle cx="46" cy="84" r="4.6" /><circle cx="94" cy="84" r="4.6" /></g>
        </g>
      ) : (
        <g>
          <path d="M52 71 Q58 67 64 71 L64 61 L52 61 Z" fill="var(--creme-clair)" />
          <path d="M76 71 Q82 67 88 71 L88 61 L76 61 Z" fill="var(--creme-clair)" />
          <path d="M52 71 Q58 67 64 71" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M76 71 Q82 67 88 71" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      )}
      <path d="M64 84 H76 L70 91 Z" fill={INK} />
    </svg>
  )
}

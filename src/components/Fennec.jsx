// Le fennec — le guide, « l'élément attache-toi ».
// Lignes d'or affinées, oreilles expressives, regard vif. Quatre expressions
// (repos · curieux · encourageant · célébrant) et trois stades de croissance
// (nouveau-né → complice « foulard d'étoiles » → gardien « couronne · 30 cartes »).
// Le mouvement est coupé par prefers-reduced-motion (voir motion.css).

const EAR_L = 'M44 64 L22 14 L66 46 Z'
const EAR_R = 'M96 64 L118 14 L74 46 Z'
const EAR_L_IN = 'M44 60 L31 28 L60 47 Z'
const EAR_R_IN = 'M96 60 L109 28 L80 47 Z'
const HEAD = 'M70 40 C100 40 108 66 104 86 C100 108 86 120 70 120 C54 120 40 108 36 86 C32 66 40 40 70 40 Z'
const MUZZLE = 'M70 80 C79 80 86 87 86 96 C86 107 79 113 70 113 C61 113 54 107 54 96 C54 87 61 80 70 80Z'
const TAIL = 'M48 132 C40 150 30 150 26 146 C34 140 36 132 40 124 Z'
const NOSE = 'M65 89 H75 L70 96 Z'

const INK = '#1B2350'
const PINK = '#E8718A'

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

// Ornements additifs de croissance (jamais punitifs : on n'enlève rien).
function Ornaments({ stage }) {
  if (stage === 'gardien') {
    return (
      <g>
        {/* couronne d'améthyste */}
        <path d="M48 44 Q70 30 92 44 L88 33 Q70 23 52 33 Z" fill="#A98BD9" stroke="#0E1430" strokeWidth="1.5" />
        {/* foulard d'or */}
        <path d="M50 116 Q70 126 90 116 L86 125 Q70 133 54 125 Z" fill="#F5C66B" stroke="#0E1430" strokeWidth="1.5" />
        {/* étincelle de la couronne */}
        <path d="M70 20 l1.3 4 4 1.3 -4 1.3 -1.3 4 -1.3 -4 -4 -1.3 4 -1.3Z" fill="#F5C66B" />
      </g>
    )
  }
  if (stage === 'complice') {
    return (
      <g>
        {/* foulard d'étoiles (céleste) */}
        <path d="M50 116 Q70 126 90 116 L86 125 Q70 133 54 125 Z" fill="#6FB7E0" stroke="#0E1430" strokeWidth="1.5" />
        <circle cx="62" cy="122" r="1.1" fill="#FBE9C4" />
        <circle cx="78" cy="122" r="1.1" fill="#FBE9C4" />
        <circle cx="70" cy="124" r="1" fill="#FBE9C4" />
      </g>
    )
  }
  return null
}

export function Fennec({
  expression = 'repos',
  stage = 'ne',
  size = 160,
  animated = true,
  sparkle = false,
  className = '',
}) {
  const w = size
  const h = size * (160 / 140)
  const bodyAnim = animated
    ? (expression === 'celebrant' ? 'floaty 2.4s ease-in-out infinite' : 'floaty 5s ease-in-out infinite')
    : 'none'
  const tilt = expression === 'curieux' ? 'rotate(-7deg)' : 'none'

  return (
    <div className={`fennec ${className}`} style={{ position: 'relative', width: w, lineHeight: 0 }}>
      <div style={{ animation: bodyAnim, transformOrigin: '50% 80%' }}>
        <svg viewBox="0 0 140 160" width={w} height={h} role="img"
             aria-label="le fennec, ton guide"
             style={{ overflow: 'visible', transform: tilt, transformOrigin: '70px 80px' }}>
          <ellipse cx="70" cy="151" rx="33" ry="6.5" fill="#000" opacity=".22" />
          <path d={TAIL} fill="var(--or)" stroke="var(--encre)" strokeWidth="2" />
          {/* oreilles — frémissent par à-coups */}
          <path d={EAR_L} fill="var(--or)" stroke="var(--encre)" strokeWidth="2.5" strokeLinejoin="round"
                style={{ transformOrigin: '50px 50px', animation: animated ? 'earwiggle 5s ease-in-out infinite' : 'none' }} />
          <path d={EAR_R} fill="var(--or)" stroke="var(--encre)" strokeWidth="2.5" strokeLinejoin="round"
                style={{ transformOrigin: '90px 50px', animation: animated ? 'earwiggle 5s ease-in-out .25s infinite' : 'none' }} />
          <path d={EAR_L_IN} fill={PINK} opacity=".5" />
          <path d={EAR_R_IN} fill={PINK} opacity=".5" />
          <path d={HEAD} fill="var(--creme-clair)" stroke="var(--encre)" strokeWidth="2.5" />
          <path d={MUZZLE} fill="#fff8ec" />
          <Face expression={expression} />
          <Ornaments stage={stage} />
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

// Visage seul, pour les médaillons (en-tête, avatar de profil).
export function FennecFace({ size = 38, stage = 'ne' }) {
  return (
    <svg viewBox="0 0 140 120" width={size} height={size * (120 / 140)} aria-hidden="true">
      <path d="M44 60 L26 20 L62 44 Z" fill="var(--or)" />
      <path d="M96 60 L114 20 L78 44 Z" fill="var(--or)" />
      <path d="M70 38 C98 38 104 62 100 82 C96 102 84 112 70 112 C56 112 44 102 40 82 C36 62 42 38 70 38Z" fill="var(--creme-clair)" />
      {stage === 'complice' && <path d="M52 40 Q70 28 88 40 L84 31 Q70 23 56 31 Z" fill="#6FB7E0" />}
      {stage === 'gardien' && <path d="M50 40 Q70 26 90 40 L86 30 Q70 21 54 30 Z" fill="#A98BD9" />}
      <ellipse cx="58" cy="70" rx="5" ry="6" fill={INK} />
      <ellipse cx="82" cy="70" rx="5" ry="6" fill={INK} />
      <path d="M64 84 H76 L70 91 Z" fill={INK} />
    </svg>
  )
}

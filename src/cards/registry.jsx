// Les cartes-merveilles — registre. Plusieurs cartes par monde, trois raretés
// (commune · rare · légendaire). Chaque carte : identité + illustration centrale
// (recto) + « le fait-merveille » (verso, à retourner).
//
// Les numéros (#02, #07…) suivent le fichier de design là où il les montre.

import { Etoile } from '../components/Sparkle.jsx'

// — Illustrations de recto —
function GlyphArt({ value, color = 'var(--or)', size = 56 }) {
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: size, color, lineHeight: 1, fontWeight: 600 }}>
      {value}
    </span>
  )
}

function ZenonArt() {
  // constellation + étincelle, exactement dans l'esprit du fichier
  return (
    <svg viewBox="0 0 120 120" width="120" aria-hidden="true">
      <g stroke="var(--or)" strokeWidth="1.4" fill="none" opacity=".9">
        <path d="M20 70 L45 50 L70 64 L95 46" />
      </g>
      <g fill="var(--creme-clair)">
        <circle cx="20" cy="70" r="3.5" /><circle cx="45" cy="50" r="3" />
        <circle cx="70" cy="64" r="2.6" /><circle cx="95" cy="46" r="2.2" />
      </g>
      <svg x="38" y="58" width="44" viewBox="0 0 48 24" fill="none" stroke="var(--or)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 12c0-5 5-7 8-3l8 6c3 4 8 2 8-3s-5-7-8-3l-8 6c-3 4-8 2-8-3Z" />
      </svg>
    </svg>
  )
}

function InfiniteArt({ color = 'var(--or)' }) {
  return (
    <svg width="78" viewBox="0 0 48 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"
         aria-hidden="true" style={{ filter: 'drop-shadow(0 0 8px rgba(245,198,107,.6))' }}>
      <path d="M12 12c0-5 5-7 8-3l8 6c3 4 8 2 8-3s-5-7-8-3l-8 6c-3 4-8 2-8-3Z" />
    </svg>
  )
}

// — Glyphes du monde « Les codes secrets » (cyan lunaire + touches d'or) —

// #02 · La clé de César — décaler une lettre : A → D.
function CleCesarArt() {
  return (
    <svg viewBox="0 0 124 60" width="116" aria-hidden="true">
      <text x="20" y="44" textAnchor="middle" fontFamily="var(--font-display)" fontSize="42" fontWeight="600" fill="var(--w-codes)">A</text>
      <path d="M40 30 H82" stroke="var(--or)" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 21 L83 30 L72 39" stroke="var(--or)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="104" y="44" textAnchor="middle" fontFamily="var(--font-display)" fontSize="42" fontWeight="600" fill="var(--creme-clair)">D</text>
    </svg>
  )
}

// #03 · La force brute — une clé, et les 25 essais possibles.
function ForceBruteArt() {
  return (
    <svg viewBox="0 0 124 80" width="112" aria-hidden="true">
      <g stroke="var(--w-codes)" strokeWidth="3" fill="none" strokeLinecap="round">
        <circle cx="34" cy="46" r="15" /><path d="M49 46 H96 M84 46 V58 M96 46 V56" />
      </g>
      <circle cx="34" cy="46" r="5" fill="var(--encre)" />
      <text x="92" y="26" textAnchor="middle" fontFamily="var(--font-display)" fontSize="28" fontWeight="700" fill="var(--or)">25</text>
    </svg>
  )
}

// #04 · L'analyse des fréquences — un histogramme, le E qui domine.
function FrequencesArt() {
  const bars = [46, 32, 24, 17, 12]
  return (
    <svg viewBox="0 0 124 72" width="112" aria-hidden="true">
      <line x1="14" y1="60" x2="110" y2="60" stroke="var(--line-5)" strokeWidth="1.5" />
      {bars.map((h, i) => (
        <rect key={i} x={18 + i * 19} y={60 - h} width="13" height={h} rx="2"
              fill={i === 0 ? 'var(--or)' : 'var(--w-codes)'} opacity={i === 0 ? 1 : 0.85 - i * 0.13} />
      ))}
      <text x="24.5" y={60 - 46 - 5} textAnchor="middle" fontFamily="var(--font-display)" fontSize="17" fontWeight="700" fill="var(--creme-clair)">E</text>
    </svg>
  )
}

// #10 · Le secret partagé — deux couleurs qui se mêlent (Diffie–Hellman).
function SecretPartageArt() {
  return (
    <svg viewBox="0 0 124 80" width="112" aria-hidden="true">
      <g style={{ mixBlendMode: 'screen' }}>
        <circle cx="50" cy="40" r="27" fill="var(--w-codes)" opacity=".8" />
        <circle cx="76" cy="40" r="27" fill="var(--or)" opacity=".75" />
      </g>
      <circle cx="63" cy="40" r="13" fill="#dff3df" opacity=".55" />
    </svg>
  )
}

// #11 · Le cadenas à sens unique — le petit cadenas du Web.
function CadenasArt() {
  return (
    <svg viewBox="0 0 84 96" width="76" aria-hidden="true">
      <path d="M24 46 V32 a18 18 0 0 1 36 0 V46" fill="none" stroke="var(--legendaire)" strokeWidth="5" strokeLinecap="round" />
      <rect x="14" y="46" width="56" height="42" rx="10" fill="none" stroke="var(--or)" strokeWidth="4" />
      <circle cx="42" cy="64" r="6" fill="var(--or)" />
      <path d="M42 64 V76" stroke="var(--or)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// #12 · Le masque jetable — la page brûlée + l'étincelle (le secret parfait).
function MasqueJetableArt() {
  return (
    <svg viewBox="0 0 92 96" width="82" aria-hidden="true">
      <path d="M24 20 H58 L66 28 V80 H24 Z" fill="none" stroke="var(--w-codes)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M31 36 H56 M31 46 H56 M31 56 H49" stroke="var(--w-codes)" strokeWidth="2" opacity=".55" strokeLinecap="round" />
      <path d="M44 80 c-11 -8 -3 -17 1 -23 c2 7 13 8 7 19 c4 -2 5 -7 4 -11 c7 7 4 19 -6 23 c-5 1 -10 -2 -7 -8 Z" fill="var(--or)" />
      <path d="M66 14 l1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5 4.5 -1.5Z" fill="var(--creme-clair)" />
    </svg>
  )
}

// — Glyphes du monde « Le monde des motifs » (céladon + touches d'or) —

// #13 · La symétrie — un papillon de part et d'autre d'un axe-miroir.
function SymetrieArt() {
  return (
    <svg viewBox="0 0 124 84" width="112" aria-hidden="true">
      <line x1="62" y1="6" x2="62" y2="78" stroke="var(--or)" strokeWidth="1.4" strokeDasharray="3 4" opacity=".7" />
      <path d="M62 44 C40 16 12 22 22 44 C12 66 42 70 62 44 Z" fill="var(--w-motifs)" opacity=".9" />
      <path d="M62 44 C84 16 112 22 102 44 C112 66 82 70 62 44 Z" fill="var(--w-motifs)" opacity=".55" />
      <ellipse cx="62" cy="44" rx="2.6" ry="15" fill="var(--creme-clair)" />
      <path d="M62 30 q-5 -9 -12 -11 M62 30 q5 -9 12 -11" stroke="var(--creme-clair)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// #14 · La rosace — un trait répété en tournant : six pétales.
function RosaceArt() {
  return (
    <svg viewBox="0 0 120 120" width="104" aria-hidden="true">
      <g transform="translate(60 60)">
        {Array.from({ length: 6 }, (_, k) => (
          <g key={k} transform={`rotate(${60 * k})`}>
            <ellipse cx="0" cy="-27" rx="8" ry="23" fill="var(--w-motifs)" opacity={k % 2 ? 0.55 : 0.9} />
          </g>
        ))}
        <circle r="9" fill="var(--or)" />
      </g>
    </svg>
  )
}

// #15 · Le zellige — l'étoile à huit branches (khatam), le carreau emblématique.
function ZelligeArt() {
  const star = (R, r, cy) => Array.from({ length: 16 }, (_, k) => {
    const rad = k % 2 ? r : R
    const a = (Math.PI / 180) * (22.5 * k - 90)
    return `${(60 + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 120 96" width="104" aria-hidden="true">
      <polygon points={star(34, 16, 48)} fill="var(--w-motifs)" stroke="var(--or)" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={star(17, 8, 48)} fill="#0c1813" opacity=".5" />
    </svg>
  )
}

// #16 · Penrose — le cerf-volant et la flèche, côte à côte.
function PenroseArt() {
  return (
    <svg viewBox="0 0 124 80" width="112" aria-hidden="true">
      <polygon points="40,12 60,44 40,56 20,44" fill="var(--w-motifs)" stroke="var(--or)" strokeWidth="1.4" strokeLinejoin="round" />
      <polygon points="86,16 102,62 86,50 70,62" fill="var(--or)" stroke="var(--creme-clair)" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

// #17 · Le flocon de Koch — le vrai contour, deux niveaux de détail.
function KochArt() {
  const C = 44
  const R = 34
  const base = [-90, 150, 30].map((d) => { const a = (Math.PI / 180) * d; return [C + R * Math.cos(a), C + R * Math.sin(a)] })
  const rot = (v, d) => { const a = (Math.PI / 180) * d; return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)] }
  const lerp = (p, q, f) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]
  const step = (pts) => {
    const o = []
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]
      const q = pts[(i + 1) % pts.length]
      const b = lerp(p, q, 1 / 3)
      const c = lerp(p, q, 2 / 3)
      const r = rot([c[0] - b[0], c[1] - b[1]], -60)
      o.push(p, b, [b[0] + r[0], b[1] + r[1]], c)
    }
    return o
  }
  let p = base
  for (let i = 0; i < 2; i++) p = step(p)
  const d = `M${p.map((x) => `${x[0].toFixed(1)},${x[1].toFixed(1)}`).join(' L')} Z`
  return (
    <svg viewBox="0 0 88 88" width="92" aria-hidden="true">
      <path d={d} fill="rgba(127,201,168,.28)" stroke="var(--w-motifs)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

// #18 · Le pavage du paradis — l'étincelle au-dessus d'une arche mauresque.
function AlhambraArt() {
  return (
    <svg viewBox="0 0 96 100" width="84" aria-hidden="true">
      <path d="M24 92 V54 a24 24 0 0 1 48 0 V92" fill="none" stroke="var(--w-motifs)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M24 92 v-6 a4 4 0 0 1 8 0 v6 M64 92 v-6 a4 4 0 0 1 8 0 v6" fill="none" stroke="var(--w-motifs)" strokeWidth="2.4" opacity=".7" />
      <path d="M48 8 l2.2 7 7 2.2 -7 2.2 -2.2 7 -2.2 -7 -7 -2.2 7 -2.2Z" fill="var(--or)" style={{ filter: 'drop-shadow(0 0 6px rgba(245,198,107,.6))' }} />
      <circle cx="34" cy="46" r="1.8" fill="var(--or)" opacity=".7" />
      <circle cx="62" cy="46" r="1.8" fill="var(--or)" opacity=".7" />
      <circle cx="48" cy="40" r="1.8" fill="var(--or)" opacity=".7" />
    </svg>
  )
}

// — Le registre —
export const CARDS = {
  'nombres-10n': {
    id: 'nombres-10n', worldId: 'nombres', num: '05', rarity: 'commune',
    name: '10ⁿ', subtitle: 'plus grand que tout',
    Art: () => <GlyphArt value="10ⁿ" size={40} />,
    back: {
      title: 'Les puissances de dix',
      text: "Dix, cent, mille… on ajoute un zéro et tout change d'échelle. Il n'existe aucun « plus grand nombre » : on peut toujours en écrire un de plus.",
    },
  },
  'nombres-sigma': {
    id: 'nombres-sigma', worldId: 'nombres', num: '06', rarity: 'commune',
    name: '∑', subtitle: 'doubler, encore doubler',
    Art: () => <GlyphArt value="∑" size={48} />,
    back: {
      title: 'La somme qui s\'emballe',
      text: "1 + 2 + 4 + 8 + 16… À chaque pas on double. La somme grossit si vite qu'un seul échiquier dépasse tout le blé du monde.",
    },
  },
  'nombres-zenon': {
    id: 'nombres-zenon', worldId: 'nombres', num: '07', rarity: 'rare',
    name: 'Zénon', subtitle: "l'infini dans un seul pas",
    Art: ZenonArt,
    back: {
      title: 'Le paradoxe du presque',
      text: "La puce s'approche pour toujours sans jamais arriver — et pourtant la fleur est juste là. Une infinité de sauts tiennent dans un seul pas.",
    },
  },
  'nombres-aleph': {
    id: 'nombres-aleph', worldId: 'nombres', num: '08', rarity: 'rare',
    name: 'ℵ₀', subtitle: "l'hôtel toujours complet",
    Art: () => <GlyphArt value="ℵ₀" size={46} />,
    back: {
      title: "L'hôtel de Hilbert",
      text: "Un hôtel plein, avec une infinité de chambres, peut toujours accueillir un client de plus : chacun avance d'une chambre. Dans l'infini, il reste de la place.",
    },
  },
  'nombres-infini': {
    id: 'nombres-infini', worldId: 'nombres', num: '09', rarity: 'rare', treasure: true,
    name: '∞', subtitle: 'le trésor du monde',
    Art: () => <InfiniteArt />,
    back: {
      title: "L'infini",
      text: "Ce n'est pas un très grand nombre — c'est l'idée qu'on ne s'arrête jamais. Tu en as fait le tour : compter, doubler, sauter, héberger… toujours encore.",
    },
  },

  // — « Les codes secrets » (cyan lunaire) — le duel entre coder et casser —
  'cle-cesar': {
    id: 'cle-cesar', worldId: 'codes', num: '02', rarity: 'commune',
    name: 'La clé de César', subtitle: 'décaler chaque lettre',
    Art: CleCesarArt,
    back: {
      title: 'La clé de César',
      text: "Le tout premier code secret de l'Histoire : décaler chaque lettre. Simple — mais il a protégé un empire.",
    },
  },
  'force-brute': {
    id: 'force-brute', worldId: 'codes', num: '03', rarity: 'commune',
    name: 'La force brute', subtitle: 'tout essayer, l’un après l’autre',
    Art: ForceBruteArt,
    back: {
      title: 'La force brute',
      text: "César n'a que 25 clés possibles. Un espion patient les essaie toutes — et le perce.",
    },
  },
  'frequences': {
    id: 'frequences', worldId: 'codes', num: '04', rarity: 'rare',
    name: "L'analyse des fréquences", subtitle: 'les lettres se trahissent',
    Art: FrequencesArt,
    back: {
      title: "L'analyse des fréquences",
      text: "Un code cache quelle lettre c'est, pas combien de fois elle revient. En français, le E trahit tout.",
    },
  },
  'secret-partage': {
    id: 'secret-partage', worldId: 'codes', num: '10', rarity: 'rare',
    name: 'Le secret partagé', subtitle: 'un secret à voix haute',
    Art: SecretPartageArt,
    back: {
      title: 'Le secret partagé',
      text: "Deux personnes peuvent se mettre d'accord sur un secret à voix haute, sans que l'espion qui écoute puisse le deviner.",
    },
  },
  'cadenas': {
    id: 'cadenas', worldId: 'codes', num: '11', rarity: 'legendaire',
    name: 'Le cadenas à sens unique', subtitle: 'facile à fermer, presque impossible à ouvrir',
    Art: CadenasArt,
    back: {
      title: 'Le cadenas à sens unique',
      text: "Multiplier deux nombres premiers géants est facile ; les retrouver est presque impossible. C'est ce cadenas qui garde tes secrets en ligne.",
    },
  },
  'masque-jetable': {
    id: 'masque-jetable', worldId: 'codes', num: '12', rarity: 'legendaire', treasure: true,
    name: 'Le masque jetable', subtitle: 'le seul code parfait',
    Art: MasqueJetableArt,
    back: {
      title: 'Le masque jetable',
      text: "Une clé au hasard, aussi longue que le message, utilisée une seule fois : le seul code que personne, jamais, ne pourra casser.",
    },
  },

  // — « Le monde des motifs » (céladon) — l'œil qui voit l'ordre caché —
  'symetrie': {
    id: 'symetrie', worldId: 'motifs', num: '13', rarity: 'commune',
    name: 'La symétrie', subtitle: "une moitié, le reflet de l’autre",
    Art: SymetrieArt,
    back: {
      title: 'La symétrie',
      text: "Quand une moitié est le reflet exact de l'autre. Le papillon, le flocon, ton visage : la symétrie est partout.",
    },
  },
  'rosace': {
    id: 'rosace', worldId: 'motifs', num: '14', rarity: 'commune',
    name: 'La rosace', subtitle: 'un trait qui tourne en ornement',
    Art: RosaceArt,
    back: {
      title: 'La rosace',
      text: "Répète une forme en la faisant tourner autour d'un point, et un simple trait devient tout un ornement.",
    },
  },
  'zellige': {
    id: 'zellige', worldId: 'motifs', num: '15', rarity: 'rare',
    name: 'Le zellige', subtitle: "un seul carreau, à l’infini",
    Art: ZelligeArt,
    back: {
      title: 'Le zellige',
      text: "Un seul carreau, choisi pour s'emboîter à l'infini sans le moindre trou. Les zelliges de tes murs sont de la haute géométrie.",
    },
  },
  'penrose': {
    id: 'penrose', worldId: 'motifs', num: '16', rarity: 'rare',
    name: 'Penrose', subtitle: "l’ordre sans répétition",
    Art: PenroseArt,
    back: {
      title: 'Penrose',
      text: "Deux formes suffisent à couvrir l'infini sans jamais se répéter à l'identique : de l'ordre sans répétition.",
    },
  },
  'koch': {
    id: 'koch', worldId: 'motifs', num: '17', rarity: 'legendaire',
    name: 'Le flocon de Koch', subtitle: 'un contour de longueur infinie',
    Art: KochArt,
    back: {
      title: 'Le flocon de Koch',
      text: "Un contour de longueur infinie autour d'une surface finie. Zoome : la même forme revient sans fin. C'est une fractale.",
    },
  },
  'alhambra': {
    id: 'alhambra', worldId: 'motifs', num: '18', rarity: 'legendaire', treasure: true,
    name: 'Le pavage du paradis', subtitle: 'les 17 façons de paver un mur',
    Art: AlhambraArt,
    back: {
      title: 'Le pavage du paradis',
      text: "Il existe exactement 17 façons de répéter un motif sur un mur. L'Alhambra les contient toutes les 17.",
    },
  },
}

export const getCard = (id) => CARDS[id]
export const allCards = () => Object.values(CARDS)

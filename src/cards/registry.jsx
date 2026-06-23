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
}

export const getCard = (id) => CARDS[id]
export const allCards = () => Object.values(CARDS)

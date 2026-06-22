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

function CesarArt() {
  return (
    <svg viewBox="0 0 120 120" width="118" aria-hidden="true">
      <g stroke="var(--w-codes)" strokeWidth="1.4" fill="none">
        <circle cx="42" cy="50" r="16" /><path d="M52 60 L92 96 M78 82 L90 70 M88 92 L98 82" />
      </g>
      <g fill="#cfeefb"><circle cx="42" cy="50" r="3" /><circle cx="92" cy="96" r="3" /><circle cx="98" cy="82" r="2.4" /></g>
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

  // — Carte préservée du monde des codes (réutilisée dans une prochaine passe) —
  'codes-cesar': {
    id: 'codes-cesar', worldId: 'codes', num: '02', rarity: 'commune',
    name: 'La clé de César', subtitle: 'décaler chaque lettre de 3',
    Art: CesarArt,
    back: {
      title: 'Le premier code secret',
      text: "Jules César décalait chaque lettre de l'alphabet de trois rangs. A devient D, B devient E… Un secret qui tient dans une seule clé.",
    },
  },
}

export const getCard = (id) => CARDS[id]
export const allCards = () => Object.values(CARDS)

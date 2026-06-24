// Le fennec grandit avec les cartes — la TABLE de croissance, source unique.
//
// Sept stades, par nombre TOTAL de cartes gagnées. Chaque stade introduit ses
// propres CALQUES additifs ; un stade rend ses calques PLUS ceux de tous les
// stades inférieurs (cumulatif). On n'enlève jamais rien : revenir n'ajoute que
// de la lumière, jamais de punition, jamais de série ni de jour manqué.
//
// Les calques sont des clés que dessine le fennec (voir Fennec.jsx) :
//   alert         — oreilles dressées, regard plus vif (l'éveil)
//   foulard       — le foulard d'étoiles céleste (look « complice » existant)
//   tailUp        — la queue se relève
//   orbit         — une petite étoile orbite doucement près de lui
//   aura          — un halo chaud très doux dans la nuit
//   foulard2      — une SECONDE étoile rejoint le foulard
//   wise          — des paupières sereines (regard qui sait)
//   constellation — quelques points + lignes ténues tracés au-dessus de sa tête
//   couronne      — la couronne d'améthyste (look « gardien » existant), le sommet

export const STAGES = [
  { id: 'ne',       label: 'nouveau-né',             threshold: 0,  layers: [] },
  { id: 'eveille',  label: 'éveillé',                threshold: 3,  layers: ['alert'] },
  { id: 'complice', label: 'complice',               threshold: 7,  layers: ['foulard'] },
  { id: 'curieux',  label: 'curieux du ciel',        threshold: 12, layers: ['tailUp', 'orbit'] },
  { id: 'veilleur', label: 'veilleur',               threshold: 18, layers: ['aura', 'foulard2'] },
  { id: 'sage',     label: 'sage des merveilles',    threshold: 25, layers: ['wise', 'constellation'] },
  { id: 'gardien',  label: 'gardien des merveilles', threshold: 30, layers: ['couronne'] },
]

const ORDER = STAGES.map((s) => s.id)

// Le stade ATTEINT pour un nombre de cartes (le plus haut seuil franchi).
export function fennecStageFor(count) {
  let id = STAGES[0].id
  for (const s of STAGES) { if (count >= s.threshold) id = s.id }
  return id
}

// Tous les calques cumulés jusqu'au stade donné (inclus) — dans l'ordre de croissance.
export function layersFor(stageId) {
  const upto = ORDER.indexOf(stageId)
  const idx = upto < 0 ? 0 : upto
  const out = []
  for (let i = 0; i <= idx; i++) out.push(...STAGES[i].layers)
  return out
}

// Position d'un stade dans l'échelle (pour comparer « plus haut que »).
export function stageRank(stageId) {
  const i = ORDER.indexOf(stageId)
  return i < 0 ? 0 : i
}

export const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.id, s.label]))

// La ligne MANUSCRITE du guide (voix Caveat) au passage d'un seuil — par stade
// atteint. Chaude, jamais à propos des jours ni de l'absence. « ne » n'apparaît
// pas : on n'y « grandit » jamais (c'est le départ).
export const GROWTH_LINE = {
  eveille:  'je m’éveille avec toi…',
  complice: 'nous voilà complices, toi et moi.',
  curieux:  'le ciel commence à m’appeler…',
  veilleur: 'je veille à tes côtés, dans la nuit.',
  sage:     'chaque merveille me rend un peu plus sage.',
  gardien:  'gardien de tes merveilles — pour toujours.',
}

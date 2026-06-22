// Registry of every collectible wonder card, keyed by id.
// A world declares the card ids it grants (its `cards` array); the engine awards
// them on solve, and the Collection looks them up here.
//
// To add a card: add an entry below, then list its id in the world's `cards`.
//   color     — one of the names in src/theme.js (tints the card header)
//   rarity    — short label shown on the card
//   sym       — the big glyph on the card header
//   fact      — short line, shown in the Collection
//   factLong  — longer line, shown in the big reveal (falls back to `fact`)
export const CARDS = {
  cesar: {
    id: 'cesar',
    world: 'codes',
    color: 'blue',
    rarity: 'Rare',
    sym: 'A→D',
    title: 'Le chiffre de César',
    fact: "Le tout premier code secret de l'Histoire.",
    factLong:
      "Le tout premier code secret de l'Histoire. Tout simple... et pourtant il a protégé un empire entier.",
  },
  pi: {
    id: 'pi',
    world: 'infinity',
    color: 'purple',
    rarity: 'Rare',
    sym: 'π',
    title: 'Le nombre π',
    fact:
      "Ses décimales continuent à l'infini, sans jamais se répéter. On en connaît des milliers de milliards de chiffres, et personne n'a trouvé la fin.",
  },
  zellige: {
    id: 'zellige',
    world: 'motifs',
    color: 'pink',
    rarity: 'Rare',
    sym: '❖',
    title: 'La symétrie',
    fact:
      "Quand un motif est identique de chaque côté d'une ligne, on dit qu'il a une symétrie. Les zelliges marocains en sont remplis — certains cachent des symétries dans tous les sens.",
  },
  des: {
    id: 'des',
    world: 'hasard',
    color: 'amber',
    rarity: 'Rare',
    sym: '7',
    title: 'Le hasard a ses préférés',
    fact:
      "Avec deux dés, le 7 sort plus souvent que tout autre nombre : il y a six façons de faire 7, mais une seule de faire 2 ou 12. Le hasard n'est pas si hasardeux.",
  },
  mobius: {
    id: 'mobius',
    world: 'formes',
    color: 'teal',
    rarity: 'Épique',
    sym: '↺',
    title: 'Le ruban de Möbius',
    fact:
      "Une boucle de papier avec une demi-torsion n'a qu'un seul côté et un seul bord. Suis sa surface du doigt : tu reviens au départ sans jamais franchir le bord.",
  },
}

export const getCard = (id) => CARDS[id]

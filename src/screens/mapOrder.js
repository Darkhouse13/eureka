// L'ordre de PROGRESSION des mondes sur la carte. Le monde actif / à commencer
// MÈNE (il occupe l'index 0 — le premier point que l'œil atteint : le plus haut
// en pile, l'entrée gauche en panorama) et les mondes verrouillés « bientôt »
// ferment la marche. On NE se fie PAS à l'ordre figé du registre : ainsi la
// carte reste juste si un statut change plus tard (le jour où « codes » sera
// déverrouillé, il quittera de lui-même la queue de la file).
//
// Tri STABLE : à rang égal, l'ordre d'origine (celui de worldsView / WORLDS,
// l'ordre narratif) départage — donc aucun réarrangement surprise entre deux
// mondes de même statut.

// Rang par statut : plus petit = plus tôt sur le chemin. Le « en cours » d'abord,
// puis « à commencer », puis « terminé », et enfin les « bientôt » verrouillés.
export const STATUS_RANK = { 'in-progress': 0, available: 1, complete: 2, bientot: 3 }

const rankOf = (status) => STATUS_RANK[status] ?? STATUS_RANK.available

// view : worldsView (tableau d'entrées { world, status, … }). Renvoie une COPIE
// triée dans l'ordre de progression, sans muter l'entrée.
export function progressionOrder(view) {
  return view
    .map((entry, i) => ({ entry, i }))
    .sort((a, b) => rankOf(a.entry.status) - rankOf(b.entry.status) || a.i - b.i)
    .map((x) => x.entry)
}

// Numéro AFFICHÉ d'un monde (« Monde 01 ») — son rang 1-based dans le MÊME ordre
// de progression qui ordonne la carte. Source unique : ainsi le monde de tête lit
// toujours « 01 », et les numéros se réécrivent d'eux-mêmes quand un statut change
// (le jour où « codes » mène, il devient « 01 ») — sans trou ni doublon. On ne se
// fie donc PLUS à un champ figé : le numéro suit la position réelle, point.
export function displayNumberOf(view, worldId) {
  const idx = progressionOrder(view).findIndex((e) => e.world.id === worldId)
  return idx < 0 ? null : String(idx + 1).padStart(2, '0')
}

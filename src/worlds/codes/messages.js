// Messages clairs pour les jeux du monde des codes. Choisis au hasard à chaque
// partie (rejouabilité).
// IMPORTANT : MAJUSCULES A–Z et espaces uniquement — pas d'accents, pas
// d'apostrophes, pas de ponctuation — car les chiffrements ne déplacent que A–Z
// (voir lib/caesar.js). On les garde joyeux, tendres et de bon âge.

// — César (rung 1) + force brute (rung 2) : messages interceptés à déchiffrer —
export const MESSAGES = [
  'BIENVENUE DANS UN MONDE PLUS GRAND',
  'LES MATHS SONT PARTOUT AUTOUR DE TOI',
  'TU VIENS DE CASSER TON PREMIER CODE',
  'BRAVO PETITE EXPLORATRICE DES NOMBRES',
  'CHAQUE ENIGME CACHE UNE MERVEILLE',
  'UN ESPRIT CURIEUX TROUVE TOUJOURS',
  'RENDEZ VOUS A MINUIT PRES DE LA FONTAINE',
  'JULES CESAR SERAIT TRES FIER DE TOI',
  'LE PLUS GRAND TRESOR EST LA CURIOSITE',
  'ROME NE SEST PAS FAITE EN UN JOUR',
]

// — Force brute (rung 2) : messages COURTS (≤ 20 lettres) pour que les 25 essais
//   tiennent en lignes lisibles, même sur un téléphone. Ton d'espionnage, joyeux. —
export const BRUTE_MESSAGES = [
  'ATTAQUE A LAUBE',
  'LE TRESOR EST CACHE',
  'RENDEZ VOUS A MINUIT',
  'GARDE BIEN LE SECRET',
  'LA VOIE EST LIBRE',
  'FUYEZ VERS LE NORD',
  'LA CLE EST SOUS LA PIERRE',
  'PERSONNE NE NOUS SUIT',
]

// — Analyse des fréquences (rung 3) : messages dont la lettre la plus fréquente
//   est bien le E (vérifié), pour que la leçon « le E trahit tout » soit juste. —
export const FREQ_MESSAGES = [
  'COMPTE LES LETTRES ET LE CODE SE FISSURE',
  'CHAQUE LETTRE LAISSE UNE TRACE SECRETE',
  'RIEN NE RESISTE A QUI SAIT COMPTER LES SIGNES',
  'LE PLUS FREQUENT TRAHIT TOUJOURS LE SECRET',
]

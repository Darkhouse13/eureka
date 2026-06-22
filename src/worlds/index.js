// Le registre des mondes — le cœur de l'architecture enfichable.
//
// Une échelle de défis : un monde est un tableau ORDONNÉ de défis. Chaque défi a
// sa boucle à quatre temps (l'étincelle → l'idée → le jeu → la découverte) et
// accorde une ou plusieurs cartes. Le moteur possède la carte, l'écran d'échelle,
// la boucle, la célébration, l'attribution des cartes, la progression, la mémoire.
// Un monde ne fournit que du CONTENU + des jeux.
//
// Forme d'un monde :
//   id          string         identifiant unique (clé de progression)
//   name        string         nom complet
//   shortName   [string,…]     libellé sur deux lignes pour la carte
//   numero      string         « 02 » — cosmétique, l'ordre dans l'app
//   tagline     string         une ligne sous le titre
//   blurb       string         présentation du monde (écran d'échelle)
//   status      'ready'|'bientot'
//   challenges  Challenge[]    barreaux ordonnés
//
// Forme d'un défi :
//   id, index, title, kind ('challenge'|'treasure')
//   etincelle { lead, text }                 — temps 1
//   idee      { lead, title, Demo?, text? }  — temps 2 (démo inline facultative)
//   Game      Comp(props:{ onSolve })        — temps 3 (appelle onSolve())
//   decouverte{ lead, title, text }          — temps 4
//   cards     [cardId,…]                      — cartes accordées à la résolution
//
// Pour ajouter le prochain monde : créer un dossier, exporter une définition, et
// l'enregistrer ici. Les jeux préservés (César, symétrie, dés, Möbius, zoom)
// deviendront les barreaux des mondes « bientôt ».

import nombres from './nombres/index.jsx'
import { codes, motifs, hasard, formes } from './stubs.js'

// Ordre d'affichage sur la carte. « Les nombres sans fin » d'abord : c'est le
// monde ouvert et complet de cette passe ; les autres suivent, « bientôt ».
export const WORLDS = [nombres, codes, motifs, hasard, formes]

export const getWorld = (id) => WORLDS.find((w) => w.id === id)

// Défis « réels » (hors trésor) d'un monde.
export const realChallenges = (w) => (w.challenges || []).filter((c) => c.kind !== 'treasure')

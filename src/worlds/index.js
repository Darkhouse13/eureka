// The world registry — the heart of the pluggable architecture.
// Adding a world is: create a folder under src/worlds/, default-export a world
// definition, and add it to this array. The engine renders everything else.
//
// World definition shape:
//   id          string   unique id (also the localStorage key for completion)
//   name        string   shown on the map and in the loopbar
//   icon        Comp     a React icon component (see src/icons.jsx)
//   color       string   theme colour name (see src/theme.js)
//   status      string   'available' (playable now) | 'soon' (locked placeholder)
//   cards       string[] wonder-card ids this world grants on solve
//   createSession?  ()=>data   optional per-play data shared across the loop steps
//   etincelle   Comp     "l'étincelle" content  — props: { session, onNext }
//   idee        Comp     "l'idée" content        — props: { session, onNext }
//   Game        Comp     "le jeu"                — props: { session, onSolve }
//   decouverte  Comp     "la découverte" content — props: { session, onFinish }
//
// A 'soon' world only needs id/name/icon/color/status — the loop never opens.
import codes from './codes/index.js'
import infinity from './infinity/index.js'
import motifs from './motifs/index.js'
import hasard from './hasard/index.js'
import formes from './formes/index.js'

export const WORLDS = [codes, infinity, motifs, hasard, formes]

export const getWorld = (id) => WORLDS.find((w) => w.id === id)

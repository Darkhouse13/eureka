// « Le monde des motifs » (céladon) — le troisième monde, bâti de bout en bout sur
// le moteur déjà éprouvé. Une échelle de 5 défis + 1 trésor : apprendre à voir les
// règles cachées derrière ce qui semble simplement joli — du miroir d'un papillon
// aux zelliges des murs, jusqu'aux formes qui contiennent l'infini. Chaque défi a
// sa boucle à quatre temps (l'étincelle → l'idée → le jeu → la découverte) et
// accorde une carte. Le trésor se réclame une fois les 5 défis franchis.
import Miroir from './games/Miroir.jsx'
import Rosace from './games/Rosace.jsx'
import Pavage from './games/Pavage.jsx'
import Penrose from './games/Penrose.jsx'
import Koch from './games/Koch.jsx'
import './games/motifs-games.css'

const challenges = [
  {
    id: 'symetrie', index: 1, title: 'Le miroir', kind: 'challenge',
    etincelle: {
      lead: 'imagine…',
      text: "Un papillon, un flocon, ton propre visage… Pourquoi certaines choses sont-elles si agréables à regarder ? Souvent, c'est qu'un côté répond exactement à l'autre.",
    },
    idee: {
      lead: 'l’idée, tout simplement',
      title: 'Le reflet',
      text: "La symétrie, c'est quand une moitié est le reflet exact de l'autre, de chaque côté d'une ligne — comme dans un miroir.",
    },
    Game: Miroir,
    decouverte: {
      lead: 'la merveille',
      title: 'La symétrie',
      text: "Tu viens de dompter le miroir. Mais que se passe-t-il avec PLUSIEURS miroirs à la fois ?",
    },
    cards: ['symetrie'],
  },
  {
    id: 'rosace', index: 2, title: 'Les quatre miroirs', kind: 'challenge',
    etincelle: {
      lead: 'et si…',
      text: "Un miroir, c'est joli. Mais imagine quatre miroirs, qui se renvoient l'image encore et encore, tout autour d'un même point.",
    },
    idee: {
      lead: 'l’idée',
      title: 'Tourner pour multiplier',
      text: "En répétant un motif autour d'un point — en le faisant tourner — une seule petite forme devient une rosace. C'est la symétrie tournante.",
    },
    Game: Rosace,
    decouverte: {
      lead: 'la merveille',
      title: 'La rosace',
      text: "D'un seul geste, tout un ornement. Et ces ornements… tu les as déjà vus mille fois, autour de toi.",
    },
    cards: ['rosace'],
  },
  {
    id: 'zellige', index: 3, title: 'Le secret du zellige', kind: 'challenge',
    etincelle: {
      lead: 'regarde autour de toi…',
      text: "Sur les murs, les fontaines, les portes — ces mosaïques faites de mille morceaux colorés. Les artisans qui les créent sont, sans toujours le dire, parmi les plus grands géomètres du monde.",
    },
    idee: {
      lead: 'l’idée',
      title: 'Le pavage',
      text: "Un motif qui se répète à l'infini dans toutes les directions, sans jamais laisser de trou ni se chevaucher : c'est un pavage. Tout le secret tient dans une seule tuile, choisie pour s'emboîter parfaitement.",
    },
    Game: Pavage,
    decouverte: {
      lead: 'la merveille',
      title: 'Le zellige',
      text: "Ce que tu viens de faire, des artisans le font depuis mille ans, à la main, sur les murs autour de toi. La géométrie la plus profonde était déjà là, sous tes yeux.",
    },
    cards: ['zellige'],
  },
  {
    id: 'penrose', index: 4, title: 'Le pavage impossible', kind: 'challenge',
    etincelle: {
      lead: 'vraiment ?',
      text: "Tous les pavages se répètent… non ? On l'a cru très longtemps. Puis quelqu'un a trouvé un motif qui remplit l'infini sans jamais se répéter à l'identique.",
    },
    idee: {
      lead: 'l’idée',
      title: "L’ordre sans répétition",
      text: "Avec seulement deux formes bien choisies — le « cerf-volant » et la « flèche » — on peut couvrir tout l'espace. Mais le dessin ne se répète jamais exactement. De l'ordre, sans répétition.",
    },
    Game: Penrose,
    decouverte: {
      lead: 'la merveille',
      title: 'Penrose',
      text: "Un motif infini qui ne se répète jamais. On en a même retrouvé la trace dans des mosaïques anciennes, des siècles avant qu'un mathématicien le « découvre ».",
    },
    cards: ['penrose'],
  },
  {
    id: 'koch', index: 5, title: 'La forme sans fin', kind: 'challenge',
    etincelle: {
      lead: 'imagine…',
      text: "Dessine un triangle. Sur chaque côté, ajoute un triangle plus petit. Sur chacun des nouveaux côtés, encore un plus petit. Et si tu ne t'arrêtais jamais ?",
    },
    idee: {
      lead: 'l’idée',
      title: 'La fractale',
      text: "Une figure qui contient des détails à toutes les échelles : zoome, et tu retrouves la même forme, encore et encore, pour toujours. C'est une fractale — un contour de longueur infinie autour d'une surface qui, elle, reste finie.",
    },
    Game: Koch,
    decouverte: {
      lead: 'la merveille',
      title: 'Le flocon de Koch',
      text: "Un tour de périmètre infini, autour d'une surface que tu pourrais peindre. L'infini n'est pas seulement dans les nombres — il se cache aussi dans les formes. (souviens-toi des nombres sans fin…)",
    },
    cards: ['koch'],
  },
  {
    id: 'tresor', index: 6, title: 'Le pavage du paradis', kind: 'treasure',
    decouverte: {
      lead: 'le trésor',
      title: 'Le pavage du paradis',
      text: "Il existe exactement 17 façons différentes de répéter un motif à l'infini sur un mur — pas une de plus. Et dans un seul palais, l'Alhambra, des artisans les ont toutes les 17 gravées dans la pierre, il y a des siècles. Maintenant, tu vois ce que presque tout le monde traverse sans remarquer.",
    },
    cards: ['alhambra'],
  },
]

const motifs = {
  id: 'motifs',
  name: 'Le monde des motifs',
  shortName: ['Le monde', 'des motifs'],
  tagline: "L'œil qui voit l'ordre caché.",
  blurb: "Cinq défis pour apprendre à voir les règles cachées derrière ce qui semble simplement joli — du miroir d'un papillon aux zelliges de tes murs, jusqu'aux formes qui contiennent l'infini.",
  status: 'ready',
  challenges,
}

export default motifs

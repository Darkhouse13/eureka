// « Les nombres sans fin » (ambre) — un monde implémenté de bout en bout.
// Une échelle de défis, chacun avec sa boucle à quatre temps
// (l'étincelle → l'idée → le jeu → la découverte) et ses cartes.

import PlusGrand from './games/PlusGrand.jsx'
import GrainBle from './games/GrainBle.jsx'
import SautPuce from './games/SautPuce.jsx'
import HotelHilbert from './games/HotelHilbert.jsx'

// — démo inline de l'idée du « saut de la puce » : 1/2 + 1/4 + 1/8 … → 1 —
function HalvesDemo() {
  const widths = [100, 50, 25, 12.5, 6]
  const labels = ['1/2', '1/4', '1/8', '1/16', '1/32']
  return (
    <div className="demo-halves">
      {widths.map((w, i) => (
        <div key={i} className="demo-halves-bar" style={{ width: w + '%' }}>{i < 2 ? labels[i] : ''}</div>
      ))}
      <div className="demo-halves-tail"><span>⋯</span> toujours plus petit, jamais zéro</div>
    </div>
  )
}

// — démo inline du doublement : 1, 2, 4, 8, 16 —
function DoubleDemo() {
  return (
    <div className="demo-double">
      {[1, 2, 4, 8, 16].map((v, i) => (
        <div key={i} className="demo-double-step" style={{ height: 14 + i * 14 }}><span>{v}</span></div>
      ))}
    </div>
  )
}

const challenges = [
  {
    id: 'plus-grand', index: 1, title: 'Plus grand que tout', kind: 'challenge',
    etincelle: {
      lead: 'imagine…',
      text: 'Tu comptes : un, deux, trois… Existe-t-il un nombre si grand qu’on ne puisse plus rien écrire après lui ?',
    },
    idee: {
      lead: 'l’idée, tout simplement',
      title: 'Un outil tout simple : ×1000 à chaque tape.',
      text: 'Tu ajoutes trois zéros d’un coup — mille fois plus grand. Encore, et encore. Regarde jusqu’où tu peux monter.',
    },
    predict: {
      question: 'Existe-t-il un plus grand nombre de tous — un nombre qu’on ne pourra plus jamais dépasser ?',
      options: [
        { id: 'oui', label: 'Oui, forcément' },
        { id: 'non', label: 'Non, jamais' },
      ],
      correctId: 'non',
      revealRight: 'Bien vu ! Quel que soit ton nombre, on peut toujours faire plus grand. Il n’y a pas de dernier nombre.',
      revealWrong: 'C’est ce que presque tout le monde imagine ! Mais regarde : quel que soit le nombre, on peut toujours faire plus grand. Il n’existe pas de plus grand nombre.',
    },
    Game: PlusGrand,
    decouverte: {
      lead: 'tu as découvert…',
      title: 'Compter ne s’arrête jamais.',
      text: 'Les nombres n’ont pas de fin : pour chaque géant, il en existe un plus grand encore. L’infini commence là, dans un simple « et un de plus ».',
    },
    cards: ['nombres-10n'],
  },
  {
    id: 'grain-double', index: 2, title: 'Le grain de blé qui double', kind: 'challenge',
    etincelle: {
      lead: 'imagine…',
      text: 'Un sage demande au roi un grain sur la 1re case d’un échiquier, deux sur la 2e, quatre sur la 3e… en doublant. Le roi accepte en riant. A-t-il eu tort ?',
    },
    idee: {
      lead: 'l’idée, tout simplement',
      title: 'Doubler, encore doubler. 1, 2, 4, 8, 16…',
      Demo: DoubleDemo,
      text: 'Chaque pas vaut tous les précédents réunis, plus un. La somme grimpe à une vitesse vertigineuse.',
    },
    predict: {
      question: 'On pose 1 grain sur la 1ʳᵉ case, 2 sur la 2ᵉ, 4 sur la 3ᵉ… en doublant jusqu’à la 64ᵉ case. Au total, ça fait assez de grains pour remplir quoi ?',
      options: [
        { id: 'sac', label: 'Un grand sac' },
        { id: 'piece', label: 'Une pièce' },
        { id: 'pays', label: 'Un pays entier' },
        { id: 'terre', label: 'Plus que la Terre entière peut en produire' },
      ],
      correctId: 'terre',
      revealRight: 'Tu l’avais senti ! Sur la dernière case seule, plus de grains que sur toutes les précédentes réunies — et au total, plus que toute la Terre n’en a jamais fait pousser.',
      revealWrong: 'Surprise ! Ça commence par un seul grain… mais doubler, encore et encore, devient gigantesque. Au total : plus de grains que toute la Terre n’en a jamais produit.',
    },
    Game: GrainBle,
    decouverte: {
      lead: 'tu as découvert…',
      title: 'En doublant, on dépasse tout.',
      text: 'Sur la 64e case, il faudrait plus de blé qu’il n’en a jamais poussé sur la Terre. Le doublement est la croissance la plus folle qui soit.',
    },
    cards: ['nombres-sigma'],
  },
  {
    id: 'saut-puce', index: 3, title: 'Le saut de la puce', kind: 'challenge',
    etincelle: {
      lead: 'imagine…',
      text: 'Tu marches vers une fleur. À chaque pas, tu n’en franchis que la moitié. Y arriveras-tu ?',
    },
    idee: {
      lead: 'l’idée, tout simplement',
      title: 'La moitié, puis la moitié de la moitié… à l’infini.',
      Demo: HalvesDemo,
      text: 'Additionne-les toutes, l’une après l’autre : la barre du chemin se remplit, de moitié en moitié.',
    },
    predict: {
      question: 'La puce saute à chaque fois la moitié du chemin qu’il lui reste jusqu’à la fleur. En sautant ainsi, encore et encore… va-t-elle atteindre la fleur ?',
      options: [
        { id: 'oui', label: 'Oui, elle finira par y arriver' },
        { id: 'non', label: 'Non, jamais tout à fait' },
        { id: 'milieu', label: 'Elle s’arrêtera au milieu' },
      ],
      correctId: 'non',
      revealRight: 'Exactement. Elle s’approche, encore et encore… mais il reste toujours une moitié de ce qui reste. Jamais tout à fait arrivée.',
      revealWrong: 'Regarde bien : elle s’approche si près qu’on dirait qu’elle touche… mais il reste toujours une moitié d’une moitié. Une infinité de sauts, et jamais tout à fait la fleur.',
    },
    Game: SautPuce,
    decouverte: {
      lead: 'tu as découvert…',
      title: 'L’infini tient dans un seul pas.',
      text: 'La puce s’approche pour toujours sans jamais arriver — et pourtant la fleur est juste là. C’est le paradoxe de Zénon : l’infini se cache dans le tout petit.',
    },
    cards: ['nombres-zenon'],
  },
  {
    id: 'hotel-hilbert', index: 4, title: 'L’hôtel toujours complet', kind: 'challenge',
    etincelle: {
      lead: 'imagine…',
      text: 'Un hôtel a une infinité de chambres, toutes occupées. Un voyageur arrive tard dans la nuit. « Désolé, c’est complet »… ou peut-être pas ?',
    },
    idee: {
      lead: 'l’idée, tout simplement',
      title: 'Une infinité de chambres — chacune a une suivante.',
      text: 'Elles sont numérotées 1, 2, 3… sans fin, toutes occupées. Mais après chaque chambre, il y en a toujours une autre. Garde ça en tête.',
    },
    predict: {
      question: 'L’hôtel a une infinité de chambres — et elles sont TOUTES occupées. Un nouveau voyageur arrive. Peut-on lui trouver une chambre ?',
      options: [
        { id: 'non', label: 'Non, c’est complet' },
        { id: 'oui', label: 'Oui, on peut faire de la place' },
      ],
      correctId: 'oui',
      revealRight: 'Bravo ! Chacun avance d’une chambre : la 1 → 2, la 2 → 3… et la chambre 1 se libère. Complet, et pourtant de la place !',
      revealWrong: 'C’est ce qu’on croit tous — mais regarde : chacun avance d’une chambre, la 1 → 2, la 2 → 3… et la chambre 1 se libère pour le nouveau. Avec l’infini, « complet » ne veut plus dire « plus de place » !',
    },
    Game: HotelHilbert,
    decouverte: {
      lead: 'tu as découvert…',
      title: 'Dans l’infini, il y a toujours de la place.',
      text: 'L’hôtel de Hilbert : « infini + 1 », c’est encore l’infini. Une idée si étrange qu’elle a occupé les plus grands mathématiciens.',
    },
    cards: ['nombres-aleph'],
  },
  {
    id: 'tresor', index: 5, title: 'La carte rare « ∞ »', kind: 'treasure',
    decouverte: {
      lead: 'le trésor du monde',
      title: 'L’infini',
      text: 'Tu as fait le tour : compter sans fin, doubler, sauter pour toujours, héberger l’impossible. La carte ∞ rejoint ta collection — le trésor des nombres sans fin.',
    },
    cards: ['nombres-infini'],
  },
]

const nombres = {
  id: 'nombres',
  name: 'Les nombres sans fin',
  shortName: ['Les nombres', 'sans fin'],
  tagline: 'Là où compter ne s’arrête jamais.',
  blurb: 'Cinq défis qui montent vers le vertige : compter sans fin, doubler, l’infini qui se touche presque. Au bout, une carte rare.',
  status: 'ready',
  challenges,
}

export default nombres

// « Les codes secrets » (cyan lunaire) — le second monde, bâti de bout en bout sur
// le moteur déjà éprouvé. Une échelle de 5 défis + 1 trésor : le grand duel entre
// ceux qui CACHENT et ceux qui PERCENT, de Jules César au cadenas que personne ne
// sait ouvrir. Au bout, le seul code parfait. Chaque défi a sa boucle à quatre temps
// (l'étincelle → l'idée → le jeu → la découverte) et accorde une carte.
import { caesar } from '../../lib/caesar.js'
import Cesar from './games/Cesar.jsx'
import ForceBrute from './games/ForceBrute.jsx'
import Frequences from './games/Frequences.jsx'
import SecretPartage from './games/SecretPartage.jsx'
import Cadenas from './games/Cadenas.jsx'
import './games/codes-games.css'

// — démo inline de l'idée de César : décaler de 3 (A→D, B→E…) —
function ShiftDemo() {
  const letters = ['A', 'B', 'C', 'D', 'E']
  return (
    <div className="cg-demo">
      <div className="cg-demo-row">{letters.map((l) => <span key={l} className="cg-demo-chip">{l}</span>)}</div>
      <div className="cg-demo-arrow">↓ décalage de 3</div>
      <div className="cg-demo-row">{letters.map((l, i) => <span key={i} className="cg-demo-chip is-on">{caesar(l, 3)}</span>)}</div>
    </div>
  )
}

const challenges = [
  {
    id: 'cle-cesar', index: 1, title: 'La clé de César', kind: 'challenge',
    etincelle: {
      lead: 'imagine…',
      text: "Il y a 2000 ans, Jules César envoyait des ordres secrets à son armée. Si un messager était capturé, l'ennemi ne trouvait que ça : du charabia. Son secret ? Une astuce toute simple.",
    },
    idee: {
      lead: 'l’idée, tout simplement',
      title: 'Décale les lettres',
      Demo: ShiftDemo,
      text: "Décale chaque lettre du même nombre dans l'alphabet. Avec un décalage de 3 : A→D, B→E, C→F… Et quand tu dépasses Z, tu reviens à A. Pour lire, tu décales dans l'autre sens.",
    },
    Game: Cesar,
    decouverte: {
      lead: 'la merveille',
      title: 'La clé de César',
      text: "Tu viens de casser le plus vieux code de l'Histoire. Mais un code aussi simple… cache une faiblesse.",
    },
    cards: ['cle-cesar'],
  },
  {
    id: 'force-brute', index: 2, title: 'L’attaque par force brute', kind: 'challenge',
    etincelle: {
      lead: 'et si…',
      text: "Un espion intercepte ton message. Il ne connaît pas ta clé. Bloqué ? Pas du tout — et il va te montrer pourquoi César ne suffit pas.",
    },
    idee: {
      lead: 'l’idée',
      title: 'Tout essayer',
      text: "Le code de César n'a que 25 décalages possibles. Quand il y en a si peu, on peut tous les essayer, l'un après l'autre, jusqu'à ce qu'une ligne veuille dire quelque chose.",
    },
    Game: ForceBrute,
    decouverte: {
      lead: 'la merveille',
      title: 'La force brute',
      text: "Vingt-cinq essais, et le secret tombe. Pour résister, il va falloir bien plus que 25 clés…",
    },
    cards: ['force-brute'],
  },
  {
    id: 'alphabet-melange', index: 3, title: 'L’alphabet mélangé', kind: 'challenge',
    etincelle: {
      lead: 'incassable ?',
      text: "Et si, au lieu de décaler, on mélangeait tout l'alphabet au hasard ? Le nombre de clés devient plus grand que tous les grains de sable de toutes les plages de la Terre. Là, l'espion est fichu… non ?",
    },
    idee: {
      lead: 'l’idée',
      title: 'Les lettres se trahissent',
      text: "Un code peut cacher quelle lettre se cache derrière un symbole — mais pas combien de fois elle revient. En français, certaines reviennent sans cesse : le E d'abord, puis A, S, I, N, T… Compte-les, et le code se fissure.",
    },
    Game: Frequences,
    decouverte: {
      lead: 'la merveille',
      title: "L’analyse des fréquences",
      text: "Même un code aux milliards de milliards de clés laisse une trace : la fréquence des lettres. Pendant des siècles, c'est ainsi qu'on a tout déchiffré.",
    },
    cards: ['frequences'],
  },
  {
    id: 'secret-partage', index: 4, title: 'Le secret partagé', kind: 'challenge',
    etincelle: {
      lead: 'le problème…',
      text: "Pour te lire, ton amie a besoin de la clé. Mais si tu la lui envoies, l'espion qui écoute la reçoit aussi. Comment se mettre d'accord sur un secret… quand quelqu'un écoute tout ?",
    },
    idee: {
      lead: 'l’idée',
      title: 'Le tour des couleurs',
      text: "On part d'une couleur publique, que tout le monde voit. Chacune garde une couleur secrète. Vous mélangez, vous échangez les mélanges à voix haute, puis chacune rajoute sa couleur secrète. Vous obtenez la même couleur finale… que l'espion, lui, n'arrive pas à refaire.",
    },
    Game: SecretPartage,
    decouverte: {
      lead: 'la merveille',
      title: 'Le secret partagé',
      text: "Deux personnes viennent de se fabriquer un secret commun, à voix haute, devant un espion impuissant. C'est exactement comme ça que ton téléphone se met d'accord avec un site web.",
    },
    cards: ['secret-partage'],
  },
  {
    id: 'cadenas', index: 5, title: 'Le cadenas à sens unique', kind: 'challenge',
    etincelle: {
      lead: 'le secret du petit cadenas',
      text: "Le petit cadenas en haut de l'écran quand tu vas sur un site : il garde tes mots de passe et tes messages avec un code que personne, sur toute la Terre, ne sait casser. Son secret ? Des nombres premiers géants.",
    },
    idee: {
      lead: 'l’idée',
      title: 'La porte à sens unique',
      text: "Multiplier deux énormes nombres premiers : facile, instantané. Les retrouver à partir du résultat : si difficile que tous les ordinateurs du monde réunis y passeraient plus de temps que l'âge de l'univers. Facile dans un sens, presque impossible dans l'autre — une porte à sens unique.",
    },
    Game: Cadenas,
    decouverte: {
      lead: 'la merveille',
      title: 'Le cadenas à sens unique',
      text: "Voilà le code qui protège le monde entier — bâti sur des nombres premiers. Et les nombres premiers… cachent bien d'autres mystères. (un monde t'attend.)",
    },
    cards: ['cadenas'],
  },
  {
    id: 'tresor', index: 6, title: 'Le masque jetable', kind: 'treasure',
    decouverte: {
      lead: 'le trésor',
      title: 'Le masque jetable',
      text: "Il existe un seul code que personne, jamais, ne pourra casser : une clé au hasard, aussi longue que le message, utilisée une seule fois puis brûlée. Les vrais espions en portaient sur eux. Le secret parfait — il est à toi.",
    },
    cards: ['masque-jetable'],
  },
]

const codes = {
  id: 'codes',
  name: 'Les codes secrets',
  shortName: ['Les codes', 'secrets'],
  tagline: 'La course entre ceux qui cachent et ceux qui percent.',
  blurb: "Six défis dans le grand duel entre les codes et ceux qui les brisent — de Jules César au cadenas que personne au monde ne sait ouvrir. Au bout : le seul code parfait.",
  status: 'ready',
  challenges,
}

export default codes

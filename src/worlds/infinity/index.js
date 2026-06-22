// "Les nombres sans fin" — a number line you can zoom into forever.
// Same pluggable shape as "Les codes secrets": it supplies content + a Game and
// nothing else; the engine handles the loop, the card reward and persistence.
import { InfinityIcon } from '../../icons.jsx'
import { Etincelle, Idee, Decouverte } from './steps.jsx'
import InfinityGame from './Game.jsx'
import './infinity.css'

export default {
  id: 'infinity',
  name: 'Les nombres sans fin',
  icon: InfinityIcon,
  color: 'purple',
  status: 'available',
  cards: ['pi'],
  etincelle: Etincelle,
  idee: Idee,
  Game: InfinityGame,
  decouverte: Decouverte,
}

// "Les formes impossibles" — the Möbius strip, a shape with a single side.
// Same pluggable shape as the other worlds: it supplies content + a Game and
// nothing else; the engine handles the loop, the card reward and persistence.
import { Cube } from '../../icons.jsx'
import { Etincelle, Idee, Decouverte } from './steps.jsx'
import FormesGame from './Game.jsx'
import './formes.css'

export default {
  id: 'formes',
  name: 'Les formes impossibles',
  icon: Cube,
  color: 'teal',
  status: 'available',
  cards: ['mobius'],
  etincelle: Etincelle,
  idee: Idee,
  Game: FormesGame,
  decouverte: Decouverte,
}

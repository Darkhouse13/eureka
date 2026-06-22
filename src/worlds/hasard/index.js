// "Le grand hasard" — why two dice love the number 7.
// Same pluggable shape as the other worlds: it supplies content + a Game and
// nothing else; the engine handles the loop, the card reward and persistence.
import { Dice } from '../../icons.jsx'
import { Etincelle, Idee, Decouverte } from './steps.jsx'
import HasardGame from './Game.jsx'
import './hasard.css'

export default {
  id: 'hasard',
  name: 'Le grand hasard',
  icon: Dice,
  color: 'amber',
  status: 'available',
  cards: ['des'],
  etincelle: Etincelle,
  idee: Idee,
  Game: HasardGame,
  decouverte: Decouverte,
}

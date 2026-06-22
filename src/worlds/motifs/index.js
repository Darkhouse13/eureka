// "Le monde des motifs" — symmetry through Moroccan zellige.
// Same pluggable shape as the other worlds: it supplies content + a Game and
// nothing else; the engine handles the loop, the card reward and persistence.
import { Pattern } from '../../icons.jsx'
import { Etincelle, Idee, Decouverte } from './steps.jsx'
import MotifsGame from './Game.jsx'
import './motifs.css'

export default {
  id: 'motifs',
  name: 'Le monde des motifs',
  icon: Pattern,
  color: 'pink',
  status: 'available',
  cards: ['zellige'],
  etincelle: Etincelle,
  idee: Idee,
  Game: MotifsGame,
  decouverte: Decouverte,
}

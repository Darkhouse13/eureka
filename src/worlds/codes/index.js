// "Les codes secrets" — the first fully-implemented world and the template for
// every future one. It supplies content + a Game; the engine does the rest.
import { Lock } from '../../icons.jsx'
import { Etincelle, Idee, Decouverte } from './steps.jsx'
import CodesGame from './CodesGame.jsx'
import { makeSession } from './session.js'
import './codes.css'

export default {
  id: 'codes',
  name: 'Les codes secrets',
  icon: Lock,
  color: 'blue',
  status: 'available',
  cards: ['cesar'],
  createSession: makeSession,
  etincelle: Etincelle,
  idee: Idee,
  Game: CodesGame,
  decouverte: Decouverte,
}

// Per-play data for "Les codes secrets", shared across all four loop steps:
// a random secret message and a random shift, so no two plays are identical.
// The encrypted text is shown in l'étincelle and decoded in le jeu.
import { caesar } from '../../lib/caesar.js'
import { pick, randInt } from '../../lib/random.js'
import { MESSAGES } from './messages.js'

export function makeSession() {
  const plain = pick(MESSAGES)
  const key = randInt(4, 12) // the shift that solves the puzzle
  return { plain, key, enc: caesar(plain, key) }
}

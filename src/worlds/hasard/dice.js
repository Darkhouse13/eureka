// Small helpers for "Le grand hasard". Kept local to the world so it stays fully
// self-contained.

export const SUMS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// Many rolls so the triangular shape is unmistakable on every run. The exact
// bars still wobble run to run — that variance is part of the lesson.
export const ROLLS = 500

// The ordered dice pairs (d1, d2) that add up to `s`. 7 has six of them; 2 and
// 12 have only one. This count is the whole reason 7 wins.
export const pairsForSum = (s) => {
  const out = []
  for (let d1 = 1; d1 <= 6; d1++) {
    const d2 = s - d1
    if (d2 >= 1 && d2 <= 6) out.push([d1, d2])
  }
  return out
}

const rollDie = () => 1 + Math.floor(Math.random() * 6)

// Roll two fair dice `ROLLS` times and tally the sums into a { sum: count } map.
// No cherry-picking: every batch is exactly what the dice gave. The 7 isn't
// guaranteed to be the single tallest bar — but with this many rolls the middle
// sums clearly tower over the extremes, every time. The honest variance is the
// point: a kid who later rolls 100 dice and sees 6 edge out 7 shouldn't feel lied
// to. The reveal speaks about the *shape*, not a fixed winner.
export const rollBatch = () => {
  const counts = {}
  SUMS.forEach((s) => (counts[s] = 0))
  for (let i = 0; i < ROLLS; i++) counts[rollDie() + rollDie()]++
  return counts
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

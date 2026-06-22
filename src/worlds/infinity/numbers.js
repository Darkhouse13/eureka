// Small helpers for "Les nombres sans fin": French number formatting and the
// interval maths the number line needs. Kept local to the world so it stays
// fully self-contained — adding this world needed no engine change.

// Round to d decimal places (keeps the displayed grid tidy and float-safe at
// the shallow depths the game reaches).
export const roundTo = (n, d) => {
  const f = 10 ** d
  return Math.round(n * f) / f
}

// French style: a comma decimal separator, exactly d decimals (0 → "0", 1 → "1").
export const fr = (n, d) => n.toFixed(d).replace('.', ',')

// The nearest value on the d-decimal grid that is *strictly* between a and b,
// so any placement the player makes is always valid (the ends are excluded).
export const clampInside = (v, a, b, d) => {
  const step = 10 ** -d
  const lo = roundTo(a + step, d)
  const hi = roundTo(b - step, d)
  return Math.min(hi, Math.max(lo, roundTo(v, d)))
}

// Middle of [a, b], rounded to d decimals and kept strictly inside.
export const midpoint = (a, b, d) => clampInside((a + b) / 2, a, b, d)

// Matches the engine's confetti: snap instead of animating when asked.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

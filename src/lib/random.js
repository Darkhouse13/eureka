// Tiny helpers for the replayability touch. Browser Math.random is fine here.
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Inclusive integer in [lo, hi].
export const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))

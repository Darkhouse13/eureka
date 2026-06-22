// Petits utilitaires visuels : champ d'étoiles déterministe (même graine →
// même ciel, stable entre rendus) et détection de prefers-reduced-motion.

// Reproduit le makeStars du fichier de design (PRNG congruentiel, déterministe).
export function makeStars(n, seed = 1) {
  let s = seed * 9301 + 49297;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push({
      top: (r() * 100).toFixed(2) + '%',
      left: (r() * 100).toFixed(2) + '%',
      size: +(0.8 + r() * 2.6).toFixed(2),
      delay: +(r() * 6).toFixed(2),
      dur: +(2.6 + r() * 4.5).toFixed(2),
      op: +(0.3 + r() * 0.7).toFixed(2),
    });
  }
  return a;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

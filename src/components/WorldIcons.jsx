// Icônes des mondes — des figures à relier, tracées comme des constellations.
// Chaque icône prend `size` et `stroke` (sombre dans la planète claire, coloré ailleurs).

export function IconCodes({ size = 34, stroke = '#0E1430' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="4" /><path d="M11 11l8 8M16 16l3-3M19 19l2-2" />
    </svg>
  )
}

export function IconNombres({ size = 42, stroke = '#3a2606' }) {
  // l'infini, en un seul trait
  return (
    <svg width={size} height={size * (24 / 48)} viewBox="0 0 48 24" fill="none" stroke={stroke}
         strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M12 12c0-5 5-7 8-3l8 6c3 4 8 2 8-3s-5-7-8-3l-8 6c-3 4-8 2-8-3Z" />
    </svg>
  )
}

export function IconMotifs({ size = 36, stroke = '#0c3326' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
         strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

export function IconHasard({ size = 34, stroke = '#4a1421' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
         strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="9" cy="9" r="1.4" fill={stroke} /><circle cx="15" cy="15" r="1.4" fill={stroke} />
      <circle cx="15" cy="9" r="1.4" fill={stroke} /><circle cx="9" cy="15" r="1.4" fill={stroke} />
    </svg>
  )
}

export function IconFormes({ size = 36, stroke = '#2a1f44' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
         strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 4 18h16L12 3Z" /><path d="M9 13h9M7.5 16l4.5-8" />
    </svg>
  )
}

export const WORLD_ICONS = {
  codes: IconCodes,
  nombres: IconNombres,
  motifs: IconMotifs,
  hasard: IconHasard,
  formes: IconFormes,
}

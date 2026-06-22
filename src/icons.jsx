// All icons as small React components, ported 1:1 from the prototype's ICONS.
// They draw with `currentColor`, so size and colour come from CSS on the parent
// (e.g. `.tile-ic svg { width: 26px }`). Each spreads `props` so callers can
// add a className when needed.

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Lock = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2.2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

// Renamed to avoid clashing with the JS global `Infinity`.
export const InfinityIcon = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M6 8.5c-2.2 0-3.5 1.6-3.5 3.5S3.8 15.5 6 15.5c3.4 0 4.6-7 8-7 2.2 0 3.5 1.6 3.5 3.5S16.2 15.5 14 15.5c-3.4 0-4.6-7-8-7z" />
  </svg>
)

export const Pattern = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1.6" />
    <rect x="13" y="4" width="7" height="7" rx="1.6" />
    <rect x="4" y="13" width="7" height="7" rx="1.6" />
    <rect x="13" y="13" width="7" height="7" rx="1.6" />
  </svg>
)

export const Dice = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3.2" />
    <circle cx="9" cy="9" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15" cy="9" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="9" cy="15" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15" cy="15" r="1.3" fill="currentColor" stroke="none" />
  </svg>
)

export const Cube = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
    <path d="M4 7.5l8 4.5 8-4.5" />
    <path d="M12 12v9" />
  </svg>
)

export const Star = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M12 3l2.6 5.4 5.9.9-4.3 4.1 1 5.9L12 16.6 6.8 19.3l1-5.9L3.5 9.3l5.9-.9z" />
  </svg>
)

export const MapIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
    <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
)

export const User = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.2 4-6 8-6s8 1.8 8 6" />
  </svg>
)

export const Check = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12l4.5 4.5L19 7" />
  </svg>
)

export const Play = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M8 5v14l11-7z" />
  </svg>
)

// Visually identical to Lock; kept as a separate name for the map's "locked"
// trailing icon so intent stays clear at call sites.
export const LockSmall = Lock

export const Back = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
)

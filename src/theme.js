// Maps a world/card `color` name to the matching CSS custom properties.
// `l` = light (soft fill), `d` = dark (text), `m` = main (the colour itself).
// A world picks one of these names; the engine themes the loop with it and
// wonder cards tint their header from it.
export const COLORS = {
  blue: { l: 'var(--blue-l)', d: 'var(--blue-d)', m: 'var(--blue)' },
  purple: { l: 'var(--purple-l)', d: 'var(--purple-d)', m: 'var(--purple)' },
  pink: { l: 'var(--pink-l)', d: '#A02659', m: 'var(--pink)' },
  amber: { l: 'var(--amber-l)', d: 'var(--amber-d)', m: 'var(--amber)' },
  teal: { l: 'var(--teal-l)', d: '#0C6B56', m: 'var(--teal)' },
}

export const colorOf = (name) => COLORS[name] || COLORS.blue

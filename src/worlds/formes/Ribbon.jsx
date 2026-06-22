// The stylized 2D Möbius ribbon, shared by l'idée's demo and le jeu.
// It is deliberately NOT a 3D model: the half-twist is represented by drawing the
// band as a thick figure-eight (a single closed curve with one self-crossing),
// which reads as "a twisted loop" and lets an ant walk the whole thing and come
// back to the start — the "one side" idea, in flat 2D.
import { forwardRef } from 'react'

// The centerline: one closed figure-eight in a 220×120 box. Both the band (a
// thick stroke along it) and the "cut down the middle" line run along this curve.
export const FIG8 =
  'M110,60 C80,16 20,16 20,60 C20,104 80,104 110,60 C140,16 200,16 200,60 C200,104 140,104 110,60 Z'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// pathRef is forwarded to the (invisible) centerline path so callers can measure
// it with getPointAtLength to drive the ant. `showCut` draws the dashed mid-line.
// `traced` highlights the whole centerline (used as the reduced-motion fallback
// for the ant walk: the full path is shown statically instead of animating).
export const MobiusRibbon = forwardRef(function MobiusRibbon(
  { showCut = false, traced = false, children },
  pathRef,
) {
  return (
    <svg className="fms-svg" viewBox="0 0 220 120" role="img" aria-label="Un ruban de Möbius stylisé">
      <defs>
        <linearGradient id="fms-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23C7A6" />
          <stop offset="1" stopColor="#0C6B56" />
        </linearGradient>
      </defs>
      {/* the ribbon band */}
      <path d={FIG8} fill="none" stroke="url(#fms-grad)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      {/* a soft highlight down the band, for depth */}
      <path d={FIG8} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".3" />
      {/* the traced path (reduced-motion fallback for the ant walk) */}
      {traced && (
        <path d={FIG8} fill="none" stroke="#FFE9A8" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 6" />
      )}
      {/* the dashed "cut down the middle" line */}
      {showCut && (
        <path className="fms-cutline" d={FIG8} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="7 7" />
      )}
      {/* invisible centerline the ant follows (always present so getPointAtLength works) */}
      <path ref={pathRef} d={FIG8} fill="none" stroke="none" />
      {children}
    </svg>
  )
})

// The result of cutting the ribbon down the middle: a single, larger loop (drawn
// bigger than the figure-eight, with one twist kept for character). A stylized
// morph target — not physically exact, which the brief allows.
export function ResultLoop() {
  return (
    <svg className="fms-svg" viewBox="0 0 220 120" role="img" aria-label="Une seule boucle, plus grande">
      <defs>
        <linearGradient id="fms-grad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23C7A6" />
          <stop offset="1" stopColor="#0C6B56" />
        </linearGradient>
      </defs>
      {/* one big loop with a single twist pinch on the right */}
      <path
        d="M150,60 C150,18 16,18 16,60 C16,102 150,102 150,60 C150,40 178,40 178,60 C178,80 150,80 150,60 Z"
        fill="none" stroke="url(#fms-grad2)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M150,60 C150,18 16,18 16,60 C16,102 150,102 150,60 C150,40 178,40 178,60 C178,80 150,80 150,60 Z"
        fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".3"
      />
    </svg>
  )
}

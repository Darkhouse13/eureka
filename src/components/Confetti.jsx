// App-owned confetti. The shell renders <ConfettiLayer/> inside the app frame;
// any component fires a burst with useConfetti(). Respects reduced motion.
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import './Confetti.css'

const ConfettiContext = createContext({ fire: () => {}, pieces: [] })

export const useConfetti = () => useContext(ConfettiContext).fire

const COLORS = ['#6C5CE0', '#2E6FD6', '#F0A92B', '#E45A92', '#15A98A']
let uid = 0

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ConfettiProvider({ children }) {
  const [pieces, setPieces] = useState([])
  const reduced = useRef(prefersReducedMotion())

  const fire = useCallback(() => {
    if (reduced.current) return
    const batch = []
    let maxMs = 0
    for (let i = 0; i < 36; i++) {
      const dur = 1.6 + Math.random() * 1.3
      const delay = Math.random() * 0.25
      maxMs = Math.max(maxMs, (dur + delay + 0.5) * 1000)
      batch.push({
        id: ++uid,
        style: {
          left: `${Math.random() * 100}%`,
          background: COLORS[i % COLORS.length],
          animation: `fall ${dur}s linear ${delay}s forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        },
      })
    }
    const ids = new Set(batch.map((b) => b.id))
    setPieces((prev) => [...prev, ...batch])
    setTimeout(() => setPieces((prev) => prev.filter((p) => !ids.has(p.id))), maxMs)
  }, [])

  return (
    <ConfettiContext.Provider value={{ fire, pieces }}>
      {children}
    </ConfettiContext.Provider>
  )
}

export function ConfettiLayer() {
  const { pieces } = useContext(ConfettiContext)
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <i key={p.id} style={p.style} />
      ))}
    </div>
  )
}

// Small transient message ("bientôt", "merveille ajoutée"). The shell renders
// <ToastLayer/> inside the app frame; components call useToast().show(msg).
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import './Toast.css'

const ToastContext = createContext({ show: () => {}, toast: null })

export const useToast = () => {
  const { show } = useContext(ToastContext)
  return { show }
}

let tid = 0

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null) // { id, msg, visible }
  const timers = useRef([])

  const show = useCallback((msg) => {
    const id = ++tid
    // Clear any pending hide/remove from a previous toast.
    timers.current.forEach(clearTimeout)
    timers.current = []

    setToast({ id, msg, visible: false })
    requestAnimationFrame(() =>
      setToast((t) => (t && t.id === id ? { ...t, visible: true } : t)),
    )
    timers.current.push(
      setTimeout(() => setToast((t) => (t && t.id === id ? { ...t, visible: false } : t)), 1900),
      setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2200),
    )
  }, [])

  return (
    <ToastContext.Provider value={{ show, toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function ToastLayer() {
  const { toast } = useContext(ToastContext)
  if (!toast) return null
  return (
    <div className={`toast${toast.visible ? ' show' : ''}`} role="status" aria-live="polite">
      {toast.msg}
    </div>
  )
}

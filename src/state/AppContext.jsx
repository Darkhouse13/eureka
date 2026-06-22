// Persisted app state: the fox's name, earned cards, completed worlds, and the
// last world opened. Loaded from localStorage on boot and saved on every change.
import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_STATE, loadState, saveState } from '../lib/storage.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadState() ?? DEFAULT_STATE)

  useEffect(() => {
    saveState(data)
  }, [data])

  const value = {
    ...data,

    setFoxName: (name) =>
      setData((d) => ({ ...d, foxName: name })),

    // Idempotent: awarding the same card twice never duplicates it.
    awardCards: (ids = []) =>
      setData((d) => {
        const set = new Set(d.cards)
        ids.forEach((id) => set.add(id))
        return { ...d, cards: [...set] }
      }),

    completeWorld: (id) =>
      setData((d) =>
        d.completed.includes(id) ? d : { ...d, completed: [...d.completed, id] },
      ),

    setLastOpened: (id) =>
      setData((d) => ({ ...d, lastOpened: id })),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}

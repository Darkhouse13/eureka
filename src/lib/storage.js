// All progress lives on the device. No accounts, no network, no tracking.
const KEY = 'eureka.v1'

export const DEFAULT_STATE = {
  foxName: '',      // empty => first run, show Welcome
  cards: [],        // earned wonder-card ids
  completed: [],    // completed world ids
  lastOpened: null, // last world id opened
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    // Be defensive: merge over defaults so older/partial saves never crash.
    return {
      ...DEFAULT_STATE,
      ...data,
      cards: Array.isArray(data.cards) ? data.cards : [],
      completed: Array.isArray(data.completed) ? data.completed : [],
    }
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private mode, quota). Failing to persist
    // should never break the experience.
  }
}

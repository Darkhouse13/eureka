// Tout l'état vit sur l'appareil. Aucun compte, aucun réseau, aucun pistage.
// Schéma v2 (l'échelle des défis). Migration douce depuis v1 (le nom du guide).
const KEY = 'eureka.v2'
const KEY_V1 = 'eureka.v1'

export const DEFAULT_STATE = {
  version: 2,
  guideName: '',          // '' => première ouverture, on montre l'accueil « nomme ton guide »
  childName: null,        // optionnel, local — par défaut aucun (« exploratrice de minuit »)
  cards: {},              // { [cardId]: dateGain(ms) }
  progress: {},           // { [worldId]: { done: {[challengeId]:true}, last: challengeId|null } }
  lastOpened: null,       // { worldId, challengeId } | null
  seen: {},               // { [challengeId]: true } — défis déjà ouverts (pour la pastille NOUVEAU)
  sound: { enabled: true, music: false },  // effets activés, musique coupée par défaut
}

function migrateFromV1() {
  try {
    const raw = localStorage.getItem(KEY_V1)
    if (!raw) return null
    const v1 = JSON.parse(raw)
    return { ...clone(DEFAULT_STATE), guideName: typeof v1.foxName === 'string' ? v1.foxName : '' }
  } catch {
    return null
  }
}

function clone(o) { return JSON.parse(JSON.stringify(o)) }

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return migrateFromV1()
    const data = JSON.parse(raw)
    return {
      ...clone(DEFAULT_STATE),
      ...data,
      cards: isObj(data.cards) ? data.cards : {},
      progress: isObj(data.progress) ? data.progress : {},
      seen: isObj(data.seen) ? data.seen : {},
      sound: { ...DEFAULT_STATE.sound, ...(isObj(data.sound) ? data.sound : {}) },
    }
  } catch {
    return null
  }
}

function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v) }

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Stockage indisponible (mode privé, quota) — ne doit jamais casser l'expérience.
  }
}

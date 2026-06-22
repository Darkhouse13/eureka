// Le cerveau du moteur. Charge l'état depuis localStorage, le sauve à chaque
// changement, expose les mutations et tous les sélecteurs dérivés :
// statut des mondes, déverrouillage des défis, cible « ce soir », stade du fennec.
// Bien-être : aucune série, aucun jour manqué, aucun compte à rebours. Le retour
// n'est récompensé que par de l'ajout.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_STATE, loadState, saveState } from '../lib/storage.js'
import { WORLDS, getWorld, realChallenges } from '../worlds/index.js'
import { allCards } from '../cards/registry.jsx'
import { sound } from '../audio/sound.js'

const AppContext = createContext(null)

// Stade de croissance du fennec selon le nombre de cartes (additif, jamais punitif).
export function fennecStageFor(count) {
  if (count >= 30) return 'gardien'
  if (count >= 3) return 'complice'
  return 'ne'
}
const STAGE_LABEL = { ne: 'nouveau-né', complice: 'complice', gardien: 'gardien des merveilles' }

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadState() ?? DEFAULT_STATE)

  useEffect(() => { saveState(data) }, [data])

  // Synchronise les préférences sonores (au démarrage et à chaque changement).
  useEffect(() => { sound.setPrefs(data.sound) }, [data.sound])

  // — mutations —
  const setGuideName = (name) => setData((d) => ({ ...d, guideName: name }))
  const setChildName = (name) => setData((d) => ({ ...d, childName: name || null }))

  const awardCards = (ids = []) => setData((d) => {
    const cards = { ...d.cards }
    let t = Date.now()
    ids.forEach((id) => { if (!cards[id]) cards[id] = t++ })
    return { ...d, cards }
  })

  const markChallengeDone = (worldId, challengeId) => setData((d) => {
    const prev = d.progress[worldId] || { done: {}, last: null }
    return {
      ...d,
      progress: { ...d.progress, [worldId]: { done: { ...prev.done, [challengeId]: true }, last: challengeId } },
    }
  })

  const setLastOpened = (worldId, challengeId) => setData((d) => ({ ...d, lastOpened: { worldId, challengeId } }))
  const markSeen = (challengeId) => setData((d) => (d.seen[challengeId] ? d : { ...d, seen: { ...d.seen, [challengeId]: true } }))
  const setSound = (partial) => setData((d) => ({ ...d, sound: { ...d.sound, ...partial } }))

  // — dérivations —
  const cardCount = Object.keys(data.cards).length
  const fennecStage = fennecStageFor(cardCount)

  // Déverrouillage séquentiel + statut, pour un monde donné.
  const worldProgress = (world) => {
    const done = data.progress[world.id]?.done || {}
    const rungs = world.challenges || []
    const real = realChallenges(world)
    const allRealDone = real.length > 0 && real.every((c) => done[c.id])
    const isUnlocked = (ch, i) => {
      if (ch.kind === 'treasure') return allRealDone
      if (i === 0) return true
      const prev = rungs[i - 1]
      return !!done[prev.id]
    }
    const rungsDone = rungs.filter((c) => done[c.id]).length
    const rungsTotal = rungs.length
    let next = null
    rungs.forEach((ch, i) => { if (!next && !done[ch.id] && isUnlocked(ch, i)) next = ch })
    const isNew = world.status === 'ready' && rungs.some((ch, i) => isUnlocked(ch, i) && !done[ch.id] && !data.seen[ch.id])
    let status = 'bientot'
    if (world.status === 'ready') {
      status = rungsTotal > 0 && rungsDone === rungsTotal ? 'complete' : rungsDone > 0 ? 'in-progress' : 'available'
    }
    return { done, rungs, rungsDone, rungsTotal, next, isNew, status, isUnlocked }
  }

  const worldsView = useMemo(() => WORLDS.map((w) => ({ world: w, ...worldProgress(w) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.progress, data.seen])

  // Cible « ce soir » : reprendre là où on était, sinon le premier défi disponible.
  const tonight = useMemo(() => {
    // priorité au dernier ouvert s'il reste à faire
    const lo = data.lastOpened
    if (lo) {
      const w = getWorld(lo.worldId)
      if (w && w.status === 'ready') {
        const wp = worldProgress(w)
        const ch = (w.challenges || []).find((c) => c.id === lo.challengeId)
        if (ch && !wp.done[ch.id]) {
          return { has: true, worldId: w.id, world: w, challenge: ch, fresh: !data.seen[ch.id] }
        }
      }
    }
    for (const w of WORLDS) {
      if (w.status !== 'ready') continue
      const wp = worldProgress(w)
      if (wp.next) return { has: true, worldId: w.id, world: w, challenge: wp.next, fresh: !data.seen[wp.next.id] }
    }
    return { has: false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.progress, data.seen, data.lastOpened])

  // Collection groupée par monde (cartes enregistrées des mondes prêts).
  const collection = useMemo(() => {
    const earnedIds = Object.keys(data.cards).sort((a, b) => data.cards[a] - data.cards[b])
    const byWorld = {}
    allCards().forEach((c) => {
      const w = getWorld(c.worldId)
      if (!w || w.status !== 'ready') return
      ;(byWorld[c.worldId] ||= []).push(c)
    })
    const total = Object.values(byWorld).reduce((n, arr) => n + arr.length, 0)
    const earnedCount = earnedIds.filter((id) => allCards().some((c) => c.id === id && getWorld(c.worldId)?.status === 'ready')).length
    const latestId = earnedIds[earnedIds.length - 1] || null
    return { earnedIds, byWorld, total, earnedCount, latestId }
  }, [data.cards])

  const value = {
    // état brut
    guideName: data.guideName,
    childName: data.childName,
    greetName: data.guideName || 'ton guide',
    cards: data.cards,
    sound: data.sound,
    // dérivé
    cardCount, fennecStage, fennecStageLabel: STAGE_LABEL[fennecStage],
    worldsView, tonight, collection,
    hasCard: (id) => !!data.cards[id],
    // mutations
    setGuideName, setChildName, awardCards, markChallengeDone, setLastOpened, markSeen, setSound,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

import { useQuery } from '@tanstack/react-query'
import { getAllObjects, mapObjects } from '@/lib/novostoyApi'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }
const SNAPSHOT_SIZE = 100
const INTERACTION_EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'scroll', 'keydown']

const getSnapshotKey = (deal) => `catalog-snapshot-v2-${deal}`

// Resolves immediately on first user interaction or after `timeoutMs`, preventing heavy JSON parsing from blocking mobile LCP/TBT
export const waitForInteractiveOrIdle = (timeoutMs = 3500) => {
  if (typeof window === 'undefined') return Promise.resolve()

  return new Promise((resolve) => {
    let settled = false

    const cleanup = () => {
      clearTimeout(timer)
      INTERACTION_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, handleInteract, { capture: true })
      })
    }

    const done = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }

    const handleInteract = () => done()

    const timer = setTimeout(done, timeoutMs)
    INTERACTION_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleInteract, { passive: true, capture: true })
    })
  })
}

// Snapshot of the freshest objects: shows the sorted catalog immediately while the full feed syncs
export const readSnapshot = (deal) => {
  try {
    const raw = localStorage.getItem(getSnapshotKey(deal))
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // Storage unavailable or corrupt: skip cached snapshot
  }
  return undefined
}

const writeSnapshot = (deal, items) => {
  const slimItems = items
    .slice(0, SNAPSHOT_SIZE)
    .map(({ description, images, agent_phones, address_full, source_url, flat, ...cardFields }) => cardFields)
  try {
    localStorage.setItem(getSnapshotKey(deal), JSON.stringify(slimItems))
  } catch {
    // Storage unavailable or full: snapshot is only an optimisation
  }
}

export const fetchFullCatalog = async (deal) => {
  const sellType = SELL_TYPE_BY_DEAL[deal]

  try {
    const res = await fetch(`/api/catalog?deal=${encodeURIComponent(deal || 'sale')}`)
    if (res.ok) {
      const items = await res.json()
      if (Array.isArray(items) && items.length > 0) {
        writeSnapshot(deal, items)
        return items
      }
    }
  } catch {
    // Fallback to direct API scan if serverless endpoint is unavailable
  }

  const allItems = await getAllObjects(sellType ? { sell_type: sellType } : {})
  const items = mapObjects(allItems)
  writeSnapshot(deal, items)
  return items
}

export const useCatalogObjects = (deal) =>
  useQuery({
    queryKey: ['novostoy-objects', deal],
    queryFn: async () => {
      const cachedSeed = readSnapshot(deal)
      if (cachedSeed && cachedSeed.length > 0) {
        await waitForInteractiveOrIdle(1500)
      }
      return fetchFullCatalog(deal)
    },
    placeholderData: () => readSnapshot(deal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

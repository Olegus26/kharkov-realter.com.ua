import { useQuery } from '@tanstack/react-query'
import { getAllObjects, mapObjects } from '@/lib/novostoyApi'
import { INITIAL_CATALOG_SEED } from '@/data/initialCatalogSeed'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }
const SNAPSHOT_SIZE = 100

const getSnapshotKey = (deal) => `catalog-snapshot-v2-${deal}`

// Snapshot of the freshest objects: shows the sorted catalog immediately while the full feed syncs
const readSnapshot = (deal) => {
  try {
    const raw = localStorage.getItem(getSnapshotKey(deal))
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // Storage unavailable or corrupt: fall back to bundled newest-sorted seed
  }
  return INITIAL_CATALOG_SEED[deal] || undefined
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
      // Yield briefly so the frame-1 LCP card image gets network priority over the full JSON payload
      await new Promise((resolve) => setTimeout(resolve, 150))
      return fetchFullCatalog(deal)
    },
    placeholderData: () => readSnapshot(deal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

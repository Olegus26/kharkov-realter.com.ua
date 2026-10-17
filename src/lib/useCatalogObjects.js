import { useQuery } from '@tanstack/react-query'
import { getAllObjects, mapObjects } from '@/lib/novostoyApi'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }
const SNAPSHOT_SIZE = 100

const getSnapshotKey = (deal) => `catalog-snapshot-${deal}`

// Snapshot of the freshest objects from the previous visit: it lets the catalog and the home page
// show the right order immediately while the whole database is loading
const readSnapshot = (deal) => {
  try {
    return JSON.parse(localStorage.getItem(getSnapshotKey(deal))) || undefined
  } catch {
    return undefined
  }
}

const writeSnapshot = (deal, items) => {
  const slimItems = items.slice(0, SNAPSHOT_SIZE).map(({ description, images, agent_phones, ...cardFields }) => cardFields)
  try {
    localStorage.setItem(getSnapshotKey(deal), JSON.stringify(slimItems))
  } catch {
    // Storage is unavailable or full: the snapshot is only an optimisation
  }
}

export const useCatalogObjects = (deal) => useQuery({
  queryKey: ['novostoy-objects', deal],
  queryFn: async () => {
    const sellType = SELL_TYPE_BY_DEAL[deal]
    const allItems = await getAllObjects(sellType ? { sell_type: sellType } : {})
    const items = mapObjects(allItems)
    writeSnapshot(deal, items)
    return items
  },
  placeholderData: () => readSnapshot(deal),
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
  refetchOnMount: false,
  refetchOnWindowFocus: false,
})

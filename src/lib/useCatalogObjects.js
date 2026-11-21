import { useQuery } from '@tanstack/react-query'
import { getAllObjects, getInitialObjects, mapObjects } from '@/lib/novostoyApi'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }
const SNAPSHOT_SIZE = 100

const getSnapshotKey = (deal) => `catalog-snapshot-${deal}`

// Snapshot of the freshest objects from the previous visit: it lets the catalog and the home page
// show the right order immediately while the database is loading
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

export const useCatalogObjects = (deal, { loadFull = false } = {}) => {
  const sellType = SELL_TYPE_BY_DEAL[deal]

  // Fast initial fetch (~400ms across 3 parent types) unblocks first paint and LCP
  const initialQuery = useQuery({
    queryKey: ['novostoy-objects-initial', deal],
    queryFn: async () => {
      const initialItems = await getInitialObjects(sellType)
      const mapped = mapObjects(initialItems)
      writeSnapshot(deal, mapped)
      return mapped
    },
    placeholderData: () => readSnapshot(deal),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // Full database scan runs only once the user searches, filters, browses map, or paginates
  const fullQuery = useQuery({
    queryKey: ['novostoy-objects', deal],
    queryFn: async () => {
      const allItems = await getAllObjects(sellType ? { sell_type: sellType } : {})
      const items = mapObjects(allItems)
      writeSnapshot(deal, items)
      return items
    },
    enabled: loadFull,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const data = fullQuery.data && fullQuery.data.length > 0
    ? fullQuery.data
    : (initialQuery.data || [])

  return {
    data,
    isLoading: initialQuery.isLoading && data.length === 0,
    isFetching: initialQuery.isFetching || fullQuery.isFetching,
    error: fullQuery.error || initialQuery.error,
  }
}

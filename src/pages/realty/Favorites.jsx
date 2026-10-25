import { useMemo, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Heart, Trash2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard from '@/components/realty/PropertyCard'
import { getObjects, mapObject } from '@/lib/novostoyApi'
import { useFavorites } from '@/lib/FavoritesContext'
import SeoMeta from '@/components/seo/SeoMeta'

const getDeclension = (count) => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod100 >= 11 && mod100 <= 19) return 'об\'єктів'
  if (mod10 === 1) return 'об\'єкт'
  if (mod10 >= 2 && mod10 <= 4) return 'об\'єкти'
  return 'об\'єктів'
}

const readLocalSnapshot = (key) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}

const FavoritesPage = () => {
  const { favorites, favoriteItems, saveFavoriteItem, removeFavorite } = useFavorites()
  const queryClient = useQueryClient()

  const cachedPropertiesMap = useMemo(() => {
    const map = new Map()

    // 1. Source: favorites local storage items
    Object.values(favoriteItems || {}).forEach((item) => {
      if (item?.id) map.set(String(item.id), item)
    })

    // 2. Source: localStorage catalog snapshots
    const saleSnapshot = readLocalSnapshot('catalog-snapshot-sale')
    const rentSnapshot = readLocalSnapshot('catalog-snapshot-rent')
    ;[...saleSnapshot, ...rentSnapshot].forEach((item) => {
      if (item?.id && !map.has(String(item.id))) {
        map.set(String(item.id), item)
      }
    })

    // 3. Source: React Query active caches
    const saleCache = queryClient.getQueryData(['novostoy-objects', 'sale']) || []
    const rentCache = queryClient.getQueryData(['novostoy-objects', 'rent']) || []
    const featuredCache = queryClient.getQueryData(['novostoy-objects-featured']) || []
    ;[...saleCache, ...rentCache, ...featuredCache].forEach((item) => {
      if (item?.id && !map.has(String(item.id))) {
        map.set(String(item.id), item)
      }
    })

    return map
  }, [favoriteItems, queryClient])

  // Find IDs that are not yet resolved in any local cache
  const missingIds = useMemo(() => {
    return favorites.filter((id) => !cachedPropertiesMap.has(String(id)))
  }, [favorites, cachedPropertiesMap])

  // Fast targeted fetch for missing favorites (latest sale & rent items)
  const { data: fetchedMissingItems = [], isLoading: isFetchingMissing } = useQuery({
    queryKey: ['novostoy-favorites-fetch', missingIds.slice().sort().join(',')],
    queryFn: async () => {
      if (missingIds.length === 0) return []
      const [saleRes, rentRes] = await Promise.allSettled([
        getObjects({ sell_type: '2', limit: 100 }),
        getObjects({ sell_type: '1', limit: 100 }),
      ])

      const fetchedList = [
        ...(saleRes.status === 'fulfilled' ? saleRes.value.data || [] : []),
        ...(rentRes.status === 'fulfilled' ? rentRes.value.data || [] : []),
      ].map(mapObject)

      return fetchedList.filter((item) => missingIds.includes(String(item.id)))
    },
    enabled: missingIds.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  // Whenever missing items are fetched, persist them to favoriteItems
  useEffect(() => {
    if (fetchedMissingItems.length > 0) {
      fetchedMissingItems.forEach((item) => {
        saveFavoriteItem(item)
      })
    }
  }, [fetchedMissingItems, saveFavoriteItem])

  // Assemble resolved list and maintain order matching favorites
  const resolvedProperties = useMemo(() => {
    const freshMap = new Map(cachedPropertiesMap)
    fetchedMissingItems.forEach((item) => {
      freshMap.set(String(item.id), item)
    })

    return favorites.map((id) => {
      const stringId = String(id)
      return freshMap.get(stringId) || { id: stringId, isMissing: true }
    })
  }, [favorites, cachedPropertiesMap, fetchedMissingItems])

  const handleRemoveFavorite = useCallback(
    (id) => {
      removeFavorite(id)
    },
    [removeFavorite]
  )

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <SeoMeta
          title="Збережені об'єкти | Харків Ріелтер"
          description="Ваш персональний список збережених оголошень нерухомості у Харкові. Порівнюйте ціни, планування та зв'язуйтесь з агентом."
          url="/favorites"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6 mb-12">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-inter mb-2">ОБРАНЕ</p>
              <h1 className="font-inter font-bold text-4xl sm:text-5xl tracking-tight text-foreground">Збережені об'єкти</h1>
            </div>
            <p className="text-sm text-muted-foreground font-inter">0 об'єктів</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center py-32 bg-card rounded-3xl shadow-sm border border-border">
            <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center mb-6 text-muted-foreground">
              <Heart className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <p className="font-inter font-medium text-2xl text-foreground mb-2">Поки немає збережених об'єктів</p>
            <p className="text-muted-foreground font-inter mb-8 text-sm">Натисніть на серце біля об'єкта, щоб зберегти його тут</p>
            <Link
              to="/flats"
              tabIndex={0}
              aria-label="Перейти до каталогу"
              className="px-8 py-4 gradient-gold text-white text-xs tracking-widest uppercase font-inter font-semibold rounded-full hover:opacity-90 transition-opacity shadow-md flex items-center gap-2"
            >
              Перейти до каталогу <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <SeoMeta
        title="Збережені об'єкти | Харків Ріелтер"
        description="Ваш персональний список збережених оголошень нерухомості у Харкові. Порівнюйте ціни, планування та зв'язуйтесь з агентом."
        url="/favorites"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-inter mb-2">ОБРАНЕ</p>
            <h1 className="font-inter font-bold text-4xl sm:text-5xl tracking-tight text-foreground">Збережені об'єкти</h1>
          </div>
          <p className="text-sm text-muted-foreground font-inter">
            {favorites.length} {getDeclension(favorites.length)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resolvedProperties.map((item, idx) => {
            if (item.isMissing) {
              if (isFetchingMissing) {
                return (
                  <div
                    key={`loading-${item.id}`}
                    className="bg-card border border-border h-[400px] animate-pulse rounded-2xl"
                  />
                )
              }

              return (
                <div
                  key={`missing-${item.id}`}
                  className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between h-[400px] text-center shadow-sm"
                >
                  <div className="flex flex-col items-center pt-8">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                      <AlertCircle className="w-7 h-7" />
                    </div>
                    <p className="font-semibold text-foreground mb-2">Об'єкт #{item.id}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed px-2">
                      Оголошення знято з публікації, продано або застаріло в базі даних.
                    </p>
                  </div>
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={`Видалити об'єкт ${item.id} з обраного`}
                    onClick={() => handleRemoveFavorite(item.id)}
                    className="w-full py-3 px-4 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Видалити з обраного
                  </button>
                </div>
              )
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <PropertyCard property={item} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FavoritesPage

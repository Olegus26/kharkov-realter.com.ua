import { useState, useMemo, useEffect, useRef, startTransition } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { LayoutGrid, Map, AlertCircle, ChevronDown, Filter, ChevronUp, Check, Hammer, Home as HomeIcon } from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import MapView from '@/components/realty/MapView'
import { useCatalogObjects } from '@/lib/useCatalogObjects'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import SeoMeta from '@/components/seo/SeoMeta'
import JsonLd, { generateItemListSchema } from '@/components/seo/JsonLd'
import { Autocomplete } from '@/components/ui/autocomplete'
import { cn } from '@/lib/utils'
import { METRO_LINES, DISTRICTS } from '@/data/geoFilters'
import {
  CATEGORIES,
  SUBTYPES_BY_CATEGORY,
  STATES,
  SORT_OPTIONS,
  checkSubTypeMatch,
} from '@/pages/realty/catalogConfig'
import RangeFilter from '@/components/realty/catalog/RangeFilter'
import CheckboxFilter from '@/components/realty/catalog/CheckboxFilter'
import ActiveFilterBadge from '@/components/realty/catalog/ActiveFilterBadge'
import Pagination from '@/components/realty/catalog/Pagination'
import MascotTelegramCard from '@/components/realty/catalog/MascotTelegramCard'
import MascotTelegramEmptyState from '@/components/realty/catalog/MascotTelegramEmptyState'
import MascotTelegramModal from '@/components/realty/catalog/MascotTelegramModal'

const ITEMS_PER_PAGE = 18

const CatalogPage = ({ defaultCategory = 'apartment' }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isFirstRender = useRef(true)

  const [deal, setDeal] = useState(searchParams.get('deal') || 'sale')
  const [category, setCategory] = useState(defaultCategory)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date_desc')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [subTypes, setSubTypes] = useState(
    searchParams.get('subTypes') ? searchParams.get('subTypes').split(',') : []
  )
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [minArea, setMinArea] = useState(searchParams.get('minArea') || '')
  const [maxArea, setMaxArea] = useState(searchParams.get('maxArea') || '')

  const [searchComplex, setSearchComplex] = useState(searchParams.get('searchComplex') || '')
  const [searchStreet, setSearchStreet] = useState(searchParams.get('searchStreet') || '')
  const [searchHouse, setSearchHouse] = useState(searchParams.get('searchHouse') || '')
  const [geoData, setGeoData] = useState({ streets: [], houses: {}, complexes: [] })

  const [metroStations, setMetroStations] = useState(
    searchParams.get('metroStations') ? searchParams.get('metroStations').split(',') : []
  )
  const [districts, setDistricts] = useState(
    searchParams.get('districts') ? searchParams.get('districts').split(',') : []
  )
  const [states, setStates] = useState(
    searchParams.get('states') ? searchParams.get('states').split(',') : []
  )
  const [minFloor, setMinFloor] = useState(searchParams.get('minFloor') || '')
  const [maxFloor, setMaxFloor] = useState(searchParams.get('maxFloor') || '')
  const [minFloorsTotal, setMinFloorsTotal] = useState(searchParams.get('minFloorsTotal') || '')
  const [maxFloorsTotal, setMaxFloorsTotal] = useState(searchParams.get('maxFloorsTotal') || '')
  const [filterEoselia, setFilterEoselia] = useState(
    searchParams.get('eoselia') === 'true' || searchParams.get('program') === 'eoselia'
  )
  const [filterErecovery, setFilterErecovery] = useState(
    searchParams.get('erecovery') === 'true' || searchParams.get('program') === 'erecovery'
  )

  const [viewMode, setViewMode] = useState(searchParams.get('viewMode') || 'list')
  const [showMapFilters, setShowMapFilters] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [isPromoDismissed, setIsPromoDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('kh_catalog_tg_promo_dismissed') === 'true'
  })

  const handleDismissPromo = () => {
    setIsPromoDismissed(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kh_catalog_tg_promo_dismissed', 'true')
    }
  }

  useEffect(() => {
    Promise.all([
      import('@/data/streets.json').then((m) => m.default),
      import('@/data/houses.json').then((m) => m.default),
      import('@/data/complexes.json').then((m) => m.default),
    ])
      .then(([streets, houses, complexes]) => {
        setGeoData({ streets, houses, complexes })
      })
      .catch((e) => console.error('Error loading geo data', e))
  }, [])

  const streetOptions = useMemo(
    () => geoData.streets.map((s) => ({ label: s.current_name, value: s.current_name })),
    [geoData.streets]
  )
  const complexOptions = useMemo(
    () => geoData.complexes.map((c) => ({ label: c.jk_name, value: c.jk_name })),
    [geoData.complexes]
  )
  const houseOptions = useMemo(() => {
    if (!searchStreet || !geoData?.streets || !geoData?.houses) return []
    const q = searchStreet
      .toLowerCase()
      .replace(/вул\.|пров\.|просп\.|пр-т|м\.|пер\.|ул\.|проспект/g, '')
      .trim()
    const st = geoData.streets.find((s) => {
      const cur = s.current_name.toLowerCase()
      if (cur.length > 2 && (q.includes(cur) || cur.includes(q))) return true
      if (s.old_names) {
        return s.old_names.some((o) => {
          const old = o.toLowerCase()
          return old.length > 2 && (q.includes(old) || old.includes(q))
        })
      }
      return false
    })
    if (!st || !geoData.houses[st.street_id]) return []
    return Object.keys(geoData.houses[st.street_id]).map((h) => ({ label: h, value: h }))
  }, [searchStreet, geoData])

  const handleComplexSelect = (val) => {
    setSearchComplex(val)
    setCurrentPage(1)
    if (!val) return
    setSearchStreet('')
    setSearchHouse('')
  }

  const handleCategoryChange = (catValue) => {
    if (category === catValue) return
    setCategory(catValue)
    setSubTypes([])
    setCurrentPage(1)
    const catObj = CATEGORIES.find((c) => c.value === catValue)
    if (!catObj) return
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('subTypes')
    nextParams.delete('page')
    const qs = nextParams.toString()
    navigate(`${catObj.path}${qs ? `?${qs}` : ''}`, { replace: true })
  }

  useEffect(() => {
    setCategory(defaultCategory)
    setSubTypes([])
  }, [defaultCategory])

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const found = CATEGORIES.find((c) => path.startsWith(c.path))
      if (found && found.value !== category) {
        setCategory(found.value)
        setSubTypes([])
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [category])

  useEffect(() => {
    if (!location.search) {
      const saved = sessionStorage.getItem('catalogParams')
      if (saved) {
        navigate(location.pathname + saved, { replace: true })
      }
    }
  }, [location.search, navigate])

  useEffect(() => {
    if (!location.search) return
    const p = new URLSearchParams(location.search)
    if (p.has('deal')) setDeal(p.get('deal') || 'sale')
    if (p.has('q')) setSearchQuery(p.get('q') || '')
    if (p.has('searchStreet')) setSearchStreet(p.get('searchStreet') || '')
    if (p.has('searchComplex')) setSearchComplex(p.get('searchComplex') || '')
    if (p.has('searchHouse')) setSearchHouse(p.get('searchHouse') || '')
    if (p.has('metroStations')) {
      const val = p.get('metroStations')
      setMetroStations(val ? val.split(',') : [])
    }
    if (p.has('districts')) {
      const val = p.get('districts')
      setDistricts(val ? val.split(',') : [])
    }
    if (p.has('eoselia')) setFilterEoselia(p.get('eoselia') === 'true')
    if (p.has('erecovery')) setFilterErecovery(p.get('erecovery') === 'true')
    if (p.has('subTypes')) {
      const val = p.get('subTypes')
      setSubTypes(val ? val.split(',') : [])
    }
    if (p.has('minPrice')) setMinPrice(p.get('minPrice') || '')
    if (p.has('maxPrice')) setMaxPrice(p.get('maxPrice') || '')
  }, [location.search])

  useEffect(() => {
    const params = new URLSearchParams()
    if (deal) params.set('deal', deal)
    if (searchQuery) params.set('q', searchQuery)
    if (sortBy && sortBy !== 'date_desc') params.set('sort', sortBy)
    if (subTypes.length > 0) params.set('subTypes', subTypes.join(','))
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minArea) params.set('minArea', minArea)
    if (maxArea) params.set('maxArea', maxArea)
    if (searchComplex) params.set('searchComplex', searchComplex)
    if (searchStreet) params.set('searchStreet', searchStreet)
    if (searchHouse) params.set('searchHouse', searchHouse)
    if (metroStations.length > 0) params.set('metroStations', metroStations.join(','))
    if (districts.length > 0) params.set('districts', districts.join(','))
    if (states.length > 0) params.set('states', states.join(','))
    if (minFloor) params.set('minFloor', minFloor)
    if (maxFloor) params.set('maxFloor', maxFloor)
    if (minFloorsTotal) params.set('minFloorsTotal', minFloorsTotal)
    if (maxFloorsTotal) params.set('maxFloorsTotal', maxFloorsTotal)
    if (filterEoselia) params.set('eoselia', 'true')
    if (filterErecovery) params.set('erecovery', 'true')
    if (viewMode !== 'list') params.set('viewMode', viewMode)
    if (currentPage > 1) params.set('page', String(currentPage))

    const searchString = params.toString()
    if (searchString) {
      sessionStorage.setItem('catalogParams', '?' + searchString)
    } else {
      sessionStorage.removeItem('catalogParams')
    }

    setSearchParams(params, { replace: true })
  }, [
    deal,
    category,
    searchQuery,
    sortBy,
    subTypes,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    searchComplex,
    searchStreet,
    searchHouse,
    metroStations,
    districts,
    states,
    minFloor,
    maxFloor,
    minFloorsTotal,
    maxFloorsTotal,
    filterEoselia,
    filterErecovery,
    viewMode,
    currentPage,
    setSearchParams,
  ])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setCurrentPage(1)
  }, [
    deal,
    category,
    searchQuery,
    sortBy,
    subTypes,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    searchComplex,
    searchStreet,
    searchHouse,
    metroStations,
    districts,
    states,
    minFloor,
    maxFloor,
    minFloorsTotal,
    maxFloorsTotal,
    filterEoselia,
    filterErecovery,
    viewMode,
  ])

  useEffect(() => {
    if (viewMode === 'map') {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [viewMode])

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    setSearchParams((prev) => {
      if (mode === 'list') prev.delete('viewMode')
      else prev.set('viewMode', mode)
      return prev
    })
    if (mode === 'map') setShowMapFilters(false)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setTimeout(() => {
      const el = document.getElementById('catalog-top')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 50)
  }

  const handleToggleEoselia = () => setFilterEoselia((prev) => !prev)
  const handleToggleErecovery = () => setFilterErecovery((prev) => !prev)

  const handleClearFilters = () => {
    setSearchQuery('')
    setSubTypes([])
    setMinPrice('')
    setMaxPrice('')
    setMinArea('')
    setMaxArea('')
    setSearchComplex('')
    setSearchStreet('')
    setSearchHouse('')
    setMetroStations([])
    setDistricts([])
    setStates([])
    setMinFloor('')
    setMaxFloor('')
    setMinFloorsTotal('')
    setMaxFloorsTotal('')
    setFilterEoselia(false)
    setFilterErecovery(false)
  }

  const { data: properties = [], isLoading, isFetching, error } = useCatalogObjects(deal)

  const filtered = useMemo(() => {
    const list = properties.filter((p) => {
      if (minPrice && p.price < Number(minPrice)) return false
      if (maxPrice && p.price > Number(maxPrice)) return false
      if (minArea && p.area < Number(minArea)) return false
      if (maxArea && p.area > Number(maxArea)) return false
      if (category && p.type !== category) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim()
        const matchesQ =
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.street && p.street.toLowerCase().includes(q)) ||
          (p.region && p.region.toLowerCase().includes(q)) ||
          (p.mregion && p.mregion.toLowerCase().includes(q)) ||
          (p.building && p.building.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        if (!matchesQ) return false
      }

      if (searchComplex) {
        const c = searchComplex.toLowerCase().trim()
        const cClean = c.replace(/^жк\s+/i, '').trim()
        const text = `${p.title || ''} ${p.location || ''} ${p.description || ''}`.toLowerCase()
        const matchesC = text.includes(c) || (cClean.length >= 3 && text.includes(cClean))
        if (!matchesC) return false
      }

      if (subTypes.length > 0) {
        const matches = subTypes.some((st) => checkSubTypeMatch(p, st))
        if (!matches) return false
      }

      if (searchStreet) {
        const query = searchStreet
          .toLowerCase()
          .replace(/вул\.|пров\.|просп\.|пр-т|м\.|пер\.|ул\.|проспект/g, '')
          .trim()
        if (!p.street?.toLowerCase().includes(query)) return false
      }

      if (districts.length > 0) {
        if (!districts.includes(p.region) && !districts.includes(p.mregion)) return false
      }

      if (states.length > 0) {
        if (!p.state || !states.includes(p.state)) return false
      }

      if (minFloor && p.floor < Number(minFloor)) return false
      if (maxFloor && p.floor > Number(maxFloor)) return false

      if (minFloorsTotal && p.floors_total < Number(minFloorsTotal)) return false
      if (maxFloorsTotal && p.floors_total > Number(maxFloorsTotal)) return false

      if (searchHouse) {
        const houseQuery = searchHouse.toLowerCase()
        if (p.building?.toLowerCase() !== houseQuery && !p.building?.toLowerCase().includes(houseQuery)) {
          return false
        }
      }

      if (metroStations.length > 0) {
        if (!metroStations.some((s) => (p.metro || p.mregion)?.toLowerCase().includes(s.toLowerCase()))) {
          return false
        }
      }

      if (filterEoselia && !p.eoselia) return false
      if (filterErecovery && !p.erecovery) return false

      return true
    })

    switch (sortBy) {
      case 'price_asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price_desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'area_desc':
        return [...list].sort((a, b) => (b.area || 0) - (a.area || 0))
      case 'area_asc':
        return [...list].sort((a, b) => (a.area || 0) - (b.area || 0))
      case 'date_desc':
      default:
        return [...list].sort((a, b) => b.date_edit - a.date_edit || Number(b.id) - Number(a.id))
    }
  }, [
    properties,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    category,
    searchQuery,
    searchComplex,
    subTypes,
    searchStreet,
    searchHouse,
    metroStations,
    districts,
    states,
    minFloor,
    maxFloor,
    minFloorsTotal,
    maxFloorsTotal,
    filterEoselia,
    filterErecovery,
    sortBy,
  ])

  const isPromoPage = (currentPage - 1) % 3 === 0
  const shouldShowPromo = isPromoPage && !isPromoDismissed && filtered.length > 3

  const promoPagesBefore = useMemo(() => {
    if (isPromoDismissed || currentPage <= 1) return 0
    return Math.floor((currentPage - 2) / 3) + 1
  }, [currentPage, isPromoDismissed])

  const promoInsertIndex = useMemo(() => {
    const min = 2
    const max = 14
    return Math.floor(Math.random() * (max - min + 1)) + min
  }, [currentPage])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const pageSize = shouldShowPromo ? ITEMS_PER_PAGE - 1 : ITEMS_PER_PAGE
  const startIndex = Math.max(0, (currentPage - 1) * ITEMS_PER_PAGE - promoPagesBefore)

  const currentItems = useMemo(() => {
    if (viewMode !== 'list') return filtered
    return filtered.slice(startIndex, startIndex + pageSize)
  }, [viewMode, filtered, startIndex, pageSize])

  const gridItems = useMemo(() => {
    if (viewMode !== 'list') return []
    const items = currentItems.map((p) => ({ type: 'property', data: p, id: p.id }))
    if (!shouldShowPromo || items.length === 0) return items

    const insertAt = Math.min(promoInsertIndex, items.length)
    items.splice(insertAt, 0, {
      type: 'promo',
      id: `catalog-tg-promo-keys-${currentPage}`,
    })
    return items
  }, [viewMode, currentItems, shouldShowPromo, promoInsertIndex, currentPage])

  const hasFilters = Boolean(
    searchQuery ||
      subTypes.length > 0 ||
      minPrice ||
      maxPrice ||
      minArea ||
      maxArea ||
      searchComplex ||
      searchStreet ||
      searchHouse ||
      metroStations.length > 0 ||
      districts.length > 0 ||
      states.length > 0 ||
      minFloor ||
      maxFloor ||
      minFloorsTotal ||
      maxFloorsTotal ||
      filterEoselia ||
      filterErecovery
  )

  const advancedFiltersActiveCount =
    (metroStations.length > 0 ? 1 : 0) +
    (districts.length > 0 ? 1 : 0) +
    (states.length > 0 ? 1 : 0) +
    (minFloor || maxFloor ? 1 : 0) +
    (minFloorsTotal || maxFloorsTotal ? 1 : 0) +
    (filterErecovery ? 1 : 0) +
    (filterEoselia ? 1 : 0)

  const getSeoTitle = () => {
    let title =
      category === 'apartment'
        ? 'Квартири'
        : category === 'house'
        ? 'Будинки та ділянки'
        : category === 'commercial'
        ? 'Комерційна нерухомість'
        : 'Каталог нерухомості'
    if (deal === 'sale') title = `Продаж: ${title.toLowerCase()}`
    if (deal === 'rent') title = `Оренда: ${title.toLowerCase()}`
    if (filtered.length > 0) {
      const minP = minPrice ? Number(minPrice) : Math.min(...filtered.map((p) => p.price))
      const formattedMinP =
        deal === 'rent' ? `${minP.toLocaleString('uk-UA')} грн` : `$${minP.toLocaleString('uk-UA')}`
      title += ` в Харкові. ${filtered.length} об'єктів від ${formattedMinP}`
    } else {
      title += ' в Харкові'
    }
    return title
  }

  const getSeoDescription = () => {
    const catName =
      category === 'apartment'
        ? 'квартир'
        : category === 'house'
        ? 'будинків'
        : category === 'commercial'
        ? 'комерційної нерухомості'
        : 'нерухомості'
    const dealName = deal === 'rent' ? 'оренду' : 'продаж'
    return `Актуальний каталог на ${dealName} ${catName} в Харкові та області від агентства Харків Ріелтер. Безпечні угоди, перевірені об'єкти.`
  }

  const schemaUrl = `https://kharkov-realter.com.ua${location.pathname}${location.search}`

  return (
    <div
      className={cn('pt-24 flex flex-col', viewMode === 'list' ? 'pb-8 min-h-screen' : 'h-screen overflow-hidden pb-0')}
      id="catalog-top"
    >
      <SeoMeta title={getSeoTitle()} description={getSeoDescription()} url={`${location.pathname}${location.search}`} />
      <JsonLd data={generateItemListSchema(filtered, schemaUrl)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-40">
        {viewMode === 'map' && (
          <div className="lg:hidden mb-4 relative z-50">
            <button
              type="button"
              onClick={() => setShowMapFilters(!showMapFilters)}
              className="w-full py-3 bg-card backdrop-blur-md border border-border rounded-2xl shadow-md text-sm font-inter font-semibold text-foreground flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showMapFilters ? 'Сховати фільтри' : 'Показати фільтри'}
            </button>
          </div>
        )}

        <AnimatePresence initial={false}>
          {!(viewMode === 'map' && !showMapFilters) && (
            <motion.div
              initial={false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={cn(
                'bg-card shadow-md border border-border flex-shrink-0 w-full relative z-40 mt-2',
                viewMode === 'map' ? 'rounded-3xl' : 'rounded-3xl mb-10 sticky top-24'
              )}
            >
              <LayoutGroup id={viewMode}>
                <div className="p-4 sm:p-6 flex flex-col gap-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex p-1 bg-muted rounded-full shrink-0 relative">
                        {[
                          ['sale', 'Продаж'],
                          ['rent', 'Оренда'],
                        ].map(([v, l]) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setDeal(v)}
                            aria-label={`Обрати тип угоди: ${l}`}
                            className={cn(
                              'relative z-10 px-5 sm:px-6 py-2 sm:py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full',
                              deal === v ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {deal === v && (
                              <motion.div
                                layoutId="deal-pill"
                                className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            )}
                            {l}
                          </button>
                        ))}
                      </div>

                      <div className="flex p-1 bg-muted rounded-full w-fit shrink-0 relative">
                        {CATEGORIES.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => handleCategoryChange(c.value)}
                            aria-label={`Обрати категорію: ${c.label}`}
                            className={cn(
                              'relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full whitespace-nowrap',
                              category === c.value ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {category === c.value && (
                              <motion.div
                                layoutId="category-pill"
                                className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            )}
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-4 flex-wrap ml-auto">
                      {viewMode === 'list' && (
                        <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              aria-label="Сортування каталогу"
                              className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-inter font-semibold rounded-full px-4 py-2.5 outline-none transition-colors border border-transparent hover:border-border"
                            >
                              <span>{SORT_OPTIONS.find((s) => s.value === sortBy)?.label || 'Новіші спочатку'}</span>
                              <ChevronDown
                                className={cn(
                                  'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                                  isSortOpen && 'rotate-180'
                                )}
                              />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-52 p-1.5 rounded-2xl bg-white shadow-xl border border-border/70 z-50" align="start">
                            <div className="space-y-0.5">
                              {SORT_OPTIONS.map((opt) => {
                                const isSelected = sortBy === opt.value
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setSortBy(opt.value)
                                      setIsSortOpen(false)
                                    }}
                                    className={cn(
                                      'w-full text-left px-3 py-2 text-xs font-inter rounded-xl transition-colors font-medium flex items-center justify-between',
                                      isSelected ? 'bg-gold/15 text-gold font-semibold' : 'text-foreground hover:bg-muted/70'
                                    )}
                                  >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                                  </button>
                                )
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      <p className="text-muted-foreground text-sm font-inter whitespace-nowrap font-medium flex items-center gap-1.5">
                        {isFetching && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping shrink-0" />}
                        <span>{filtered.length} об'єктів</span>
                      </p>

                      <div className="flex p-1 bg-muted rounded-full relative shrink-0">
                        {[
                          { id: 'list', icon: LayoutGrid, label: 'Список' },
                          { id: 'map', icon: Map, label: 'Карта' },
                        ].map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => startTransition(() => handleViewModeChange(v.id))}
                            className={cn(
                              'relative z-10 flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full',
                              viewMode === v.id ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {viewMode === v.id && (
                              <motion.div
                                layoutId="view-pill"
                                className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            )}
                            <v.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{v.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="flex flex-wrap items-center gap-3 w-full font-inter">
                      <div className="relative flex-1 min-w-[150px] lg:max-w-[200px] z-50">
                        <Autocomplete
                          placeholder="Оберіть ЖК..."
                          options={complexOptions}
                          value={searchComplex}
                          onChange={handleComplexSelect}
                          onInputChange={setSearchComplex}
                        />
                      </div>

                      <div className="relative flex-1 min-w-[150px] lg:max-w-[200px] z-50">
                        <Autocomplete
                          placeholder="Вулиця..."
                          options={streetOptions}
                          value={searchStreet}
                          onChange={(val) => {
                            setSearchStreet(val)
                            setSearchHouse('')
                          }}
                          onInputChange={(val) => {
                            setSearchStreet(val)
                            setSearchHouse('')
                          }}
                          minChars={1}
                        />
                      </div>

                      <div className="relative flex-1 min-w-[100px] lg:max-w-[120px] z-50">
                        <Autocomplete
                          placeholder="Дім..."
                          disabled={!searchStreet}
                          options={houseOptions}
                          value={searchHouse}
                          onChange={setSearchHouse}
                          onInputChange={setSearchHouse}
                        />
                      </div>

                      <RangeFilter
                        label="Ціна"
                        title={deal === 'rent' ? 'Ціна (грн)' : 'Ціна ($)'}
                        minValue={minPrice}
                        maxValue={maxPrice}
                        onMinChange={setMinPrice}
                        onMaxChange={setMaxPrice}
                      />

                      <RangeFilter
                        label="Площа"
                        title="Площа (кв.м)"
                        minValue={minArea}
                        maxValue={maxArea}
                        onMinChange={setMinArea}
                        onMaxChange={setMaxArea}
                      />

                      {category && SUBTYPES_BY_CATEGORY[category] && (
                        <CheckboxFilter
                          label="Тип нерухомості"
                          options={SUBTYPES_BY_CATEGORY[category]}
                          selected={subTypes}
                          onChange={setSubTypes}
                          contentClassName="w-[420px]"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        aria-expanded={showAdvancedFilters}
                        aria-label="Більше фільтрів"
                        className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground font-semibold"
                      >
                        <span>Більше фільтрів</span>
                        <ChevronDown
                          className={cn(
                            'w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200',
                            showAdvancedFilters && 'rotate-180'
                          )}
                        />
                        {advancedFiltersActiveCount > 0 && !showAdvancedFilters && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">
                            {advancedFiltersActiveCount}
                          </span>
                        )}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {showAdvancedFilters && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="overflow-hidden w-full"
                        >
                          <div className="flex flex-wrap items-center gap-3 w-full font-inter border-t border-border/50 pt-4 mt-3">
                            <CheckboxFilter
                              label="Станція метро"
                              title="Оберіть станції"
                              groups={METRO_LINES}
                              selected={metroStations}
                              onChange={setMetroStations}
                              contentClassName="w-[500px]"
                            />

                            <CheckboxFilter
                              label="Район"
                              title="Оберіть район"
                              options={DISTRICTS}
                              selected={districts}
                              onChange={setDistricts}
                              contentClassName="w-[450px]"
                            />

                            <RangeFilter
                              label="Поверх"
                              minValue={minFloor}
                              maxValue={maxFloor}
                              onMinChange={setMinFloor}
                              onMaxChange={setMaxFloor}
                            />

                            <RangeFilter
                              label="Всього поверхів"
                              minValue={minFloorsTotal}
                              maxValue={maxFloorsTotal}
                              onMinChange={setMinFloorsTotal}
                              onMaxChange={setMaxFloorsTotal}
                            />

                            <CheckboxFilter
                              label="Стан"
                              title="Оберіть стан"
                              options={STATES}
                              selected={states}
                              onChange={setStates}
                              contentClassName="w-[450px]"
                            />

                            <button
                              type="button"
                              onClick={handleToggleErecovery}
                              aria-pressed={filterErecovery}
                              aria-label="Фільтр об'єктів за програмою єВідновлення"
                              tabIndex={0}
                              className={cn(
                                'px-4 sm:px-5 py-3.5 rounded-full text-sm font-inter font-semibold transition-all flex items-center gap-2 border select-none',
                                filterErecovery
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-muted hover:bg-emerald-500/10 text-foreground border-transparent hover:border-emerald-500/30'
                              )}
                            >
                              <Hammer className={cn('w-4 h-4', filterErecovery ? 'text-white' : 'text-emerald-600')} />
                              <span>єВідновлення</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleToggleEoselia}
                              aria-pressed={filterEoselia}
                              aria-label="Фільтр об'єктів за програмою єОселя"
                              tabIndex={0}
                              className={cn(
                                'px-4 sm:px-5 py-3.5 rounded-full text-sm font-inter font-semibold transition-all flex items-center gap-2 border select-none',
                                filterEoselia
                                  ? 'bg-navy text-white border-navy shadow-sm'
                                  : 'bg-muted hover:bg-navy/10 text-foreground border-transparent hover:border-navy/30'
                              )}
                            >
                              <HomeIcon className={cn('w-4 h-4', filterEoselia ? 'text-white' : 'text-navy')} />
                              <span>єОселя</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {hasFilters && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/50 text-xs font-inter">
                      <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider mr-1">
                        Фільтри:
                      </span>
                      {searchQuery && (
                        <ActiveFilterBadge
                          onRemove={() => setSearchQuery('')}
                          removeLabel="Скинути пошуковий запит"
                        >
                          Пошук: "{searchQuery}"
                        </ActiveFilterBadge>
                      )}
                      {(minPrice || maxPrice) && (
                        <ActiveFilterBadge
                          onRemove={() => {
                            setMinPrice('')
                            setMaxPrice('')
                          }}
                          removeLabel="Скинути фільтр ціни"
                        >
                          Ціна: {minPrice ? `від ${minPrice}` : ''} {maxPrice ? `до ${maxPrice}` : ''}{' '}
                          {deal === 'rent' ? 'грн' : '$'}
                        </ActiveFilterBadge>
                      )}
                      {(minArea || maxArea) && (
                        <ActiveFilterBadge
                          onRemove={() => {
                            setMinArea('')
                            setMaxArea('')
                          }}
                          removeLabel="Скинути фільтр площі"
                        >
                          Площа: {minArea ? `від ${minArea}` : ''} {maxArea ? `до ${maxArea}` : ''} м²
                        </ActiveFilterBadge>
                      )}
                      {searchComplex && (
                        <ActiveFilterBadge
                          onRemove={() => setSearchComplex('')}
                          removeLabel="Скинути фільтр ЖК"
                        >
                          ЖК: {searchComplex}
                        </ActiveFilterBadge>
                      )}
                      {searchStreet && (
                        <ActiveFilterBadge
                          onRemove={() => {
                            setSearchStreet('')
                            setSearchHouse('')
                          }}
                          removeLabel="Скинути фільтр вулиці"
                        >
                          Вулиця: {searchStreet} {searchHouse}
                        </ActiveFilterBadge>
                      )}
                      {filterErecovery && (
                        <ActiveFilterBadge
                          onRemove={() => setFilterErecovery(false)}
                          removeLabel="Скинути фільтр єВідновлення"
                          tone="emerald"
                          isBold
                        >
                          Програма: єВідновлення
                        </ActiveFilterBadge>
                      )}
                      {filterEoselia && (
                        <ActiveFilterBadge
                          onRemove={() => setFilterEoselia(false)}
                          removeLabel="Скинути фільтр єОселя"
                          isBold
                        >
                          Програма: єОселя
                        </ActiveFilterBadge>
                      )}
                      {subTypes.map((st) => {
                        const item = (SUBTYPES_BY_CATEGORY[category] || []).find((x) => x.value === st)
                        return (
                          <ActiveFilterBadge
                            key={st}
                            onRemove={() => setSubTypes(subTypes.filter((v) => v !== st))}
                            removeLabel={`Видалити тип ${st}`}
                          >
                            {item ? item.label : st}
                          </ActiveFilterBadge>
                        )
                      })}
                      {districts.map((d) => {
                        const item = DISTRICTS.find((x) => x.value === d)
                        return (
                          <ActiveFilterBadge
                            key={d}
                            onRemove={() => setDistricts(districts.filter((v) => v !== d))}
                            removeLabel={`Видалити район ${d}`}
                          >
                            {item ? item.label : d}
                          </ActiveFilterBadge>
                        )
                      })}
                      {metroStations.map((m) => {
                        let label = m
                        for (const line of METRO_LINES) {
                          const found = line.stations.find((s) => s.value === m)
                          if (found) {
                            label = found.label
                            break
                          }
                        }
                        return (
                          <ActiveFilterBadge
                            key={m}
                            onRemove={() => setMetroStations(metroStations.filter((v) => v !== m))}
                            removeLabel={`Видалити станцію ${label}`}
                          >
                            М: {label}
                          </ActiveFilterBadge>
                        )
                      })}
                      {states.map((s) => {
                        const item = STATES.find((x) => x.value === s)
                        return (
                          <ActiveFilterBadge
                            key={s}
                            onRemove={() => setStates(states.filter((v) => v !== s))}
                            removeLabel={`Видалити стан ${s}`}
                          >
                            {item ? item.label : s}
                          </ActiveFilterBadge>
                        )
                      })}
                      {(minFloor || maxFloor) && (
                        <ActiveFilterBadge
                          onRemove={() => {
                            setMinFloor('')
                            setMaxFloor('')
                          }}
                          removeLabel="Скинути фільтр поверху"
                        >
                          Поверх: {minFloor ? `від ${minFloor}` : ''} {maxFloor ? `до ${maxFloor}` : ''}
                        </ActiveFilterBadge>
                      )}
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        aria-label="Скинути всі вибрані фільтри"
                        className="text-xs text-destructive hover:underline font-semibold ml-auto transition-colors"
                      >
                        Скинути все
                      </button>
                    </div>
                  )}
                </div>
              </LayoutGroup>
            </motion.div>
          )}
        </AnimatePresence>

        {viewMode === 'map' && (
          <div className="hidden lg:flex justify-center absolute left-1/2 -bottom-5 -translate-x-1/2 z-50">
            <button
              type="button"
              onClick={() => setShowMapFilters(!showMapFilters)}
              aria-label="Перемкнути видимість панелі фільтрів"
              className="bg-white border border-border shadow-md rounded-full p-1.5 text-muted-foreground hover:text-navy hover:shadow-lg transition-all flex items-center justify-center"
            >
              <ChevronUp
                className={cn('w-5 h-5 transition-transform duration-300', !showMapFilters && 'rotate-180')}
              />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 border border-destructive/40 bg-destructive/10 text-destructive text-sm font-inter mb-6 mt-4 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Помилка завантаження: {error.message}
          </div>
        )}
      </div>

      {viewMode === 'map' && (
        <div className="fixed inset-0 top-[80px] z-0">
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-muted flex items-center justify-center">
              <p className="text-muted-foreground font-inter text-sm">Завантаження карти...</p>
            </div>
          ) : (
            <MapView properties={filtered} />
          )}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border aspect-[4/5] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <MascotTelegramEmptyState
              deal={deal}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridItems.map((item, i) => {
                  if (item.type === 'promo') {
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35 }}
                        className="h-full"
                      >
                        <MascotTelegramCard
                          variant="keys"
                          deal={deal}
                          onDismiss={handleDismissPromo}
                        />
                      </motion.div>
                    )
                  }

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (i % 18) * 0.03 }}
                      className="h-full"
                    >
                      <PropertyCard property={item.data} />
                    </motion.div>
                  )
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Mascot Telegram Scroll Popup Modal */}
      <MascotTelegramModal deal={deal} />
    </div>
  )
}

export default CatalogPage
import { useState, useMemo, useEffect, useRef, useCallback, startTransition, lazy, Suspense } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { LayoutGrid, Map as MapIcon, AlertCircle, ChevronDown, SlidersHorizontal, ChevronUp, Check, Hammer, Home as HomeIcon } from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import { useCatalogObjects } from '@/lib/useCatalogObjects'

const MapView = lazy(() => import('@/components/realty/MapView'))
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import SeoMeta from '@/components/seo/SeoMeta'
import JsonLd, { generateItemListSchema } from '@/components/seo/JsonLd'
import { Autocomplete } from '@/components/ui/autocomplete'
import { cn } from '@/lib/utils'
import { parseSearchIntent, matchesPropertyTag, matchesPropertyPhone } from '@/lib/searchQuery'
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
import MobileFilterSheet from '@/components/realty/catalog/MobileFilterSheet'
import Pagination from '@/components/realty/catalog/Pagination'
import MascotTelegramCard from '@/components/realty/catalog/MascotTelegramCard'
import MascotTelegramEmptyState from '@/components/realty/catalog/MascotTelegramEmptyState'
import MascotTelegramModal from '@/components/realty/catalog/MascotTelegramModal'

const ITEMS_PER_PAGE = 18

const CatalogPage = ({ defaultCategory = 'apartment' }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const initialSearchParams = useMemo(() => {
    if (location.search) return new URLSearchParams(location.search)
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('catalogParams')
      if (saved) return new URLSearchParams(saved)
    }
    return searchParams
  }, [])

  const [deal, setDeal] = useState(initialSearchParams.get('deal') || 'sale')
  const [category, setCategory] = useState(defaultCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearchParams.get('q') || '')
  const [sortBy, setSortBy] = useState(initialSearchParams.get('sort') || 'date_desc')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [subTypes, setSubTypes] = useState(
    initialSearchParams.get('subTypes') ? initialSearchParams.get('subTypes').split(',') : []
  )
  const [minPrice, setMinPrice] = useState(initialSearchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(initialSearchParams.get('maxPrice') || '')
  const [minArea, setMinArea] = useState(initialSearchParams.get('minArea') || '')
  const [maxArea, setMaxArea] = useState(initialSearchParams.get('maxArea') || '')

  const [searchComplex, setSearchComplex] = useState(initialSearchParams.get('searchComplex') || '')
  const [searchStreet, setSearchStreet] = useState(initialSearchParams.get('searchStreet') || '')
  const [searchHouse, setSearchHouse] = useState(initialSearchParams.get('searchHouse') || '')
  const [geoData, setGeoData] = useState({ streets: [], houses: {}, complexes: [] })

  const [metroStations, setMetroStations] = useState(
    initialSearchParams.get('metroStations') ? initialSearchParams.get('metroStations').split(',') : []
  )
  const [districts, setDistricts] = useState(
    initialSearchParams.get('districts') ? initialSearchParams.get('districts').split(',') : []
  )
  const [states, setStates] = useState(
    initialSearchParams.get('states') ? initialSearchParams.get('states').split(',') : []
  )
  const [minFloor, setMinFloor] = useState(initialSearchParams.get('minFloor') || '')
  const [maxFloor, setMaxFloor] = useState(initialSearchParams.get('maxFloor') || '')
  const [minFloorsTotal, setMinFloorsTotal] = useState(initialSearchParams.get('minFloorsTotal') || '')
  const [maxFloorsTotal, setMaxFloorsTotal] = useState(initialSearchParams.get('maxFloorsTotal') || '')
  const [filterEoselia, setFilterEoselia] = useState(
    initialSearchParams.get('eoselia') === 'true' || initialSearchParams.get('program') === 'eoselia'
  )
  const [filterErecovery, setFilterErecovery] = useState(
    initialSearchParams.get('erecovery') === 'true' || initialSearchParams.get('program') === 'erecovery'
  )
  const [filterTender, setFilterTender] = useState(initialSearchParams.get('tender') === 'true')

  const [viewMode, setViewMode] = useState(initialSearchParams.get('viewMode') || 'list')
  const [showMapFilters, setShowMapFilters] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(initialSearchParams.get('page')) || 1)
  const prevDefaultCategoryRef = useRef(defaultCategory)
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

  const geoLoadedRef = useRef(false)
  const ensureGeoData = useCallback(() => {
    if (geoLoadedRef.current) return
    geoLoadedRef.current = true
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

  useEffect(() => {
    if (viewMode === 'map' || searchComplex || searchStreet) {
      ensureGeoData()
    }
  }, [viewMode, searchComplex, searchStreet, ensureGeoData])

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
    if (prevDefaultCategoryRef.current === defaultCategory) return
    prevDefaultCategoryRef.current = defaultCategory
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
      const p = new URLSearchParams(window.location.search)
      setCurrentPage(Number(p.get('page')) || 1)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [category])

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
    if (p.has('tender')) setFilterTender(p.get('tender') === 'true')
    if (p.has('subTypes')) {
      const val = p.get('subTypes')
      setSubTypes(val ? val.split(',') : [])
    }
    if (p.has('minPrice')) setMinPrice(p.get('minPrice') || '')
    if (p.has('maxPrice')) setMaxPrice(p.get('maxPrice') || '')
    if (p.has('page')) setCurrentPage(Number(p.get('page')) || 1)
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
    if (filterTender) params.set('tender', 'true')
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
    filterTender,
    viewMode,
    currentPage,
    setSearchParams,
  ])

  const filterSignature = JSON.stringify([
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
    filterTender,
    viewMode,
  ])
  const prevFilterSignatureRef = useRef(filterSignature)

  useEffect(() => {
    if (prevFilterSignatureRef.current === filterSignature) return
    prevFilterSignatureRef.current = filterSignature
    setCurrentPage(1)
  }, [filterSignature])

  // Restore scroll position when returning from a property detail page and track scroll offset
  useEffect(() => {
    if (typeof window === 'undefined' || viewMode !== 'list') return

    let isRestoring = sessionStorage.getItem('catalogReturnScroll') === '1'
    if (isRestoring) {
      const savedY = Number(sessionStorage.getItem('catalogScrollY') || 0)
      sessionStorage.removeItem('catalogReturnScroll')
      if (savedY > 0) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedY, behavior: 'instant' })
          setTimeout(() => {
            isRestoring = false
          }, 80)
        })
      } else {
        isRestoring = false
      }
    }

    const handleScrollSave = () => {
      if (isRestoring) return
      sessionStorage.setItem('catalogScrollY', String(window.scrollY))
    }

    window.addEventListener('scroll', handleScrollSave, { passive: true })
    return () => window.removeEventListener('scroll', handleScrollSave)
  }, [viewMode])

  useEffect(() => {
    if (viewMode === 'map' || isMobileFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [viewMode, isMobileFilterOpen])

  useEffect(() => {
    if (viewMode === 'map') {
      window.scrollTo(0, 0)
    }
  }, [viewMode])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 1024px)')
    const handleBreakpointChange = (e) => {
      if (e.matches) {
        setIsMobileFilterOpen(false)
      }
    }
    mq.addEventListener('change', handleBreakpointChange)
    return () => mq.removeEventListener('change', handleBreakpointChange)
  }, [])

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

  const handleOpenMobileFilters = useCallback(() => {
    ensureGeoData()
    setIsMobileFilterOpen(true)
  }, [ensureGeoData])

  const handleCloseMobileFilters = useCallback(() => {
    setIsMobileFilterOpen(false)
  }, [])

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
    setFilterTender(false)
  }

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (searchComplex ? 1 : 0) +
    (searchStreet ? 1 : 0) +
    (searchHouse ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (minArea || maxArea ? 1 : 0) +
    (subTypes.length > 0 ? 1 : 0) +
    (metroStations.length > 0 ? 1 : 0) +
    (districts.length > 0 ? 1 : 0) +
    (states.length > 0 ? 1 : 0) +
    (minFloor || maxFloor ? 1 : 0) +
    (minFloorsTotal || maxFloorsTotal ? 1 : 0) +
    (filterEoselia ? 1 : 0) +
    (filterErecovery ? 1 : 0) +
    (filterTender ? 1 : 0)

  const hasFilters = activeFiltersCount > 0

  const searchIntent = useMemo(() => parseSearchIntent(searchQuery), [searchQuery])
  const isCrossCatalogLookup = searchIntent.type === 'tag' || searchIntent.type === 'phone'
  const otherDeal = deal === 'rent' ? 'sale' : 'rent'

  const { data: primaryProperties = [], isLoading, isFetching, error } = useCatalogObjects(deal, {
    skipIdleDelay: isCrossCatalogLookup,
  })
  const { data: secondaryProperties = [], isFetching: isFetchingSecondary } = useCatalogObjects(otherDeal, {
    enabled: isCrossCatalogLookup,
    skipIdleDelay: true,
  })

  const properties = useMemo(() => {
    if (!isCrossCatalogLookup) return primaryProperties
    const byId = new Map()
    primaryProperties.forEach((item) => byId.set(String(item.id), item))
    secondaryProperties.forEach((item) => {
      const key = String(item.id)
      if (!byId.has(key)) byId.set(key, item)
    })
    return Array.from(byId.values())
  }, [isCrossCatalogLookup, primaryProperties, secondaryProperties])

  const filtered = useMemo(() => {
    const list = properties.filter((p) => {
      if (minPrice && p.price < Number(minPrice)) return false
      if (maxPrice && p.price > Number(maxPrice)) return false
      if (minArea && p.area < Number(minArea)) return false
      if (maxArea && p.area > Number(maxArea)) return false
      if (!isCrossCatalogLookup && category && p.type !== category) return false

      if (searchQuery) {
        if (searchIntent.type === 'tag') {
          if (!matchesPropertyTag(p, searchIntent.value)) return false
        } else if (searchIntent.type === 'phone') {
          if (!matchesPropertyPhone(p, searchIntent.value)) return false
        } else {
          const q = searchQuery.toLowerCase().trim()
          const matchesQ =
            (p.title && p.title.toLowerCase().includes(q)) ||
            (p.location && p.location.toLowerCase().includes(q)) ||
            (p.street && p.street.toLowerCase().includes(q)) ||
            (p.region && p.region.toLowerCase().includes(q)) ||
            (p.mregion && p.mregion.toLowerCase().includes(q)) ||
            (p.building && p.building.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            String(p.id).includes(q)
          if (!matchesQ) return false
        }
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
      if (filterTender && !p.tender) return false

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
    searchIntent,
    isCrossCatalogLookup,
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
    filterTender,
    sortBy,
  ])

  const isPromoPage = (currentPage - 1) % 3 === 0
  const shouldShowPromo = isPromoPage && !isPromoDismissed && filtered.length > 3

  const isLookupLoading =
    isLoading || (isCrossCatalogLookup && (isFetching || isFetchingSecondary) && filtered.length === 0)

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

  const activeFilterBadgesContent = hasFilters ? (
    <>
      <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider mr-1 shrink-0">
        Фільтри:
      </span>
      {searchQuery && (
        <ActiveFilterBadge
          onRemove={() => setSearchQuery('')}
          removeLabel="Скинути пошуковий запит"
        >
          {searchIntent.type === 'tag'
            ? `Код об'єкта: #${searchIntent.value}`
            : searchIntent.type === 'phone'
              ? `Агент: ${searchQuery}`
              : `Пошук: "${searchQuery}"`}
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
      {filterTender && (
        <ActiveFilterBadge
          onRemove={() => setFilterTender(false)}
          removeLabel="Скинути фільтр Можливий торг"
          isBold
        >
          Можливий торг
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
      {(minFloorsTotal || maxFloorsTotal) && (
        <ActiveFilterBadge
          onRemove={() => {
            setMinFloorsTotal('')
            setMaxFloorsTotal('')
          }}
          removeLabel="Скинути фільтр поверховості"
        >
          Поверховість: {minFloorsTotal ? `від ${minFloorsTotal}` : ''} {maxFloorsTotal ? `до ${maxFloorsTotal}` : ''}
        </ActiveFilterBadge>
      )}
      <button
        type="button"
        onClick={handleClearFilters}
        className="text-xs text-destructive hover:underline font-semibold ml-auto transition-colors shrink-0 whitespace-nowrap"
      >
        Скинути все
      </button>
    </>
  ) : null

  return (
    <div
      className={cn('pt-[74px] sm:pt-24 flex flex-col', viewMode === 'list' ? 'pb-8 min-h-[100dvh]' : 'h-[100dvh] overflow-hidden pb-0')}
      id="catalog-top"
    >
      <SeoMeta title={getSeoTitle()} description={getSeoDescription()} url={`${location.pathname}${location.search}`} />
      <JsonLd data={generateItemListSchema(filtered, schemaUrl)} />
      <h1 className="sr-only">{getSeoTitle()}</h1>
      <h2 className="sr-only">Фільтри та список нерухомості</h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-40">
        {/* Mobile Unified Header (< lg): identical structure and locked position in List & Map */}
        <div className="lg:hidden">
          <div
            data-catalog-mobile-bar="true"
            className="bg-white shadow-md border border-border rounded-2xl p-2.5 flex flex-col gap-2 w-full relative z-40 mt-1"
          >
            <LayoutGroup id="catalog-mobile-bar">
              {/* Row 1: Deal toggle */}
              <div className="grid grid-cols-2 p-1 bg-muted rounded-full relative">
                {[
                  ['sale', 'Продаж'],
                  ['rent', 'Оренда'],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDeal(v)}
                    className={cn(
                      'relative z-10 py-2 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full text-center',
                      deal === v ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {deal === v && (
                      <motion.div
                        layoutId="mobile-deal-pill"
                        className="absolute inset-0 gradient-gold shadow-sm rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    {l}
                  </button>
                ))}
              </div>

              {/* Row 2: Category toggle */}
              <div className="grid grid-cols-3 p-1 bg-muted rounded-full relative">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleCategoryChange(c.value)}
                    className={cn(
                      'relative z-10 px-1.5 py-2 text-[11px] tracking-wider uppercase font-inter font-semibold transition-colors rounded-full whitespace-nowrap text-center',
                      category === c.value ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {category === c.value && (
                      <motion.div
                        layoutId="mobile-category-pill"
                        className="absolute inset-0 gradient-gold shadow-sm rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Row 3: Left = Filters Sheet Trigger, Right = Locked List/Map Segmented Toggle */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleOpenMobileFilters}
                  aria-label="Відкрити фільтри"
                  aria-expanded={isMobileFilterOpen}
                  tabIndex={0}
                  className={cn(
                    'relative flex-1 min-w-0 h-10 px-3.5 rounded-full text-xs font-inter font-semibold transition-colors flex items-center justify-center gap-2 border',
                    activeFiltersCount > 0
                      ? 'bg-navy text-white border-navy shadow-sm'
                      : 'bg-muted hover:bg-muted/80 text-foreground border-transparent'
                  )}
                >
                  <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Фільтри</span>
                  {activeFiltersCount > 0 && (
                    <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="flex p-1 bg-muted rounded-full shrink-0 h-10 items-center relative">
                  {[
                    { id: 'list', icon: LayoutGrid, label: 'Список' },
                    { id: 'map', icon: MapIcon, label: 'Карта' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      aria-label={v.label}
                      aria-pressed={viewMode === v.id}
                      onClick={() => startTransition(() => handleViewModeChange(v.id))}
                      className={cn(
                        'relative z-10 h-8 px-3 rounded-full text-xs font-inter font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap',
                        viewMode === v.id ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {viewMode === v.id && (
                        <motion.div
                          layoutId="mobile-view-pill"
                          className="absolute inset-0 gradient-gold shadow-sm rounded-full -z-10"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      <v.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="hidden min-[360px]:inline">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </LayoutGroup>
          </div>

          {/* Mobile List Secondary Strip: Object Count + Sort Popover + Active Filter Badges */}
          {viewMode === 'list' && (
            <div className="mt-3 mb-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-xs sm:text-sm font-inter whitespace-nowrap font-medium flex items-center gap-1.5">
                  {(isFetching || isFetchingSecondary) && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping shrink-0" />}
                  <span>{filtered.length} об'єктів</span>
                </p>

                <Popover open={isMobileSortOpen} onOpenChange={setIsMobileSortOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 bg-white hover:bg-muted/70 text-foreground text-xs font-inter font-semibold rounded-full px-3.5 py-2 outline-none transition-colors border border-border/80 shadow-sm"
                    >
                      <span>{SORT_OPTIONS.find((s) => s.value === sortBy)?.label || 'Новіші спочатку'}</span>
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                          isMobileSortOpen && 'rotate-180'
                        )}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-1.5 rounded-2xl bg-white shadow-xl border border-border/70 z-50" align="end">
                    <div className="space-y-0.5">
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = sortBy === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.value)
                              setIsMobileSortOpen(false)
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
              </div>

              {hasFilters && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-inter">
                  {activeFilterBadgesContent}
                </div>
              )}
            </div>
          )}

          {/* Mobile Map Active Filters Horizontal Strip */}
          {viewMode === 'map' && hasFilters && (
            <div className="mt-2 bg-white/95 backdrop-blur border border-border/80 rounded-xl px-2.5 py-2 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-inter whitespace-nowrap">
              {activeFilterBadgesContent}
            </div>
          )}
        </div>

        {/* Desktop Filter Header (>= lg) */}
        <div className="hidden lg:block">
          <AnimatePresence initial={false}>
            {!(viewMode === 'map' && !showMapFilters) && (
              <motion.div
                initial={false}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                  'bg-card shadow-md border border-border flex-shrink-0 w-full relative z-40 mt-2',
                  viewMode === 'map' ? 'rounded-3xl' : 'rounded-3xl mb-10'
                )}
              >
                <LayoutGroup id={`catalog-desktop-${viewMode}`}>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex flex-row items-center justify-between gap-4 border-b border-border/50 pb-5">
                      <div className="flex items-center gap-3 w-auto">
                        <div className="flex p-1 bg-muted rounded-full w-auto shrink-0 relative">
                          {[
                            ['sale', 'Продаж'],
                            ['rent', 'Оренда'],
                          ].map(([v, l]) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setDeal(v)}
                              className={cn(
                                'relative z-10 px-6 py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full text-center justify-center',
                                deal === v ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              {deal === v && (
                                <motion.div
                                  layoutId="desktop-deal-pill"
                                  className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}
                              {l}
                            </button>
                          ))}
                        </div>

                        <div className="flex p-1 bg-muted rounded-full w-auto shrink-0 relative">
                          {CATEGORIES.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => handleCategoryChange(c.value)}
                              className={cn(
                                'relative z-10 px-6 py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full whitespace-nowrap text-center justify-center',
                                category === c.value ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              {category === c.value && (
                                <motion.div
                                  layoutId="desktop-category-pill"
                                  className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-4 flex-wrap w-auto ml-auto">
                        {viewMode === 'list' && (
                          <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
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
                          {(isFetching || isFetchingSecondary) && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping shrink-0" />}
                          <span>{filtered.length} об'єктів</span>
                        </p>

                        <div className="flex p-1 bg-muted rounded-full relative shrink-0">
                          {[
                            { id: 'list', icon: LayoutGrid, label: 'Список' },
                            { id: 'map', icon: MapIcon, label: 'Карта' },
                          ].map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              aria-label={v.label}
                              onClick={() => startTransition(() => handleViewModeChange(v.id))}
                              className={cn(
                                'relative z-10 flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full',
                                viewMode === v.id ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              {viewMode === v.id && (
                                <motion.div
                                  layoutId="desktop-view-pill"
                                  className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}
                              <v.icon className="w-4 h-4" />
                              <span>{v.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col w-full">
                      <div className="flex flex-wrap items-center gap-3 w-full font-inter">
                        <div onFocus={ensureGeoData} className="relative flex-1 min-w-[140px] max-w-[200px]">
                          <Autocomplete
                            placeholder="Оберіть ЖК..."
                            options={complexOptions}
                            value={searchComplex}
                            onChange={handleComplexSelect}
                            onInputChange={setSearchComplex}
                          />
                        </div>

                        <div onFocus={ensureGeoData} className="relative flex-1 min-w-[140px] max-w-[200px]">
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

                        <div onFocus={ensureGeoData} className="relative flex-1 min-w-[100px] max-w-[120px]">
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
                            contentClassName="w-[min(420px,calc(100vw-2rem))]"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                          aria-expanded={showAdvancedFilters}
                          className="relative w-auto px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground font-semibold"
                        >
                          <span className="truncate">Більше фільтрів</span>
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
                                contentClassName="w-[min(740px,calc(100vw-2rem))]"
                              />

                              <CheckboxFilter
                                label="Район"
                                title="Оберіть район"
                                options={DISTRICTS}
                                selected={districts}
                                onChange={setDistricts}
                                contentClassName="w-[min(450px,calc(100vw-2rem))]"
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
                                contentClassName="w-[min(450px,calc(100vw-2rem))]"
                              />

                              <button
                                type="button"
                                onClick={handleToggleErecovery}
                                aria-pressed={filterErecovery}
                                tabIndex={0}
                                className={cn(
                                  'w-auto px-5 py-3.5 rounded-full text-sm font-inter font-semibold transition-all flex items-center justify-center gap-2 border select-none',
                                  filterErecovery
                                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                                    : 'bg-muted hover:bg-emerald-500/10 text-foreground border-transparent hover:border-emerald-500/30'
                                )}
                              >
                                <Hammer className={cn('w-4 h-4 shrink-0', filterErecovery ? 'text-white' : 'text-emerald-600')} />
                                <span className="truncate">єВідновлення</span>
                              </button>

                              <button
                                type="button"
                                onClick={handleToggleEoselia}
                                aria-pressed={filterEoselia}
                                tabIndex={0}
                                className={cn(
                                  'w-auto px-5 py-3.5 rounded-full text-sm font-inter font-semibold transition-all flex items-center justify-center gap-2 border select-none',
                                  filterEoselia
                                    ? 'bg-navy text-white border-navy shadow-sm'
                                    : 'bg-muted hover:bg-navy/10 text-foreground border-transparent hover:border-navy/30'
                                )}
                              >
                                <HomeIcon className={cn('w-4 h-4 shrink-0', filterEoselia ? 'text-white' : 'text-navy')} />
                                <span className="truncate">єОселя</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {hasFilters && (
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/50 text-xs font-inter">
                        {activeFilterBadgesContent}
                      </div>
                    )}
                  </div>
                </LayoutGroup>
              </motion.div>
            )}
          </AnimatePresence>

          {viewMode === 'map' && (
            <div className="flex justify-center absolute left-1/2 -bottom-5 -translate-x-1/2 z-50">
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
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 border border-destructive/40 bg-destructive/10 text-destructive text-sm font-inter mb-6 mt-4 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Помилка завантаження: {error.message}
          </div>
        )}
      </div>

      {viewMode === 'map' && (
        <div className="fixed inset-0 top-16 sm:top-20 z-0">
          {isLookupLoading ? (
            <div className="w-full h-full animate-pulse bg-muted flex items-center justify-center">
              <p className="text-muted-foreground font-inter text-sm">Завантаження карти...</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="w-full h-full animate-pulse bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground font-inter text-sm">Завантаження карти...</p>
                </div>
              }
            >
              <MapView properties={filtered} />
            </Suspense>
          )}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
          {isLookupLoading ? (
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
                      initial={i === 0 ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i === 0 ? 0 : (i % 18) * 0.025 }}
                      className="h-full"
                    >
                      <PropertyCard property={item.data} priority={i === 0} />
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

      {/* Mobile Full-Screen Filter Sheet (< lg) */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={handleCloseMobileFilters}
        deal={deal}
        category={category}
        filteredCount={filtered.length}
        activeFiltersCount={activeFiltersCount}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        onEnsureGeoData={ensureGeoData}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchComplex={searchComplex}
        complexOptions={complexOptions}
        onComplexSelect={handleComplexSelect}
        onComplexInputChange={setSearchComplex}
        searchStreet={searchStreet}
        streetOptions={streetOptions}
        onStreetChange={setSearchStreet}
        onStreetInputChange={setSearchStreet}
        searchHouse={searchHouse}
        houseOptions={houseOptions}
        onHouseChange={setSearchHouse}
        onHouseInputChange={setSearchHouse}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        minArea={minArea}
        maxArea={maxArea}
        onMinAreaChange={setMinArea}
        onMaxAreaChange={setMaxArea}
        subTypes={subTypes}
        onSubTypesChange={setSubTypes}
        filterErecovery={filterErecovery}
        onToggleErecovery={handleToggleErecovery}
        filterEoselia={filterEoselia}
        onToggleEoselia={handleToggleEoselia}
        metroStations={metroStations}
        onMetroStationsChange={setMetroStations}
        districts={districts}
        onDistrictsChange={setDistricts}
        minFloor={minFloor}
        maxFloor={maxFloor}
        onMinFloorChange={setMinFloor}
        onMaxFloorChange={setMaxFloor}
        minFloorsTotal={minFloorsTotal}
        maxFloorsTotal={maxFloorsTotal}
        onMinFloorsTotalChange={setMinFloorsTotal}
        onMaxFloorsTotalChange={setMaxFloorsTotal}
        states={states}
        onStatesChange={setStates}
      />

      {/* Mascot Telegram Scroll Popup Modal */}
      <MascotTelegramModal deal={deal} />
    </div>
  )
}

export default CatalogPage
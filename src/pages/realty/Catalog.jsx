import { useState, useMemo, useEffect, useRef, startTransition } from 'react'
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { X, LayoutGrid, Map, AlertCircle, ChevronLeft, ChevronRight, Heart, ChevronDown, Filter, ChevronUp } from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import MapView from '@/components/realty/MapView'
import { getAllObjects, getObjects, mapObject } from '@/lib/novostoyApi'
import { useFavorites } from '@/lib/FavoritesContext'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import SeoMeta from '@/components/seo/SeoMeta'
import JsonLd, { generateItemListSchema } from '@/components/seo/JsonLd'
import { Autocomplete } from '@/components/ui/autocomplete'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'apartment', label: 'Квартири', path: '/flats' },
  { value: 'house', label: 'Будинки', path: '/houses' },
  { value: 'commercial', label: 'Комерція', path: '/realtys' },
]

const SUBTYPES_BY_CATEGORY = {
  apartment: [
    { value: 'rooms_1', label: '1-комн. квартира' },
    { value: 'rooms_2', label: '2-комн. квартира' },
    { value: 'rooms_3', label: '3-комн. квартира' },
    { value: 'rooms_4', label: '4-комн. квартира' },
    { value: 'rooms_5+', label: '5 и более комнат' },
    { value: 'gostinka', label: 'гостинки' },
    { value: 'gostinka_su', label: 'гостинки с с/у' },
    { value: 'podselenie', label: 'подселение' },
  ],
  house: [
    { value: 'whole', label: 'целый' },
    { value: 'half', label: '1/2' },
    { value: 'third', label: '1/3' },
    { value: 'dacha', label: 'дача' },
    { value: 'land', label: 'участок' },
  ],
  commercial: [
    { value: 'premises', label: 'помещение' },
    { value: 'building', label: 'здание' },
    { value: 'land_comm', label: 'участок' },
    { value: 'garage', label: 'гараж' },
    { value: 'shop', label: 'магазин' },
    { value: 'office', label: 'офис' },
    { value: 'production', label: 'производство' },
    { value: 'sto', label: 'СТО' },
    { value: 'warehouse', label: 'склад' },
    { value: 'non_res_complex', label: 'нежил. комплекс' },
    { value: 'cafe', label: 'кафе' },
    { value: 'kiosk', label: 'киоск' },
  ]
}

const METRO_LINES = [
  {
    name: 'Холодногірсько-Заводська лінія',
    color: 'text-red-500',
    stations: ['Холодная гора', 'Вокзальная', 'Центральный рынок', 'Площадь Конституции', 'Левада', 'Спортивная', 'Заводская', 'Турбоатом', 'Дворец Спорта', 'Армейская', 'Им. А. С. Масельского', 'Тракторный завод', 'Индустриальная']
  },
  {
    name: 'Салтівська лінія',
    color: 'text-blue-500',
    stations: ['Исторический музей', 'Университет', 'Ярослава Мудрого', 'Киевская', 'Академика Барабашова', 'Академика Павлова', 'Студенческая', 'Салтовская']
  },
  {
    name: 'Олексіївська лінія',
    color: 'text-green-500',
    stations: ['Метростроителей', 'Державинская', 'Защитников Украины', 'Архитектора Бекетова', 'Госпром', 'Научная', 'Ботанический сад', '23 Августа', 'Алексеевская', 'Победа']
  }
]

const DISTRICTS = [
  { value: 'Алексеевка', label: 'Олексіївка' },
  { value: 'Аэропорт', label: 'Аеропорт' },
  { value: 'Восточный', label: 'Східний' },
  { value: 'Гагарина (нач.)', label: 'Гагаріна (поч.)' },
  { value: 'Жуковского', label: 'Жуковського' },
  { value: 'Журавлевка', label: 'Журавлівка' },
  { value: 'З-д Шевченко', label: 'Завод Шевченка' },
  { value: 'Залютино', label: 'Залютине' },
  { value: 'Ивановка', label: 'Іванівка' },
  { value: 'Конный рынок', label: 'Кінний ринок' },
  { value: 'Красный луч', label: 'Червоний Промінь' },
  { value: 'Лысая Гора', label: 'Лиса Гора' },
  { value: 'Москалевка', label: 'Москалівка' },
  { value: 'Н.Бавария', label: 'Нова Баварія' },
  { value: 'Немышля', label: 'Немишля' },
  { value: 'Нов.Дома', label: 'Нові Будинки' },
  { value: 'Одесская', label: 'Одеська' },
  { value: 'Основа', label: 'Основа' },
  { value: 'П.Поле', label: 'Павлове Поле' },
  { value: 'Павловка', label: 'Павлівка' },
  { value: 'Песочин', label: 'Пісочин' },
  { value: 'Пятихатки', label: 'П\'ятихатки' },
  { value: 'Роганский', label: 'Роганський' },
  { value: 'Салтовка', label: 'Салтівка' },
  { value: 'Сев.Салтовка', label: 'Північна Салтівка' },
  { value: 'Сортировка', label: 'Сортувальня' },
  { value: 'Хол.Гора', label: 'Холодна Гора' },
  { value: 'ХТЗ', label: 'ХТЗ' },
  { value: 'Шишковка', label: 'Шишківка' },
  { value: 'ЮВ и ЦР', label: 'ПВ і ЦР' }, 
  { value: 'Центр', label: 'Центр' }
].sort((a, b) => a.label.localeCompare(b.label, 'uk'))

const STATES = [
  { value: '1', label: 'Житловий' },
  { value: '2', label: 'Косметичний ремонт' },
  { value: '3', label: 'Євроремонт' },
  { value: '4', label: 'Капітальний ремонт' },
  { value: '5', label: 'Без ремонту' },
  { value: '6', label: 'Старий' },
  { value: '7', label: 'Недобудова' },
  { value: '8', label: 'Будівельний стан' },
  { value: '9', label: 'Під обробку' }
]

const CatalogPage = ({ defaultCategory = 'apartment' }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  
  const [deal, setDeal] = useState(searchParams.get('deal') || 'sale')
  const [category, setCategory] = useState(defaultCategory)
  const [subTypes, setSubTypes] = useState(searchParams.get('subTypes') ? searchParams.get('subTypes').split(',') : [])
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const [minArea, setMinArea] = useState(searchParams.get('minArea') || '')
  const [maxArea, setMaxArea] = useState(searchParams.get('maxArea') || '')

  const [searchComplex, setSearchComplex] = useState(searchParams.get('searchComplex') || '')
  const [searchStreet, setSearchStreet] = useState(searchParams.get('searchStreet') || '')
  const [searchHouse, setSearchHouse] = useState(searchParams.get('searchHouse') || '')
  const [geoData, setGeoData] = useState({ streets: [], houses: {}, complexes: [] })
  
  const [metroStations, setMetroStations] = useState(searchParams.get('metroStations') ? searchParams.get('metroStations').split(',') : [])
  const [districts, setDistricts] = useState(searchParams.get('districts') ? searchParams.get('districts').split(',') : [])
  const [states, setStates] = useState(searchParams.get('states') ? searchParams.get('states').split(',') : [])
  const [minFloor, setMinFloor] = useState(searchParams.get('minFloor') || '')
  const [maxFloor, setMaxFloor] = useState(searchParams.get('maxFloor') || '')
  const [minFloorsTotal, setMinFloorsTotal] = useState(searchParams.get('minFloorsTotal') || '')
  const [maxFloorsTotal, setMaxFloorsTotal] = useState(searchParams.get('maxFloorsTotal') || '')

  useEffect(() => {
    Promise.all([
      import('@/data/streets.json').then(m => m.default),
      import('@/data/houses.json').then(m => m.default),
      import('@/data/complexes.json').then(m => m.default)
    ]).then(([streets, houses, complexes]) => {
      setGeoData({ streets, houses, complexes })
    }).catch(e => console.error("Error loading geo data", e))
  }, [])

  const streetOptions = useMemo(() => geoData.streets.map(s => ({ label: s.current_name, value: s.current_name })), [geoData.streets])
  const complexOptions = useMemo(() => geoData.complexes.map(c => ({ label: c.jk_name, value: c.jk_name })), [geoData.complexes])

  const handleComplexSelect = (val) => {
    setSearchComplex(val)
    if (!val) return
    const c = geoData.complexes.find(x => x.jk_name === val)
    if (c && c.address) {
      const parts = c.address.split(',')
      if (parts.length > 0) setSearchStreet(parts[0].replace(/вул\.|пров\.|просп\.|пр-т/g, '').trim())
      if (parts.length > 1) setSearchHouse(parts[1].trim())
    }
  }

  const [viewMode, setViewMode] = useState(searchParams.get('viewMode') || 'list')
  const [showMapFilters, setShowMapFilters] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const itemsPerPage = 18

  const { favorites } = useFavorites()
  const isFirstRender = useRef(true)
  const location = useLocation()
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCategory(defaultCategory)
    setSubTypes([])
  }, [defaultCategory])

  // Load from sessionStorage if navigated without params
  useEffect(() => {
    if (!location.search) {
      const saved = sessionStorage.getItem('catalogParams')
      if (saved) {
        navigate(location.pathname + saved, { replace: true })
      }
    }
  }, [location.search, navigate])

  useEffect(() => {
    const params = new URLSearchParams()
    if (deal) params.set('deal', deal)
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
    if (viewMode !== 'list') params.set('viewMode', viewMode)
    if (currentPage > 1) params.set('page', currentPage)
    
    const searchString = params.toString()
    if (searchString) {
      sessionStorage.setItem('catalogParams', '?' + searchString)
    } else {
      sessionStorage.removeItem('catalogParams')
    }
    
    setSearchParams(params, { replace: true })
  }, [deal, category, subTypes, minPrice, maxPrice, minArea, maxArea, searchComplex, searchStreet, searchHouse, metroStations, districts, states, minFloor, maxFloor, minFloorsTotal, maxFloorsTotal, viewMode, currentPage, setSearchParams])

  // Reset page when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setCurrentPage(1)
  }, [deal, category, subTypes, minPrice, maxPrice, minArea, maxArea, searchComplex, searchStreet, searchHouse, metroStations, districts, states, minFloor, maxFloor, minFloorsTotal, maxFloorsTotal, viewMode])

  // Lock body scroll in map view to prevent seeing footer
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
    setSearchParams(prev => {
      if (mode === 'list') prev.delete('viewMode')
      else prev.set('viewMode', mode)
      return prev
    })
    // Auto-hide map filters when entering map mode on mobile for better UX
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

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['novostoy-objects', deal],
    queryFn: async () => {
      const filters = {}
      if (deal === 'sale') filters.sell_type = '2'
      if (deal === 'rent') filters.sell_type = '1'

      // 1. Instantly return the first 100 properties so the UI unblocks and the user sees results
      const firstPage = await getObjects(filters).catch(() => ({ data: [] }))
      const initialItems = (firstPage?.data || []).map(mapObject)
      
      // 2. Quietly kick off the exhaustive fetch in the background
      getAllObjects(filters).then(allItems => {
        // 3. When done, silently update the cache to the full list (4000+ items)
        queryClient.setQueryData(['novostoy-objects', deal], allItems.map(mapObject))
      }).catch(e => console.error("Background fetch failed", e))

      return initialItems
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (minPrice && p.price < Number(minPrice)) return false
      if (maxPrice && p.price > Number(maxPrice)) return false

      if (minArea && p.area < Number(minArea)) return false
      if (maxArea && p.area > Number(maxArea)) return false

      if (category && p.type !== category) return false

      if (subTypes.length > 0) {
        const matches = subTypes.some(st => {
          if (st === 'rooms_1') return p.rooms === 1
          if (st === 'rooms_2') return p.rooms === 2
          if (st === 'rooms_3') return p.rooms === 3
          if (st === 'rooms_4') return p.rooms === 4
          if (st === 'rooms_5+') return p.rooms >= 5
          return true // Unmapped subtypes return true temporarily
        })
        if (!matches) return false
      }

      if (searchStreet) {
        const query = searchStreet.toLowerCase().replace(/вул\.|пров\.|просп\.|пр-т|м\.|пер\.|ул\.|проспект/g, '').trim()
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
        if (p.building?.toLowerCase() !== houseQuery && !p.building?.toLowerCase().includes(houseQuery)) return false
      }

      if (metroStations.length > 0) {
        if (!metroStations.some(s => p.mregion?.toLowerCase().includes(s.toLowerCase()))) return false
      }

      return true
    })
  }, [properties, minPrice, maxPrice, minArea, maxArea, category, subTypes, searchStreet, searchHouse, metroStations, districts, states, minFloor, maxFloor, minFloorsTotal, maxFloorsTotal])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentItems = viewMode === 'list'
    ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filtered // map view shows all filtered

  const clearFilters = () => {
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
  }
  const hasFilters = subTypes.length > 0 || minPrice || maxPrice || minArea || maxArea || searchComplex || searchStreet || searchHouse || metroStations.length > 0 || districts.length > 0 || states.length > 0 || minFloor || maxFloor || minFloorsTotal || maxFloorsTotal

  // Dynamic SEO calculation
  const getSeoTitle = () => {
    let title = category === 'apartment' ? 'Квартири' : category === 'house' ? 'Будинки та ділянки' : category === 'commercial' ? 'Комерційна нерухомість' : 'Каталог нерухомості'
    if (deal === 'sale') title = `Продаж: ${title.toLowerCase()}`
    if (deal === 'rent') title = `Оренда: ${title.toLowerCase()}`
    if (filtered.length > 0) {
      const minP = minPrice ? Number(minPrice) : Math.min(...filtered.map(p => p.price))
      title += ` в Харкові. ${filtered.length} об'єктів від $${minP.toLocaleString()}`
    } else {
      title += ' в Харкові'
    }
    return title
  }
  
  const getSeoDescription = () => {
    const catName = category === 'apartment' ? 'квартир' : category === 'house' ? 'будинків' : category === 'commercial' ? 'комерційної нерухомості' : 'нерухомості'
    const dealName = deal === 'rent' ? 'оренду' : 'продаж'
    return `Актуальний каталог на ${dealName} ${catName} в Харкові та області від агентства Харків Ріелтер. Безпечні угоди, перевірені об'єкти.`
  }

  const schemaUrl = `https://kharkov-realter.com.ua${location.pathname}${location.search}`

  return (
    <div className={cn("pt-24 flex flex-col", viewMode === 'list' ? 'pb-8 min-h-screen' : 'h-screen overflow-hidden pb-0')} id="catalog-top">
      <SeoMeta 
        title={getSeoTitle()} 
        description={getSeoDescription()} 
        url={`${location.pathname}${location.search}`} 
      />
      <JsonLd data={generateItemListSchema(filtered, schemaUrl)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-40 transition-all">
        {/* Toggle Filters Button for Mobile Map View */}
        {viewMode === 'map' && (
          <div className="lg:hidden mb-4 relative z-50">
            <button 
              onClick={() => setShowMapFilters(!showMapFilters)}
              className="w-full py-3 bg-card backdrop-blur-md border border-border rounded-2xl shadow-md text-sm font-inter font-semibold text-foreground flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showMapFilters ? 'Сховати фільтри' : 'Показати фільтри'}
            </button>
          </div>
        )}

        {/* Filters */}
        <AnimatePresence initial={false}>
          {!(viewMode === 'map' && !showMapFilters) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={cn(
                "bg-card shadow-md border border-border flex-shrink-0 w-full relative z-40 mt-2",
                viewMode === 'map' ? "rounded-3xl" : "rounded-3xl mb-10 sticky top-24"
              )}
            >
              <LayoutGroup id={viewMode}>
              <div className="p-4 sm:p-6 flex flex-col gap-5">
            {/* Top row: Deal Tabs + View Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border/50 pb-5">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                {/* Deal tabs */}
                <div className="flex p-1 bg-muted rounded-full shrink-0 relative">
                  {[['sale', 'Продаж'], ['rent', 'Оренда']].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setDeal(v)}
                      className={cn('relative z-10 px-6 py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full', {
                        'text-white': deal === v,
                        'text-muted-foreground hover:text-foreground': deal !== v
                      })}
                    >
                      {deal === v && (
                        <motion.div
                          layoutId="deal-pill"
                          className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      {l}
                    </button>
                  ))}
                </div>
                {/* Category tabs */}
                <div className="flex p-1 bg-muted rounded-full w-fit shrink-0 relative">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.value}
                      onClick={() => navigate(c.path + location.search)}
                      className={cn('relative z-10 px-6 py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full whitespace-nowrap', {
                        'text-white': category === c.value,
                        'text-muted-foreground hover:text-foreground': category !== c.value
                      })}
                    >
                      {category === c.value && (
                        <motion.div
                          layoutId="category-pill"
                          className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      {c.label}
                    </button>
                  ))}
                </div>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-sm font-inter font-semibold text-destructive hover:text-destructive/80 transition-colors flex items-center justify-center gap-1.5 shrink-0 px-4 py-2 bg-destructive/10 rounded-full h-[40px]">
                      <X className="w-4 h-4 shrink-0" /> <span>Скинути</span>
                    </button>
                  )}
                </div>

              {/* View Toggle (Moved from Header) */}
              <div className="flex items-center gap-4 lg:gap-6">
                <p className="text-muted-foreground text-sm font-inter hidden xl:block font-medium">
                  {properties.length <= 100 ? (
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-navy/70 bg-navy/5 px-3 py-1.5 rounded-full animate-pulse font-semibold">
                      <svg className="w-3.5 h-3.5 animate-spin text-navy" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Оновлення бази...
                    </span>
                  ) : (
                    <>{filtered.length} об'єктів</>
                  )}
                </p>
                <div className="flex p-1 bg-muted rounded-full relative">
                  {[
                    { id: 'list', icon: LayoutGrid, label: 'Список' },
                    { id: 'map', icon: Map, label: 'Карта' }
                  ].map(v => (
                    <button
                      key={v.id}
                      onClick={() => startTransition(() => setViewMode(v.id))}
                      className={cn('relative z-10 flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-inter font-semibold transition-colors rounded-full', {
                        'text-white': viewMode === v.id,
                        'text-muted-foreground hover:text-foreground': viewMode !== v.id
                      })}
                    >
                      {viewMode === v.id && (
                        <motion.div
                          layoutId="view-pill"
                          className="absolute inset-0 gradient-gold shadow-md rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <v.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom row: Inputs & Popovers */}
            <div className="flex flex-wrap items-center gap-3 w-full font-inter">
              {/* Complex */}
              <div className="relative flex-1 min-w-[150px] lg:max-w-[200px] z-50">
                <Autocomplete
                  placeholder="Оберіть ЖК..."
                  options={complexOptions}
                  value={searchComplex}
                  onChange={handleComplexSelect}
                  onInputChange={setSearchComplex}
                />
              </div>

              {/* Street */}
              <div className="relative flex-1 min-w-[150px] lg:max-w-[200px] z-50">
                <Autocomplete
                  placeholder="Вулиця..."
                  options={streetOptions}
                  value={searchStreet}
                  onChange={(val) => { setSearchStreet(val); setSearchHouse('') }}
                  onInputChange={(val) => { setSearchStreet(val); setSearchHouse('') }}
                  minChars={1}
                />
              </div>

              {/* House */}
              <div className="relative flex-1 min-w-[100px] lg:max-w-[120px] z-50">
                <Autocomplete
                  placeholder="Дім..."
                  disabled={!searchStreet}
                  options={(() => {
                    if (!searchStreet) return []
                    const q = searchStreet.toLowerCase().replace(/вул\.|пров\.|просп\.|пр-т|м\.|пер\.|ул\.|проспект/g, '').trim()
                    const st = geoData.streets.find(s => {
                        const cur = s.current_name.toLowerCase()
                        if (cur.length > 2 && (q.includes(cur) || cur.includes(q))) return true
                        if (s.old_names) return s.old_names.some(o => {
                            const old = o.toLowerCase()
                            return old.length > 2 && (q.includes(old) || old.includes(q))
                        })
                        return false
                    })
                    if (!st || !geoData.houses[st.street_id]) return []
                    return Object.keys(geoData.houses[st.street_id]).map(h => ({ label: h, value: h }))
                  })()}
                  value={searchHouse}
                  onChange={setSearchHouse}
                  onInputChange={setSearchHouse}
                />
              </div>

              {/* Ціна */}
              <Popover>
                <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground min-w-[120px] [&[data-state=open]>svg]:rotate-180">
                  <span className="truncate">Ціна</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                  {(minPrice || maxPrice) && <span className="absolute top-0 right-1 w-3 h-3 bg-navy border-2 border-card rounded-full" />}
                </PopoverTrigger>
                <PopoverContent className="w-64 p-5 border-border bg-card rounded-2xl shadow-lg" align="start">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-semibold">Ціна ($)</p>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="number" placeholder="від" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                    <span className="text-muted-foreground">–</span>
                    <input type="number" placeholder="до" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Площа */}
              <Popover>
                <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground min-w-[120px] [&[data-state=open]>svg]:rotate-180">
                  <span className="truncate">Площа</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                  {(minArea || maxArea) && <span className="absolute top-0 right-1 w-3 h-3 bg-navy border-2 border-card rounded-full" />}
                </PopoverTrigger>
                <PopoverContent className="w-64 p-5 border-border bg-card rounded-2xl shadow-lg" align="start">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-semibold">Площа (кв.м)</p>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="number" placeholder="від" value={minArea} onChange={e => setMinArea(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                    <span className="text-muted-foreground">–</span>
                    <input type="number" placeholder="до" value={maxArea} onChange={e => setMaxArea(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Тип нерухомості */}
              {category && SUBTYPES_BY_CATEGORY[category] && (
                <Popover>
                  <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground [&[data-state=open]>svg]:rotate-180">
                    <span className="truncate">Тип нерухомості</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                    {subTypes.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">{subTypes.length}</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-[420px] p-6 border-border bg-card rounded-2xl shadow-lg" align="start">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4 font-semibold">Тип нерухомості</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {SUBTYPES_BY_CATEGORY[category].map(t => (
                        <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
                          <div className={cn("w-5 h-5 rounded flex items-center justify-center transition-colors border", subTypes.includes(t.value) ? "bg-navy border-navy text-white" : "border-border group-hover:border-navy")}>
                            {subTypes.includes(t.value) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={subTypes.includes(t.value)}
                            onChange={(e) => {
                              if (e.target.checked) setSubTypes([...subTypes, t.value])
                              else setSubTypes(subTypes.filter(v => v !== t.value))
                            }}
                          />
                          <span className={cn("text-sm transition-colors", subTypes.includes(t.value) ? "text-navy font-medium" : "text-foreground group-hover:text-navy")}>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Advanced Filters Toggle Button */}
              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground font-semibold"
              >
                <span>Більше фільтрів</span> 
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200", showAdvancedFilters && "rotate-180")} />
                {((metroStations.length > 0 ? 1 : 0) + (districts.length > 0 ? 1 : 0) + (states.length > 0 ? 1 : 0) + (minFloor || maxFloor ? 1 : 0) + (minFloorsTotal || maxFloorsTotal ? 1 : 0)) > 0 && !showAdvancedFilters && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">
                    {((metroStations.length > 0 ? 1 : 0) + (districts.length > 0 ? 1 : 0) + (states.length > 0 ? 1 : 0) + (minFloor || maxFloor ? 1 : 0) + (minFloorsTotal || maxFloorsTotal ? 1 : 0))}
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters Row */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap items-center gap-3 w-full font-inter overflow-hidden border-t border-border/50 pt-4"
                >
              {/* Станція метро */}
              <Popover>
                <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground [&[data-state=open]>svg]:rotate-180">
                  <span className="truncate">Станція метро</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                  {metroStations.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">{metroStations.length}</span>}
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-6 border-border bg-card rounded-2xl shadow-lg" align="start">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4 font-semibold">Оберіть станції</p>
                  <div className="max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
                    {METRO_LINES.map(line => (
                      <div key={line.name} className="mb-6 last:mb-0">
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-4 ${line.color}`}>{line.name}</p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                          {line.stations.map(st => (
                            <label key={st} className="flex items-center gap-3 cursor-pointer group">
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center transition-colors border", metroStations.includes(st) ? "bg-navy border-navy text-white" : "border-border group-hover:border-navy")}>
                                {metroStations.includes(st) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                              </div>
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={metroStations.includes(st)}
                                onChange={(e) => {
                                  if (e.target.checked) setMetroStations([...metroStations, st])
                                  else setMetroStations(metroStations.filter(v => v !== st))
                                }}
                              />
                              <span className={cn("text-sm truncate transition-colors", metroStations.includes(st) ? "text-navy font-medium" : "text-foreground group-hover:text-navy")} title={st}>{st}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Район */}
              <Popover>
                <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground [&[data-state=open]>svg]:rotate-180">
                  <span className="truncate">Район</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                  {districts.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">{districts.length}</span>}
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-6 border-border bg-card rounded-2xl shadow-lg" align="start">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4 font-semibold">Оберіть район</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
                    {DISTRICTS.map(d => (
                      <label key={d.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={cn("w-5 h-5 rounded flex items-center justify-center transition-colors border", districts.includes(d.value) ? "bg-navy border-navy text-white" : "border-border group-hover:border-navy")}>
                          {districts.includes(d.value) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={districts.includes(d.value)}
                          onChange={(e) => {
                            if (e.target.checked) setDistricts([...districts, d.value])
                            else setDistricts(districts.filter(v => v !== d.value))
                          }}
                        />
                        <span className={cn("text-sm truncate transition-colors", districts.includes(d.value) ? "text-navy font-medium" : "text-foreground group-hover:text-navy")} title={d.label}>{d.label}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Поверх */}
              <Popover>
                <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground min-w-[120px] [&[data-state=open]>svg]:rotate-180">
                  <span className="truncate">Поверх</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                  {(minFloor || maxFloor) && <span className="absolute top-0 right-1 w-3 h-3 bg-navy border-2 border-card rounded-full" />}
                </PopoverTrigger>
                <PopoverContent className="w-64 p-5 border-border bg-card rounded-2xl shadow-lg" align="start">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-semibold">Поверх</p>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="number" placeholder="від" value={minFloor} onChange={e => setMinFloor(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                    <span className="text-muted-foreground">–</span>
                    <input type="number" placeholder="до" value={maxFloor} onChange={e => setMaxFloor(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Поверховість */}
              <Popover>
                <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground min-w-[120px] [&[data-state=open]>svg]:rotate-180">
                  <span className="truncate">Всього поверхів</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                  {(minFloorsTotal || maxFloorsTotal) && <span className="absolute top-0 right-1 w-3 h-3 bg-navy border-2 border-card rounded-full" />}
                </PopoverTrigger>
                <PopoverContent className="w-64 p-5 border-border bg-card rounded-2xl shadow-lg" align="start">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-semibold">Всього поверхів</p>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="number" placeholder="від" value={minFloorsTotal} onChange={e => setMinFloorsTotal(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                    <span className="text-muted-foreground">–</span>
                    <input type="number" placeholder="до" value={maxFloorsTotal} onChange={e => setMaxFloorsTotal(e.target.value)}
                      className="w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground" />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Стан */}
              <Popover>
                <PopoverTrigger className="relative px-6 py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-3 hover:bg-muted/80 transition-colors text-foreground min-w-[120px] [&[data-state=open]>svg]:rotate-180">
                  <span className="truncate">Стан</span> <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" />
                  {states.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">{states.length}</span>}
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-6 border-border bg-card rounded-2xl shadow-lg" align="start">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4 font-semibold">Оберіть стан</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {STATES.map(st => (
                      <label key={st.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={cn("w-5 h-5 rounded flex items-center justify-center transition-colors border", states.includes(st.value) ? "bg-navy border-navy text-white" : "border-border group-hover:border-navy")}>
                          {states.includes(st.value) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={states.includes(st.value)}
                          onChange={(e) => {
                            if (e.target.checked) setStates([...states, st.value])
                            else setStates(states.filter(v => v !== st.value))
                          }}
                        />
                        <span className={cn("text-sm transition-colors", states.includes(st.value) ? "text-navy font-medium" : "text-foreground group-hover:text-navy")}>{st.label}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

                </motion.div>
              )}
            </AnimatePresence>
            </div>
            </LayoutGroup>
          </motion.div>
        )}
    </AnimatePresence>

        {/* Desktop Toggle Map Filters Button */}
        {viewMode === 'map' && (
          <div className="hidden lg:flex justify-center absolute left-1/2 -bottom-5 -translate-x-1/2 z-50">
             <button 
                onClick={() => setShowMapFilters(!showMapFilters)}
                className="bg-white border border-border shadow-md rounded-full p-1.5 text-muted-foreground hover:text-navy hover:shadow-lg transition-all flex items-center justify-center"
             >
                 <ChevronUp className={cn("w-5 h-5 transition-transform duration-300", !showMapFilters && "rotate-180")} />
             </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 border border-destructive/40 bg-destructive/10 text-destructive text-sm font-inter mb-6 mt-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Помилка завантаження: {error.message}
          </div>
        )}
      </div>

      {/* Content: Map or List */}
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
              {[...Array(6)].map((_, i) => <div key={i} className="bg-card border border-border aspect-[4/5] animate-pulse rounded-2xl" />)}
            </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-cormorant text-3xl text-muted-foreground mb-2">Об'єкти не знайдено</p>
            <p className="text-sm text-muted-foreground font-inter">Спробуйте змінити параметри пошуку</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % 20) * 0.05 }}>
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border">

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Pagination logic */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1
                    const isCurrent = page === currentPage
                    const isNear = Math.abs(currentPage - page) <= 2
                    const isEdge = page === 1 || page === totalPages

                    if (!isNear && !isEdge) {
                      if (page === 2 || page === totalPages - 1) {
                        return <span key={page} className="px-2 text-muted-foreground">...</span>
                      }
                      return null
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn('relative z-10 w-10 h-10 flex items-center justify-center text-sm font-inter transition-colors rounded-full', {
                          'text-white': isCurrent,
                          'text-muted-foreground hover:bg-muted hover:text-foreground': !isCurrent
                        })}
                      >
                        {isCurrent && (
                          <motion.div
                            layoutId="pagination-pill"
                            className="absolute inset-0 gradient-gold rounded-full -z-10"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        {page}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors text-sm"
                  >
                    вперед <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {totalPages <= 1 && filtered.length > 0 && (
              <div className="flex justify-center pt-8 border-t border-border mt-4">
              </div>
            )}
          </div>
        )}
        </div>
      )}
    </div>
  )
}

export default CatalogPage
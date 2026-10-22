import { useState, useMemo, useEffect, useRef, startTransition } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { X, LayoutGrid, Map, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, Filter, ChevronUp } from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import MapView from '@/components/realty/MapView'
import { useCatalogObjects } from '@/lib/useCatalogObjects'
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
    { value: 'rooms_1', label: '1-кімн. квартира' },
    { value: 'rooms_2', label: '2-кімн. квартира' },
    { value: 'rooms_3', label: '3-кімн. квартира' },
    { value: 'rooms_4', label: '4-кімн. квартира' },
    { value: 'rooms_5+', label: '5 і більше кімнат' },
    { value: 'gostinka', label: 'Гостинка' },
    { value: 'gostinka_su', label: 'Гостинка зі своїм с/в' },
    { value: 'podselenie', label: 'Підселення' },
  ],
  house: [
    { value: 'whole', label: 'Окремий будинок' },
    { value: 'half', label: 'Частина будинку (1/2)' },
    { value: 'third', label: 'Частина будинку (1/3)' },
    { value: 'dacha', label: 'Дача' },
    { value: 'land', label: 'Земельна ділянка' },
  ],
  commercial: [
    { value: 'premises', label: 'Нежитлове приміщення' },
    { value: 'building', label: 'Окрема будівля' },
    { value: 'land_comm', label: 'Ділянка під комерцію' },
    { value: 'garage', label: 'Гараж / паркінг' },
    { value: 'shop', label: 'Магазин / торгова площа' },
    { value: 'office', label: 'Офіс' },
    { value: 'production', label: 'Виробниче приміщення' },
    { value: 'sto', label: 'СТО / автосервіс' },
    { value: 'warehouse', label: 'Склад' },
    { value: 'non_res_complex', label: 'Майновий комплекс' },
    { value: 'cafe', label: 'Кафе / ресторан' },
    { value: 'kiosk', label: 'Кіоск / павільйон' },
  ]
}

const METRO_LINES = [
  {
    name: 'Холодногірсько-Заводська лінія',
    color: 'text-red-500',
    stations: [
      { label: 'Холодна гора', value: 'Холодная гора' },
      { label: 'Вокзальна', value: 'Вокзальная' },
      { label: 'Центральний ринок', value: 'Центральный рынок' },
      { label: 'Майдан Конституції', value: 'Площадь Конституции' },
      { label: 'Левада', value: 'Левада' },
      { label: 'Спортивна', value: 'Спортивная' },
      { label: 'Заводська', value: 'Заводская' },
      { label: 'Турбоатом', value: 'Турбоатом' },
      { label: 'Палац Спорту', value: 'Дворец Спорта' },
      { label: 'Армійська', value: 'Армейская' },
      { label: 'Ім. О. С. Масельського', value: 'Им. А. С. Масельского' },
      { label: 'Тракторний завод', value: 'Тракторный завод' },
      { label: 'Індустріальна', value: 'Индустриальная' }
    ]
  },
  {
    name: 'Салтівська лінія',
    color: 'text-blue-500',
    stations: [
      { label: 'Історичний музей', value: 'Исторический музей' },
      { label: 'Університет', value: 'Университет' },
      { label: 'Ярослава Мудрого', value: 'Ярослава Мудрого' },
      { label: 'Київська', value: 'Киевская' },
      { label: 'Академіка Барабашова', value: 'Академика Барабашова' },
      { label: 'Академіка Павлова', value: 'Академика Павлова' },
      { label: 'Студентська', value: 'Студенческая' },
      { label: 'Салтівська', value: 'Салтовская' }
    ]
  },
  {
    name: 'Олексіївська лінія',
    color: 'text-green-500',
    stations: [
      { label: 'Метробудівників', value: 'Метростроителей' },
      { label: 'Захисників України', value: 'Защитников Украины' },
      { label: 'Архітектора Бекетова', value: 'Архитектора Бекетова' },
      { label: 'Держпром', value: 'Госпром' },
      { label: 'Наукова', value: 'Научная' },
      { label: 'Ботанічний сад', value: 'Ботанический сад' },
      { label: '23 Серпня', value: '23 Августа' },
      { label: 'Олексіївська', value: 'Алексеевская' },
      { label: 'Перемога', value: 'Победа' }
    ]
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

const checkSubTypeMatch = (p, st) => {
  if (st === 'rooms_1') return p.rooms === 1
  if (st === 'rooms_2') return p.rooms === 2
  if (st === 'rooms_3') return p.rooms === 3
  if (st === 'rooms_4') return p.rooms === 4
  if (st === 'rooms_5+') return p.rooms >= 5

  const text = `${p.title || ''} ${p.description || ''}`.toLowerCase()

  if (st === 'gostinka') {
    return text.includes('гостинк') || text.includes('гостинка') || text.includes('малогабарит')
  }
  if (st === 'gostinka_su') {
    const isGost = text.includes('гостинк') || text.includes('гостинка')
    const hasSu = text.includes('свой с/у') || text.includes('своїм с/в') || text.includes('свій с/в') || text.includes('санвуз') || text.includes('сануз')
    return isGost && hasSu
  }
  if (st === 'podselenie') {
    return text.includes('подселен') || text.includes('підселен') || text.includes('комнат') || text.includes('кімнат')
  }
  if (st === 'whole') {
    return p.type === 'house' && !text.includes('1/2') && !text.includes('1/3') && !text.includes('часть') && !text.includes('частин') && !text.includes('дач')
  }
  if (st === 'half') {
    return text.includes('1/2') || text.includes('полдома') || text.includes('півбудинк') || text.includes('часть') || text.includes('частин')
  }
  if (st === 'third') {
    return text.includes('1/3') || text.includes('треть')
  }
  if (st === 'dacha') {
    return text.includes('дач')
  }
  if (st === 'land' || st === 'land_comm') {
    return text.includes('участок') || text.includes('ділянк') || text.includes('земл')
  }
  if (st === 'office') {
    return text.includes('офис') || text.includes('офіс')
  }
  if (st === 'shop') {
    return text.includes('магазин') || text.includes('торгов')
  }
  if (st === 'warehouse') {
    return text.includes('склад')
  }
  if (st === 'production') {
    return text.includes('производ') || text.includes('виробниц') || text.includes('цех')
  }
  if (st === 'garage') {
    return text.includes('гараж') || text.includes('паркинг') || text.includes('паркінг') || text.includes('машином')
  }
  if (st === 'cafe') {
    return text.includes('кафе') || text.includes('ресторан') || text.includes('общепит') || text.includes('харчуван')
  }
  if (st === 'kiosk') {
    return text.includes('киоск') || text.includes('кіоск') || text.includes('павильон') || text.includes('павільйон')
  }
  if (st === 'sto') {
    return text.includes('сто') || text.includes('автосервис') || text.includes('автосервіс') || text.includes('мойка') || text.includes('мийка')
  }
  if (st === 'premises') {
    return p.type === 'commercial'
  }
  if (st === 'building' || st === 'non_res_complex') {
    return text.includes('здание') || text.includes('будівля') || text.includes('комплекс')
  }

  return true
}

const CatalogPage = ({ defaultCategory = 'apartment' }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [deal, setDeal] = useState(searchParams.get('deal') || 'sale')
  const [category, setCategory] = useState(defaultCategory)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date_desc')
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
  const houseOptions = useMemo(() => {
    if (!searchStreet || !geoData?.streets || !geoData?.houses) return []
    const q = searchStreet.toLowerCase().replace(/вул\.|пров\.|просп\.|пр-т|м\.|пер\.|ул\.|проспект/g, '').trim()
    const st = geoData.streets.find(s => {
      const cur = s.current_name.toLowerCase()
      if (cur.length > 2 && (q.includes(cur) || cur.includes(q))) return true
      if (s.old_names) {
        return s.old_names.some(o => {
          const old = o.toLowerCase()
          return old.length > 2 && (q.includes(old) || old.includes(q))
        })
      }
      return false
    })
    if (!st || !geoData.houses[st.street_id]) return []
    return Object.keys(geoData.houses[st.street_id]).map(h => ({ label: h, value: h }))
  }, [searchStreet, geoData])

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

  const handleCategoryChange = (catValue) => {
    if (category === catValue) return
    setCategory(catValue)
    setSubTypes([])
    setCurrentPage(1)
    const catObj = CATEGORIES.find(c => c.value === catValue)
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
      const found = CATEGORIES.find(c => path.startsWith(c.path))
      if (found && found.value !== category) {
        setCategory(found.value)
        setSubTypes([])
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [category])

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
    if (viewMode !== 'list') params.set('viewMode', viewMode)
    if (currentPage > 1) params.set('page', currentPage)
    
    const searchString = params.toString()
    if (searchString) {
      sessionStorage.setItem('catalogParams', '?' + searchString)
    } else {
      sessionStorage.removeItem('catalogParams')
    }
    
    setSearchParams(params, { replace: true })
  }, [deal, category, searchQuery, sortBy, subTypes, minPrice, maxPrice, minArea, maxArea, searchComplex, searchStreet, searchHouse, metroStations, districts, states, minFloor, maxFloor, minFloorsTotal, maxFloorsTotal, viewMode, currentPage, setSearchParams])

  // Reset page when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setCurrentPage(1)
  }, [deal, category, searchQuery, sortBy, subTypes, minPrice, maxPrice, minArea, maxArea, searchComplex, searchStreet, searchHouse, metroStations, districts, states, minFloor, maxFloor, minFloorsTotal, maxFloorsTotal, viewMode])

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

  const { data: properties = [], isLoading, isFetching, error } = useCatalogObjects(deal)

  const filtered = useMemo(() => {
    const list = properties.filter(p => {
      if (minPrice && p.price < Number(minPrice)) return false
      if (maxPrice && p.price > Number(maxPrice)) return false

      if (minArea && p.area < Number(minArea)) return false
      if (maxArea && p.area > Number(maxArea)) return false

      if (category && p.type !== category) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim()
        const matchesQ = (p.title && p.title.toLowerCase().includes(q)) ||
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
        const matchesC = (p.title && p.title.toLowerCase().includes(c)) ||
                         (p.location && p.location.toLowerCase().includes(c)) ||
                         (p.description && p.description.toLowerCase().includes(c))
        if (!matchesC) return false
      }

      if (subTypes.length > 0) {
        const matches = subTypes.some(st => checkSubTypeMatch(p, st))
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
        if (!metroStations.some(s => (p.metro || p.mregion)?.toLowerCase().includes(s.toLowerCase()))) return false
      }

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
  }, [properties, minPrice, maxPrice, minArea, maxArea, category, searchQuery, searchComplex, subTypes, searchStreet, searchHouse, metroStations, districts, states, minFloor, maxFloor, minFloorsTotal, maxFloorsTotal, sortBy])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentItems = viewMode === 'list'
    ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filtered

  const clearFilters = () => {
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
  }
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
    maxFloorsTotal
  )

  // Dynamic SEO calculation
  const getSeoTitle = () => {
    let title = category === 'apartment' ? 'Квартири' : category === 'house' ? 'Будинки та ділянки' : category === 'commercial' ? 'Комерційна нерухомість' : 'Каталог нерухомості'
    if (deal === 'sale') title = `Продаж: ${title.toLowerCase()}`
    if (deal === 'rent') title = `Оренда: ${title.toLowerCase()}`
    if (filtered.length > 0) {
      const minP = minPrice ? Number(minPrice) : Math.min(...filtered.map(p => p.price))
      const formattedMinP = deal === 'rent' ? `${minP.toLocaleString('uk-UA')} грн` : `$${minP.toLocaleString('uk-UA')}`
      title += ` в Харкові. ${filtered.length} об'єктів від ${formattedMinP}`
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-40">
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
              initial={false}
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
                      type="button"
                      onClick={() => handleCategoryChange(c.value)}
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

              {/* Sort & View Toggle */}
              <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Сортування каталогу"
                    className="appearance-none bg-muted hover:bg-muted/80 text-foreground text-xs font-inter font-semibold rounded-full pl-4 pr-8 py-2.5 outline-none cursor-pointer border border-transparent focus:border-navy/30 transition-colors"
                  >
                    <option value="date_desc">Новіші спочатку</option>
                    <option value="price_asc">Ціна: від дешевших</option>
                    <option value="price_desc">Ціна: від дорожчих</option>
                    <option value="area_asc">Площа: від меншої</option>
                    <option value="area_desc">Площа: від більшої</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <p className="text-muted-foreground text-sm font-inter hidden xl:block font-medium">
                  {isFetching ? (
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
                      onClick={() => startTransition(() => handleViewModeChange(v.id))}
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

            {/* Filter controls row */}
            <div className="flex flex-col w-full">
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
                  options={houseOptions}
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
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-semibold">{deal === 'rent' ? 'Ціна (грн)' : 'Ціна ($)'}</p>
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
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                aria-expanded={showAdvancedFilters}
                aria-label="Більше фільтрів"
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
                            <label key={st.value} className="flex items-center gap-3 cursor-pointer group">
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center transition-colors border", metroStations.includes(st.value) ? "bg-navy border-navy text-white" : "border-border group-hover:border-navy")}>
                                {metroStations.includes(st.value) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                              </div>
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={metroStations.includes(st.value)}
                                onChange={(e) => {
                                  if (e.target.checked) setMetroStations([...metroStations, st.value])
                                  else setMetroStations(metroStations.filter(v => v !== st.value))
                                }}
                              />
                              <span className={cn("text-sm truncate transition-colors", metroStations.includes(st.value) ? "text-navy font-medium" : "text-foreground group-hover:text-navy")} title={st.label}>{st.label}</span>
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

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            {/* Active filter badges */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/50 text-xs font-inter">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider mr-1">Фільтри:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                    Пошук: "{searchQuery}"
                    <button type="button" onClick={() => setSearchQuery('')} aria-label="Скинути пошуковий запит" className="hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                    Ціна: {minPrice ? `від ${minPrice}` : ''} {maxPrice ? `до ${maxPrice}` : ''} {deal === 'rent' ? 'грн' : '$'}
                    <button type="button" onClick={() => { setMinPrice(''); setMaxPrice('') }} aria-label="Скинути фільтр ціни" className="hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minArea || maxArea) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                    Площа: {minArea ? `від ${minArea}` : ''} {maxArea ? `до ${maxArea}` : ''} м²
                    <button type="button" onClick={() => { setMinArea(''); setMaxArea('') }} aria-label="Скинути фільтр площі" className="hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchComplex && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                    ЖК: {searchComplex}
                    <button type="button" onClick={() => setSearchComplex('')} aria-label="Скинути фільтр ЖК" className="hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchStreet && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                    Вулиця: {searchStreet} {searchHouse}
                    <button type="button" onClick={() => { setSearchStreet(''); setSearchHouse('') }} aria-label="Скинути фільтр вулиці" className="hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {subTypes.map(st => {
                  const item = (SUBTYPES_BY_CATEGORY[category] || []).find(x => x.value === st)
                  return (
                    <span key={st} className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                      {item ? item.label : st}
                      <button type="button" onClick={() => setSubTypes(subTypes.filter(v => v !== st))} aria-label={`Видалити тип ${st}`} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
                {districts.map(d => {
                  const item = DISTRICTS.find(x => x.value === d)
                  return (
                    <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                      {item ? item.label : d}
                      <button type="button" onClick={() => setDistricts(districts.filter(v => v !== d))} aria-label={`Видалити район ${d}`} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
                {metroStations.map(m => {
                  let label = m
                  for (const line of METRO_LINES) {
                    const found = line.stations.find(s => s.value === m)
                    if (found) { label = found.label; break }
                  }
                  return (
                    <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                      М: {label}
                      <button type="button" onClick={() => setMetroStations(metroStations.filter(v => v !== m))} aria-label={`Видалити станцію ${label}`} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
                {states.map(s => {
                  const item = STATES.find(x => x.value === s)
                  return (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                      {item ? item.label : s}
                      <button type="button" onClick={() => setStates(states.filter(v => v !== s))} aria-label={`Видалити стан ${s}`} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
                {(minFloor || maxFloor) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/10 text-navy rounded-full font-medium">
                    Поверх: {minFloor ? `від ${minFloor}` : ''} {maxFloor ? `до ${maxFloor}` : ''}
                    <button type="button" onClick={() => { setMinFloor(''); setMaxFloor('') }} aria-label="Скинути фільтр поверху" className="hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
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
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (i % 20) * 0.04 }}
                >
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
                    aria-label="Попередня сторінка"
                    className="flex items-center gap-1.5 px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors text-sm font-inter"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Назад</span>
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
                        aria-label={`Сторінка ${page}`}
                        aria-current={isCurrent ? "page" : undefined}
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
                    aria-label="Наступна сторінка"
                    className="flex items-center gap-1.5 px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors text-sm font-inter"
                  >
                    <span className="hidden sm:inline">Вперед</span>
                    <ChevronRight className="w-4 h-4" />
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
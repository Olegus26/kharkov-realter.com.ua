import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
  Percent,
  Sparkles,
  Award,
  Users,
  Home as HomeIcon,
  TrendingUp,
  MapPin,
  Building2,
  TrainFront,
  Navigation,
  Search,
  X,
  ArrowUpRight,
  Hammer
} from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import { getObjects, getAllObjects, mapObject } from '@/lib/novostoyApi'
import { METRO_LINES, DISTRICTS } from '@/data/geoFilters'
import SeoMeta from '@/components/seo/SeoMeta'
import JsonLd, { generateRealEstateAgentSchema } from '@/components/seo/JsonLd'
import { cn } from '@/lib/utils'

const HERO_BG = '/hero-bg.webp'

const FEATURED_CATEGORIES = [
  {
    id: 'all',
    label: 'Всі топові',
    icon: Flame,
    catalogUrl: '/flats',
    filter: () => true
  },
  {
    id: 'eoselia',
    label: 'єОселя 3-7%',
    icon: ShieldCheck,
    catalogUrl: '/flats?eoselia=1',
    filter: (p) => p.eoselia
  },
  {
    id: 'erecovery',
    label: 'єВідновлення',
    icon: Hammer,
    catalogUrl: '/flats?erecovery=1',
    filter: (p) => p.erecovery
  },
  {
    id: 'tender',
    label: 'Можливий торг',
    icon: Percent,
    catalogUrl: '/flats?tender=1',
    filter: (p) => p.tender
  },
  {
    id: 'premium',
    label: 'Преміум ($50k+)',
    icon: Sparkles,
    catalogUrl: '/flats?price_from=50000',
    filter: (p) => p.price >= 50000
  }
]


const stats = [
  { icon: Award, value: '30+', label: 'років на ринку' },
  { icon: HomeIcon, value: '5 000+', label: 'угод закрито' },
  { icon: Users, value: '100+', label: 'спеціалістів' },
  { icon: TrendingUp, value: 'ТОП-1', label: 'у Харкові' }
]

const HomePage = () => {
  const [deal, setDeal] = useState('sale')
  const [query, setQuery] = useState('')
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [geoData, setGeoData] = useState({ streets: [], complexes: [] })

  const searchContainerRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    Promise.all([
      import('@/data/streets.json').then((m) => m.default || m),
      import('@/data/complexes.json').then((m) => m.default || m)
    ])
      .then(([streets, complexes]) => {
        setGeoData({ streets: streets || [], complexes: complexes || [] })
      })
      .catch((e) => console.error('Error loading geo data on Home', e))
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSuggestionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePrefetchCatalog = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['novostoy-objects', 'sale'],
      queryFn: async () => {
        const allItems = await getAllObjects({ sell_type: '2' })
        return allItems.map(mapObject)
      },
      staleTime: 10 * 60 * 1000,
    })
  }, [queryClient])

  const [activeCategory, setActiveCategory] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1)
        return
      }
      if (window.innerWidth < 1024) {
        setItemsPerPage(2)
        return
      }
      setItemsPerPage(3)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['novostoy-objects-featured'],
    queryFn: async () => {
      const res = await getObjects({ parent_id: '2', limit: 100 })
      const items = (res.data || []).map(mapObject)
      const validItems = items.filter(
        (item) => item.images && item.images.length >= 3 && !item.is_sold && item.price > 0
      )
      const pool = validItems.length >= 12
        ? validItems
        : items.filter((item) => item.images && item.images.length > 0 && !item.is_sold)

      return pool.sort((a, b) => {
        const scoreA =
          (a.views || 0) +
          a.images.length * 150 +
          (a.eoselia ? 1000 : 0) +
          (a.erecovery ? 600 : 0) +
          (a.price >= 30000 ? 500 : 0)
        const scoreB =
          (b.views || 0) +
          b.images.length * 150 +
          (b.eoselia ? 1000 : 0) +
          (b.erecovery ? 600 : 0) +
          (b.price >= 30000 ? 500 : 0)
        return scoreB - scoreA
      })
    },
    staleTime: 5 * 60 * 1000
  })

  const currentCategoryObj = useMemo(() => {
    return FEATURED_CATEGORIES.find((c) => c.id === activeCategory) || FEATURED_CATEGORIES[0]
  }, [activeCategory])

  const categoryCounts = useMemo(() => {
    const counts = {}
    FEATURED_CATEGORIES.forEach((cat) => {
      counts[cat.id] = properties.filter(cat.filter).length
    })
    return counts
  }, [properties])

  const filteredProperties = useMemo(() => {
    return properties.filter(currentCategoryObj.filter)
  }, [properties, currentCategoryObj])

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / itemsPerPage))
  const safeCurrentSlide = Math.min(currentSlide, totalPages - 1)

  const visibleProperties = useMemo(() => {
    const start = safeCurrentSlide * itemsPerPage
    return filteredProperties.slice(start, start + itemsPerPage)
  }, [filteredProperties, safeCurrentSlide, itemsPerPage])

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(totalPages - 1, prev + 1))
  }, [totalPages])

  const handleCategoryChange = useCallback((catId) => {
    setActiveCategory(catId)
    setCurrentSlide(0)
  }, [])

  const handleSlideDotClick = useCallback((pageIdx) => {
    setCurrentSlide(pageIdx)
  }, [])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return {
        hasResults: true,
        isPopular: true,
        metro: [
          { label: 'Університет', value: 'Университет', line: 'Салтівська лінія' },
          { label: 'Холодна гора', value: 'Холодная гора', line: 'Холодногірсько-Заводська лінія' },
          { label: 'Наукова', value: 'Научная', line: 'Олексіївська лінія' }
        ],
        districts: [
          { label: 'Салтівка', value: 'Салтовка' },
          { label: 'Олексіївка', value: 'Алексеевка' },
          { label: 'Центр', value: 'Центр' }
        ],
        complexes: (geoData.complexes || []).slice(0, 3).map((c) => ({
          label: c.jk_name,
          value: c.jk_name,
          address: c.address
        })),
        streets: []
      }
    }

    const matchingMetro = []
    METRO_LINES.forEach((line) => {
      line.stations.forEach((st) => {
        if (st.label.toLowerCase().includes(q) || st.value.toLowerCase().includes(q)) {
          matchingMetro.push({ label: st.label, value: st.value, line: line.name })
        }
      })
    })

    const matchingDistricts = DISTRICTS.filter(
      (d) => d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)
    ).slice(0, 5)

    const matchingComplexes = (geoData.complexes || [])
      .filter((c) => c.jk_name?.toLowerCase().includes(q) || c.address?.toLowerCase().includes(q))
      .slice(0, 4)
      .map((c) => ({ label: c.jk_name, value: c.jk_name, address: c.address }))

    const matchingStreets = (geoData.streets || [])
      .filter((s) => {
        if (s.current_name?.toLowerCase().includes(q)) return true
        if (s.old_names && s.old_names.some((old) => old.toLowerCase().includes(q))) return true
        return false
      })
      .slice(0, 5)
      .map((s) => ({ label: s.current_name, value: s.current_name }))

    const hasResults =
      matchingMetro.length > 0 ||
      matchingDistricts.length > 0 ||
      matchingComplexes.length > 0 ||
      matchingStreets.length > 0

    return {
      hasResults,
      isPopular: false,
      metro: matchingMetro.slice(0, 4),
      districts: matchingDistricts,
      complexes: matchingComplexes,
      streets: matchingStreets
    }
  }, [query, geoData])

  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const flattenedSuggestions = useMemo(() => {
    const list = []
    if (suggestions.metro?.length > 0) {
      suggestions.metro.forEach((m) => list.push({ type: 'metro', label: `м. ${m.label}`, value: m.value, sub: m.line }))
    }
    if (suggestions.districts?.length > 0) {
      suggestions.districts.forEach((d) => list.push({ type: 'district', label: `р-н ${d.label}`, value: d.value, sub: 'Харків' }))
    }
    if (suggestions.complexes?.length > 0) {
      suggestions.complexes.forEach((c) => list.push({ type: 'complex', label: c.label, value: c.value, sub: c.address }))
    }
    if (suggestions.streets?.length > 0) {
      suggestions.streets.forEach((s) => list.push({ type: 'street', label: s.label, value: s.value, sub: 'Вулиця' }))
    }
    return list
  }, [suggestions])

  const handleSelectSuggestion = (type, val) => {
    setIsSuggestionsOpen(false)
    setHighlightedIndex(-1)
    if (!val) return

    if (type === 'metro') {
      navigate(`/flats?deal=${deal}&metroStations=${encodeURIComponent(val)}`)
      return
    }
    if (type === 'district') {
      navigate(`/flats?deal=${deal}&districts=${encodeURIComponent(val)}`)
      return
    }
    if (type === 'complex') {
      navigate(`/flats?deal=${deal}&searchComplex=${encodeURIComponent(val)}`)
      return
    }
    if (type === 'street') {
      navigate(`/flats?deal=${deal}&searchStreet=${encodeURIComponent(val)}`)
      return
    }
    if (type === 'query') {
      navigate(`/flats?deal=${deal}&q=${encodeURIComponent(val)}`)
      return
    }
    navigate(`/flats?deal=${deal}&q=${encodeURIComponent(val)}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setIsSuggestionsOpen(false)
    setHighlightedIndex(-1)
    const trimmed = query.trim()
    if (!trimmed) {
      navigate(`/flats?deal=${deal}`)
      return
    }
    navigate(`/flats?deal=${deal}&q=${encodeURIComponent(trimmed)}`)
  }

  const handleSetDealSale = () => {
    setDeal('sale')
  }

  const handleSetDealRent = () => {
    setDeal('rent')
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setIsSuggestionsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleInputFocus = () => {
    setIsSuggestionsOpen(true)
  }

  const handleClearQuery = () => {
    setQuery('')
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isSuggestionsOpen) {
        setIsSuggestionsOpen(true)
        return
      }
      if (flattenedSuggestions.length === 0) return
      setHighlightedIndex((prev) => (prev + 1 < flattenedSuggestions.length ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isSuggestionsOpen) {
        setIsSuggestionsOpen(true)
        return
      }
      if (flattenedSuggestions.length === 0) return
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flattenedSuggestions.length - 1))
    } else if (e.key === 'Enter') {
      if (isSuggestionsOpen && highlightedIndex >= 0 && flattenedSuggestions[highlightedIndex]) {
        e.preventDefault()
        const selected = flattenedSuggestions[highlightedIndex]
        handleSelectSuggestion(selected.type, selected.value)
        return
      }
    } else if (e.key === 'Escape') {
      setIsSuggestionsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div>
      <SeoMeta
        title="Агентство нерухомості Харків Ріелтер | Купити, продати, орендувати житло"
        description="Купівля, продаж та оренда нерухомості в Харкові. Квартири, будинки, комерційна нерухомість. 30 років на ринку, 13 філій, сертифіковані експерти."
      />
      <JsonLd schema={generateRealEstateAgentSchema()} />

      {/* Hero — cinematic, left-aligned with safe clipping for dropdown */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center">
        {/* Background image & gradient with safe clipping */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <picture className="block w-full h-full">
            <source media="(max-width: 767px)" srcSet="/hero-bg-mobile.webp" type="image/webp" />
            <img
              src={HERO_BG}
              alt="Харків Ріелтер - елітна нерухомість"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-navy/90" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-16 sm:pt-36 sm:pb-24 text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex px-4 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl text-cream/80 text-xs tracking-[0.25em] uppercase font-inter mb-8"
          >
            Корпорація нерухомості · з 1996 року
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-cormorant font-extrabold tracking-tight leading-[1.02] text-5xl sm:text-7xl lg:text-8xl text-white mb-6 max-w-4xl drop-shadow-xl"
          >
            Харків
            <br />
            <span className="text-sky-300 drop-shadow-lg">Ріелтер</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/95 text-lg font-normal mb-10 max-w-xl font-inter drop-shadow-md"
          >
            Чесність, порядок та безпека угод з будь-якою нерухомістю. З Агентством нерухомості «Харків-Ріелтер» вирішити житлове питання легко та надійно!
          </motion.p>

          {/* Search pill with live popup autocomplete */}
          <div className="relative max-w-2xl z-30" ref={searchContainerRef}>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-0 w-full border border-white/20 bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-full p-2 shadow-2xl"
            >
              <div className="flex gap-1 rounded-full bg-black/35 p-1 mx-1 shrink-0">
                <button
                  type="button"
                  onClick={handleSetDealSale}
                  className={`flex-1 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-inter font-medium transition-all ${deal === 'sale' ? 'bg-white text-navy shadow-sm' : 'text-cream/75 hover:text-cream'}`}
                >
                  Купити
                </button>
                <button
                  type="button"
                  onClick={handleSetDealRent}
                  className={`flex-1 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-inter font-medium transition-all ${deal === 'rent' ? 'bg-white text-navy shadow-sm' : 'text-cream/75 hover:text-cream'}`}
                >
                  Орендувати
                </button>
              </div>

              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Район, метро, вулиця або ЖК..."
                  aria-label="Пошук за районом, метро, вулицею або ЖК"
                  autoComplete="off"
                  spellCheck="false"
                  aria-expanded={isSuggestionsOpen}
                  aria-autocomplete="list"
                  className="w-full px-5 py-3 bg-transparent text-sm text-cream placeholder:text-cream/50 outline-none font-inter"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    aria-label="Очистити поле пошуку"
                    className="p-1.5 text-cream/60 hover:text-white transition-colors mr-2 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-white text-navy rounded-full text-xs tracking-widest uppercase font-inter font-bold whitespace-nowrap hover:bg-cream transition-colors shadow-sm shrink-0"
              >
                Знайти
              </button>
            </motion.form>

            {/* Live Autocomplete Dropdown Popup */}
            <AnimatePresence>
              {isSuggestionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_24px_50px_rgba(15,23,42,0.28)] border border-border/80 p-3 sm:p-4 z-50 max-h-[min(420px,55vh)] overflow-y-auto custom-scrollbar font-inter text-foreground"
                >
                  {suggestions.isPopular ? (
                    /* 2-Column Balanced Layout for Popular Items */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left: Популярне метро */}
                      <div>
                        <div className="flex items-center gap-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          <TrainFront className="w-3.5 h-3.5 text-blue-600" />
                          <span>Популярне метро</span>
                        </div>
                        <div className="space-y-0.5">
                          {suggestions.metro.map((m) => {
                            const flatIdx = flattenedSuggestions.findIndex((x) => x.type === 'metro' && x.value === m.value)
                            const isHighlighted = highlightedIndex === flatIdx
                            return (
                              <button
                                key={m.value}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  handleSelectSuggestion('metro', m.value)
                                }}
                                tabIndex={0}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between group cursor-pointer',
                                  isHighlighted ? 'bg-navy/10 text-navy font-semibold ring-1 ring-navy/20' : 'hover:bg-muted/80'
                                )}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                  <span className="text-sm font-semibold text-foreground group-hover:text-navy truncate">м. {m.label}</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-navy opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Right: Популярні райони та ЖК */}
                      <div>
                        <div className="flex items-center gap-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>Популярні райони та ЖК</span>
                        </div>
                        <div className="space-y-0.5">
                          {suggestions.districts.map((d) => {
                            const flatIdx = flattenedSuggestions.findIndex((x) => x.type === 'district' && x.value === d.value)
                            const isHighlighted = highlightedIndex === flatIdx
                            return (
                              <button
                                key={d.value}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  handleSelectSuggestion('district', d.value)
                                }}
                                tabIndex={0}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between group cursor-pointer',
                                  isHighlighted ? 'bg-navy/10 text-navy font-semibold ring-1 ring-navy/20' : 'hover:bg-muted/80'
                                )}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                  <span className="text-sm font-semibold text-foreground group-hover:text-navy truncate">р-н {d.label}</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-navy opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              </button>
                            )
                          })}

                          {suggestions.complexes.map((c) => {
                            const flatIdx = flattenedSuggestions.findIndex((x) => x.type === 'complex' && x.value === c.value)
                            const isHighlighted = highlightedIndex === flatIdx
                            return (
                              <button
                                key={c.value}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  handleSelectSuggestion('complex', c.value)
                                }}
                                tabIndex={0}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between group cursor-pointer',
                                  isHighlighted ? 'bg-navy/10 text-navy font-semibold ring-1 ring-navy/20' : 'hover:bg-muted/80'
                                )}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                                  <span className="text-sm font-semibold text-foreground group-hover:text-navy truncate">{c.label}</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-navy opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : suggestions.hasResults ? (
                    (() => {
                      const activeGroups = []
                      if (suggestions.metro?.length > 0) {
                        activeGroups.push({
                          id: 'metro',
                          title: 'Станції метро',
                          icon: TrainFront,
                          iconColor: 'text-blue-600',
                          dotColor: 'bg-blue-500',
                          items: suggestions.metro,
                          type: 'metro',
                          prefix: 'м. '
                        })
                      }
                      if (suggestions.districts?.length > 0) {
                        activeGroups.push({
                          id: 'districts',
                          title: 'Райони',
                          icon: MapPin,
                          iconColor: 'text-amber-600',
                          dotColor: 'bg-amber-500',
                          items: suggestions.districts,
                          type: 'district',
                          prefix: 'р-н '
                        })
                      }
                      if (suggestions.complexes?.length > 0) {
                        activeGroups.push({
                          id: 'complexes',
                          title: 'Житлові комплекси (ЖК)',
                          icon: Building2,
                          iconColor: 'text-purple-600',
                          dotColor: 'bg-purple-500',
                          items: suggestions.complexes,
                          type: 'complex',
                          prefix: ''
                        })
                      }
                      if (suggestions.streets?.length > 0) {
                        activeGroups.push({
                          id: 'streets',
                          title: 'Вулиці',
                          icon: Navigation,
                          iconColor: 'text-emerald-600',
                          dotColor: 'bg-emerald-500',
                          items: suggestions.streets,
                          type: 'street',
                          prefix: ''
                        })
                      }

                      const renderGroup = (g, isSingleGroup = false) => {
                        const IconComp = g.icon
                        return (
                          <div key={g.id}>
                            <div className="flex items-center gap-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              <IconComp className={cn('w-3.5 h-3.5', g.iconColor)} />
                              <span>{g.title}</span>
                            </div>
                            <div className={cn('space-y-0.5', isSingleGroup && 'grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 space-y-0')}>
                              {g.items.map((item) => {
                                const flatIdx = flattenedSuggestions.findIndex((x) => x.type === g.type && x.value === item.value)
                                const isHighlighted = highlightedIndex === flatIdx
                                return (
                                  <button
                                    key={item.value}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault()
                                      handleSelectSuggestion(g.type, item.value)
                                    }}
                                    tabIndex={0}
                                    className={cn(
                                      'w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between group cursor-pointer',
                                      isHighlighted ? 'bg-navy/10 text-navy font-semibold ring-1 ring-navy/20' : 'hover:bg-muted/80'
                                    )}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className={cn('w-2 h-2 rounded-full shrink-0', g.dotColor)} />
                                      <span className="text-sm font-semibold text-foreground group-hover:text-navy truncate">
                                        {g.prefix}{item.label}
                                      </span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-navy opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      }

                      if (activeGroups.length === 1) {
                        return (
                          <div className="w-full">
                            {renderGroup(activeGroups[0], true)}
                          </div>
                        )
                      }

                      const mid = Math.ceil(activeGroups.length / 2)
                      const col1 = activeGroups.slice(0, mid)
                      const col2 = activeGroups.slice(mid)

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            {col1.map((g) => renderGroup(g, false))}
                          </div>
                          <div className="space-y-3">
                            {col2.map((g) => renderGroup(g, false))}
                          </div>
                        </div>
                      )
                    })()
                  ) : (
                    /* Friendly Empty State with Direct Search */
                    <div className="py-6 px-4 text-center">
                      <p className="text-sm text-foreground/80 font-medium mb-1">
                        Не знайдено точних назв серед метро, районів чи ЖК
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Ви можете знайти «{query.trim()}» по всій базі описів та оголошень
                      </p>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSelectSuggestion('query', query.trim())
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors shadow-sm"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Шукати «{query.trim()}» у каталозі</span>
                      </button>
                    </div>
                  )}

                  {/* Free Search fallback action at bottom when typing */}
                  {query.trim().length > 0 && suggestions.hasResults && (
                    <div className="pt-2.5 mt-3 border-t border-border/60">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSelectSuggestion('query', query.trim())
                        }}
                        tabIndex={0}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl bg-muted/60 hover:bg-navy hover:text-white transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Search className="w-4 h-4 text-gold shrink-0 group-hover:text-white transition-colors" />
                          <span className="text-xs font-semibold">Шукати всі об'єкти за запитом: «{query.trim()}»</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors shrink-0" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <a
          href="#featured"
          aria-label="Перейти до топових об'єктів"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <span className="text-[10px] tracking-widest uppercase font-inter">Дивитись</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* Stats — signature navy band */}
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <s.icon className="w-6 h-6 text-cream/40 mx-auto mb-4" />
              <p className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl text-white">{s.value}</p>
              <p className="text-sm text-cream/50 mt-2 font-inter">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-24">
        {/* Header with Title and Nav controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-3">
              <Flame className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="text-[11px] font-inter font-semibold tracking-wider uppercase text-gold">
                Гарячі пропозиції
              </span>
            </div>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl text-foreground">
              Топові об'єкти Харкова
            </h2>
            <p className="text-sm text-muted-foreground font-inter mt-2 max-w-xl">
              Відібрані перевірені квартири з якісним ремонтом та можливістю оформлення за державними програмами
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                tabIndex={0}
                aria-label="Попередні об'єкти"
                disabled={safeCurrentSlide === 0}
                onClick={handlePrevSlide}
                className={cn(
                  'w-11 h-11 rounded-full border flex items-center justify-center transition-all',
                  safeCurrentSlide === 0
                    ? 'border-border/50 text-muted-foreground/30 cursor-not-allowed bg-card/40'
                    : 'border-border bg-card hover:bg-gold hover:text-navy hover:border-gold text-foreground shadow-sm cursor-pointer'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-xs font-inter font-medium text-muted-foreground px-2 min-w-[50px] text-center">
                <span className="text-foreground font-bold">{safeCurrentSlide + 1}</span> / {totalPages}
              </div>

              <button
                type="button"
                tabIndex={0}
                aria-label="Наступні об'єкти"
                disabled={safeCurrentSlide >= totalPages - 1}
                onClick={handleNextSlide}
                className={cn(
                  'w-11 h-11 rounded-full border flex items-center justify-center transition-all',
                  safeCurrentSlide >= totalPages - 1
                    ? 'border-border/50 text-muted-foreground/30 cursor-not-allowed bg-card/40'
                    : 'border-border bg-card hover:bg-gold hover:text-navy hover:border-gold text-foreground shadow-sm cursor-pointer'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              to={currentCategoryObj.catalogUrl}
              onMouseEnter={handlePrefetchCatalog}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold/80 transition-all font-inter pl-2"
            >
              Весь каталог <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = activeCategory === cat.id
            const count = categoryCounts[cat.id] || 0
            return (
              <button
                key={cat.id}
                type="button"
                tabIndex={0}
                aria-label={`Фільтр: ${cat.label} (${count})`}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-inter font-medium transition-all shrink-0 cursor-pointer',
                  isSelected
                    ? 'bg-navy text-white shadow-md shadow-navy/30 border border-navy ring-2 ring-primary/20'
                    : 'bg-card hover:bg-secondary text-muted-foreground hover:text-foreground border border-border'
                )}
              >
                <Icon className={cn('w-4 h-4', isSelected ? 'text-amber-400' : 'text-muted-foreground')} />
                <span className={isSelected ? 'text-white font-semibold' : ''}>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                      isSelected ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Cards Grid / Carousel View */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-foreground font-medium font-inter">
              У цій категорії зараз немає об'єктів
            </p>
            <button
              type="button"
              tabIndex={0}
              aria-label="Дивитися всі топові"
              onClick={() => handleCategoryChange('all')}
              className="mt-4 px-5 py-2.5 bg-gold text-navy font-semibold text-xs rounded-full hover:bg-gold/90 transition-all font-inter shadow-sm cursor-pointer"
            >
              Дивитися всі топові
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${safeCurrentSlide}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleProperties.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <PropertyCard property={{ ...p, featured: true }} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                type="button"
                tabIndex={0}
                aria-label={`Сторінка ${idx + 1}`}
                onClick={() => handleSlideDotClick(idx)}
                className={cn(
                  'h-2 rounded-full transition-all cursor-pointer',
                  idx === safeCurrentSlide ? 'w-8 bg-gold' : 'w-2 bg-border hover:bg-muted-foreground/50'
                )}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link
            to={currentCategoryObj.catalogUrl}
            onMouseEnter={handlePrefetchCatalog}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold font-inter"
          >
            Весь каталог {currentCategoryObj.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Us — editorial numbered cards */}
      <section className="bg-secondary/40 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Наші переваги</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl max-w-xl text-foreground">Чому обирають нас</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'ТОП-100 України & 30 років',
                desc: 'Входимо до офіційного рейтингу «ТОП-100 агенцій нерухомості України 2026» за версією ЛУН (платформи ЛУН, Flatfy, Rieltor, Bird). На ринку з 1996 року.'
              },
              {
                num: '02',
                title: 'Професійна спільнота',
                desc: 'Дійсний член Асоціації фахівців з нерухомості України (АСНУ), Союзу ріелторів Харкова (ХСРіО) та Європейської Асоціації CEREAN.'
              },
              {
                num: '03',
                title: 'Локальна експертиза',
                desc: 'Глибоке знання кожного району Харкова та області. Понад 100 кваліфікованих співробітників, які допоможуть з будь-яким запитом.'
              }
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                <p className="font-cormorant font-extrabold tracking-tight text-6xl text-gold/10 group-hover:text-gold/25 transition-colors mb-6">{item.num}</p>
                <h3 className="font-cormorant font-bold text-2xl mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* State Programs: eOselia & eRecovery */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600/10 text-emerald-700 text-xs font-bold font-inter rounded-full uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Державна підтримка
          </span>
          <h2 className="font-cormorant font-extrabold tracking-tight text-3xl sm:text-5xl text-foreground">
            Програми «єОселя» та «єВідновлення»
          </h2>
          <p className="text-muted-foreground font-inter text-sm sm:text-base mt-3">
            Корпорація «Харків Ріелтер» — акредитований партнер банків. Забезпечуємо повний супровід від вибору нерухомості до реєстрації права власності.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: єОселя */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-gold/30 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/10 transition-colors" />
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold font-inter rounded-full uppercase tracking-wider">
                  Пільгова іпотека від 3% до 7%
                </span>
                <span className="text-xs font-bold font-inter text-muted-foreground">Державна програма</span>
              </div>
              <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-foreground mb-3">
                Програма «єОселя»
              </h3>
              <p className="text-muted-foreground text-sm font-inter leading-relaxed mb-6">
                Кредитування житла за зниженими ставками для військовослужбовців, медиків, педагогів, науковців (3%), а також ветеранів, захисників та ВПО (7%).
              </p>
              <ul className="space-y-3 text-xs sm:text-sm font-inter text-foreground mb-8">
                <li className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Акредитація в банках: Ощадбанк, ПриватБанк, Укргазбанк</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Швидкий підбір об'єктів під нормативну площу та бюджет</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Супровід оцінки та банківської верифікації без черг</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/eoselia"
                className="flex-1 py-3 px-5 border border-gold/40 text-foreground hover:bg-gold/10 text-xs tracking-wider uppercase font-inter font-bold rounded-full text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Умови програми</span>
              </Link>
              <Link
                to="/flats?deal=sale&eoselia=true"
                className="flex-1 py-3 px-5 gradient-gold text-white text-xs tracking-wider uppercase font-inter font-bold rounded-full text-center hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Об'єкти єОселя</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: єВідновлення */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-gold/30 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="px-3 py-1 bg-emerald-600/10 text-emerald-700 text-xs font-bold font-inter rounded-full uppercase tracking-wider">
                  Сертифікати через «Дія»
                </span>
                <span className="text-xs font-bold font-inter text-muted-foreground">Компенсація</span>
              </div>
              <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-foreground mb-3">
                Програма «єВідновлення»
              </h3>
              <p className="text-muted-foreground text-sm font-inter leading-relaxed mb-6">
                Купівля нової квартири або будинку взамін зруйнованого житла за рахунок державного житлового сертифіката у Харкові та передмісті.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm font-inter text-foreground mb-8">
                <li className="flex items-center gap-2.5">
                  <Hammer className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Повна юридична перевірка правовстановлюючих документів</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Hammer className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Безпечне бронювання коштів сертифіката через Дію</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Hammer className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Нотаріальне оформлення угоди без затримок та ризиків</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/evidnovlennya"
                className="flex-1 py-3 px-5 border border-emerald-600/40 text-foreground hover:bg-emerald-600/10 text-xs tracking-wider uppercase font-inter font-bold rounded-full text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Умови програми</span>
              </Link>
              <Link
                to="/flats?deal=sale&erecovery=true"
                className="flex-1 py-3 px-5 bg-emerald-600 text-white text-xs tracking-wider uppercase font-inter font-bold rounded-full text-center hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Об'єкти єВідновлення</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — signature navy block */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-navy rounded-3xl p-12 sm:p-20 text-center text-cream shadow-2xl"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-4 font-inter">Безкоштовна консультація</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-6xl mb-6 text-white">Готові розпочати пошук?</h2>
            <p className="text-cream/60 font-inter mb-10 max-w-md mx-auto text-sm leading-relaxed">
              Наші експерти допоможуть знайти ідеальний об'єкт під ваші запити та бюджет у Харкові
            </p>
            <Link
              to="/kontakty"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-navy rounded-full text-xs tracking-widest uppercase font-inter font-bold hover:bg-cream transition-colors shadow-lg"
            >
              Зв'язатися з нами <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage

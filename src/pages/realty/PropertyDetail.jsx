import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, BedDouble, Maximize2, MapPin, Phone, Building, Calendar, UtensilsCrossed, ExternalLink, ChevronLeft, ChevronRight, Heart, CalendarCheck, X, CheckCircle, Send, Share2, MessageCircle, Eye, Hammer, Home as HomeIcon, Handshake } from 'lucide-react'
import { getAllObjects, mapObject } from '@/lib/novostoyApi'
import { useFavorites } from '@/lib/FavoritesContext'
import { useVisited } from '@/lib/useVisited'
import { submitLead } from '@/lib/leadService'
import { formatPhone, cn } from '@/lib/utils'
import PropertyCard from '@/components/realty/PropertyCard'
import SeoMeta from '@/components/seo/SeoMeta'
import JsonLd, { generateRealEstateSchema } from '@/components/seo/JsonLd'

const DEAL_LABELS = { sale: 'Продаж', rent: 'Оренда' }
const TYPE_LABELS = { apartment: 'Квартира', house: 'Будинок', penthouse: 'Пентхаус', villa: 'Вілла', commercial: 'Комерційна' }

const STATUS_STAMPS = [
  { key: 'is_sold', src: '/stamp-sold.png', alt: 'Продано' },
  { key: 'deposit', src: '/stamp-deposit.png', alt: 'Завдаток' },
]

const sanitizeHtml = (html) => {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
}

const PropertyDetail = () => {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const thumbnailRefs = useRef([])
  const { isFavorite, toggleFavorite } = useFavorites()
  const { markVisited } = useVisited()
  const queryClient = useQueryClient()

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', note: '' })
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    if (thumbnailRefs.current[activeImg]) {
      thumbnailRefs.current[activeImg].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeImg])

  // Try to find property in existing cache first, then fetch if needed
  const { data: property, isLoading } = useQuery({
    queryKey: ['novostoy-property', id],
    queryFn: async () => {
      const saleCache = queryClient.getQueryData(['novostoy-objects', 'sale'])
      const rentCache = queryClient.getQueryData(['novostoy-objects', 'rent'])
      const allCache = queryClient.getQueryData(['novostoy-objects', ''])

      for (const cache of [saleCache, rentCache, allCache]) {
        if (cache) {
          const found = cache.find((o) => String(o.id) === String(id))
          if (found && found.images && found.images.length > 0) return found
        }
      }

      const allItems = await getAllObjects({ sell_type: '2' })
      const mapped = allItems.map(mapObject)
      const found = mapped.find((o) => String(o.id) === String(id))
      if (found) return found

      const rentItems = await getAllObjects({ sell_type: '1' })
      const mappedRent = rentItems.map(mapObject)
      return mappedRent.find((o) => String(o.id) === String(id)) || null
    },
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    if (property?.id) {
      markVisited(property.id)
    }
  }, [property?.id, markVisited])

  const handlePrevImage = useCallback(() => {
    if (!property?.images?.length) return
    setActiveImg((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }, [property?.images])

  const handleNextImage = useCallback(() => {
    if (!property?.images?.length) return
    setActiveImg((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }, [property?.images])

  const handleKeyDownGallery = useCallback((e) => {
    if (e.key === 'ArrowLeft') handlePrevImage()
    if (e.key === 'ArrowRight') handleNextImage()
  }, [handlePrevImage, handleNextImage])

  const [copiedShare, setCopiedShare] = useState(false)

  const handleShare = async () => {
    if (!property) return
    const shareData = {
      title: property.title,
      text: `${property.title} — Харків Ріелтер`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedShare(true)
      setTimeout(() => setCopiedShare(false), 2500)
    } catch {
      // Ignored
    }
  }

  const { data: allObjects = [] } = useQuery({
    queryKey: ['novostoy-objects', property?.deal || 'sale'],
    queryFn: async () => {
      const items = await getAllObjects({ sell_type: property?.deal === 'rent' ? '1' : '2' })
      return items.map(mapObject)
    },
    enabled: Boolean(property?.id),
    staleTime: 10 * 60 * 1000,
  })

  const similarProperties = useMemo(() => {
    if (!property || !allObjects.length) return []
    return allObjects
      .filter((p) => p.id !== property.id && !p.is_sold && (p.region === property.region || p.type === property.type))
      .slice(0, 3)
  }, [property, allObjects])

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault()
    if (property?.id) toggleFavorite(property.id)
  }, [property?.id, toggleFavorite])

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingBooking(true)
    setBookingError('')

    const result = await submitLead({
      type: 'viewing',
      name: bookingForm.name,
      phone: bookingForm.phone,
      propertyId: property?.id,
      propertyTitle: property?.title,
      message: bookingForm.note
    })

    setIsSubmittingBooking(false)
    if (!result.success) {
      setBookingError(result.error || 'Помилка надсилання')
      return
    }

    setBookingSubmitted(true)
  }

  const catalogBackLink = useMemo(() => {
    if (!property) return '/flats'
    if (property.type === 'house') return '/houses'
    if (property.type === 'commercial') return '/realtys'
    return '/flats'
  }, [property])

  const catalogBackTitle = useMemo(() => {
    if (!property) return 'Каталог'
    if (property.type === 'house') return 'Будинки'
    if (property.type === 'commercial') return 'Комерція'
    return 'Квартири'
  }, [property])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="w-full h-[50vh] md:h-[60vh] bg-card border-b border-border/50 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="w-24 h-4 bg-muted/30 rounded animate-pulse" />
                <div className="w-3/4 h-12 md:h-16 bg-muted/30 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-muted/30 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/50">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card h-32 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center px-4">
        <p className="font-cormorant text-4xl mb-4 font-bold text-foreground">Об'єкт не знайдено</p>
        <p className="text-muted-foreground font-inter text-sm mb-6">Можливо, оголошення було знято з публікації або змінилася адреса.</p>
        <Link to="/flats" className="px-6 py-3 bg-navy text-white text-xs tracking-widest uppercase font-inter rounded-full hover:bg-navy/90 transition-colors">
          Повернутися до каталогу
        </Link>
      </div>
    )
  }

  const images = property.images?.length
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80']

  const stamp = STATUS_STAMPS.find(({ key }) => property[key])
  const pricePerM2 = property.area ? Math.round(property.price / property.area) : null

  const formattedPrice = property.deal === 'rent'
    ? `${property.price.toLocaleString('uk-UA')} грн`
    : `$${property.price.toLocaleString('uk-UA')}`

  const schemaUrl = `https://kharkov-realter.com.ua/property/${property.id}`
  const seoTitle = `${TYPE_LABELS[property.type] || 'Об\'єкт'} ${property.rooms ? property.rooms + '-кімн., ' : ''}${property.area ? property.area + ' м² ' : ''}за ${formattedPrice}`

  const primaryCallPhone = property.agent_phones?.[0]
    ? `tel:+38${property.agent_phones[0]}`
    : 'tel:+380957372261'

  return (
    <div className="pt-24 pb-20" onKeyDown={handleKeyDownGallery} tabIndex={0}>
      <SeoMeta
        title={seoTitle}
        description={property.description?.substring(0, 160) || `${property.deal === 'rent' ? 'Орендувати' : 'Купити'} ${seoTitle.toLowerCase()} від агентства Харків Ріелтер.`}
        url={`/property/${property.id}`}
        image={images[0]}
      />
      <JsonLd data={generateRealEstateSchema(property, schemaUrl)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="py-6 flex items-center gap-3 text-xs sm:text-sm font-inter">
          <Link to={catalogBackLink} className="flex items-center gap-1.5 text-muted-foreground hover:text-gold transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> {catalogBackTitle}
          </Link>
          <span className="text-border">/</span>
          <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-sm">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image */}
            <div className="relative aspect-[16/9] overflow-hidden bg-card border border-border rounded-2xl group shadow-sm">
              <img
                src={images[activeImg]}
                alt={property.title}
                className="w-full h-full object-cover select-none"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80' }}
              />
              {stamp && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none z-10">
                  <img
                    src={stamp.src}
                    alt={stamp.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-1/2 h-1/2 object-contain scale-125 drop-shadow-2xl"
                  />
                </div>
              )}
              {property.new_building && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-navy text-white text-[10px] tracking-widest uppercase font-inter font-medium rounded-full z-10">
                  Новобудова
                </div>
              )}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur text-white text-[10px] tracking-widest uppercase font-inter rounded-full z-10">
                {activeImg + 1} / {images.length}
              </div>

              {/* Navigation arrows - visible on mobile touch, hover on desktop */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Попереднє фото"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:text-gold transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Наступне фото"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:text-gold transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      ref={(el) => { thumbnailRefs.current[i] = el }}
                      onClick={() => setActiveImg(i)}
                      aria-label={`Переглянути фото ${i + 1}`}
                      className={cn(
                        'shrink-0 w-24 h-16 overflow-hidden rounded-xl border-2 transition-all duration-300',
                        activeImg === i
                          ? 'border-navy scale-95 shadow-md shadow-navy/20'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-border'
                      )}
                    >
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover pointer-events-none rounded-lg"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Info block */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border-t border-border pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <p className="text-xs tracking-[0.2em] uppercase text-gold font-inter font-semibold">{TYPE_LABELS[property.type]}</p>
                {property.views > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-inter bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{property.views} переглядів</span>
                  </div>
                )}
              </div>
              <h1 className="font-cormorant text-3xl sm:text-5xl font-bold tracking-tight mb-3 text-foreground leading-tight">{property.title}</h1>

              {/* State programs & bargain badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {property.erecovery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-inter font-bold shadow-sm">
                    <Hammer className="w-3.5 h-3.5" />
                    єВідновлення
                  </span>
                )}
                {property.eoselia && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a365d] text-white rounded-full text-xs font-inter font-bold shadow-sm">
                    <HomeIcon className="w-3.5 h-3.5" />
                    єОселя
                  </span>
                )}
                {property.tender && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/80 text-white rounded-full text-xs font-inter font-bold shadow-sm">
                    <Handshake className="w-3.5 h-3.5" />
                    Торг можливий
                  </span>
                )}
              </div>

              <div className="flex items-start gap-1.5 text-muted-foreground text-sm mb-8 font-inter">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{property.location}</span>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border border-y border-border py-6 mb-10">
                {property.area > 0 && (
                  <div className="text-center px-4 py-2">
                    <Maximize2 className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-bold text-2xl text-foreground">{property.area}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Загальна м²</p>
                  </div>
                )}
                {property.area_live > 0 && (
                  <div className="text-center px-4 py-2">
                    <BedDouble className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-bold text-2xl text-foreground">{property.area_live}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Житлова м²</p>
                  </div>
                )}
                {property.area_kitchen > 0 && (
                  <div className="text-center px-4 py-2">
                    <UtensilsCrossed className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-bold text-2xl text-foreground">{property.area_kitchen}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Кухня м²</p>
                  </div>
                )}
                {property.rooms > 0 && (
                  <div className="text-center px-4 py-2">
                    <BedDouble className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-bold text-2xl text-foreground">{property.rooms}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Кімнат</p>
                  </div>
                )}
                {property.floor > 0 && (
                  <div className="text-center px-4 py-2">
                    <Building className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-bold text-2xl text-foreground">{property.floor}/{property.floors_total}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Поверх</p>
                  </div>
                )}
                {(!property.floor || property.floor === 0) && property.year_built > 0 && (
                  <div className="text-center px-4 py-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-bold text-2xl text-foreground">{property.year_built}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Рік будівн.</p>
                  </div>
                )}
              </div>

              {/* Additional Specs */}
              <div className="mb-8 flex flex-col gap-3 text-sm font-inter">
                {property.region && (
                  <div className="grid grid-cols-3 border-b border-border/50 pb-2">
                    <span className="text-muted-foreground col-span-1">Район</span>
                    <span className="text-foreground font-medium col-span-2 text-right sm:text-left">{property.region}</span>
                  </div>
                )}
                {property.street && (
                  <div className="grid grid-cols-3 border-b border-border/50 pb-2">
                    <span className="text-muted-foreground col-span-1">Вулиця</span>
                    <span className="text-foreground font-medium col-span-2 text-right sm:text-left">
                      {property.street} {property.building && `, ${property.building}`}
                    </span>
                  </div>
                )}
                {property.mregion && (
                  <div className="grid grid-cols-3 border-b border-border/50 pb-2">
                    <span className="text-muted-foreground col-span-1">Орієнтир</span>
                    <span className="text-foreground font-medium col-span-2 text-right sm:text-left">{property.mregion}</span>
                  </div>
                )}
              </div>

              {/* Description sanitized */}
              {property.description && (
                <div className="mb-8">
                  <h3 className="font-cormorant text-2xl mb-4 font-bold">Опис</h3>
                  <div
                    className="text-foreground leading-relaxed text-sm font-inter space-y-3 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(property.description) }}
                  />
                </div>
              )}

              {/* Source link */}
              {property.source_url && (
                <a
                  href={property.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-gold font-inter transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Оригінальна сторінка об'єкта
                </a>
              )}

              {/* Mortgage Calculator - eOselia */}
              {property.deal === 'sale' && property.price > 0 && (
                <div className="mt-8 border border-border bg-card p-6 sm:p-7 rounded-2xl shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-gold font-inter font-semibold">Державна іпотека</p>
                      <h3 className="font-cormorant text-2xl font-bold">Калькулятор «єОселя»</h3>
                    </div>
                    <span className="px-3 py-1 bg-emerald-600/10 text-emerald-600 text-xs font-bold font-inter rounded-full">
                      від 3% річних
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-inter mb-5 leading-relaxed">
                    Розрахунок за державною програмою доступного кредитування житла (строк 20 років, перший внесок 20%):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="p-4 bg-muted/40 rounded-xl">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-inter mb-1">Перший внесок (20%)</p>
                      <p className="font-inter font-bold text-lg text-foreground">${Math.round(property.price * 0.2).toLocaleString('uk-UA')}</p>
                      <p className="text-[11px] text-muted-foreground">≈ {Math.round(property.price * 0.2 * 41.5).toLocaleString('uk-UA')} грн</p>
                    </div>

                    <div className="p-4 bg-muted/40 rounded-xl">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-inter mb-1">Сума кредиту (80%)</p>
                      <p className="font-inter font-bold text-lg text-foreground">${Math.round(property.price * 0.8).toLocaleString('uk-UA')}</p>
                      <p className="text-[11px] text-muted-foreground">≈ {Math.round(property.price * 0.8 * 41.5).toLocaleString('uk-UA')} грн</p>
                    </div>

                    <div className="p-4 bg-gold/10 rounded-xl border border-gold/20">
                      <p className="text-[10px] uppercase tracking-wider text-gold font-inter font-semibold mb-1">Платіж на місяць (від 3%)</p>
                      <p className="font-inter font-bold text-xl text-navy">
                        ${Math.round(property.price * 0.8 * 0.0055).toLocaleString('uk-UA')}<span className="text-xs font-normal text-muted-foreground">/міс</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground font-semibold">
                        ≈ {Math.round(property.price * 0.8 * 0.0055 * 41.5).toLocaleString('uk-UA')} грн/міс
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBookingForm((prev) => ({ ...prev, note: 'Консультація щодо програми єОселя' }))
                      setIsBookingOpen(true)
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white text-xs tracking-widest uppercase font-inter font-bold rounded-full hover:bg-navy/90 transition-colors"
                  >
                    <span>Отримати консультацію щодо єОселя</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Price + Contact + Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              <div className="border border-border bg-card p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1 font-inter font-semibold">
                  {DEAL_LABELS[property.deal]}
                </p>
                <p className="font-inter font-bold text-3xl sm:text-4xl mb-1 tracking-tight text-foreground">
                  {formattedPrice}
                  {property.deal === 'rent' && <span className="text-sm font-normal text-muted-foreground ml-2">/місяць</span>}
                </p>
                {pricePerM2 && property.deal !== 'rent' && (
                  <p className="text-muted-foreground text-xs font-inter mb-6">
                    ${pricePerM2.toLocaleString('uk-UA')}/м²
                  </p>
                )}

                {/* Primary Action 1: Book viewing */}
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="flex items-center justify-center w-full py-3.5 gradient-gold text-white text-xs tracking-widest uppercase font-inter font-bold hover:opacity-90 transition-opacity rounded-full shadow-md gap-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Записатись на перегляд
                </button>

                {/* Primary Action 2: Call agent directly */}
                <a
                  href={primaryCallPhone}
                  className="flex items-center justify-center w-full mt-3 py-3.5 bg-navy text-white text-xs tracking-widest uppercase font-inter font-bold hover:bg-navy/90 transition-colors rounded-full shadow-sm gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Подзвонити агенту
                </a>

                {/* Primary Action 3: Add to favorites */}
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={cn(
                    'w-full mt-3 py-3 border border-border bg-transparent flex items-center justify-center gap-2 transition-colors font-inter rounded-full text-xs font-semibold uppercase tracking-wider',
                    isFavorite(property.id) ? 'bg-red-50 text-red-600 border-red-200' : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Heart className={cn('w-4 h-4', isFavorite(property.id) && 'fill-red-500 text-red-500')} />
                  <span>{isFavorite(property.id) ? 'В обраному' : 'Додати в обране'}</span>
                </button>

                {/* Share button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full mt-2.5 py-3 border border-border bg-transparent flex items-center justify-center gap-2 hover:bg-muted transition-colors font-inter rounded-full text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                  <span>{copiedShare ? 'Посилання скопійовано!' : 'Поділитися'}</span>
                </button>

                {/* Agent phones list if multiple */}
                {property.agent_phones?.length > 1 && (
                  <div className="space-y-2 mt-6 pt-6 border-t border-border">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-2 font-semibold">Додаткові контакти</p>
                    {property.agent_phones.slice(1).map((phone) => (
                      <a
                        key={phone}
                        href={`tel:+38${phone}`}
                        className="flex items-center gap-2.5 w-full py-2 px-3 border border-border bg-card rounded-xl hover:border-navy transition-all font-inter text-xs text-foreground"
                      >
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>+38 {phone}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* ID & Info */}
              <div className="border border-border bg-card p-5 text-center rounded-2xl shadow-sm space-y-1">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter">ID об'єкта</p>
                <p className="font-inter text-base text-foreground font-bold">#{property.id}</p>
                {property.views > 0 && (
                  <p className="text-xs text-muted-foreground font-inter pt-2 flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{property.views} переглядів</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-inter font-semibold mb-1">Рекомендації</p>
                <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-foreground">Схожі об'єкти поруч</h2>
              </div>
              <Link to={catalogBackLink} className="text-xs font-semibold text-gold hover:underline font-inter">
                Всі пропозиції →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => { setIsBookingOpen(false); setBookingSubmitted(false); setBookingError('') }}
              aria-label="Закрити вікно"
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-cormorant text-3xl font-bold mb-2">Заявку прийнято!</h3>
                <p className="text-muted-foreground font-inter text-sm mb-6">
                  Ми зв'яжемося з вами найближчим часом для узгодження зручного часу перегляду об'єкта <b>#{property.id}</b>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-8 py-3.5 bg-navy text-white text-xs tracking-widest uppercase font-inter font-bold rounded-full hover:bg-navy/90 transition-colors"
                >
                  Зрозуміло
                </button>
              </div>
            ) : (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-inter font-semibold mb-1">Огляд нерухомості</p>
                <h3 className="font-cormorant text-2xl sm:text-3xl font-bold mb-2">Запис на перегляд</h3>
                <p className="text-xs text-muted-foreground font-inter mb-6 line-clamp-1">
                  Об'єкт: #{property.id} · {property.title}
                </p>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5">Ваше ім'я *</label>
                    <input
                      required
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Олександр"
                      className="w-full border border-border bg-card text-foreground px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-inter"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5">Номер телефону *</label>
                    <input
                      required
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      placeholder="+380 (50) 000-00-00"
                      className="w-full border border-border bg-card text-foreground px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-inter"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5">Зручний час або коментар</label>
                    <textarea
                      rows={3}
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, note: e.target.value }))}
                      placeholder="Наприклад: завтра після 15:00"
                      className="w-full border border-border bg-card text-foreground px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-inter resize-none"
                    />
                  </div>

                  {bookingError && (
                    <p className="text-xs text-destructive font-inter bg-destructive/10 p-3 rounded-xl">{bookingError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full py-4 gradient-gold text-white text-xs tracking-widest uppercase font-inter font-bold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingBooking ? (
                      <span>Відправляємо...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Підтвердити запис</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile sticky action bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border px-3 py-2.5 shadow-2xl flex items-center gap-2">
        <a
          href={primaryCallPhone}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-navy text-white text-xs font-inter font-bold rounded-xl active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Дзвінок</span>
        </a>

        <a
          href={`viber://chat?number=%2B38${property.agent_phones?.[0] || '0507136363'}`}
          className="flex items-center justify-center p-3 bg-[#7360f2] text-white rounded-xl active:scale-95 transition-transform"
          aria-label="Написати у Viber"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        <a
          href="https://t.me/kharkov_realter"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 bg-[#0088cc] text-white rounded-xl active:scale-95 transition-transform"
          aria-label="Написати у Telegram"
        >
          <Send className="w-4 h-4" />
        </a>

        <button
          type="button"
          onClick={() => setIsBookingOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 gradient-gold text-white text-xs font-inter font-bold rounded-xl active:scale-95 transition-transform"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Огляд</span>
        </button>
      </div>
    </div>
  )
}

export default PropertyDetail

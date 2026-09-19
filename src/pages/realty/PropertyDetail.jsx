import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, BedDouble, Maximize2, MapPin, Phone, Building, Calendar, UtensilsCrossed, ExternalLink, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { getAllObjects, mapObject } from '@/lib/novostoyApi'
import { useFavorites } from '@/lib/FavoritesContext'
import { cn } from '@/lib/utils'
import SeoMeta from '@/components/seo/SeoMeta'
import JsonLd, { generateRealEstateSchema } from '@/components/seo/JsonLd'

const DEAL_LABELS = { sale: 'Продаж', rent: 'Оренда' }
const TYPE_LABELS = { apartment: 'Квартира', house: 'Будинок', penthouse: 'Пентхаус', villa: 'Вілла', commercial: 'Комерційна' }

const PropertyDetail = () => {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const thumbnailRefs = useRef([])
  const { isFavorite, toggleFavorite } = useFavorites()
  const queryClient = useQueryClient()

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
      // Check if already in catalog cache (sale or rent)
      const saleCache = queryClient.getQueryData(['novostoy-objects', 'sale'])
      const rentCache = queryClient.getQueryData(['novostoy-objects', 'rent'])
      const allCache = queryClient.getQueryData(['novostoy-objects', ''])
      
      for (const cache of [saleCache, rentCache, allCache]) {
        if (cache) {
          const found = cache.find(o => String(o.id) === String(id))
          if (found) return found
        }
      }
      
      // Not in cache — fetch all and find
      const allItems = await getAllObjects({})
      const mapped = allItems.map(mapObject)
      return mapped.find(o => String(o.id) === String(id)) || null
    },
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Skeleton Gallery */}
      <div className="w-full h-[50vh] md:h-[60vh] bg-card border-b border-border/50 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location Skeleton */}
            <div className="space-y-4">
              <div className="w-24 h-4 bg-muted/30 rounded animate-pulse" />
              <div className="w-3/4 h-12 md:h-16 bg-muted/30 rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-muted/30 rounded animate-pulse" />
            </div>
            {/* Specs Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/50">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card h-32 animate-pulse" />
              ))}
            </div>
            {/* Description Skeleton */}
            <div className="space-y-3 pt-4">
              <div className="w-32 h-8 bg-muted/30 rounded animate-pulse mb-6" />
              <div className="w-full h-4 bg-muted/30 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-muted/30 rounded animate-pulse" />
              <div className="w-full h-4 bg-muted/30 rounded animate-pulse" />
              <div className="w-4/5 h-4 bg-muted/30 rounded animate-pulse" />
            </div>
          </div>
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="border border-border/50 bg-card p-7 space-y-6">
              <div className="w-20 h-3 bg-muted/30 rounded animate-pulse" />
              <div className="w-48 h-14 bg-muted/30 rounded animate-pulse" />
              <div className="w-24 h-3 bg-muted/30 rounded animate-pulse" />
              <div className="w-full h-12 bg-muted/30 rounded animate-pulse mt-8" />
              <div className="w-full h-12 bg-muted/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!property) return (
    <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center">
      <p className="font-cormorant text-4xl mb-4">Об'єкт не знайдено</p>
      <Link to="/flats" className="text-gold text-sm font-inter">← Повернутися до каталогу</Link>
    </div>
  )

  const images = property.images?.length
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80']

  const handlePrevImage = () => {
    setActiveImg(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImg(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const pricePerM2 = property.area ? Math.round(property.price / property.area) : null

  const schemaUrl = `https://kharkov-realter.com.ua/property/${property.id}`
  const seoTitle = `${TYPE_LABELS[property.type] || 'Об\'єкт'} ${property.rooms ? property.rooms + '-кімн., ' : ''}${property.area} м² за $${property.price.toLocaleString()}`

  return (
    <div className="pt-24 pb-20">
      <SeoMeta 
        title={seoTitle}
        description={property.description?.substring(0, 160) || `Купити ${seoTitle.toLowerCase()} від агентства Харків Ріелтер.`}
        url={`/property/${property.id}`}
        image={images[0]}
      />
      <JsonLd data={generateRealEstateSchema(property, schemaUrl)} />
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="py-6 flex items-center gap-3">
          <Link to="/flats" className="flex items-center gap-2 text-muted-foreground hover:text-gold text-sm font-inter transition-colors">
            <ArrowLeft className="w-4 h-4" /> Каталог
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm text-muted-foreground font-inter truncate max-w-xs">{property.title}</span>
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
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80' }}
              />
              {property.new_building && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-navy text-white text-[10px] tracking-widest uppercase font-inter font-medium rounded-full z-10">Новобудова</div>
              )}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur text-white text-[10px] tracking-widest uppercase font-inter rounded-full z-10">
                {activeImg + 1} / {images.length}
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Попереднє фото"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/40 hover:bg-background/85 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:text-gold transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Наступне фото"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/40 hover:bg-background/85 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:text-gold transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
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
                      ref={el => { thumbnailRefs.current[i] = el }}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-24 h-16 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        activeImg === i 
                          ? 'border-navy scale-95 shadow-md shadow-navy/20' 
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-border'
                      }`}
                    >
                      <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover pointer-events-none rounded-lg"
                        onError={e => { e.currentTarget.style.display = 'none' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Info block */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border-t border-border pt-8">
              <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2 font-inter">{TYPE_LABELS[property.type]}</p>
              <h1 className="font-cormorant text-4xl sm:text-5xl font-light mb-3">{property.title}</h1>

              <div className="flex items-start gap-1.5 text-muted-foreground text-sm mb-8 font-inter">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{property.location}</span>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border border-y border-border py-6 mb-10">
                {property.area && (
                  <div className="text-center px-4 py-2">
                    <Maximize2 className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-medium text-2xl text-foreground">{property.area}</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Загальна м²</p>
                  </div>
                )}
                {property.area_live && (
                  <div className="text-center px-4 py-2">
                    <BedDouble className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-medium text-2xl text-foreground">{property.area_live}</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Житлова м²</p>
                  </div>
                )}
                {property.area_kitchen && (
                  <div className="text-center px-4 py-2">
                    <UtensilsCrossed className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-medium text-2xl text-foreground">{property.area_kitchen}</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Кухня м²</p>
                  </div>
                )}
                {property.rooms && (
                  <div className="text-center px-4 py-2">
                    <BedDouble className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-medium text-2xl text-foreground">{property.rooms}</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Кімнат</p>
                  </div>
                )}
                {property.floor && (
                  <div className="text-center px-4 py-2">
                    <Building className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-medium text-2xl text-foreground">{property.floor}/{property.floors_total}</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Поверх</p>
                  </div>
                )}
                {!property.floor && property.year_built && (
                  <div className="text-center px-4 py-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
                    <p className="font-inter font-medium text-2xl text-foreground">{property.year_built}</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-inter mt-1">Рік будівн.</p>
                  </div>
                )}
              </div>

              {/* Additional Text Specs */}
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

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h3 className="font-cormorant text-2xl mb-4 font-bold">Опис</h3>
                  <div 
                    className="text-foreground leading-relaxed text-sm font-inter space-y-3"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </div>
              )}

              {/* Source link */}
              {property.source_url && (
                <a href={property.source_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-gold font-inter transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Оригінальна сторінка об'єкта
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: Price + Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              {/* Price card */}
              <div className="border border-border bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1 font-inter">
                  {DEAL_LABELS[property.deal]}
                </p>
                <p className="font-inter font-bold text-4xl mb-1 tracking-tight text-foreground">
                  ${property.price.toLocaleString('uk-UA')}
                </p>
                {pricePerM2 && (
                  <p className="text-muted-foreground text-xs font-inter mb-8">
                    ${pricePerM2.toLocaleString('uk-UA')}/м²
                  </p>
                )}

                {/* Agent phones */}
                {property.agent_phones?.length > 0 && (
                  <div className="space-y-2 mb-8">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-3">Контакти агента</p>
                    {property.agent_phones.map(phone => (
                      <a key={phone} href={`tel:+38${phone}`}
                        className="flex items-center gap-3 w-full py-3 px-4 border border-border bg-card rounded-xl hover:border-navy hover:shadow-sm transition-all group font-inter">
                        <Phone className="w-4 h-4 text-muted-foreground group-hover:text-navy transition-colors" />
                        <span className="text-sm font-medium group-hover:text-navy transition-colors">+38 {phone}</span>
                      </a>
                    ))}
                  </div>
                )}

                <Link to="/contact"
                  className="flex items-center justify-center w-full py-4 gradient-gold text-xs tracking-widest uppercase font-inter font-semibold hover:opacity-90 transition-opacity rounded-full shadow-md">
                  <Phone className="w-4 h-4 mr-2" />
                  Подзвонити агенту
                </Link>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFavorite(property.id)}
                  className="w-full mt-3 py-4 border border-border bg-transparent flex items-center justify-center gap-2 hover:bg-muted transition-colors group font-inter rounded-full"
                >
                  <motion.div animate={{ scale: isFavorite(property.id) ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
                    <Heart className={cn("w-4 h-4 transition-colors", isFavorite(property.id) ? "text-navy fill-navy" : "text-muted-foreground group-hover:text-navy")} />
                  </motion.div>
                  <span className="text-xs tracking-widest uppercase font-medium text-foreground">
                    {isFavorite(property.id) ? 'В обраному' : 'Записатись на перегляд'}
                  </span>
                </motion.button>
              </div>

              {/* ID */}
              <div className="border border-border bg-card p-6 text-center rounded-2xl shadow-sm">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-2">ID об'єкта</p>
                <p className="font-inter text-lg text-foreground font-medium">{property.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PropertyDetail

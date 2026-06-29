import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, BedDouble, Maximize2, MapPin, Phone, Building, Calendar, UtensilsCrossed, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { getObjects, mapObject } from '@/lib/novostoyApi'

const DEAL_LABELS = { sale: 'Продаж', rent: 'Оренда' };
const TYPE_LABELS = { apartment: 'Квартира', house: 'Будинок', penthouse: 'Пентхаус', villa: 'Вілла', commercial: 'Комерційна' };

export default function PropertyDetail() {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const thumbnailRefs = useRef([])

  useEffect(() => {
    if (thumbnailRefs.current[activeImg]) {
      thumbnailRefs.current[activeImg].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeImg])

  // Fetch from API by searching all objects and find by id
  const { data: property, isLoading } = useQuery({
    queryKey: ['novostoy-property', id],
    queryFn: async () => {
      // Try all parent categories
      const results = await Promise.allSettled([
        getObjects({ parent_id: '2', limit: 200 }),
        getObjects({ parent_id: '4', limit: 200 }),
        getObjects({ parent_id: '6', limit: 200 }),
      ]);
      const allItems = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value.data || []);
      const found = allItems.find(o => String(o.id) === String(id));
      return found ? mapObject(found) : null;
    },
  });

  if (isLoading) return (
    <div className="pt-32 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center">
      <p className="font-cormorant text-4xl mb-4">Об'єкт не знайдено</p>
      <Link to="/catalog" className="text-gold text-sm font-inter">← Повернутися до каталогу</Link>
    </div>
  );

  const images = property.images?.length
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'];

  const handlePrevImage = () => {
    setActiveImg(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImg(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const pricePerM2 = property.area ? Math.round(property.price / property.area) : null;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="py-6 flex items-center gap-3">
          <Link to="/catalog" className="flex items-center gap-2 text-muted-foreground hover:text-gold text-sm font-inter transition-colors">
            <ArrowLeft className="w-4 h-4" /> Каталог
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm text-muted-foreground font-inter truncate max-w-xs">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image */}
            <div className="relative aspect-[16/9] overflow-hidden bg-card border border-border group">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImg]}
                alt={property.title}
                className="w-full h-full object-cover select-none"
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80' }}
              />
              {property.new_building && (
                <div className="absolute top-4 left-4 px-3 py-1 gradient-gold text-background text-[10px] tracking-widest uppercase font-inter z-10">Новобудова</div>
              )}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/80 text-foreground text-[10px] tracking-widest uppercase font-inter z-10">
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
                      className={`shrink-0 w-24 h-16 overflow-hidden border-2 transition-all duration-300 ${
                        activeImg === i 
                          ? 'border-gold scale-95 shadow-md shadow-gold/20' 
                          : 'border-border opacity-70 hover:opacity-100 hover:border-border/80'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover pointer-events-none"
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border mb-8">
                {property.area && (
                  <div className="bg-card text-center p-5">
                    <Maximize2 className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.area}</p>
                    <p className="text-xs text-muted-foreground font-inter mt-0.5">Загальна м²</p>
                  </div>
                )}
                {property.area_live && (
                  <div className="bg-card text-center p-5">
                    <BedDouble className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.area_live}</p>
                    <p className="text-xs text-muted-foreground font-inter mt-0.5">Житлова м²</p>
                  </div>
                )}
                {property.area_kitchen && (
                  <div className="bg-card text-center p-5">
                    <UtensilsCrossed className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.area_kitchen}</p>
                    <p className="text-xs text-muted-foreground font-inter mt-0.5">Кухня м²</p>
                  </div>
                )}
                {property.floor && (
                  <div className="bg-card text-center p-5">
                    <Building className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.floor}/{property.floors_total}</p>
                    <p className="text-xs text-muted-foreground font-inter mt-0.5">Поверх</p>
                  </div>
                )}
                {property.rooms && (
                  <div className="bg-card text-center p-5">
                    <BedDouble className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.rooms}</p>
                    <p className="text-xs text-muted-foreground font-inter mt-0.5">Кімнат</p>
                  </div>
                )}
                {property.year_built && (
                  <div className="bg-card text-center p-5">
                    <Calendar className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.year_built}</p>
                    <p className="text-xs text-muted-foreground font-inter mt-0.5">Рік будівництва</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h3 className="font-cormorant text-2xl mb-4">Опис</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-inter whitespace-pre-line">{property.description}</p>
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
              <div className="border border-gold/40 bg-card p-7">
                <p className="text-xs tracking-[0.2em] uppercase text-gold mb-1 font-inter">
                  {DEAL_LABELS[property.deal]}
                </p>
                <p className="font-cormorant text-5xl font-semibold mb-1">
                  ${property.price.toLocaleString('uk-UA')}
                </p>
                {pricePerM2 && (
                  <p className="text-muted-foreground text-xs font-inter mb-6">
                    ${pricePerM2.toLocaleString('uk-UA')}/м²
                  </p>
                )}

                {/* Agent phones */}
                {property.agent_phones?.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-3">Контакти агента</p>
                    {property.agent_phones.map(phone => (
                      <a key={phone} href={`tel:+38${phone}`}
                        className="flex items-center gap-3 w-full py-3 px-4 border border-border bg-background hover:border-gold/50 hover:text-gold transition-colors group font-inter">
                        <Phone className="w-4 h-4 text-gold" />
                        <span className="text-sm group-hover:text-gold transition-colors">+38 {phone}</span>
                      </a>
                    ))}
                  </div>
                )}

                <Link to="/contact"
                  className="block w-full py-3.5 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium text-center hover:opacity-90 transition-opacity">
                  Записатись на перегляд
                </Link>
              </div>

              {/* ID */}
              <div className="border border-border bg-card p-5 text-center">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-1">ID об'єкта</p>
                <p className="font-cormorant text-lg text-gold">{property.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
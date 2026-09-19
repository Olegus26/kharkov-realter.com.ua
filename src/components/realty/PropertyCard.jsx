import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BedDouble, Maximize2, MapPin, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/FavoritesContext'

const TYPE_LABELS = {
  apartment: 'Квартира',
  house: 'Будинок',
  penthouse: 'Пентхаус',
  villa: 'Вілла',
  commercial: 'Комерційна',
}

const formatPrice = (p) => {
  if (!p) return '—'
  if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(2)} млн`
  return `$${p?.toLocaleString('uk-UA')}`
}

const PropertyCard = memo(({ property, className = '' }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const liked = isFavorite(property.id)

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }, [property.id, toggleFavorite])

  return (
    <div
      className={cn('group bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-xl transition-all hover:-translate-y-1 duration-300', className)}
    >
      <Link to={`/property/${property.id}`} className="relative aspect-[4/3] overflow-hidden block">
        <img
          src={property.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <span className="px-3 py-1 bg-navy text-white text-[10px] tracking-widest uppercase font-inter font-medium rounded-full">
              Топ
            </span>
          )}
          {property.new_building && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-[10px] tracking-widest uppercase font-inter rounded-full">
              Новобудова
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className="p-2 bg-black/20 backdrop-blur hover:bg-black/40 rounded-full transition-colors group/btn flex items-center justify-center"
            aria-label={liked ? 'Видалити з обраного' : 'Додати в обране'}
          >
            <motion.div animate={{ scale: liked ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
              <Heart className={cn("w-4 h-4 transition-colors", {
                "text-white fill-white": liked,
                "text-white/70 group-hover/btn:text-white": !liked
              })} />
            </motion.div>
          </motion.button>
        </div>

        {/* Price on image and Deal badge */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="font-inter text-2xl font-bold text-white tracking-tight">{formatPrice(property.price)}</p>
            {property.deal === 'rent' && <p className="text-[10px] text-white/70 font-inter">/місяць</p>}
          </div>
          <span className="px-3 py-1 bg-black/50 backdrop-blur text-white/90 text-[9px] tracking-widest uppercase font-inter rounded-full">
            {property.deal === 'sale' ? 'Продаж' : 'Оренда'}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow bg-card">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 font-medium">{TYPE_LABELS[property.type]}</p>
        <h3 className="font-inter text-lg font-semibold mb-2 text-foreground group-hover:text-navy transition-colors line-clamp-1 tracking-tight">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted-foreground font-inter mt-auto">
          <div className="flex items-center gap-4">
            {property.rooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 shrink-0" />
                {property.rooms} кімн.
              </span>
            )}
            {property.area && (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                {property.area} м²
              </span>
            )}
          </div>
          {property.floor && (
            <span>{property.floor}/{property.floors_total} пов.</span>
          )}
        </div>
      </div>
    </div>
  )
})

export default PropertyCard
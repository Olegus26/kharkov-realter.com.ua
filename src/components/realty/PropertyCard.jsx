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

const PropertyCard = memo(function PropertyCard({ property, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const liked = isFavorite(property.id)

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }, [property.id, toggleFavorite])

  return (
    <div
      className={cn('group bg-card border border-border flex flex-col h-full hover:border-gold/50 transition-all hover:-translate-y-1 duration-300', className)}
    >
      <Link to={`/property/${property.id}`} className="relative aspect-[4/3] overflow-hidden block">
        <img
          src={property.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 will-change-transform"
        />
        <div className="absolute inset-0 gradient-dark opacity-60" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <span className="px-3 py-1 gradient-gold text-background text-[10px] tracking-widest uppercase font-inter font-medium">
              Топ
            </span>
          )}
          {property.new_building && (
            <span className="px-3 py-1 bg-background/80 text-foreground text-[10px] tracking-widest uppercase font-inter">
              Новостройка
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <span className="px-3 py-1 bg-background/80 text-foreground text-[10px] tracking-widest uppercase font-inter">
            {property.deal === 'sale' ? 'Продажа' : 'Аренда'}
          </span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className="p-2 bg-background/80 hover:bg-background rounded-full transition-colors group/btn flex items-center justify-center"
            aria-label={liked ? 'Видалити з обраного' : 'Додати в обране'}
          >
            <motion.div animate={{ scale: liked ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
              <Heart className={cn("w-4 h-4 transition-colors", liked ? "text-gold fill-gold" : "text-muted-foreground group-hover/btn:text-gold")} />
            </motion.div>
          </motion.button>
        </div>

        {/* Price on image */}
        <div className="absolute bottom-4 left-4">
          <p className="font-cormorant text-2xl font-semibold text-white">{formatPrice(property.price)}</p>
          {property.deal === 'rent' && <p className="text-xs text-white/70 font-inter">/месяц</p>}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{TYPE_LABELS[property.type]}</p>
        <h3 className="font-cormorant text-xl font-medium mb-3 group-hover:text-gold transition-colors line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border text-xs text-muted-foreground font-inter mt-auto">
          {property.rooms && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5" />
              {property.rooms} комн.
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              {property.area} м²
            </span>
          )}
          {property.floor && (
            <span>{property.floor}/{property.floors_total} эт.</span>
          )}
        </div>
      </div>
    </div>
  )
})

export default PropertyCard
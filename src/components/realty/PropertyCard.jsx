import { Link } from 'react-router-dom';
import { BedDouble, Maximize2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_LABELS = {
  apartment: 'Апартаменти',
  house: 'Будинок',
  penthouse: 'Пентхаус',
  villa: 'Вілла',
  commercial: 'Комерційна',
};

export default function PropertyCard({ property, className = '' }) {
  const formatPrice = (p) => {
    if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)} млн ₴`;
    return `${p?.toLocaleString('uk-UA')} ₴`;
  };

  return (
    <Link
      to={`/property/${property.id}`}
      className={cn('group block bg-card border border-border overflow-hidden hover:border-gold/50 transition-all duration-500', className)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
              Новобудова
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-background/80 text-foreground text-[10px] tracking-widest uppercase font-inter">
            {property.deal === 'sale' ? 'Продаж' : 'Оренда'}
          </span>
        </div>

        {/* Price on image */}
        <div className="absolute bottom-4 left-4">
          <p className="font-cormorant text-2xl font-semibold text-white">{formatPrice(property.price)}</p>
          {property.deal === 'rent' && <p className="text-xs text-white/70 font-inter">/місяць</p>}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{TYPE_LABELS[property.type]}</p>
        <h3 className="font-cormorant text-xl font-medium mb-3 group-hover:text-gold transition-colors line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border text-xs text-muted-foreground font-inter">
          {property.rooms && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5" />
              {property.rooms} кімн.
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              {property.area} м²
            </span>
          )}
          {property.floor && (
            <span>{property.floor}/{property.floors_total} пов.</span>
          )}
        </div>
      </div>
    </Link>
  );
}
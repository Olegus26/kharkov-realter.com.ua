import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BedDouble, Maximize2, MapPin, Phone, Building, Calendar } from 'lucide-react'
import { MOCK_PROPERTIES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const TYPE_LABELS = { 
  apartment: 'Апартаменти', 
  house: 'Будинок', 
  penthouse: 'Пентхаус', 
  villa: 'Вілла', 
  commercial: 'Комерційна' 
}

const PropertyDetail = () => {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)

  // Use only hardcoded static offline data
  const property = MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0]

  const formatPrice = (p) => {
    if (p >= 1000000) return `₴ ${(p / 1000000).toFixed(1)} млн`
    return `₴ ${p?.toLocaleString('uk-UA')}`
  }

  const handleImageClick = (index) => () => {
    setActiveImg(index)
  }

  if (!property) {
    return (
      <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center" aria-label="Об'єкт нерухомості не знайдено">
        <p className="font-cormorant text-4xl mb-4">Об'єкт не знайдено</p>
        <Link 
          to="/catalog" 
          tabIndex={0}
          className="text-gold text-sm font-inter focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded p-1"
        >
          ← Повернутися до каталогу
        </Link>
      </div>
    )
  }

  const images = property.images?.length ? property.images : [property.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80']

  return (
    <div className="pt-24 pb-20" aria-label={`Відомості про об'єкт ${property.title}`}>
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Хлібні крихти" className="py-6 flex items-center gap-3">
          <Link 
            to="/catalog" 
            tabIndex={0}
            className="flex items-center gap-2 text-muted-foreground hover:text-gold text-sm font-inter transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded p-1"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4" /> Каталог
          </Link>
          <span className="text-border" aria-hidden="true">/</span>
          <span className="text-sm text-foreground font-inter truncate" aria-current="page">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-md">
              <img 
                src={images[activeImg]} 
                alt={`${property.title} - Фото ${activeImg + 1}`} 
                className="w-full h-full object-cover" 
              />
              {property.featured && (
                <div className="absolute top-4 left-4 px-3 py-1 gradient-gold text-background text-[10px] tracking-widest uppercase font-inter rounded-sm">
                  Топ
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Фотографії об'єкта">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={handleImageClick(i)}
                    role="tab"
                    tabIndex={0}
                    aria-selected={activeImg === i}
                    aria-label={`Показати фото ${i + 1}`}
                    className={cn(
                      'shrink-0 w-20 h-16 overflow-hidden border-2 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                      activeImg === i ? 'border-gold' : 'border-border'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-border pt-8">
              <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2 font-inter">{TYPE_LABELS[property.type]}</p>
              <h1 className="font-cormorant text-4xl sm:text-5xl font-light mb-3">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-6 font-inter">
                <MapPin aria-hidden="true" className="w-4 h-4" />{property.location}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border border-border p-6 mb-8 rounded-md bg-card/30">
                {property.area && (
                  <div className="text-center" aria-label={`Площа ${property.area} квадратних метрів`}>
                    <Maximize2 aria-hidden="true" className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.area}</p>
                    <p className="text-xs text-muted-foreground font-inter">м²</p>
                  </div>
                )}
                {property.rooms && (
                  <div className="text-center" aria-label={`${property.rooms} кімнат`}>
                    <BedDouble aria-hidden="true" className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.rooms}</p>
                    <p className="text-xs text-muted-foreground font-inter">кімнат</p>
                  </div>
                )}
                {property.floor && (
                  <div className="text-center" aria-label={`Поверх ${property.floor} з ${property.floors_total}`}>
                    <Building aria-hidden="true" className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.floor}/{property.floors_total}</p>
                    <p className="text-xs text-muted-foreground font-inter">поверх</p>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center" aria-label={`Рік побудови ${property.year_built}`}>
                    <Calendar aria-hidden="true" className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="font-cormorant text-2xl">{property.year_built}</p>
                    <p className="text-xs text-muted-foreground font-inter">рік побудови</p>
                  </div>
                )}
              </div>

              {property.description && (
                <section aria-label="Опис об'єкта">
                  <h3 className="font-cormorant text-2xl mb-4">Опис</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-inter">
                    {property.description}
                  </p>
                </section>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1" aria-label="Бічна панель з ціною та контактами">
            <div className="sticky top-28 space-y-6">
              <div className="border border-gold/40 bg-card p-8 rounded-lg shadow-lg">
                <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2 font-inter">
                  {property.deal === 'sale' ? 'Вартість' : 'Оренда за місяць'}
                </p>
                <p className="font-cormorant text-4xl font-semibold mb-1 text-foreground">{formatPrice(property.price)}</p>
                {property.area && (
                  <p className="text-muted-foreground text-xs font-inter">
                    {formatPrice(Math.round(property.price / property.area))} / м²
                  </p>
                )}

                <div className="mt-8 space-y-3">
                  <Link 
                    to="/contact" 
                    tabIndex={0}
                    className="block w-full py-3.5 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium text-center hover:opacity-90 transition-opacity rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-gold"
                  >
                    Записатися на перегляд
                  </Link>
                  <a 
                    href="tel:+380501234567" 
                    tabIndex={0}
                    className="flex items-center justify-center gap-2 w-full py-3.5 border border-border text-sm text-foreground hover:text-gold hover:border-gold transition-colors font-inter rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Phone aria-hidden="true" className="w-4 h-4" /> Зателефонувати
                  </a>
                </div>
              </div>

              <div className="border border-border bg-card/50 p-6 text-center rounded-lg">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-inter">Об'єкт ID</p>
                <p className="font-cormorant text-lg text-gold">{property.id?.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail

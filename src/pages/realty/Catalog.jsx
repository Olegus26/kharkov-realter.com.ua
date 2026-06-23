import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import { MOCK_PROPERTIES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const TYPES = [
  { value: '', label: 'Всі типи' },
  { value: 'apartment', label: 'Апартаменти' },
  { value: 'house', label: 'Будинок' },
  { value: 'penthouse', label: 'Пентхаус' },
  { value: 'villa', label: 'Вілла' },
  { value: 'commercial', label: 'Комерційна' }
]

const CatalogPage = () => {
  const [deal, setDeal] = useState('')
  const [type, setType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch] = useState('')

  const properties = MOCK_PROPERTIES

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (deal && p.deal !== deal) return false
      if (type && p.type !== type) return false
      if (minPrice && p.price < Number(minPrice)) return false
      if (maxPrice && p.price > Number(maxPrice)) return false
      if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) && !p.location?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [properties, deal, type, minPrice, maxPrice, search])

  const handleClearFilters = () => {
    setDeal('')
    setType('')
    setMinPrice('')
    setMaxPrice('')
    setSearch('')
  }
  
  const handleDealChange = (v) => () => {
    setDeal(v)
  }

  const handleSearchChange = (e) => setSearch(e.target.value)
  const handleTypeChange = (e) => setType(e.target.value)
  const handleMinPriceChange = (e) => setMinPrice(e.target.value)
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value)

  const hasFilters = deal || type || minPrice || maxPrice || search

  return (
    <div className="pt-24 pb-20" aria-label="Каталог сайту">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-12 border-b border-border mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Наші об'єкти</p>
          <div className="flex items-end justify-between">
            <h1 className="font-cormorant text-5xl sm:text-6xl font-light">Каталог</h1>
            <p className="text-muted-foreground text-sm font-inter hidden sm:block">{filtered.length} об'єктів</p>
          </div>
        </div>

        <div className="mb-8" aria-label="Фільтри">
          <div className="flex gap-0 border border-border w-fit mb-6" role="tablist">
            {[['', 'Всі'], ['sale', 'Продаж'], ['rent', 'Оренда']].map(([v, l]) => (
              <button
                key={v}
                onClick={handleDealChange(v)}
                role="tab"
                aria-selected={deal === v}
                tabIndex={0}
                className={cn(
                  'px-6 py-2.5 text-xs tracking-widest uppercase font-inter transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                  deal === v ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Пошук за назвою або адресою..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Пошук за назвою або адресою"
              tabIndex={0}
              className="border border-border bg-card text-foreground text-sm px-4 py-2.5 outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground flex-1 min-w-48"
            />

            <select 
              value={type} 
              onChange={handleTypeChange}
              aria-label="Фільтр за типом нерухомості"
              tabIndex={0}
              className="border border-border bg-card text-sm px-4 py-2.5 outline-none focus:border-gold/50 transition-colors font-inter text-foreground"
            >
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            <input 
              type="number" 
              placeholder="Ціна від" 
              value={minPrice} 
              onChange={handleMinPriceChange}
              aria-label="Мінімальна ціна"
              tabIndex={0}
              className="border border-border bg-card text-foreground text-sm px-4 py-2.5 w-36 outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground" 
            />
            
            <input 
              type="number" 
              placeholder="Ціна до" 
              value={maxPrice} 
              onChange={handleMaxPriceChange}
              aria-label="Максимальна ціна"
              tabIndex={0}
              className="border border-border bg-card text-foreground text-sm px-4 py-2.5 w-36 outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground" 
            />

            {hasFilters && (
              <button 
                onClick={handleClearFilters} 
                aria-label="Скинути фільтри"
                tabIndex={0}
                className="flex items-center gap-1.5 text-xs text-gold hover:text-gold/70 transition-colors font-inter focus:outline-none focus-visible:ring-2 focus-visible:ring-gold p-1"
              >
                <X aria-hidden="true" className="w-3.5 h-3.5" /> Скинути
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24" aria-label="Немає результатів">
            <p className="font-cormorant text-3xl text-muted-foreground mb-2">Об'єкти не знайдено</p>
            <p className="text-sm text-muted-foreground font-inter">Спробуйте змінити параметри пошуку</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogPage

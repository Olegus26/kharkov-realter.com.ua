import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X, LayoutGrid, Map, AlertCircle } from 'lucide-react';
import PropertyCard from '@/components/realty/PropertyCard';
import MapView from '@/components/realty/MapView';
import { getObjects, mapObject } from '@/lib/novostoyApi';

const TYPES = [
  { value: '', label: 'Всі типи' },
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Будинок' },
  { value: 'penthouse', label: 'Пентхаус' },
  { value: 'villa', label: 'Вілла' },
  { value: 'commercial', label: 'Комерційна' },
];

export default function CatalogPage() {
  const [deal, setDeal] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['novostoy-objects'],
    queryFn: async () => {
      const res = await getObjects({ parent_id: '2' });
      return (res.data || []).map(mapObject);
    },
  });

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (deal && p.deal !== deal) return false;
      if (type && p.type !== type) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) && !p.location?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [properties, deal, type, minPrice, maxPrice, search]);

  const clearFilters = () => { setDeal(''); setType(''); setMinPrice(''); setMaxPrice(''); setSearch(''); };
  const hasFilters = deal || type || minPrice || maxPrice || search;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="py-12 border-b border-border mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Наші об'єкти</p>
          <div className="flex items-end justify-between">
            <h1 className="font-cormorant text-5xl sm:text-6xl font-light">Каталог</h1>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-sm font-inter hidden sm:block">{filtered.length} об'єктів</p>
              {/* View Toggle */}
              <div className="flex border border-border">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-inter transition-colors ${viewMode === 'list' ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Список</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-inter transition-colors ${viewMode === 'map' ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Карта</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          {/* Deal tabs */}
          <div className="flex gap-0 border border-border w-fit mb-6">
            {[['', 'Все'], ['sale', 'Продаж'], ['rent', 'Оренда']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setDeal(v)}
                className={`px-6 py-2.5 text-xs tracking-widest uppercase font-inter transition-colors ${deal === v ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'}`}
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
              onChange={e => setSearch(e.target.value)}
              className="border border-border bg-card text-foreground text-sm px-4 py-2.5 outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground flex-1 min-w-48"
            />

            <select value={type} onChange={e => setType(e.target.value)}
              className="border border-border bg-card text-sm px-4 py-2.5 outline-none focus:border-gold/50 transition-colors font-inter text-foreground">
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            <input type="number" placeholder="Ціна від" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="border border-border bg-card text-foreground text-sm px-4 py-2.5 w-36 outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground" />
            <input type="number" placeholder="Ціна до" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="border border-border bg-card text-foreground text-sm px-4 py-2.5 w-36 outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground" />

            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-gold hover:text-gold/70 transition-colors font-inter">
                <X className="w-3.5 h-3.5" /> Скинути
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 border border-destructive/40 bg-destructive/10 text-destructive text-sm font-inter mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Помилка завантаження: {error.message}
          </div>
        )}

        {/* Content: Map or List */}
        {viewMode === 'map' ? (
          isLoading ? (
            <div className="w-full h-[500px] bg-card border border-border animate-pulse flex items-center justify-center">
              <p className="text-muted-foreground font-inter text-sm">Завантаження карти...</p>
            </div>
          ) : (
            <MapView properties={filtered} />
          )
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-card border border-border aspect-[4/5] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-cormorant text-3xl text-muted-foreground mb-2">Об'єкти не знайдено</p>
            <p className="text-sm text-muted-foreground font-inter">Спробуйте змінити параметри пошуку</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
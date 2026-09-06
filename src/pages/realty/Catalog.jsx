import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X, LayoutGrid, Map, AlertCircle, ChevronLeft, ChevronRight, Heart, ChevronDown } from 'lucide-react';
import PropertyCard from '@/components/realty/PropertyCard';
import MapView from '@/components/realty/MapView';
import { getAllObjects, mapObject } from '@/lib/novostoyApi';
import { useFavorites } from '@/lib/FavoritesContext';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import SeoMeta from '@/components/seo/SeoMeta';
import JsonLd, { generateItemListSchema } from '@/components/seo/JsonLd';


const CATEGORIES = [
  { value: 'apartment', label: 'Квартири/Гостинки', path: '/flats' },
  { value: 'house', label: 'Будинки/Ділянки', path: '/houses' },
  { value: 'commercial', label: 'Комерція', path: '/realtys' },
];

const SUBTYPES_BY_CATEGORY = {
  apartment: [
    { value: 'rooms_1', label: '1-комн. квартира' },
    { value: 'rooms_2', label: '2-комн. квартира' },
    { value: 'rooms_3', label: '3-комн. квартира' },
    { value: 'rooms_4', label: '4-комн. квартира' },
    { value: 'rooms_5+', label: '5 и более комнат' },
    { value: 'gostinka', label: 'гостинки' },
    { value: 'gostinka_su', label: 'гостинки с с/у' },
    { value: 'podselenie', label: 'подселение' },
  ],
  house: [
    { value: 'whole', label: 'целый' },
    { value: 'half', label: '1/2' },
    { value: 'third', label: '1/3' },
    { value: 'dacha', label: 'дача' },
    { value: 'land', label: 'участок' },
  ],
  commercial: [
    { value: 'premises', label: 'помещение' },
    { value: 'building', label: 'здание' },
    { value: 'land_comm', label: 'участок' },
    { value: 'garage', label: 'гараж' },
    { value: 'shop', label: 'магазин' },
    { value: 'office', label: 'офис' },
    { value: 'production', label: 'производство' },
    { value: 'sto', label: 'СТО' },
    { value: 'warehouse', label: 'склад' },
    { value: 'non_res_complex', label: 'нежил. комплекс' },
    { value: 'cafe', label: 'кафе' },
    { value: 'kiosk', label: 'киоск' },
  ]
};

const METRO_LINES = [
  {
    name: 'Холодногірсько-Заводська лінія',
    color: 'text-red-500',
    stations: ['Холодная гора', 'Вокзальная', 'Центральный рынок', 'Площадь Конституции', 'Левада', 'Спортивная', 'Заводская', 'Турбоатом', 'Дворец Спорта', 'Армейская', 'Им. А. С. Масельского', 'Тракторный завод', 'Индустриальная']
  },
  {
    name: 'Салтівська лінія',
    color: 'text-blue-500',
    stations: ['Исторический музей', 'Университет', 'Ярослава Мудрого', 'Киевская', 'Академика Барабашова', 'Академика Павлова', 'Студенческая', 'Салтовская']
  },
  {
    name: 'Олексіївська лінія',
    color: 'text-green-500',
    stations: ['Метростроителей', 'Державинская', 'Защитников Украины', 'Архитектора Бекетова', 'Госпром', 'Научная', 'Ботанический сад', '23 Августа', 'Алексеевская', 'Победа']
  }
];

export default function CatalogPage({ defaultCategory = 'apartment' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [deal, setDeal] = useState(searchParams.get('deal') || '');
  const [category, setCategory] = useState(defaultCategory);
  const [subTypes, setSubTypes] = useState(searchParams.get('subTypes') ? searchParams.get('subTypes').split(',') : []);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const [minArea, setMinArea] = useState(searchParams.get('minArea') || '');
  const [maxArea, setMaxArea] = useState(searchParams.get('maxArea') || '');

  const [searchBuilding, setSearchBuilding] = useState(searchParams.get('searchBuilding') || '');
  const [metroStations, setMetroStations] = useState(searchParams.get('metroStations') ? searchParams.get('metroStations').split(',') : []);

  const [viewMode, setViewMode] = useState(searchParams.get('viewMode') || 'list');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const itemsPerPage = 20;

  const { favorites } = useFavorites();
  const isFirstRender = useRef(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCategory(defaultCategory);
    setSubTypes([]);
  }, [defaultCategory]);

  // Load from sessionStorage if navigated without params
  useEffect(() => {
    if (!location.search) {
      const saved = sessionStorage.getItem('catalogParams');
      if (saved) {
        navigate(location.pathname + saved, { replace: true });
      }
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (deal) params.set('deal', deal);
    if (subTypes.length > 0) params.set('subTypes', subTypes.join(','));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minArea) params.set('minArea', minArea);
    if (maxArea) params.set('maxArea', maxArea);
    if (searchBuilding) params.set('searchBuilding', searchBuilding);
    if (metroStations.length > 0) params.set('metroStations', metroStations.join(','));
    if (viewMode !== 'list') params.set('viewMode', viewMode);
    if (currentPage > 1) params.set('page', currentPage);
    
    const searchString = params.toString();
    if (searchString) {
      sessionStorage.setItem('catalogParams', '?' + searchString);
    } else {
      sessionStorage.removeItem('catalogParams');
    }
    
    setSearchParams(params, { replace: true });
  }, [deal, category, subTypes, minPrice, maxPrice, minArea, maxArea, searchBuilding, metroStations, viewMode, currentPage, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [deal, category, subTypes, minPrice, maxPrice, minArea, maxArea, searchBuilding, metroStations, viewMode]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      const el = document.getElementById('catalog-top');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['novostoy-objects', deal],
    queryFn: async () => {
      const filters = {};
      if (deal === 'sale') filters.sell_type = '2';
      if (deal === 'rent') filters.sell_type = '1';

      const allItems = await getAllObjects(filters);
      return allItems.map(mapObject);
    },
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;

      if (minArea && p.area < Number(minArea)) return false;
      if (maxArea && p.area > Number(maxArea)) return false;

      if (category && p.type !== category) return false;

      if (subTypes.length > 0) {
        const matches = subTypes.some(st => {
          if (st === 'rooms_1') return p.rooms === 1;
          if (st === 'rooms_2') return p.rooms === 2;
          if (st === 'rooms_3') return p.rooms === 3;
          if (st === 'rooms_4') return p.rooms === 4;
          if (st === 'rooms_5+') return p.rooms >= 5;
          return true; // Unmapped subtypes return true temporarily
        });
        if (!matches) return false;
      }

      if (searchBuilding) {
        const query = searchBuilding.toLowerCase();
        if (!p.building?.toLowerCase().includes(query) && !p.street?.toLowerCase().includes(query)) return false;
      }

      if (metroStations.length > 0) {
        if (!metroStations.some(s => p.mregion?.toLowerCase().includes(s.toLowerCase()))) return false;
      }

      return true;
    });
  }, [properties, minPrice, maxPrice, minArea, maxArea, category, subTypes, searchBuilding, metroStations]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = viewMode === 'list'
    ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filtered; // map view shows all filtered

  const clearFilters = () => {
    setDeal('');
    setCategory('');
    setSubTypes([]);
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setSearchBuilding('');
    setMetroStations([]);
  };
  const hasFilters = deal || category || subTypes.length > 0 || minPrice || maxPrice || minArea || maxArea || searchBuilding || metroStations.length > 0;

  // Dynamic SEO calculation
  const getSeoTitle = () => {
    let title = category === 'apartment' ? 'Квартири' : category === 'house' ? 'Будинки та ділянки' : category === 'commercial' ? 'Комерційна нерухомість' : 'Каталог нерухомості';
    if (deal === 'sale') title = `Продаж: ${title.toLowerCase()}`;
    if (deal === 'rent') title = `Оренда: ${title.toLowerCase()}`;
    if (filtered.length > 0) {
      const minP = minPrice ? Number(minPrice) : Math.min(...filtered.map(p => p.price));
      title += ` в Харкові. ${filtered.length} об'єктів від $${minP.toLocaleString()}`;
    } else {
      title += ' в Харкові';
    }
    return title;
  };
  
  const getSeoDescription = () => {
    const catName = category === 'apartment' ? 'квартир' : category === 'house' ? 'будинків' : category === 'commercial' ? 'комерційної нерухомості' : 'нерухомості';
    const dealName = deal === 'rent' ? 'оренду' : 'продаж';
    return `Актуальний каталог на ${dealName} ${catName} в Харкові та області від агентства Харків Ріелтер. Безпечні угоди, перевірені об'єкти.`;
  };

  const schemaUrl = `https://kharkov-realter.com.ua${location.pathname}${location.search}`;

  return (
    <div className="pt-24 pb-20" id="catalog-top">
      <SeoMeta 
        title={getSeoTitle()} 
        description={getSeoDescription()} 
        url={`${location.pathname}${location.search}`} 
      />
      <JsonLd data={generateItemListSchema(filtered, schemaUrl)} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="py-12 border-b border-border mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Наші об'єкти</p>
          <div className="flex items-end justify-between">
            <h1 className="font-cormorant text-5xl sm:text-6xl font-light">Каталог</h1>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-sm font-inter hidden sm:block">Знайдено {filtered.length} об'єктів</p>
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
        <div className="mb-8 sticky top-20 z-40 bg-background pt-4 pb-4">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Deal tabs */}
            <div className="flex gap-0 border border-border w-fit">
              {[['', 'Усі'], ['sale', 'Продаж'], ['rent', 'Оренда']].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setDeal(v)}
                  className={`px-6 py-2.5 text-xs tracking-widest uppercase font-inter transition-colors ${deal === v ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Category tabs */}
            <div className="flex gap-0 border border-border w-fit overflow-x-auto">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => {
                    navigate(c.path + location.search);
                  }}
                  className={`px-6 py-2.5 text-xs tracking-widest uppercase font-inter transition-colors whitespace-nowrap ${category === c.value ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center bg-card border border-border divide-y md:divide-y-0 md:divide-x divide-border shadow-sm w-full font-inter">
            {/* Ціна */}
            <Popover>
              <PopoverTrigger className="relative px-5 py-3.5 text-sm flex items-center justify-between gap-2 hover:text-gold transition-colors text-foreground">
                Ціна <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                {(minPrice || maxPrice) && <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />}
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 border-border bg-card" align="start">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-medium">Ціна ($)</p>
                <div className="flex items-center gap-2 mb-4">
                  <input type="number" placeholder="від" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    className="w-full border border-border bg-background text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-foreground" />
                  <span className="text-muted-foreground">–</span>
                  <input type="number" placeholder="до" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    className="w-full border border-border bg-background text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-foreground" />
                </div>
              </PopoverContent>
            </Popover>

            {/* Площа */}
            <Popover>
              <PopoverTrigger className="relative px-5 py-3.5 text-sm flex items-center justify-between gap-2 hover:text-gold transition-colors text-foreground">
                Площа <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                {(minArea || maxArea) && <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />}
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 border-border bg-card" align="start">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-medium">Площа (кв.м)</p>
                <div className="flex items-center gap-2 mb-4">
                  <input type="number" placeholder="від" value={minArea} onChange={e => setMinArea(e.target.value)}
                    className="w-full border border-border bg-background text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-foreground" />
                  <span className="text-muted-foreground">–</span>
                  <input type="number" placeholder="до" value={maxArea} onChange={e => setMaxArea(e.target.value)}
                    className="w-full border border-border bg-background text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-foreground" />
                </div>
              </PopoverContent>
            </Popover>

            {/* Тип нерухомості */}
            {category && SUBTYPES_BY_CATEGORY[category] && (
              <Popover>
                <PopoverTrigger className="relative px-5 py-3.5 text-sm flex items-center justify-between gap-2 hover:text-gold transition-colors text-foreground">
                  Тип нерухомості <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  {subTypes.length > 0 && <span className="absolute top-1 right-2 w-4 h-4 bg-gold text-background flex items-center justify-center text-[10px] rounded-full font-bold">{subTypes.length}</span>}
                </PopoverTrigger>
                <PopoverContent className="w-[420px] p-5 border-border bg-card" align="start">
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4 font-medium">Тип нерухомості</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {SUBTYPES_BY_CATEGORY[category].map(t => (
                      <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-border flex items-center justify-center group-hover:border-gold transition-colors">
                          {subTypes.includes(t.value) && <div className="w-2 h-2 bg-gold" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={subTypes.includes(t.value)}
                          onChange={(e) => {
                            if (e.target.checked) setSubTypes([...subTypes, t.value]);
                            else setSubTypes(subTypes.filter(v => v !== t.value));
                          }}
                        />
                        <span className="text-sm text-foreground group-hover:text-gold transition-colors">{t.label}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* ЖК/Орієнтир */}
            <Popover>
              <PopoverTrigger className="relative px-5 py-3.5 text-sm flex items-center justify-between gap-2 hover:text-gold transition-colors text-foreground">
                ЖК / Вулиця <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                {searchBuilding && <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />}
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 border-border bg-card" align="start">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-medium">Пошук за назвою або адресою</p>
                <input
                  type="text"
                  placeholder="Введіть назву..."
                  value={searchBuilding}
                  onChange={e => setSearchBuilding(e.target.value)}
                  className="w-full border border-border bg-background text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-foreground mb-2"
                />
              </PopoverContent>
            </Popover>

            {/* Станція метро */}
            <Popover>
              <PopoverTrigger className="relative px-5 py-3.5 text-sm flex items-center justify-between gap-2 hover:text-gold transition-colors text-foreground">
                Станція метро <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                {metroStations.length > 0 && <span className="absolute top-1 right-2 w-4 h-4 bg-gold text-background flex items-center justify-center text-[10px] rounded-full font-bold">{metroStations.length}</span>}
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-5 border-border bg-card" align="start">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4 font-medium">Оберіть станції</p>
                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {METRO_LINES.map(line => (
                    <div key={line.name} className="mb-6 last:mb-0">
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${line.color}`}>{line.name}</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                        {line.stations.map(st => (
                          <label key={st} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 shrink-0 border border-border flex items-center justify-center group-hover:border-gold transition-colors">
                              {metroStations.includes(st) && <div className="w-2 h-2 bg-gold" />}
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={metroStations.includes(st)}
                              onChange={(e) => {
                                if (e.target.checked) setMetroStations([...metroStations, st]);
                                else setMetroStations(metroStations.filter(v => v !== st));
                              }}
                            />
                            <span className="text-sm text-foreground truncate group-hover:text-gold transition-colors" title={st}>{st}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear All */}
            {hasFilters && (
              <button onClick={clearFilters} className="px-5 py-3.5 text-sm flex items-center gap-2 hover:text-gold transition-colors text-muted-foreground">
                <X className="w-3.5 h-3.5" /> Очистити все
              </button>
            )}

            {/* Favorites Icon */}
            <div className="md:ml-auto px-5 py-3.5 flex items-center justify-center md:border-l border-border hover:bg-muted/20 transition-colors">
              <Link to="/favorites" className="relative text-muted-foreground hover:text-gold transition-colors">
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gold text-background text-[10px] font-bold flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </div>
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
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % 20) * 0.05 }}>
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border mt-4">

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Pagination logic */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    const isCurrent = page === currentPage;
                    const isNear = Math.abs(currentPage - page) <= 2;
                    const isEdge = page === 1 || page === totalPages;

                    if (!isNear && !isEdge) {
                      if (page === 2 || page === totalPages - 1) {
                        return <span key={page} className="px-2 text-muted-foreground">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-inter transition-colors ${isCurrent
                            ? 'bg-[#3B82F6] text-white'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors text-sm"
                  >
                    вперед <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {totalPages <= 1 && filtered.length > 0 && (
              <div className="flex justify-center pt-8 border-t border-border mt-4">
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
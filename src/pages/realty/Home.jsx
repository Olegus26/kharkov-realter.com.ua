import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Award, Users, Home, TrendingUp } from 'lucide-react';
import PropertyCard from '@/components/realty/PropertyCard';
import { getObjects, getAllObjects, mapObject } from '@/lib/novostoyApi';

const HERO_IMAGES = [
  '/hero-bg.jpg',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80'];

const stats = [
  { icon: Award, value: '30+', label: 'років на ринку' },
  { icon: Home, value: '5 000+', label: 'угод закрито' },
  { icon: Users, value: '100+', label: 'спеціалістів' },
  { icon: TrendingUp, value: 'ТОП-1', label: 'у Харкові' }
];

export default function HomePage() {
  const [deal, setDeal] = useState('sale');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handlePrefetchCatalog = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['novostoy-objects', 'sale'],
      queryFn: async () => {
        const allItems = await getAllObjects({ sell_type: '2' })
        return allItems.map(mapObject)
      },
      staleTime: 10 * 60 * 1000,
    })
  }, [queryClient])

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['novostoy-objects-featured'],
    queryFn: async () => {
      const res = await getObjects({ parent_id: '2', limit: 12 })
      return (res.data || []).map(mapObject)
    }
  })

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/flats?deal=${deal}&q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      {/* Hero — cinematic, left-aligned */}
      <section className="relative min-h-screen flex items-end sm:items-center overflow-hidden">
        <img
          src={HERO_IMAGES[0]}
          alt="Харків Ріелтер - елітна нерухомість"
          fetchpriority="high"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-navy" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-28 sm:py-40 text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex px-4 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl text-cream/80 text-xs tracking-[0.25em] uppercase font-inter mb-8">
            Корпорація нерухомості · з 1996 року
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="font-cormorant font-extrabold tracking-tight leading-[1.02] text-5xl sm:text-7xl lg:text-8xl text-white mb-6 max-w-4xl">
            Харків
            <br />
            <span className="text-sky-300">Ріелтер</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-white/70 text-lg font-light mb-10 max-w-xl font-inter">
            Чесність, порядок та безпека угод з будь-якою нерухомістю. З Агентством нерухомості «Харків-Ріелтер» вирішити житлове питання легко та надійно!
          </motion.p>

          {/* Search pill */}
          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-0 max-w-2xl border border-white/15 bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-full p-2">
            <div className="flex gap-1 rounded-full bg-black/30 p-1 mx-1">
              <button
                type="button"
                onClick={() => setDeal('sale')}
                className={`flex-1 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-inter font-medium transition-all ${deal === 'sale' ? 'bg-white text-navy' : 'text-cream/70 hover:text-cream'}`}>
                Купити
              </button>
              <button
                type="button"
                onClick={() => setDeal('rent')}
                className={`flex-1 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-inter font-medium transition-all ${deal === 'rent' ? 'bg-white text-navy' : 'text-cream/70 hover:text-cream'}`}>
                Орендувати
              </button>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Район, метро, вулиця..."
              className="flex-1 px-5 py-3 bg-transparent text-sm text-cream placeholder:text-cream/40 outline-none font-inter" />
            <button type="submit" className="px-8 py-3 bg-white text-navy rounded-full text-xs tracking-widest uppercase font-inter font-bold whitespace-nowrap hover:bg-cream transition-colors">
              Знайти
            </button>
          </motion.form>
        </div>

        <a href="#featured" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors">
          <span className="text-[10px] tracking-widest uppercase font-inter">Дивитись</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* Stats — signature navy band */}
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s, i) =>
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="text-center">
              <s.icon className="w-6 h-6 text-cream/40 mx-auto mb-4" />
              <p className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl text-white">{s.value}</p>
              <p className="text-sm text-cream/50 mt-2 font-inter">{s.label}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Гарячі пропозиції</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl">Топові об'єкти</h2>
          </div>
          <Link to="/flats" onMouseEnter={handlePrefetchCatalog} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gold hover:gap-4 transition-all font-inter">
            Весь каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ?
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) =>
          <div key={i} className="bg-card border border-black/5 rounded-2xl aspect-[4/5] animate-pulse" />
          )}
          </div> :

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 3).map((p, i) =>
          <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <PropertyCard property={p} />
              </motion.div>
          )}
          </div>
        }

        <div className="text-center mt-10 sm:hidden">
          <Link to="/flats" onMouseEnter={handlePrefetchCatalog} className="inline-flex items-center gap-2 text-sm font-semibold text-gold font-inter">
            Весь каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Us — editorial numbered cards */}
      <section className="bg-secondary/40 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Наші переваги</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl max-w-xl">Чому обирають нас</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            { num: '01', title: 'Досвід та авторитет', desc: 'На ринку Харкова з 1996 року. Багаторазовий переможець та лауреат всеукраїнських конкурсів «Професійне визнання» та «Визнання».' },
            { num: '02', title: 'Професійна спільнота', desc: 'Дійсний член Асоціації фахівців з нерухомості України (АСНУ), Союзу ріелторів Харкова (ХСРіО) та Європейської Асоціації CEREAN.' },
            { num: '03', title: 'Локальна експертиза', desc: 'Глибоке знання кожного району Харкова та області. Понад 100 кваліфікованих співробітників, які допоможуть з будь-яким запитом.' }].
            map((item, i) =>
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="group p-8 rounded-2xl bg-card border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">

                <p className="font-cormorant font-extrabold tracking-tight text-6xl text-gold/10 group-hover:text-gold/25 transition-colors mb-6">{item.num}</p>
                <h3 className="font-cormorant font-bold text-2xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">{item.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA — navy block */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative overflow-hidden bg-navy rounded-3xl p-12 sm:p-20 text-center text-cream">

          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-4 font-inter">Безкоштовна консультація</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-6xl mb-6 text-white">Готові розпочати пошук?</h2>
            <p className="text-cream/60 font-inter mb-10 max-w-md mx-auto text-sm leading-relaxed">
              Наші експерти допоможуть знайти ідеальний об'єкт під ваші запити та бюджет у Харкові
            </p>
            <Link to="/kontakty" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-navy rounded-full text-xs tracking-widest uppercase font-inter font-bold hover:bg-cream transition-colors">
              Зв'язатися з нами <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>);
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Award, Users, Home, TrendingUp } from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import { MOCK_PROPERTIES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const HERO_IMAGES = [
  '/hero-bg.jpg',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80'
]

const STATS = [
  { icon: Award, value: '30+', label: 'років на ринку' },
  { icon: Home, value: '3 500+', label: 'угод закрито' },
  { icon: Users, value: '45', label: 'експертів' },
  { icon: TrendingUp, value: '98%', label: 'клієнтів задоволені' }
]

const HomePage = () => {
  const [deal, setDeal] = useState('sale')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const properties = MOCK_PROPERTIES

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    navigate(`/catalog?deal=${deal}&q=${encodeURIComponent(query)}`)
  }

  const handleDealTypeClick = (type) => () => {
    setDeal(type)
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <main aria-label="Головна сторінка">
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGES[0]})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/10" aria-hidden="true" />
        <div className="bg-gradient-to-b rounded absolute inset-0 from-transparent via-transparent to-background" aria-hidden="true" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-inter"
          >
            Агентство нерухомості · Харків
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="font-cormorant text-6xl sm:text-7xl lg:text-8xl font-light leading-none mb-8"
          >
            Знайдіть своє
            <br />
            {" "}<span className="text-gold italic">ідеальне</span> житло
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="text-muted-foreground text-lg font-light mb-12 max-w-2xl mx-auto font-inter"
          >
            Преміальна нерухомість у Харкові та Харківській області — квартири, будинки, пентхауси
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            onSubmit={handleSearchSubmit}
            aria-label="Пошук нерухомості"
            className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto border border-gold/50 bg-background/80 backdrop-blur-md"
          >
            <div className="flex border-b sm:border-b-0 sm:border-r border-gold/30">
              <button
                type="button"
                onClick={handleDealTypeClick('sale')}
                aria-pressed={deal === 'sale'}
                tabIndex={0}
                className={cn(
                  'flex-1 px-6 py-4 text-xs tracking-widest uppercase font-inter transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                  deal === 'sale' ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Купити
              </button>
              <button
                type="button"
                onClick={handleDealTypeClick('rent')}
                aria-pressed={deal === 'rent'}
                tabIndex={0}
                className={cn(
                  'flex-1 px-6 py-4 text-xs tracking-widest uppercase font-inter transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                  deal === 'rent' ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Орендувати
              </button>
            </div>
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Район, метро, вулиця..."
              aria-label="Введення району або вулиці для пошуку"
              className="flex-1 px-6 py-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-inter"
            />
            <button
              type="submit"
              tabIndex={0}
              className="px-8 py-4 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-gold"
            >
              Знайти
            </button>
          </motion.form>
        </div>

        <a
          href="#featured"
          aria-label="Перейти до вибраних об'єктів"
          tabIndex={0}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full p-2"
        >
          <span className="text-[10px] tracking-widest uppercase font-inter">Дивитися</span>
          <ChevronDown aria-hidden="true" className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      <section className="border-y border-border bg-card/50" aria-label="Статистика агентства">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) =>
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <s.icon aria-hidden="true" className="w-6 h-6 text-gold mx-auto mb-3" />
              <p className="font-cormorant text-4xl font-semibold text-gold">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1 font-inter">{s.label}</p>
            </motion.div>
          )}
        </div>
      </section>

      <section id="featured" className="max-w-7xl mx-auto px-6 py-20" aria-label="Топові об'єкти">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Вибране</p>
            <h2 className="font-cormorant text-5xl font-light">Топові об'єкти</h2>
          </div>
          <Link
            to="/catalog"
            tabIndex={0}
            className="hidden sm:flex items-center gap-2 text-sm text-gold hover:gap-4 transition-all font-inter focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded p-1"
          >
            Весь каталог <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((p, i) =>
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PropertyCard property={p} />
            </motion.div>
          )}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link
            to="/catalog"
            tabIndex={0}
            className="inline-flex items-center gap-2 text-sm text-gold font-inter focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded p-1"
          >
            Весь каталог <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-card/40 border-y border-border py-20" aria-labelledby="advantages-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Наші переваги</p>
            <h2 id="advantages-heading" className="font-cormorant text-5xl font-light">Чому обирають нас</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Експертиза', desc: 'Понад 30 років роботи на харківському ринку нерухомості. Глибоке знання всіх районів та тенденцій.' },
              { num: '02', title: 'Ексклюзивні об\'єкти', desc: 'Доступ до закритої бази об\'єктів, які не публікуються у відкритих джерелах.' },
              { num: '03', title: 'Повний супровід', desc: 'Від пошуку до отримання ключів — ми беремо на себе всі юридичні та фінансові питання.' }
            ].map((item, i) =>
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 border border-border bg-card hover:border-gold/40 transition-colors group rounded-sm"
              >
                <p
                  aria-hidden="true"
                  className="font-cormorant text-5xl font-light text-gold/30 mb-6 group-hover:text-gold/60 transition-colors"
                >
                  {item.num}
                </p>
                <h3 className="font-cormorant text-2xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">{item.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20" aria-label="Консультація">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-gold/30 bg-card p-12 sm:p-16 text-center rounded-xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 translate-y-1/2" aria-hidden="true" />

          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-inter">Безкоштовна консультація</p>
            <h2 className="font-cormorant text-5xl sm:text-6xl font-light mb-6">Готові розпочати пошук?</h2>
            <p className="text-muted-foreground font-inter mb-10 max-w-md mx-auto text-sm leading-relaxed">
              Наші експерти допоможуть знайти ідеальний об'єкт під ваші запити та бюджет у Харкові
            </p>
            <Link
              to="/contact"
              tabIndex={0}
              className="inline-flex items-center gap-3 px-10 py-4 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              Зв'язатися з нами <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default HomePage

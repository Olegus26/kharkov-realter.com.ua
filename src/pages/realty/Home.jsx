import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Award, Users, Home as HomeIcon, TrendingUp, Building2, Key, ShieldCheck, CheckCircle2, Phone, MapPin, ExternalLink, Send } from 'lucide-react'
import PropertyCard from '@/components/realty/PropertyCard'
import { useCatalogObjects } from '@/lib/useCatalogObjects'
import { submitLead } from '@/lib/leadService'
import { formatPhone } from '@/lib/utils'
import { OFFICES } from '@/data/offices'
import SeoMeta from '@/components/seo/SeoMeta'

const FEATURED_COUNT = 3
const HERO_BG = '/hero-bg.jpg'

const stats = [
  { icon: Award, value: '30+', label: 'років на ринку' },
  { icon: HomeIcon, value: '5 000+', label: 'угод закрито' },
  { icon: Users, value: '100+', label: 'спеціалістів' },
  { icon: TrendingUp, value: 'ТОП-1', label: 'у Харкові' },
]

const CATEGORIES = [
  {
    title: 'Квартири',
    desc: 'Купівля та продаж перевірених квартир у всіх районах Харкова',
    to: '/flats?deal=sale',
    icon: Building2,
    badge: '4 000+ об\'єктів',
  },
  {
    title: 'Будинки та ділянки',
    desc: 'Приватний сектор, таунхауси та дачі у Харкові та передмісті',
    to: '/houses?deal=sale',
    icon: HomeIcon,
    badge: 'Перевірено',
  },
  {
    title: 'Комерційна нерухомість',
    desc: 'Офіси, магазини, склади та виробничі площі для вашого бізнесу',
    to: '/realtys?deal=sale',
    icon: Key,
    badge: 'Для бізнесу',
  },
  {
    title: 'Оренда житла',
    desc: 'Швидкий та безпечний підбір житла від перевірених власників',
    to: '/flats?deal=rent',
    icon: Key,
    badge: 'Від 3 500 грн',
  },
]

const HomePage = () => {
  const [deal, setDeal] = useState('sale')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Seller fast lead form state
  const [sellerForm, setSellerForm] = useState({ name: '', phone: '', propertyType: 'Квартира' })
  const [isSubmittingSeller, setIsSubmittingSeller] = useState(false)
  const [sellerSubmitted, setSellerSubmitted] = useState(false)
  const [sellerError, setSellerError] = useState('')

  // Already sorted by edit date (newest first); starting the load here warms up the catalog as well
  const { data: catalogObjects = [], isLoading } = useCatalogObjects('sale')
  const properties = catalogObjects
    .filter((p) => p.type === 'apartment' && !p.is_sold && !p.deposit)
    .slice(0, FEATURED_COUNT)

  const handleSearch = (e) => {
    e.preventDefault()
    const qParam = query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ''
    navigate(`/flats?deal=${deal}${qParam}`)
  }

  const handleSellerSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingSeller(true)
    setSellerError('')

    const result = await submitLead({
      type: 'consultation',
      name: sellerForm.name,
      phone: sellerForm.phone,
      message: `Заявка на продаж нерухомості (${sellerForm.propertyType})`,
    })

    setIsSubmittingSeller(false)

    if (result.success) {
      setSellerSubmitted(true)
    } else {
      setSellerError(result.error || 'Помилка відправки. Зателефонуйте нам: +38 (057) 732-00-00')
    }
  }

  return (
    <div>
      <SeoMeta
        title="Агентство нерухомості Харків Ріелтер | Купити, продати, орендувати житло"
        description="Найбільша актуальна база нерухомості Харкова та області. Купівля, продаж та оренда квартир, будинків, комерції. 13 офісів по місту, безпечні угоди з 1996 року."
        url="/"
      />

      {/* Hero — cinematic, left-aligned */}
      <section className="relative min-h-[100svh] flex items-end sm:items-center overflow-hidden">
        <img
          src={HERO_BG}
          alt="Харків Ріелтер - нерухомість у Харкові"
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-navy/90" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-28 sm:py-40 text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex px-4 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl text-cream/80 text-xs tracking-[0.25em] uppercase font-inter mb-8"
          >
            Корпорація нерухомості · з 1996 року · 13 офісів
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-cormorant font-extrabold tracking-tight leading-[1.02] text-5xl sm:text-7xl lg:text-8xl text-white mb-6 max-w-4xl drop-shadow-xl"
          >
            Харків
            <br />
            <span className="text-sky-300 drop-shadow-lg">Ріелтер</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/95 text-lg font-normal mb-10 max-w-xl font-inter drop-shadow-md"
          >
            Безпечні угоди з нерухомістю в Харкові. 30 років досвіду, 13 відділень поруч з метро та повний юридичний супровід.
          </motion.p>

          {/* Search pill */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-0 max-w-2xl border border-white/15 bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-full p-2"
          >
            <div className="flex gap-1 rounded-full bg-black/30 p-1 mx-1">
              <button
                type="button"
                onClick={() => setDeal('sale')}
                className={`flex-1 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-inter font-medium transition-all ${deal === 'sale' ? 'bg-white text-navy' : 'text-cream/70 hover:text-cream'}`}
              >
                Купити
              </button>
              <button
                type="button"
                onClick={() => setDeal('rent')}
                className={`flex-1 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-inter font-medium transition-all ${deal === 'rent' ? 'bg-white text-navy' : 'text-cream/70 hover:text-cream'}`}
              >
                Орендувати
              </button>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Район, метро, вулиця або ЖК..."
              className="flex-1 px-5 py-3 bg-transparent text-sm text-white placeholder:text-white/60 outline-none font-inter"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-navy rounded-full text-xs tracking-widest uppercase font-inter font-bold whitespace-nowrap hover:bg-cream transition-colors shadow-md"
            >
              Знайти
            </button>
          </motion.form>
        </div>

        <a href="#categories" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors">
          <span className="text-[10px] tracking-widest uppercase font-inter">Дивитись</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* Stats — signature navy band */}
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <s.icon className="w-6 h-6 text-cream/40 mx-auto mb-4" />
              <p className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl text-white">{s.value}</p>
              <p className="text-sm text-cream/60 mt-2 font-inter">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Tiles */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Каталог нерухомості</p>
          <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl text-foreground">Оберіть категорію</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={cat.to}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-gold/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/5 text-navy group-hover:bg-navy group-hover:text-white transition-colors flex items-center justify-center mb-6">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-cormorant font-bold text-2xl text-foreground">{cat.title}</h3>
                  <span className="text-[10px] font-inter font-semibold tracking-wider uppercase text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                    {cat.badge}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-inter mb-6 leading-relaxed flex-grow">
                  {cat.desc}
                </p>
                <div className="flex items-center gap-2 text-xs font-inter font-semibold text-gold group-hover:gap-3 transition-all mt-auto">
                  <span>Переглянути</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Гарячі пропозиції</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl">Топові об'єкти</h2>
          </div>
          <Link to="/flats" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gold hover:gap-4 transition-all font-inter">
            Весь каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link to="/flats" className="inline-flex items-center gap-2 text-sm font-semibold text-gold font-inter">
            Весь каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Sell with Us block */}
      <section id="sell" className="bg-secondary/40 py-24 my-12 border-y border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Для власників</p>
              <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl mb-6 text-foreground">
                Бажаєте вигідно продати або здати нерухомість?
              </h2>
              <p className="text-muted-foreground font-inter text-base mb-8 leading-relaxed">
                Довірте продаж лідеру ринку. Ми візьмемо на себе всі етапи: від професійної оцінки та фотосесії до безпечного розрахунку в банку.
              </p>

              <div className="space-y-4 font-inter text-sm mb-8">
                {[
                  'Безкоштовна експертна оцінка ринкової вартості',
                  'Реклама на ТОП-5 профільних порталах (ЛУН, DOM.RIA, OLX, Rieltor)',
                  'Власна база з понад 20 000 потенційних покупців',
                  'Повна юридична перевірка та безпека розрахунків',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-xl">
              <h3 className="font-cormorant font-bold text-2xl sm:text-3xl mb-2 text-foreground">Замовити безкоштовну консультацію</h3>
              <p className="text-muted-foreground font-inter text-xs mb-6">Залиште контакти, і наш провідний експерт зв'яжеться з вами протягом 15 хвилин</p>

              {sellerSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-cormorant font-bold text-2xl text-foreground mb-2">Заявку успішно надіслано!</p>
                  <p className="text-xs text-muted-foreground font-inter">Наш фахівець незабаром зателефонує вам для узгодження деталей.</p>
                </div>
              ) : (
                <form onSubmit={handleSellerSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5 font-semibold">Ваше ім'я *</label>
                    <input
                      required
                      type="text"
                      value={sellerForm.name}
                      onChange={(e) => setSellerForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Олександр"
                      className="w-full border border-border bg-card text-foreground px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-inter"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5 font-semibold">Номер телефону *</label>
                    <input
                      required
                      type="tel"
                      value={sellerForm.phone}
                      onChange={(e) => setSellerForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      placeholder="+380 (50) 000-00-00"
                      className="w-full border border-border bg-card text-foreground px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-inter"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5 font-semibold">Тип нерухомості</label>
                    <select
                      value={sellerForm.propertyType}
                      onChange={(e) => setSellerForm((prev) => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full border border-border bg-card text-foreground px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-inter"
                    >
                      <option value="Квартира">Квартира</option>
                      <option value="Будинок / ділянка">Будинок / ділянка</option>
                      <option value="Комерційна нерухомість">Комерційна нерухомість</option>
                      <option value="Оренда житла">Оренда житла</option>
                    </select>
                  </div>

                  {sellerError && (
                    <p className="text-xs text-destructive font-inter bg-destructive/10 p-3 rounded-xl">{sellerError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingSeller}
                    className="w-full py-4 gradient-gold text-white text-xs tracking-widest uppercase font-inter font-bold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isSubmittingSeller ? <span>Відправляємо...</span> : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Продати об'єкт</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* State Programs: eOselia & eRecovery */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="border border-border bg-card rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="px-3.5 py-1.5 bg-emerald-600/10 text-emerald-600 text-xs font-bold font-inter rounded-full uppercase tracking-wider">
                Державні програми
              </span>
              <h2 className="font-cormorant font-extrabold text-3xl sm:text-4xl text-foreground mt-4 mb-4">
                Працюємо з «єОселя» (від 3%) та сертифікатами «єВідновлення»
              </h2>
              <p className="text-muted-foreground font-inter text-sm leading-relaxed mb-6">
                Акредитовані фахівці нашого агентства допоможуть підібрати об'єкти, що відповідають усім вимогам державних програм, підготують повний пакет документів та забезпечать гарантований юридичний супровід угоди.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-inter font-medium text-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% відповідність вимогам банків
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Без прихованих комісій
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/flats?deal=sale"
                className="w-full py-3.5 px-6 gradient-gold text-white text-xs tracking-widest uppercase font-inter font-bold rounded-full text-center hover:opacity-90 transition-opacity shadow-md"
              >
                Об'єкти під єОселя
              </Link>
              <Link
                to="/kontakty"
                className="w-full py-3.5 px-6 border border-border text-foreground text-xs tracking-widest uppercase font-inter font-bold rounded-full text-center hover:bg-muted transition-colors"
              >
                Консультація експерта
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 13 Offices in Kharkiv */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Локальна присутність</p>
          <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl text-foreground">
            13 офісів у Харкові поруч з вами
          </h2>
          <p className="text-muted-foreground text-sm font-inter mt-3">
            Зручне розташування біля ключових станцій метро у всіх районах міста
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {OFFICES.map((office) => (
            <div
              key={office.id}
              className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:border-gold/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-inter font-bold text-sm text-foreground">{office.name}</h3>
                  <span className="text-[10px] font-inter px-2 py-0.5 bg-navy/5 text-navy font-semibold rounded-full">
                    {office.metro}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground font-inter mb-4">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold" />
                  <span>{office.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2 text-xs font-inter">
                <a
                  href={`tel:${office.phones[0].replace(/[^0-9+]/g, '')}`}
                  className="font-semibold text-navy hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{office.phones[0]}</span>
                </a>
                <a
                  href={office.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  title="Відгуки в Google"
                >
                  <span>Відгуки</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
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
              { num: '03', title: 'Локальна експертиза', desc: 'Глибоке знання кожного району Харкова та області. Понад 100 кваліфікованих співробітників, які допоможуть з будь-яким запитом.' },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                <p className="font-cormorant font-extrabold tracking-tight text-6xl text-gold/10 group-hover:text-gold/25 transition-colors mb-6">{item.num}</p>
                <h3 className="font-cormorant font-bold text-2xl mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — navy block */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-navy rounded-3xl p-12 sm:p-20 text-center text-cream shadow-2xl"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-4 font-inter">Безкоштовна консультація</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-6xl mb-6 text-white">Готові розпочати пошук?</h2>
            <p className="text-cream/60 font-inter mb-10 max-w-md mx-auto text-sm leading-relaxed">
              Наші експерти допоможуть знайти ідеальний об'єкт під ваші запити та бюджет у Харкові
            </p>
            <Link to="/kontakty" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-navy rounded-full text-xs tracking-widest uppercase font-inter font-bold hover:bg-cream transition-colors shadow-lg">
              Зв'язатися з нами <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage

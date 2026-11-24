import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Shield, Star, Clock, Globe, Instagram, Facebook, Send } from 'lucide-react'
import SeoMeta from '@/components/seo/SeoMeta'

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    subtitle: 'Огляди квартир та актуальні пропозиції',
    href: 'https://www.instagram.com/kharkov_realter/',
    icon: Instagram,
    iconBox: 'bg-pink-50 text-[#E1306C] border-pink-200/80',
  },
  {
    id: 'telegram',
    name: 'Telegram канал',
    subtitle: 'Нові об’єкти щодня без посередників',
    href: 'https://t.me/kharkov_realter',
    icon: Send,
    iconBox: 'bg-sky-50 text-[#0088cc] border-sky-200/80',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    subtitle: 'Новини корпорації та аналітика ринку',
    href: 'https://www.facebook.com/people/%D0%90%D0%9D-%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2-%D0%A0%D1%96%D0%B5%D0%BB%D1%82%D0%B5%D1%80/100057161062343/',
    icon: Facebook,
    iconBox: 'bg-blue-50 text-[#1877F2] border-blue-200/80',
  },
]

const values = [
  {
    icon: Shield,
    title: 'Надійність',
    desc: "Повна юридична чистота кожної угоди. Працюємо лише з перевіреними об'єктами.",
    iconBox: 'bg-emerald-500/10 text-emerald-600'
  },
  {
    icon: Star,
    title: 'Якість',
    desc: "Ретельний відбір об'єктів — тільки найкраще потрапляє до нашого каталогу.",
    iconBox: 'bg-amber-500/10 text-amber-600'
  },
  {
    icon: Clock,
    title: 'Оперативність',
    desc: 'Реагуємо на запити протягом години. Ваш час — наш пріоритет.',
    iconBox: 'bg-sky-500/10 text-sky-600'
  },
  {
    icon: Globe,
    title: 'Локальна експертиза',
    desc: 'Глибоке знання ринку нерухомості Харкова та області. Ми знаємо кожен будинок.',
    iconBox: 'bg-indigo-500/10 text-indigo-600'
  },
]

const timeline = [
  { year: '1996', event: 'Заснування агентства нерухомості у Харкові.' },
  { year: '2004', event: 'Лауреат всеукраїнського конкурсу "Визнання-2004" як "Краща ріелторська компанія на регіональному ринку".' },
  { year: '2006', event: 'Краща компанія з іпотечного кредитування на регіональному ринку за підсумками "Визнання-2006".' },
  { year: '2009', event: 'Переможець IV Всеукраїнського конкурсу "Професійне визнання" на регіональному ринку.' },
  { year: '2011', event: 'Лауреат конкурсу "Професійне визнання" у номінаціях "За професіоналізм" та "Найдовша професійна діяльність".' },
  { year: '2018', event: 'Розширення мережі до 13 філій у ключових районах Харкова поруч зі станціями метро.' },
  { year: '2022', event: "Незламність: безперервна підтримка клієнтів, допомога харків'янам з безпечним житлом та відновленням документації." },
  { year: '2023', event: 'Офіційна сертифікація та активний супровід державних програм «єОселя» (пільгова іпотека) та «єВідновлення».' },
  { year: '2026', event: 'Входження до офіційного рейтингу «ТОП-100 агенцій нерухомості України 2026» за версією ЛУН (платформи ЛУН, Flatfy, Rieltor та Bird). 30 років лідерства.' },
]

const AboutPage = () => {
  return (
    <div className="pb-20">
      <SeoMeta
        title="Про компанію | Агентство нерухомості Харків Ріелтер"
        description="Історія успіху, цінності та 30-річний досвід агентства нерухомості «Харків Ріелтер». 13 офісів по місту, безпека та юридичний захист кожної угоди."
        url="/o-korporatcii"
      />

      {/* Hero */}
      <section className="relative h-80 sm:h-[460px] overflow-hidden mb-20 rounded-b-3xl pt-24 bg-navy">
        <picture className="absolute inset-x-0 top-[68px] sm:top-[76px] bottom-0 block">
          <source media="(max-width: 767px)" srcSet="/images/backgrounds/about-bg-mobile.webp" type="image/webp" />
          <img
            src="/images/backgrounds/about-bg.webp"
            alt="Агентство нерухомості Харків Ріелтер"
            width={1024}
            height={572}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-[center_36%]"
          />
        </picture>
        <div className="absolute inset-0 bg-navy/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent z-0" aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pt-16">
          <p className="inline-flex px-4 py-1.5 rounded-full border border-white/20 bg-navy/60 backdrop-blur-md text-white text-[11px] tracking-[0.28em] uppercase font-inter font-semibold mb-4 shadow-sm">
            Про компанію
          </p>
          <h1 className="font-cormorant font-bold text-6xl sm:text-7xl tracking-tight mb-2 drop-shadow-xl [text-shadow:0_4px_24px_rgba(10,20,40,0.75)]">
            <span className="text-sky-300">Харків</span>{' '}
            <span className="text-amber-300">Ріелтер</span>
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-5 font-inter font-semibold">Наша історія</p>
            <h2 className="font-cormorant text-5xl font-bold mb-8 leading-tight">
              30 років бездоганної репутації
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5 font-inter text-sm">
              Корпорація «Харків-Ріелтер» — одна з лідируючих мереж на ринку нерухомості Харкова та області. За час свого існування з 1996 року ми перетворилися на потужну мережу агентств із високим професіоналізмом та великим авторитетом.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5 font-inter text-sm">
              Ми є дійсними членами Союзу ріелторів та Оцінювачів м. Харкова (ХСРіО), Асоціації фахівців з нерухомості України (АСНУ), а також Центрально-Європейської Асоціації (CEREAN).
            </p>
            <p className="text-muted-foreground leading-relaxed font-inter text-sm">
              Наш підхід базується на глибокому розумінні ринку, чесності та персональній увазі. Ми не просто продаємо нерухомість — ми створюємо цінність та будуємо довірчі відносини.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative">
              <img
                src="/images/backgrounds/about-story.webp"
                alt="Офіс та команда Харків Ріелтер"
                width={800}
                height={533}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-lg border border-border"
              />
              <div className="absolute -bottom-6 -left-6 bg-navy rounded-2xl p-6 hidden sm:flex flex-col items-center shadow-xl border border-white/5">
                <p className="font-cormorant text-5xl font-bold text-white leading-none mb-1">30+</p>
                <p className="text-white/80 text-[10px] tracking-widest uppercase font-inter">років досвіду</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Цінності</p>
            <h2 className="font-cormorant text-5xl font-bold">Що нас відрізняє</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 border border-border bg-card rounded-2xl hover:border-gold/40 transition-colors shadow-sm"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 ${v.iconBox}`}>
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="font-cormorant text-2xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Хронологія</p>
            <h2 className="font-cormorant text-5xl font-bold">Історія успіху</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <p className="font-cormorant text-gold text-3xl font-bold">{t.year}</p>
                    <p className="text-muted-foreground text-sm font-inter mt-1 leading-relaxed">{t.event}</p>
                  </div>
                  <div className="hidden md:flex w-3 h-3 rounded-full bg-gold border-2 border-background shrink-0 z-10" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Social promotion block */}
        <section className="mb-20 pt-10 border-t border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-inter font-semibold mb-1.5">
                Соціальні мережі
              </p>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-foreground">
                Слідкуйте за нами онлайн
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-inter max-w-sm">
              Свіжі відеоогляди квартир, гарячі пропозиції та поради експертів щодня
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SOCIAL_LINKS.map((item) => {
              const IconComp = item.icon
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={0}
                  aria-label={`${item.name} — ${item.subtitle}`}
                  className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border hover:border-navy/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${item.iconBox}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-inter font-bold text-sm text-foreground group-hover:text-navy transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-inter truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-navy shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )
            })}
          </div>
        </section>

        {/* CTA — signature navy block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-navy rounded-3xl p-10 sm:p-16 text-center text-cream shadow-2xl"
        >
          <div className="absolute -top-28 -right-28 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <p className="text-xs tracking-[0.28em] uppercase text-amber-300/90 mb-3 font-inter font-semibold">
              Безкоштовна консультація
            </p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl text-white mb-4">
              Почніть з нами
            </h2>
            <p className="text-cream/70 font-inter text-sm leading-relaxed mb-8">
              Зв&apos;яжіться з нашими експертами для безкоштовної консультації та підбору нерухомості у Харкові
            </p>
            <Link
              to="/kontakty"
              tabIndex={0}
              aria-label="Зв'язатися з нашими експертами"
              className="inline-flex items-center gap-3 px-9 py-4 bg-white text-navy text-xs tracking-widest uppercase font-inter font-bold hover:bg-cream transition-colors rounded-full shadow-lg"
            >
              <span>Зв&apos;язатися з нами</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Star, Clock, Globe } from 'lucide-react'
import SeoMeta from '@/components/seo/SeoMeta'

const values = [
  { icon: Shield, title: 'Надійність', desc: "Повна юридична чистота кожної угоди. Працюємо лише з перевіреними об'єктами." },
  { icon: Star, title: 'Якість', desc: "Ретельний відбір об'єктів — тільки найкраще потрапляє до нашого каталогу." },
  { icon: Clock, title: 'Оперативність', desc: 'Реагуємо на запити протягом години. Ваш час — наш пріоритет.' },
  { icon: Globe, title: 'Локальна експертиза', desc: 'Глибоке знання ринку нерухомості Харкова та області. Ми знаємо кожен будинок.' },
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
      <section className="relative h-80 sm:h-[450px] overflow-hidden mb-20 rounded-b-3xl pt-24">
        <img
          src="/about-bg.webp"
          alt="Агентство нерухомості Харків Ріелтер"
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent z-0" aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pt-16">
          <p className="text-xs tracking-[0.4em] uppercase text-white/70 mb-4 font-inter">Про компанію</p>
          <h1 className="font-cormorant font-bold text-6xl sm:text-7xl tracking-tight text-white mb-2">
            Харків <span className="text-[#8cd1ff]">Ріелтер</span>
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
                src="/story-image.webp"
                alt="Офіс та команда Харків Ріелтер"
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
                <v.icon className="w-7 h-7 text-gold mb-5" />
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

        {/* CTA */}
        <div className="text-center border border-gold/30 bg-card p-12 rounded-3xl shadow-sm">
          <h2 className="font-cormorant text-4xl mb-4 font-bold">Почніть з нами</h2>
          <p className="text-muted-foreground font-inter text-sm mb-8">Зв'яжіться з нашими експертами для безкоштовної консультації та підбору нерухомості</p>
          <Link to="/kontakty" className="inline-flex items-center gap-3 px-10 py-4 gradient-gold text-white text-xs tracking-widest uppercase font-inter font-medium hover:opacity-90 transition-opacity rounded-full shadow-md">
            Зв'язатися <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

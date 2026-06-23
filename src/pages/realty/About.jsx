import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Star, Clock, Globe } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Надійність', desc: 'Повна юридична чистота кожної угоди. Працюємо лише з перевіреними об\'єктами.' },
  { icon: Star, title: 'Якість', desc: 'Ретельний відбір об\'єктів — тільки найкраще потрапляє до нашого каталогу.' },
  { icon: Clock, title: 'Оперативність', desc: 'Реагуємо на запити протягом години. Ваш час — наш пріоритет.' },
  { icon: Globe, title: 'Масштаб', desc: 'Київ, область та закордонна нерухомість — допомагаємо скрізь.' },
];

const timeline = [
  { year: '1994', event: 'Заснування агентства у Харкові' },
  { year: '2009', event: 'Відкриття другого офісу на Салтівці' },
  { year: '2013', event: 'Вихід на ринок заміської нерухомості' },
  { year: '2018', event: '3000 успішних угод' },
  { year: '2022', event: 'Лауреат премії "Краще агентство року" в Харкові' },
  { year: '2026', event: 'Понад 3500 задоволених клієнтів' },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative h-80 sm:h-96 overflow-hidden mb-20">
        <img src="/about-bg.jpg" alt="About" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-inter">Про компанію</p>
          <h1 className="font-cormorant text-6xl sm:text-7xl font-light">Харків Ріелтер</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-5 font-inter">Наша історія</p>
            <h2 className="font-cormorant text-5xl font-light mb-8 leading-tight">
              30 років створюємо історії про дім
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5 font-inter text-sm">
              Харків Ріелтер — провідне агентство преміальної нерухомості в Харкові. З 1994 року ми допомагаємо клієнтам знаходити об'єкти, що стають справжнім домом: пентхауси в центрі міста, заміські будинки, квартири в кращих житлових комплексах.
            </p>
            <p className="text-muted-foreground leading-relaxed font-inter text-sm">
              Наш підхід базується на глибокому розумінні ринку, чесності та персональній увазі до кожного клієнта. Ми не просто продаємо нерухомість — ми створюємо цінність.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative">
              <img
                src="/story-image.jpg"
                alt="Office"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold p-6 hidden sm:block">
                <p className="font-cormorant text-4xl font-bold text-background">30+</p>
                <p className="text-background text-xs tracking-wider uppercase font-inter">років досвіду</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Цінності</p>
            <h2 className="font-cormorant text-5xl font-light">Що нас відрізняє</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-7 border border-border bg-card hover:border-gold/40 transition-colors"
              >
                <v.icon className="w-7 h-7 text-gold mb-5" />
                <h3 className="font-cormorant text-xl mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Хронологія</p>
            <h2 className="font-cormorant text-5xl font-light">Історія успіху</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <p className="font-cormorant text-gold text-3xl">{t.year}</p>
                    <p className="text-muted-foreground text-sm font-inter mt-1">{t.event}</p>
                  </div>
                  <div className="hidden md:flex w-3 h-3 rounded-full bg-gold border-2 border-background shrink-0 z-10" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border border-gold/30 bg-card p-12">
          <h2 className="font-cormorant text-4xl mb-4">Почніть з нами</h2>
          <p className="text-muted-foreground font-inter text-sm mb-8">Зв'яжіться з нашими експертами для безкоштовної консультації</p>
          <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-4 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium hover:opacity-90 transition-opacity">
            Зв'язатися <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

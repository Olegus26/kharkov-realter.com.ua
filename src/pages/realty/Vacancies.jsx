import { motion } from 'framer-motion';
import {
  TrendingUp, MapPin, GraduationCap, CalendarClock, Users,
  CheckCircle2, Phone, Send, ArrowRight, Check,
} from 'lucide-react';
import VacancyForm from '@/components/realty/VacancyForm';

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Необмежений дохід',
    desc: 'Можливість збільшувати свій заробіток та відсоток від угод — все залежить лише від вас.',
  },
  {
    icon: MapPin,
    title: 'Робота поруч з дому',
    desc: 'Комфортні офіси компанії у різних районах Харкова, обладнані всім необхідним.',
  },
  {
    icon: GraduationCap,
    title: 'Навчання за рахунок компанії',
    desc: 'Індивідуально за допомогою експертів та корпоративно у «школі стажистів».',
  },
  {
    icon: CalendarClock,
    title: 'Гнучкий графік роботи',
    desc: 'Самостійно плануйте свій робочий день та поєднуйте роботу з часом для близьких.',
  },
  {
    icon: Users,
    title: 'Доброзичливий колектив',
    desc: 'Досвід колег та їхні успіхи завжди стимулюватимуть вас до нових досягнень.',
  },
];

const PROFILES = [
  {
    num: '01',
    title: 'Люди з досвідом у продажах',
    desc: 'Досвід у продажах, сервісі чи комунікації з клієнтами — незалежно від сфери. Також добре реалізовуються фахівці з управлінським, педагогічним чи творчим бекграундом, які вміють працювати з людьми.',
  },
  {
    num: '02',
    title: 'Активні та цілеспрямовані',
    desc: 'Ті, кого не лякає динамічний темп роботи. Хто вміє чути клієнта, будувати довірливу комунікацію та відповідально ставиться до своєї роботи.',
  },
];

const REQUIREMENTS = ['Бажання заробляти', 'Грамотна мова', 'Здатність до навчання', 'Знання ПК', 'Терпіння', 'Охайний зовнішній вигляд'];

const OFFER_POINTS = [
  'Робота без досвіду з швидким професійним зростанням',
  'Гнучкий графік без жорсткої прив’язки до офісу',
  'Високий відсоток від угод вище середніх ринкових ставок',
  'Виплати одразу після закриття угоди, без затримок',
  'Професійна підготовка за стандартами СФНУ',
  'Підтримка наставника на початку кар’єри',
  'Сучасна CRM-система з автоматизованим підбором об’єктів',
  'Актуальна база ліквідних об’єктів, що оновлюється щогодини',
  'Юридична, інформаційна та рекламна підтримка',
  'Корпоративні заходи, тренінги, семінари',
  'Можливість кар’єрного росту всередині компанії',
];

export default function VacanciesPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16 border-b border-border">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-inter font-semibold">Кар'єра · Харків</p>
        <h1 className="font-cormorant font-extrabold tracking-tight text-5xl sm:text-7xl mb-6">Вакансії</h1>
        <p className="text-muted-foreground font-inter text-base sm:text-lg max-w-2xl">
          Приєднуйтесь до команди професіоналів ринку нерухомості. Ми шукаємо людей, які готові рости,
          заробляти та розвиватися разом з нами.
        </p>
      </section>

      {/* Hero navy band */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden bg-navy rounded-3xl p-10 sm:p-16 text-cream"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-4 font-inter">Набір відкрито</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-3xl sm:text-5xl text-white mb-5">
              Запрошуємо агента з нерухомості до нашої агенції
            </h2>
            <p className="text-cream/70 font-inter text-sm leading-relaxed mb-8">
              Рієлтор — це фахівець, який займається операціями з нерухомістю та допомагає вирішити
              проблему клієнта найкращим чином. Активність, комунікабельність та бажання заробляти —
              все інше ми навчимо!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#apply"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-navy rounded-full text-xs tracking-widest uppercase font-inter font-bold hover:bg-cream transition-colors">
                Залишити заявку <ArrowRight className="w-4 h-4" />
              </a>
              <a href="tel:+380735642268"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/25 text-cream text-xs tracking-widest uppercase font-inter font-semibold hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> Поговорити з HR
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Наші переваги</p>
        <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl mb-12">Ми пропонуємо</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group p-8 rounded-2xl bg-card border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-6">
                <b.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-cormorant font-bold text-2xl mb-3">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-inter">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who fits + requirements */}
      <section className="bg-secondary/40 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Наш ідеальний кандидат</p>
          <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl mb-12 max-w-xl">
            Хто стане успішним у нашій команді?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {PROFILES.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="group p-8 rounded-2xl bg-card border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <p className="font-cormorant font-extrabold text-6xl text-gold/15 group-hover:text-gold/30 transition-colors mb-4">{p.num}</p>
                <h3 className="font-cormorant font-bold text-2xl mb-3">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Requirements chips */}
          <div className="p-8 sm:p-10 rounded-2xl bg-card border border-black/5 shadow-sm">
            <h3 className="font-cormorant font-bold text-2xl mb-6">Що від вас буде потрібно?</h3>
            <div className="flex flex-wrap gap-3">
              {REQUIREMENTS.map(r => (
                <span key={r} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy/5 text-sm font-medium font-inter text-foreground/80">
                  <Check className="w-4 h-4 text-gold" />
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open vacancy detail */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Актуальна вакансія</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-3xl sm:text-4xl mb-4">
              Менеджер з продажу нерухомості (рієлтор)
            </h2>
            <p className="text-muted-foreground font-inter text-sm leading-relaxed mb-8 max-w-2xl">
              Додатковий набір на позицію менеджера з продажу нерухомості. Вимоги прості: активність,
              комунікабельність та бажання заробляти. Усе інше навчимо!
            </p>
            <div className="space-y-3">
              {OFFER_POINTS.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-black/5"
                >
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-sm font-inter text-foreground/80">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* HR contacts */}
          <div>
            <div className="sticky top-28 space-y-4">
              <div className="border border-black/5 bg-card shadow-sm rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-gold" />
                <p className="text-xs tracking-[0.2em] uppercase text-gold mb-1 font-inter">Зв'язатися з HR</p>
                <p className="font-cormorant text-2xl mb-6">Анастасія</p>
                <div className="space-y-3">
                  <a href="tel:+380735642268"
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-gold/40 hover:text-gold transition-colors group font-inter">
                    <Phone className="w-4 h-4 text-gold" />
                    <span className="text-sm group-hover:text-gold transition-colors">073 564 22 68</span>
                  </a>
                  <a href="https://t.me/hrkharkivrealter" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-gold/40 hover:text-gold transition-colors group font-inter">
                    <Send className="w-4 h-4 text-gold" />
                    <span className="text-sm group-hover:text-gold transition-colors">Telegram: @hrkharkivrealter</span>
                  </a>
                  <a href="mailto:hr.kharkivrealter@gmail.com"
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-gold/40 hover:text-gold transition-colors group font-inter">
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                    <span className="text-sm group-hover:text-gold transition-colors break-all">hr.kharkivrealter@gmail.com</span>
                  </a>
                </div>
              </div>
              <div className="border border-gold/30 bg-gold/5 rounded-2xl p-6 text-center">
                <p className="font-cormorant text-xl mb-2">Зробіть перший крок</p>
                <p className="text-muted-foreground text-xs font-inter mb-4">Це простіше, ніж здається — заповніть форму нижче</p>
                <a href="#apply"
                  className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-inter font-semibold text-gold hover:gap-4 transition-all">
                  До форми <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="bg-secondary/40 py-20 sm:py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter font-semibold">Заявка</p>
            <h2 className="font-cormorant font-extrabold tracking-tight text-4xl sm:text-5xl mb-4">Як стати частиною команди?</h2>
            <p className="text-muted-foreground font-inter text-sm leading-relaxed">
              Просто заповніть невелику форму — і ми зв'яжемося з вами найближчим часом.
              Не чекайте на наступний понеділок, змініть своє життя вже сьогодні.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-card border border-black/5 shadow-xl rounded-2xl p-8 sm:p-10">
            <VacancyForm />
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  MapPin,
  GraduationCap,
  CalendarClock,
  Users,
  CheckCircle2,
  Phone,
  Send,
  ArrowRight,
  Check,
  Sparkles,
  DollarSign,
  Coffee,
  Car,
  ShieldCheck,
  Clock,
  ChevronRight,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
  Building2,
  Briefcase
} from 'lucide-react'
import VacancyForm from '@/components/realty/VacancyForm'
import SeoMeta from '@/components/seo/SeoMeta'
import { OFFICES } from '@/data/offices'

const BENEFITS = [
  {
    icon: TrendingUp,
    badge: 'Без стелі',
    title: 'Необмежений дохід',
    desc: 'Заробляй від $1 000 до $3 000+ щомісяця. Відсоток виплачується відразу в день закриття угоди без затримок.',
    gradient: 'from-amber-500/20 to-amber-600/5'
  },
  {
    icon: MapPin,
    badge: '13 філій',
    title: 'Офіс біля твого дому',
    desc: 'Працюй у своєму районі — Салтівка, Центр, Олексіївка, Холодна Гора чи Нові Будинки. Забудь про затори!',
    gradient: 'from-blue-500/20 to-blue-600/5'
  },
  {
    icon: GraduationCap,
    badge: '100% Free',
    title: 'Школа рієлтора з нуля',
    desc: 'Індивідуальний ментор веде тебе за руку на перших 3 угодах. Стандарти Спілки фахівців з нерухомості (СФНУ).',
    gradient: 'from-emerald-500/20 to-emerald-600/5'
  },
  {
    icon: CalendarClock,
    badge: 'Свобода',
    title: 'Гнучкий вільний графік',
    desc: 'Сам плануй зустрічі, покази та особистий час. Поєднуй успішну кар’єру зі спортом і сім’єю.',
    gradient: 'from-purple-500/20 to-purple-600/5'
  },
  {
    icon: ShieldCheck,
    badge: 'Без стресу',
    title: 'Штатні юристи за спиною',
    desc: 'Тобі не треба боятися паперів. Корпоративний юридичний відділ перевіряє всі документи та готує договори.',
    gradient: 'from-sky-500/20 to-sky-600/5'
  },
  {
    icon: Users,
    badge: 'Команда',
    title: 'Найбільша база лідів',
    desc: 'Сучасна CRM з щогодинним оновленням ліквідних об’єктів та постійний потік гарячих заявок від компанії.',
    gradient: 'from-rose-500/20 to-rose-600/5'
  }
]

const DAILY_SCHEDULE = [
  {
    time: '10:00',
    title: 'Ранкова кава & свіжі ліди',
    icon: Coffee,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    desc: 'Зустрічаємося в комфортному офісі поруч з метро. Переглядаємо нові заявки покупців з CRM-системи, п’ємо каву та плануємо покази на день разом з наставником.'
  },
  {
    time: '11:30',
    title: 'Робота з базою та дзвінки',
    icon: Zap,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    desc: 'Домовляємося про перегляди об’єктів. Наша база автоматично підбирає варіанти під бюджет клієнта за 2 кліки — нічого не потрібно шукати вручну.'
  },
  {
    time: '13:30',
    title: 'Виїзний показ на локації',
    icon: Car,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    desc: 'Зустрічаємося з покупцями біля квартири або ЖК. Показуємо переваги району, вид з вікна та планування. Клієнти закохуються у житло!'
  },
  {
    time: '15:30',
    title: 'Юридичний супровід та завдаток',
    icon: ShieldCheck,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    desc: 'Корпоративний юрист агентства бере перевірку права власності та складання договору на себе. Ти лише фіксуєш домовленість сторін.'
  },
  {
    time: '17:00',
    title: 'Закриття угоди & виплата комісії',
    icon: Trophy,
    color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    desc: 'Угода підписана у нотаріуса! Твоя винагорода (від $1 000 до $2 500 з однієї угоди) виплачується відразу в касі. Вітання від колег!'
  },
  {
    time: '18:30',
    title: 'Вільний вечір для себе',
    icon: Sparkles,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    desc: 'Жодних нічних змін і сидіння в офісі до ночі. Вечір належить тобі: тренування, вечеря з друзями або відпочинок.'
  }
]

const CAREER_LADDER = [
  {
    step: '01',
    level: 'Стажер',
    period: '1–2 місяці',
    income: '25 000 – 45 000 ₴',
    desc: 'Безкоштовна «Школа рієлтора», персональний ментор 24/7, спільні покази та перші успішні закриття угод під наглядом керівника.',
    color: 'border-blue-500/40 bg-blue-500/5 text-blue-600'
  },
  {
    step: '02',
    level: 'Експерт з нерухомості',
    period: '3–12 місяців',
    income: '50 000 – 90 000 ₴',
    desc: 'Власна база постійних клієнтів, рекомендації, стабільні 2–3 угоди на місяць, підвищений відсоток комісії.',
    color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600'
  },
  {
    step: '03',
    level: 'Топ-брокер / VIP-напрямок',
    period: '1–2 роки',
    income: '100 000 – 160 000+ ₴',
    desc: 'Елітні квартири, пентхауси, комерційна нерухомість, інвестиційні пули. Ти формуєш особистий бренд та навчаєш новачків.',
    color: 'border-amber-500/40 bg-amber-500/5 text-amber-600'
  },
  {
    step: '04',
    level: 'Керівник філії / Партнер',
    period: 'від 2 років',
    income: '200 000+ ₴',
    desc: 'Керівництво одним із 13 офісів у Харкові, формування власної команди та отримання пасивного % від обороту відділення.',
    color: 'border-purple-500/40 bg-purple-500/5 text-purple-600'
  }
]

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Клієнт каже: «Шукаю 1-кімнатну біля метро до $18 000, але тільки з сучасним ремонтом». Твої дії?',
    options: [
      {
        text: 'Скажу, що таких цін давно немає, і закрию діалог',
        isCorrect: false,
        reaction: 'Занадто швидко здався! Гроші клієнта підуть іншому агенту 🤷‍♂️'
      },
      {
        text: 'Знайду затишну смарт-квартиру біля метро або розтермінування від забудовника та закрию угоду!',
        isCorrect: true,
        reaction: 'Бінго! Справжній брокер бачить рішення там, де інші бачать перешкоду 🎯'
      }
    ]
  },
  {
    id: 2,
    question: 'Неділя, 19:30. Покупець телефонує: «Ми завтра вранці їдемо з міста, покажіть квартиру прямо зараз!». Що зробиш?',
    options: [
      {
        text: 'Одягаюся, замовляю таксі — це мій гарячий чек на $1 200 комісії!',
        isCorrect: true,
        reaction: 'Круто! Саме така швидкість робить наших рієлторів найбагатшими у Харкові 🔥'
      },
      {
        text: '«У мене вихідний, наберіть у понеділок з 10:00»',
        isCorrect: false,
        reaction: 'Поки ти чекав понеділка, об’єкт купили через іншого рієлтора 😬'
      }
    ]
  },
  {
    id: 3,
    question: 'Що для тебе вирішальне при виборі роботи?',
    options: [
      {
        text: 'Сидіти на ставці від дзвінка до дзвінка і чекати 18:00',
        isCorrect: false,
        reaction: 'Це стабільно, але заробити на власну квартиру на ставці майже нереально 📉'
      },
      {
        text: 'Свобода, гнучкий графік і дохід без стелі, який залежить від моїх результатів',
        isCorrect: true,
        reaction: 'Ти наш кандидат на 100%! Саме таких людей ми шукаємо 🚀'
      }
    ]
  }
]

const VacanciesPage = () => {
  // Income simulator state
  const [dealsCount, setDealsCount] = useState(2)
  const [avgPrice, setAvgPrice] = useState(35000)
  const [prefilledAbout, setPrefilledAbout] = useState('')

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizScore, setQuizScore] = useState(null)
  const [activeTimeIndex, setActiveTimeIndex] = useState(0)

  // Calculations
  const calculatedIncome = useMemo(() => {
    // Commission is ~4% total, agent gets 50% on start, 55% at 3+ deals, 60% at 5+ deals
    const agentSplit = dealsCount >= 5 ? 0.6 : dealsCount >= 3 ? 0.55 : 0.5
    const totalAgencyCommission = dealsCount * avgPrice * 0.04
    const agentUsd = Math.round(totalAgencyCommission * agentSplit)
    const agentUah = Math.round(agentUsd * 41.5)

    let rank = '🥉 Швидкий старт'
    let rankDesc = 'Новачок з першого місяця. Впевнені гроші та перший досвід.'
    let rankBadgeColor = 'bg-amber-500/15 text-amber-600 border-amber-500/30'

    if (dealsCount >= 6) {
      rank = '👑 Легенда нерухомості'
      rankDesc = 'Твій заробіток перевищує зарплати сеньйор-айтівців! Рівень партнера.'
      rankBadgeColor = 'bg-purple-500/15 text-purple-600 border-purple-500/30'
    } else if (dealsCount >= 4) {
      rank = '🥇 Топ-брокер Харкова'
      rankDesc = 'Еліта компанії. Черга з клієнтів за рекомендаціями.'
      rankBadgeColor = 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
    } else if (dealsCount >= 2) {
      rank = '🥈 Профі переговорів'
      rankDesc = 'Стабільний високий дохід та повний контроль свого часу.'
      rankBadgeColor = 'bg-blue-500/15 text-blue-600 border-blue-500/30'
    }

    return {
      agentUsd,
      agentUah,
      rank,
      rankDesc,
      rankBadgeColor
    }
  }, [dealsCount, avgPrice])

  const handleDealsChange = (e) => {
    setDealsCount(parseInt(e.target.value, 10))
  }

  const handlePriceChange = (e) => {
    setAvgPrice(parseInt(e.target.value, 10))
  }

  const handleSelectQuizOption = (questionId, optionIndex) => {
    const updated = { ...quizAnswers, [questionId]: optionIndex }
    setQuizAnswers(updated)

    // Check if all answered
    if (Object.keys(updated).length === QUIZ_QUESTIONS.length) {
      let correct = 0
      QUIZ_QUESTIONS.forEach((q) => {
        const chosen = updated[q.id]
        if (q.options[chosen]?.isCorrect) correct += 1
      })
      setQuizScore(correct)
    }
  }

  const handleResetQuiz = () => {
    setQuizAnswers({})
    setQuizScore(null)
  }

  const handleApplyWithIncome = () => {
    const text = `Цікавить дохід від ${calculatedIncome.agentUah.toLocaleString('uk-UA')} ₴ ($${calculatedIncome.agentUsd.toLocaleString('en-US')}) на місяць. Рівень: ${calculatedIncome.rank}.`
    setPrefilledAbout(text)
    const el = document.getElementById('apply')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleApplyWithQuiz = () => {
    const text = `Пройшов тест на рієлтора: результат ${quizScore}/${QUIZ_QUESTIONS.length} правильних відповідей! Готовий до співбесіди.`
    setPrefilledAbout(text)
    const el = document.getElementById('apply')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="pt-24 pb-20">
      <SeoMeta
        title="Вакансії рієлтора в Харкові | Робота в нерухомості з навчанням"
        description="Робота рієлтором у Харкові з безкоштовним навчанням та доходом від 45 000 до 150 000+ ₴. 13 офісів поруч з домом, підтримка наставника."
        url="/vakansii"
      />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs tracking-widest uppercase font-inter font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Кар'єра без меж · 13 філій у Харкові</span>
        </div>
        <h1 className="font-cormorant font-extrabold tracking-tight text-5xl sm:text-7xl mb-6 text-foreground">
          Вакансії та кар'єра в нерухомості
        </h1>
        <p className="text-muted-foreground font-inter text-base sm:text-lg max-w-3xl leading-relaxed">
          Заробляй від 50 000 ₴ вже в перші місяці без попереднього досвіду. Ми надаємо безкоштовне навчання,
          персонального наставника та щогодинний потік ліквідних об'єктів.
        </p>

        {/* Quick navigation anchor pills */}
        <div className="flex flex-wrap gap-2.5 mt-8 font-inter">
          <a
            href="#simulator"
            className="px-4 py-2 rounded-full bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>🎮 Калькулятор доходу</span>
          </a>
          <a
            href="#quiz"
            className="px-4 py-2 rounded-full bg-amber-500/15 text-amber-700 text-xs font-semibold hover:bg-amber-500/25 transition-colors flex items-center gap-2"
          >
            <span>⚡ Тест на рієлтора (60 сек)</span>
          </a>
          <a
            href="#day"
            className="px-4 py-2 rounded-full bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            <span>☕ Один день з життя</span>
          </a>
          <a
            href="#apply"
            className="px-4 py-2 rounded-full gradient-gold text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <span>📝 Подати анкету</span>
          </a>
        </div>
      </section>

      {/* Hero Vibrant Banner */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-[#0e1e38] via-[#1a365d] to-[#0f2444] rounded-3xl p-8 sm:p-14 text-white shadow-2xl border border-white/10"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <Flame className="w-3.5 h-3.5" />
              <span>Відкритий набір · Менеджер з продажу</span>
            </div>

            <h2 className="font-cormorant font-extrabold text-3xl sm:text-5xl text-white mb-5 leading-tight">
              Стань господарем свого часу та доходу у Харкові
            </h2>

            <p className="text-white/80 font-inter text-sm sm:text-base leading-relaxed mb-8">
              У нас немає нудної бюрократії, душних кабінетів та мікроменеджменту. Ми вчимо тебе перемагати на ринку нерухомості,
              допомагати сім'ям знаходити затишний дім та отримувати гідну винагороду за кожну угоду.
            </p>

            {/* Metric counters grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-cormorant">40-60%</p>
                <p className="text-[11px] text-white/70 font-inter mt-1">комісії виплачується агенту</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-cormorant">13 філій</p>
                <p className="text-[11px] text-white/70 font-inter mt-1">у всіх районах Харкова</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-cormorant">0 грн</p>
                <p className="text-[11px] text-white/70 font-inter mt-1">вартість навчання з ментором</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-cormorant">24/7</p>
                <p className="text-[11px] text-white/70 font-inter mt-1">юридична підтримка угод</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#simulator"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-navy font-bold rounded-full text-xs tracking-wider uppercase font-inter hover:bg-cream transition-colors shadow-lg"
              >
                <span>Розрахувати свій дохід</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:+380735642268"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs tracking-wider uppercase font-inter font-semibold transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Зателефонувати в HR (073 564 22 68)</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="max-w-7xl mx-auto px-6 py-20 sm:py-24 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs uppercase font-inter font-bold tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Інтерактивний калькулятор</span>
          </div>
          <h2 className="font-cormorant font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
            Скільки ти заробиш рієлтором?
          </h2>
          <p className="text-muted-foreground font-inter text-sm sm:text-base">
            Рухай повзунки кількості угод та середнього чека об'єкта, щоб побачити свій реальний щомісячний дохід.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Sliders Box */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col justify-between">
            <div className="space-y-8">
              {/* Slider 1: Deals */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-inter">
                    Кількість угод на місяць
                  </span>
                  <span className="text-2xl font-extrabold text-foreground font-cormorant px-3 py-1 bg-muted rounded-xl">
                    {dealsCount} {dealsCount === 1 ? 'угода' : dealsCount < 5 ? 'угоди' : 'угод'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={dealsCount}
                  onChange={handleDealsChange}
                  className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                  aria-label="Кількість угод на місяць"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-inter mt-2">
                  <span>1 (Старт новачка)</span>
                  <span>3 (Середній агент)</span>
                  <span>6+ (Топ-брокер)</span>
                </div>
              </div>

              {/* Slider 2: Average Property Price */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-inter">
                    Середня вартість об'єкта
                  </span>
                  <span className="text-2xl font-extrabold text-foreground font-cormorant px-3 py-1 bg-muted rounded-xl">
                    ${avgPrice.toLocaleString('en-US')}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="90000"
                  step="5000"
                  value={avgPrice}
                  onChange={handlePriceChange}
                  className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                  aria-label="Середня вартість об'єкта"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-inter mt-2">
                  <span>$20 000 (Смарт-житло)</span>
                  <span>$45 000 (2-3к квартира)</span>
                  <span>$90 000 (Новобудова / Будинок)</span>
                </div>
              </div>

              {/* Perks Checklist */}
              <div className="pt-4 border-t border-border/60">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-inter mb-3">
                  Що ти отримуєш від «Харків Ріелтер» безкоштовно:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-inter text-xs text-foreground/80">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Постійні вхідні ліди з реклами</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Юридична перевірка об'єктів</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Виплата комісії в день угоди</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Офіс поруч з домом (13 філій)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-inter">
              <span>* Розрахунок орієнтовний на базі середньоринкової ставки 4%</span>
              <span className="font-semibold text-gold">Курс: 41.5 ₴/$</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0f1d33] to-[#1a365d] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col justify-between border border-gold/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Trophy className="w-48 h-48 text-gold" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 font-inter">
                  Твій прогноз доходу:
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border font-inter ${calculatedIncome.rankBadgeColor}`}>
                  {calculatedIncome.rank}
                </span>
              </div>

              <div className="mb-6">
                <p className="font-cormorant font-extrabold text-5xl sm:text-6xl text-amber-300 tracking-tight leading-none">
                  {calculatedIncome.agentUah.toLocaleString('uk-UA')} ₴
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white/90 font-inter mt-2">
                  ≈ ${calculatedIncome.agentUsd.toLocaleString('en-US')} / місяць
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md mb-6">
                <p className="text-xs text-white/90 font-inter leading-relaxed">
                  {calculatedIncome.rankDesc}
                </p>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleApplyWithIncome}
                className="w-full py-4 gradient-gold text-white font-bold rounded-2xl text-xs tracking-wider uppercase font-inter hover:opacity-95 transition-opacity shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Хочу такий дохід — Подати анкету</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-white/50 text-center mt-3 font-inter">
                Безкоштовно навчимо закривати угоди за 10 днів
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quiz Section */}
      <section id="quiz" className="bg-secondary/30 py-20 sm:py-24 scroll-mt-24 border-y border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 text-xs uppercase font-inter font-bold tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Експрес-тест за 60 секунд</span>
            </div>
            <h2 className="font-cormorant font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
              Чи вийде з тебе топовий рієлтор?
            </h2>
            <p className="text-muted-foreground font-inter text-sm sm:text-base">
              Перевір своє брокерське чуття у 3 типових життєвих ситуаціях. Жодних нудних питань — тільки практика!
            </p>
          </div>

          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOption = quizAnswers[q.id]
              const hasAnswered = selectedOption !== undefined

              return (
                <div
                  key={q.id}
                  className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0 font-inter">
                      {qIndex + 1}
                    </span>
                    <h3 className="font-inter font-bold text-base sm:text-lg text-foreground">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {q.options.map((opt, optIndex) => {
                      const isChosen = selectedOption === optIndex

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectQuizOption(q.id, optIndex)}
                          className={`p-4 rounded-2xl text-left font-inter text-sm transition-all border ${
                            isChosen
                              ? opt.isCorrect
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-500/30'
                                : 'bg-rose-500/15 border-rose-500 text-rose-950 font-semibold ring-2 ring-rose-500/30'
                              : 'bg-muted/50 border-border/70 hover:bg-muted text-foreground/80'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                              {optIndex === 0 ? 'A' : 'B'}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {hasAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3.5 rounded-xl text-xs font-inter leading-relaxed ${
                        q.options[selectedOption].isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {q.options[selectedOption].reaction}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quiz Result Celebration Card */}
          {quizScore !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-gold/10 to-amber-500/5 border border-gold/40 text-center shadow-xl"
            >
              <Trophy className="w-14 h-14 text-gold mx-auto mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-gold font-inter mb-2">
                Тест пройдено! Твій результат:
              </p>
              <h3 className="font-cormorant font-extrabold text-3xl sm:text-4xl text-foreground mb-3">
                {quizScore === 3
                  ? '🔥 100% Природжений топ-брокер!'
                  : quizScore === 2
                  ? '🚀 Відмінний потенціал у продажах!'
                  : '💡 Тобі потрібен сильний наставник!'}
              </h3>
              <p className="text-muted-foreground font-inter text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                {quizScore === 3
                  ? 'Ти мислиш як успішний підприємець! З нашою щогодинною базою об’єктів та юридичною підтримкою ти закриєш першу угоду за 3 тижні.'
                  : 'У тебе є інтуїція та бажання розвиватися. Наші безкоштовні тренінги та персональний наставник доведуть твої навички до ідеалу.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyWithQuiz}
                  className="px-8 py-3.5 gradient-gold text-white font-bold rounded-full text-xs tracking-wider uppercase font-inter hover:opacity-90 transition-opacity shadow-md flex items-center gap-2"
                >
                  <span>Зберегти результат та надіслати анкету</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-6 py-3.5 rounded-full border border-border text-foreground hover:bg-muted text-xs font-semibold font-inter transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Пройти ще раз</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Interactive Day in the Life Section */}
      <section id="day" className="max-w-7xl mx-auto px-6 py-20 sm:py-24 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs uppercase font-inter font-bold tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Хронометраж успіху</span>
          </div>
          <h2 className="font-cormorant font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
            Один день з життя рієлтора
          </h2>
          <p className="text-muted-foreground font-inter text-sm sm:text-base">
            Як проходить реальний робочий день без нудної рутини, начальників та будильників на 7 ранку.
          </p>
        </div>

        {/* Time Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {DAILY_SCHEDULE.map((item, index) => {
            const isActive = activeTimeIndex === index
            return (
              <button
                key={item.time}
                type="button"
                onClick={() => setActiveTimeIndex(index)}
                className={`px-4 py-2 rounded-full text-xs font-semibold font-inter transition-all duration-200 border ${
                  isActive
                    ? 'bg-navy text-white border-navy shadow-md scale-105'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.time} · {item.title.split(' ')[0]}
              </button>
            )
          })}
        </div>

        {/* Active Schedule Card */}
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {(() => {
              const current = DAILY_SCHEDULE[activeTimeIndex]
              const IconComp = current.icon

              return (
                <motion.div
                  key={current.time}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-cormorant font-extrabold text-4xl sm:text-5xl text-gold">
                      {current.time}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${current.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-foreground mb-4">
                    {current.title}
                  </h3>

                  <p className="text-muted-foreground font-inter text-base sm:text-lg leading-relaxed mb-8">
                    {current.desc}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-border/60">
                    <button
                      type="button"
                      disabled={activeTimeIndex === 0}
                      onClick={() => setActiveTimeIndex((prev) => Math.max(0, prev - 1))}
                      className="text-xs font-semibold font-inter text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      ← Попередній етап
                    </button>
                    <span className="text-xs text-muted-foreground font-inter">
                      {activeTimeIndex + 1} з {DAILY_SCHEDULE.length}
                    </span>
                    <button
                      type="button"
                      disabled={activeTimeIndex === DAILY_SCHEDULE.length - 1}
                      onClick={() => setActiveTimeIndex((prev) => Math.min(DAILY_SCHEDULE.length - 1, prev + 1))}
                      className="text-xs font-semibold font-inter text-gold hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                    >
                      <span>Наступний</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })()}
          </AnimatePresence>
        </div>
      </section>

      {/* Career Ladder Section */}
      <section className="bg-secondary/30 py-20 sm:py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs uppercase font-inter font-bold tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Твій кар'єрний ліфт</span>
            </div>
            <h2 className="font-cormorant font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
              Шлях від новачка до партнера філії
            </h2>
            <p className="text-muted-foreground font-inter text-sm sm:text-base">
              У нас немає штучних перешкод для росту. Кожен крок прозорий і залежить лише від твоїх амбіцій.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAREER_LADDER.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-cormorant font-extrabold text-3xl text-gold/40 group-hover:text-gold transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground font-inter px-2.5 py-1 bg-muted rounded-full">
                      {item.period}
                    </span>
                  </div>

                  <h3 className="font-cormorant font-bold text-2xl text-foreground mb-2">
                    {item.level}
                  </h3>

                  <div className={`inline-block px-3 py-1 rounded-xl text-xs font-bold font-inter mb-4 border ${item.color}`}>
                    {item.income}
                  </div>

                  <p className="text-muted-foreground font-inter text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-gold font-inter">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Швидкий перехід</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 13 Offices in Kharkiv Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs uppercase font-inter font-bold tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Локації</span>
          </div>
          <h2 className="font-cormorant font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
            13 офісів у Харкові — працюй поруч із домом
          </h2>
          <p className="text-muted-foreground font-inter text-sm sm:text-base">
            Тобі не треба щоранку їхати через усе місто. Обирай філію у своєму районі та заощаджуй час на важливі справи.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 font-inter">
          {OFFICES.map((office) => (
            <div
              key={office.id}
              className="p-4 rounded-2xl bg-card border border-border shadow-sm hover:border-gold/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-bold text-sm text-foreground truncate">{office.name}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mb-1">{office.shortAddress}</p>
              <span className="text-[10px] text-blue-600 font-semibold">м. {office.metro}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="bg-secondary/40 py-20 sm:py-24 scroll-mt-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Benefits & Pitch */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs uppercase font-inter font-bold tracking-wider mb-3">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Відділ кадрів</span>
                </div>
                <h2 className="font-cormorant font-extrabold text-4xl sm:text-5xl text-foreground mb-4">
                  Зроби перший крок до нової професії
                </h2>
                <p className="text-muted-foreground font-inter text-sm sm:text-base leading-relaxed">
                  Заповни коротку анкету прямо зараз. Наш HR-менеджер зв'яжеться з тобою, відповість на всі питання та запросить на чашку кави в зручний для тебе офіс.
                </p>
              </div>

              {/* HR Card */}
              <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4 font-inter">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-white font-bold text-lg">
                    HR
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Відділ підбору персоналу</p>
                    <p className="text-xs text-muted-foreground">Корпорація «Харків Ріелтер»</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <a
                    href="tel:+380735642268"
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <span>073 564 22 68</span>
                  </a>
                  <a
                    href="https://t.me/hrkharkivrealter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] text-xs font-semibold transition-colors"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Telegram: @hrkharkivrealter</span>
                  </a>
                  <a
                    href="mailto:hr.kharkivrealter@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>hr.kharkivrealter@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl">
              <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-foreground mb-2">
                Анкета кандидата
              </h3>
              <p className="text-muted-foreground font-inter text-xs sm:text-sm mb-6">
                Заповнення займає менше 1 хвилини. Досвід не обов'язковий — ми навчимо всього з нуля.
              </p>

              <VacancyForm initialAbout={prefilledAbout} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VacanciesPage

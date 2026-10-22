import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Building2,
  Send,
  Phone,
  Sparkles,
  Calculator
} from 'lucide-react'
import SeoMeta from '@/components/seo/SeoMeta'
import { submitLead } from '@/lib/leadService'
import { cn } from '@/lib/utils'

const RATES = [
  {
    rate: 3,
    label: 'Пільгова ставка 3%',
    desc: 'Для військовослужбовців ЗСУ за контрактом, силовиків, медиків, педагогів та науковців комунальних і державних закладів.'
  },
  {
    rate: 7,
    label: 'Масова програма 7%',
    desc: 'Для ветеранів війни, учасників бойових дій, внутрішньо переміщених осіб (ВПО) та всіх громадян України без власного житла.'
  }
]

const FAQS = [
  {
    q: 'Яку нерухомість у Харкові можна придбати за програмою єОселя?',
    a: 'За ставкою 3% можна придбати житло у багатоквартирних будинках віком до 10 років (введених в експлуатацію) у Харкові та області. За ставкою 7% підходять будинки віком до 3 років або майнові права на об\'єкти на етапі будівництва в акредитованих банком забудовників. Наші фахівці мають повний список об\'єктів Харкова, які відповідають вимогам банків.'
  },
  {
    q: 'Які граничні обмеження за площею житла?',
    a: 'Нормативна площа для сім\'ї з однієї особи становить до 52.5 м² загальної площі, плюс 21 м² на кожного наступного члена сім\'ї (чоловік/дружина, неповнолітні діти). Якщо площа обраної квартири більша за нормативну, площа понад норму сплачується позичальником за рахунок першого внеску.'
  },
  {
    q: 'Які додаткові витрати виникають при оформленні іпотеки?',
    a: 'До супутніх витрат входять: разова комісія банку (зазвичай 0.5–1% від суми кредиту), збір до Пенсійного фонду (1% від вартості, якщо це перша нерухомість — підлягає поверненню), обов\'язкове щорічне страхування іпотеки (близько 0.25–0.5%), незалежна експертна оцінка квартири та послуги нотаріуса за посвідчення іпотечного договору.'
  },
  {
    q: 'Чи можна достроково погасити кредит єОселя?',
    a: 'Так, законодавство України та правила програми єОселя дозволяють дострокове часткове або повне погашення кредиту в будь-який момент без будь-яких штрафних санкцій та прихованих комісій.'
  },
  {
    q: 'Як подати заявку та скільки часу займає схвалення?',
    a: 'Перший крок — подати заявку в застосунку «Дія» у розділі «єОселя». Банки розглядають заявку від 5 хвилин до 24 годин. Після отримання попереднього погодження ви звертаєтеся до нашого агентства, ми підбираємо акредитовану квартиру та передаємо повний юридичний пакет у банк.'
  }
]

const EOselia = () => {
  // Calculator state (in UAH, assuming ~41.5 UAH/USD)
  const [propertyPriceUah, setPropertyPriceUah] = useState(1800000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [termYears, setTermYears] = useState(20)
  const [selectedRate, setSelectedRate] = useState(3)
  const [openFaq, setOpenFaq] = useState(null)

  // Consultation form state
  const [form, setForm] = useState({ name: '', phone: '', category: 'military', note: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Mortgage calculations
  const downPaymentAmount = useMemo(() => {
    return Math.round((propertyPriceUah * downPaymentPercent) / 100)
  }, [propertyPriceUah, downPaymentPercent])

  const loanAmount = useMemo(() => {
    return Math.max(0, propertyPriceUah - downPaymentAmount)
  }, [propertyPriceUah, downPaymentAmount])

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0) return 0
    const monthlyRate = selectedRate / 100 / 12
    const totalMonths = termYears * 12
    const annuityFactor =
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    return Math.round(loanAmount * annuityFactor)
  }, [loanAmount, selectedRate, termYears])

  const approxUsd = useMemo(() => {
    return Math.round(propertyPriceUah / 41.5)
  }, [propertyPriceUah])

  const handleToggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index))
  }

  const handleSubmitLead = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg('Будь ласка, вкажіть ваше ім\'я та телефон')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: 'eoselia_consultation',
      property_id: null,
      message: `Заявка на консультацію по програмі єОселя.\nКатегорія: ${form.category}\nБюджет: ${propertyPriceUah.toLocaleString('uk-UA')} грн ($${approxUsd.toLocaleString('uk-UA')})\nСтавка: ${selectedRate}%\nТермін: ${termYears} років\nКоментар: ${form.note.trim() || '—'}`
    }

    const res = await submitLead(payload)
    setIsSubmitting(false)

    if (res.success) {
      setSubmitted(true)
      setForm({ name: '', phone: '', category: 'military', note: '' })
      return
    }

    setErrorMsg(res.error || 'Помилка при надсиланні. Спробуйте ще раз або зателефонуйте нам.')
  }

  return (
    <div className="pt-24 pb-20">
      <SeoMeta
        title="Державна програма єОселя у Харкові: іпотека 3% та 7% | Харків Ріелтер"
        description="Купівля квартир у Харкові за державною програмою доступного кредитування єОселя. Пільгова ставка 3% та 7% річних. Калькулятор платежів, умови, акредитовані об'єкти."
        url="/eoselia"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-8 sm:py-14 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy text-white text-xs font-inter font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Державна програма доступного кредитування</span>
          </div>

          <h1 className="font-cormorant text-4xl sm:text-6xl font-bold text-foreground tracking-tight mb-4 leading-tight">
            єОселя у Харкові: власне житло від 3% та 7% річних
          </h1>

          <p className="text-muted-foreground font-inter text-base sm:text-lg max-w-3xl leading-relaxed mb-8">
            Отримайте пільговий державний кредит на квартиру у Харкові за підтримки ПрАТ «Укрфінжитло» та банків-партнерів. АН «Харків Ріелтер» забезпечує повний юридичний супровід та підбір квартир, які на 100% проходять банківську акредитацію.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-navy">3% та 7%</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">Фіксована річна ставка</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-navy">від 20%</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">Мінімальний перший внесок</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-navy">до 20 років</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">Термін кредитування</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-navy">100+ об'єктів</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">У базі під єОселя</p>
            </div>
          </div>
        </div>

        {/* Interactive Mortgage Calculator */}
        <section className="py-12 sm:py-16 border-b border-border" id="calculator">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-navy text-xs uppercase tracking-widest font-bold font-inter mb-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Калькулятор іпотеки</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground">
              Розрахуйте свій щомісячний платіж
            </h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">
              Орієнтовний розрахунок щомісячного внеску згідно зі стандартними умовами програми єОселя
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Inputs Column */}
            <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Program Rate Selector */}
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-inter font-semibold block mb-3">
                  Оберіть пільгову ставку
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RATES.map((item) => (
                    <button
                      key={item.rate}
                      type="button"
                      onClick={() => setSelectedRate(item.rate)}
                      className={cn(
                        'text-left p-4 rounded-2xl border transition-all text-xs font-inter',
                        selectedRate === item.rate
                          ? 'border-navy bg-navy/5 shadow-sm ring-1 ring-navy'
                          : 'border-border hover:border-border/80 bg-background'
                      )}
                    >
                      <p className="font-bold text-base text-foreground mb-1">{item.label}</p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Price */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-inter font-semibold">
                    Вартість нерухомості
                  </label>
                  <span className="font-bold font-inter text-base text-foreground">
                    {propertyPriceUah.toLocaleString('uk-UA')} грн (~${approxUsd.toLocaleString('uk-UA')})
                  </span>
                </div>
                <input
                  type="range"
                  min={800000}
                  max={5000000}
                  step={50000}
                  value={propertyPriceUah}
                  onChange={(e) => setPropertyPriceUah(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer h-2 bg-muted rounded-lg"
                  aria-label="Вартість нерухомості у гривнях"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-inter mt-1.5">
                  <span>800 000 грн</span>
                  <span>2 500 000 грн</span>
                  <span>5 000 000 грн</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-inter font-semibold">
                    Перший внесок ({downPaymentPercent}%)
                  </label>
                  <span className="font-bold font-inter text-base text-foreground">
                    {downPaymentAmount.toLocaleString('uk-UA')} грн
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={70}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer h-2 bg-muted rounded-lg"
                  aria-label="Відсоток першого внеску"
                />
                <div className="flex gap-2 mt-2">
                  {[20, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPaymentPercent(pct)}
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-inter font-medium border transition-colors',
                        downPaymentPercent === pct
                          ? 'bg-navy text-white border-navy'
                          : 'border-border text-foreground hover:bg-muted'
                      )}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-inter font-semibold">
                    Термін кредиту
                  </label>
                  <span className="font-bold font-inter text-base text-foreground">
                    {termYears} {termYears === 1 ? 'рік' : termYears < 5 ? 'роки' : 'років'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer h-2 bg-muted rounded-lg"
                  aria-label="Термін кредиту у роках"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-inter mt-1.5">
                  <span>1 рік</span>
                  <span>10 років</span>
                  <span>20 років</span>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 bg-navy text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between border border-white/10">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-inter font-bold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Орієнтовний щомісячний платіж</span>
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-cormorant text-4xl sm:text-5xl font-bold tracking-tight text-white">
                    {monthlyPayment.toLocaleString('uk-UA')}
                  </span>
                  <span className="text-lg text-slate-300 font-inter">грн / міс</span>
                </div>

                <div className="space-y-3.5 border-t border-white/15 pt-6 text-sm font-inter">
                  <div className="flex justify-between text-slate-200">
                    <span>Сума кредиту:</span>
                    <span className="font-bold text-white">{loanAmount.toLocaleString('uk-UA')} грн</span>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>Перший внесок ({downPaymentPercent}%):</span>
                    <span className="font-bold text-white">{downPaymentAmount.toLocaleString('uk-UA')} грн</span>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>Річна ставка:</span>
                    <span className="font-bold text-emerald-400">{selectedRate}% річних</span>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>Термін кредиту:</span>
                    <span className="font-bold text-white">{termYears} {termYears === 1 ? 'рік' : termYears < 5 ? 'роки' : 'років'} ({termYears * 12} міс.)</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <Link
                  to="/flats?deal=sale&eoselia=true"
                  tabIndex="0"
                  aria-label="Дивитися квартири під єОселя у каталозі"
                  className="w-full py-4 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-inter font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]"
                >
                  <span>Дивитися квартири під єОселя</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
                <a
                  href="#consultation"
                  tabIndex="0"
                  aria-label="Отримати консультацію брокера"
                  className="w-full py-3.5 px-6 rounded-full border-2 border-white/40 hover:bg-white/10 text-white font-inter font-bold text-xs uppercase tracking-wider text-center block transition-all"
                >
                  Отримати консультацію брокера
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Who Qualifies & Requirements */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest text-navy font-bold font-inter mb-2">Хто може взяти участь</p>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground">
              Категорії позичальників та вимоги до житла
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 3% Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border-2 border-navy/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-navy text-white text-xs font-bold font-inter">
                    Ставка 3% річних
                  </span>
                  <span className="text-xs text-muted-foreground font-inter">Пільгова категорія</span>
                </div>
                <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4">
                  Для кого призначена програма 3%
                </h3>
                <ul className="space-y-3 font-inter text-sm text-foreground/90">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Військовослужбовці ЗСУ</strong> за контрактом та силовики (СБУ, МВС, ДСНС тощо).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Медичні працівники</strong> комунальних та державних лікарень і закладів.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Педагоги та вчителі</strong> шкіл, гімназій, закладів фахової освіти.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Науковці та науково-педагогічні</strong> співробітники ВНЗ та НАН України.</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground font-inter space-y-1">
                  <p><strong>Вимоги до будинку у Харкові:</strong></p>
                  <p>• Будинок введено в експлуатацію не більше 10 років тому</p>
                  <p>• Нормативна площа: 52.5 м² на одну особу + 21 м² на кожного члена родини</p>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  to="/flats?deal=sale&eoselia=true"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:underline font-inter"
                >
                  Підібрати квартиру за ставкою 3% →
                </Link>
              </div>
            </div>

            {/* 7% Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border-2 border-navy/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-navy text-white text-xs font-bold font-inter">
                    Ставка 7% річних
                  </span>
                  <span className="text-xs text-muted-foreground font-inter">Масова програма</span>
                </div>
                <h3 className="font-cormorant text-2xl font-bold text-foreground mb-4">
                  Для кого призначена програма 7%
                </h3>
                <ul className="space-y-3 font-inter text-sm text-foreground/90">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Внутрішньо переміщені особи (ВПО)</strong> з офіційною довідкою.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Ветерани війни</strong>, учасники бойових дій та члени їхніх сімей.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Усі громадяни України</strong>, які не мають власного житла (або площа менша за 52.5 м²).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Офіційне працевлаштування та платоспроможність, достатня для обслуговування боргу.</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground font-inter space-y-1">
                  <p><strong>Вимоги до будинку у Харкові:</strong></p>
                  <p>• Будинок введено в експлуатацію не більше 3 років тому або майнові права</p>
                  <p>• Акредитація забудовника та об'єкта в уповноваженому банку</p>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  to="/flats?deal=sale&eoselia=true"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:underline font-inter"
                >
                  Підібрати квартиру за ставкою 7% →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Steps to Get Home */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest text-navy font-bold font-inter mb-2">Прозорий алгоритм</p>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground">
              5 кроків до власної оселі
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Заявка в Дії',
                desc: 'Подайте заяву на послугу єОселя в застосунку Дія. Отримайте попереднє схвалення від банків за 15 хвилин.'
              },
              {
                step: '02',
                title: 'Вибір банку',
                desc: 'Оберіть банк для фінансування: Ощадбанк, ПриватБанк, Укргазбанк, Sense Bank або інший партнер програми.'
              },
              {
                step: '03',
                title: 'Підбір квартири',
                desc: 'Разом з «Харків Ріелтер» обираєте перевірену квартиру, яка відповідає всім критеріям банку.'
              },
              {
                step: '04',
                title: 'Оцінка та аудит',
                desc: 'Готуємо повний пакет правовстановлюючих документів, проводимо незалежну оцінку та узгоджуємо з банком.'
              },
              {
                step: '05',
                title: 'Угода та ключі',
                desc: 'Підписання договору купівлі-продажу та іпотечного договору у нотаріуса. Отримання ключів від вашого житла.'
              }
            ].map((st) => (
              <div key={st.step} className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
                <div>
                  <span className="font-cormorant text-4xl font-bold text-navy/30 block mb-3">{st.step}</span>
                  <h3 className="font-inter font-bold text-base text-foreground mb-2">{st.title}</h3>
                  <p className="text-xs text-muted-foreground font-inter leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Kharkiv Realter */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-xs uppercase tracking-widest text-navy font-bold font-inter">Наші переваги</p>
              <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground leading-tight">
                Чому оформити єОселю безпечніше з «Харків Ріелтер»
              </h2>
              <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                Банки відхиляють понад 40% обраних покупцями квартир через приховані нюанси в документах, невідповідність року побудови або незгоду продавця на умови програми. Ми заздалегідь перевіряємо кожен об'єкт і беремо всю рутину на себе.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-3" />
                <h4 className="font-inter font-bold text-sm text-foreground mb-1">Безкоштовний юридичний аудит</h4>
                <p className="text-xs text-muted-foreground font-inter">Перевіряємо право власності, відсутність обтяжень та відповідність вимогам Укрфінжитло.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <Building2 className="w-6 h-6 text-navy mb-3" />
                <h4 className="font-inter font-bold text-sm text-foreground mb-1">Готові об'єкти з документами</h4>
                <p className="text-xs text-muted-foreground font-inter">Власники в нашій базі поінформовані про умови безготівкових розрахунків та готові до угоди.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <FileCheck className="w-6 h-6 text-emerald-600 mb-3" />
                <h4 className="font-inter font-bold text-sm text-foreground mb-1">Швидка оцінка для банку</h4>
                <p className="text-xs text-muted-foreground font-inter">Партнерські експертні оцінювачі, сертифіковані банками, роблять висновок за 24–48 годин.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border">
                <Phone className="w-6 h-6 text-navy mb-3" />
                <h4 className="font-inter font-bold text-sm text-foreground mb-1">Персональний іпотечний брокер</h4>
                <p className="text-xs text-muted-foreground font-inter">Супроводжуємо кожен крок: від першого дзвінка до нотаріального посвідчення угоди.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-widest text-navy font-bold font-inter mb-2">Відповіді на запитання</p>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground">
              Часті питання про єОселю у Харкові
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 font-inter">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-border rounded-2xl bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleToggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-foreground">{faq.q}</span>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', openFaq === idx && 'rotate-180')} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Lead Consultation Form */}
        <section className="py-12 sm:py-16" id="consultation">
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg text-center">
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Бажаєте отримати житло за програмою єОселя?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-inter mb-6">
              Залиште заявку — наш сертифікований іпотечний брокер зв'яжеться з вами протягом 15 хвилин, оцінить шанси та підбере варіанти квартир.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg font-inter">Дякуємо! Вашу заявку прийнято</h3>
                <p className="text-xs font-inter mt-1">
                  Наш експерт зателефонує вам найближчим часом для детальної консультації.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-4 text-left font-inter">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Ваше ім'я *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Олександр"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Номер телефону *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+380 95 123 45 67"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Ваша категорія
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-navy"
                  >
                    <option value="military">Військовослужбовець / Силовик (3%)</option>
                    <option value="medic">Медичний працівник (3%)</option>
                    <option value="teacher">Педагог / Вчитель (3%)</option>
                    <option value="scientist">Науковець (3%)</option>
                    <option value="vpo">ВПО (Внутрішньо переміщена особа) (7%)</option>
                    <option value="veteran">Ветеран війни / УБД (7%)</option>
                    <option value="other">Громадянин без житла (7%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Побажання чи запитання
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Район, бажана кількість кімнат, наявність сертифіката чи інше..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-navy"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-navy text-white text-xs tracking-widest uppercase font-bold hover:bg-navy/90 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Надсилання...' : 'Отримати безкоштовну консультацію'}</span>
                </button>

                <p className="text-[11px] text-center text-muted-foreground pt-1">
                  Натискаючи кнопку, ви даєте згоду на обробку персональних даних згідно з політикою конфіденційності.
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default EOselia

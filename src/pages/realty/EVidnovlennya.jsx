import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Hammer,
  FileCheck2,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Send,
  Coins,
  AlertCircle
} from 'lucide-react'
import SeoMeta from '@/components/seo/SeoMeta'
import { submitLead } from '@/lib/leadService'
import { cn, formatPhone, isValidPhone } from '@/lib/utils'

const FAQS = [
  {
    q: 'Чи можна придбати житло у Харкові, якщо зруйнована нерухомість була в іншій області або передмісті?',
    a: 'Так! Житловий сертифікат єВідновлення діє на території всієї України (крім тимчасово окупованих територій). Ви можете використати сертифікат, виданий за знищене житло в будь-якому населеному пункті, для придбання квартири чи приватного будинку у Харкові або Харківській області.'
  },
  {
    q: 'Що відбувається, якщо вартість обраного житла відрізняється від номіналу сертифіката?',
    a: 'Якщо ціна квартири більша за суму сертифіката — ви можете доплатити залишок самостійно (власними заощадженнями або за допомогою пільгової іпотеки єОселя). Якщо ціна менша за номінал — невикористана частина коштів зберігається в державному реєстрі та може бути використана на придбання іншої нерухомості згодом.'
  },
  {
    q: 'Чи можна об\'єднати декілька сертифікатів для купівлі одного об\'єкта?',
    a: 'Так, держава дозволяє об\'єднувати житлові сертифікати декількох власників (наприклад, членів однієї родини або співвласників зруйнованого будинку) для купівлі однієї спільної квартири чи приватного будинку.'
  },
  {
    q: 'Скільки часу діє бронювання коштів у Дії?',
    a: 'Після подання запиту на бронювання коштів у застосунку «Дія» держава резервує гроші рівно на 30 календарних днів. Протягом цього терміну необхідно укласти нотаріальний договір купівлі-продажу. Якщо термін сплив — бронювання скасовується, але сертифікат не згорає, і ви можете подати запит на бронювання повторно.'
  },
  {
    q: 'Які обмеження діють на житло, куплене за сертифікатом?',
    a: 'Згідно із Законом України, нерухомість, придбану за рахунок житлового сертифіката єВідновлення, заборонено продавати, дарувати або відчужувати в інший спосіб протягом 5 років. Нотаріус накладає офіційну обтяжувальну заборону в Державному реєстрі речових прав.'
  }
]

const EVidnovlennya = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', certificateSum: '', note: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleToggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index))
  }

  const handleSubmitLead = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setErrorMsg('Будь ласка, вкажіть ваше ім\'я')
      return
    }

    if (!isValidPhone(form.phone)) {
      setErrorMsg('Будь ласка, введіть коректний номер телефону (наприклад: +380 50 123 45 67)')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: 'evidnovlennya_consultation',
      property_id: null,
      message: `Заявка на консультацію по програмі єВідновлення.\nСума сертифіката: ${form.certificateSum.trim() || 'не вказано'}\nКоментар: ${form.note.trim() || '—'}`
    }

    const res = await submitLead(payload)
    setIsSubmitting(false)

    if (res.success) {
      setSubmitted(true)
      setForm({ name: '', phone: '', certificateSum: '', note: '' })
      return
    }

    setErrorMsg(res.error || 'Помилка при надсиланні. Спробуйте ще раз або зателефонуйте нам.')
  }

  return (
    <div className="pt-24 pb-20">
      <SeoMeta
        title="єВідновлення у Харкові: купівля житла за житловим сертифікатом | Харків Ріелтер"
        description="Купівля квартир та будинків у Харкові за житловими сертифікатами єВідновлення. Безкоштовний підбір перевірених об'єктів, бронювання коштів у Дії та юридичний супровід угоди."
        url="/evidnovlennya"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-8 sm:py-14 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-inter font-semibold mb-6 shadow-sm">
            <Hammer className="w-3.5 h-3.5 text-white" />
            <span>Державна компенсація за знищене житло</span>
          </div>

          <h1 className="font-cormorant text-4xl sm:text-6xl font-bold text-foreground tracking-tight mb-4 leading-tight">
            єВідновлення у Харкові: купівля нового житла за сертифікатом Дії
          </h1>

          <p className="text-muted-foreground font-inter text-base sm:text-lg max-w-3xl leading-relaxed mb-8">
            Отримали житловий сертифікат за зруйноване житло? АН «Харків Ріелтер» допоможе знайти безпечну квартиру або будинок, перевірить юридичну чистоту та візьме на себе всю взаємодію з нотаріусами та реєстраторами.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              to="/flats?deal=sale&erecovery=true"
              className="py-3.5 px-7 rounded-full bg-navy text-white text-xs font-inter font-bold uppercase tracking-widest hover:bg-navy/90 transition-colors flex items-center gap-2 shadow-md"
            >
              <span>Квартири під єВідновлення</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#consultation"
              className="py-3.5 px-7 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-inter font-semibold uppercase tracking-wider transition-colors"
            >
              Безкоштовна консультація
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-emerald-600">30 днів</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">Резервування грошей у Дії</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-emerald-600">0 грн</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">Комісія за аудит сертифіката</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-emerald-600">100%</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">Відповідність закону № 2923-IX</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-2xl sm:text-3xl font-bold font-inter text-emerald-600">200+ угод</p>
              <p className="text-xs text-muted-foreground font-inter mt-1">Успішно проведено за сертифікатами</p>
            </div>
          </div>
        </div>

        {/* 5-Step Process */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold font-inter mb-2">Покроковий алгоритм</p>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground">
              Як придбати житло за сертифікатом у Харкові
            </h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">
              Простий та зрозумілий процес із повним супроводом наших юристів
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Сертифікат у Дії',
                desc: 'Подайте заявку на компенсацію в застосунку Дія. Комісія затверджує суму і генерує електронний житловий сертифікат.'
              },
              {
                step: '02',
                title: 'Припинення власності',
                desc: 'Обов\'язкова нотаріальна дія: припинення права власності на зруйнований об\'єкт у держреєстрі (допомагаємо оформити за 1 день).'
              },
              {
                step: '03',
                title: 'Бронювання коштів',
                desc: 'Подаєте заявку в Дії на бронювання грошей. Протягом 5 робочих днів надходить підтвердження — кошти зарезервовано на 30 днів.'
              },
              {
                step: '04',
                title: 'Підбір квартири',
                desc: 'Обираєте квартиру чи будинок із нашої бази перевірених об\'єктів, де власники погоджені на розрахунок за сертифікатом.'
              },
              {
                step: '05',
                title: 'Нотаріальна угода',
                desc: 'Оформлення купівлі-продажу у нотаріуса. Держава переказує кошти на рахунок продавця за 3–10 банківських днів.'
              }
            ].map((st) => (
              <div key={st.step} className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
                <div>
                  <span className="font-cormorant text-4xl font-bold text-emerald-600/70 block mb-3">{st.step}</span>
                  <h3 className="font-inter font-bold text-base text-foreground mb-2">{st.title}</h3>
                  <p className="text-xs text-muted-foreground font-inter leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Terms & Nuances */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold font-inter mb-2">Юридичні деталі</p>
              <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground">
                Важливі правила програми єВідновлення
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-inter font-bold text-sm">
                  <Coins className="w-5 h-5 text-emerald-600" />
                  <span>Доплата власними коштами</span>
                </div>
                <p className="text-xs text-muted-foreground font-inter leading-relaxed">
                  Якщо бажана нерухомість коштує дорожче, ніж номінал сертифіката, ви можете доплатити залишок власними коштами або оформити кредит єОселя на різницю.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-inter font-bold text-sm">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <span>Об'єднання сертифікатів</span>
                </div>
                <p className="text-xs text-muted-foreground font-inter leading-relaxed">
                  Декілька сертифікатів членів однієї родини або співвласників можна використати для придбання одного спільного об'єкта нерухомості.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 text-navy font-inter font-bold text-sm">
                  <Clock className="w-5 h-5 text-navy" />
                  <span>30 днів на завершення угоди</span>
                </div>
                <p className="text-xs text-muted-foreground font-inter leading-relaxed">
                  З моменту підтвердження бронювання коштів у вас є 30 календарних днів для укладання договору в нотаріуса. Тому житло варто підбирати заздалегідь!
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 text-navy font-inter font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-navy" />
                  <span>5-річний мораторій на продаж</span>
                </div>
                <p className="text-xs text-muted-foreground font-inter leading-relaxed">
                  Придбане житло не можна продавати або дарувати протягом 5 років. Нотаріус обов'язково накладає заборону на відчуження в Державному реєстрі.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog CTA Banner */}
        <section className="py-12 border-b border-border">
          <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#047857] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-inter font-semibold">
                Готова база об'єктів
              </span>
              <h3 className="font-cormorant text-3xl sm:text-4xl font-bold">
                Квартири у Харкові під житловий сертифікат
              </h3>
              <p className="text-emerald-100 text-sm font-inter leading-relaxed">
                Всі продавці перевірені, мають повний комплект правовстановлюючих документів та готові до безготівкових розрахунків згідно з правилами єВідновлення.
              </p>
            </div>

            <Link
              to="/flats?deal=sale&erecovery=true"
              className="py-4 px-8 rounded-full bg-white text-emerald-900 font-inter font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shrink-0 shadow-lg flex items-center gap-2"
            >
              <span>Переглянути квартири</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold font-inter mb-2">Питання та відповіді</p>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-foreground">
              Часті запитання про єВідновлення
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

        {/* Consultation Form */}
        <section className="py-12 sm:py-16" id="consultation">
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg text-center">
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Потрібна допомога з житловим сертифікатом?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-inter mb-6">
              Залиште контакти — наш провідний юрист безкоштовно проконсультує вас, перевірить статус сертифіката та підбере варіанти житла.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg font-inter">Заявку успішно прийнято!</h3>
                <p className="text-xs font-inter mt-1">
                  Фахівець зв'яжеться з вами найближчим часом для безкоштовної консультації.
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
                    placeholder="Наталія"
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
                    placeholder="+380 (50) 000-00-00"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Орієнтовна сума сертифіката (грн)
                  </label>
                  <input
                    type="text"
                    placeholder="Наприклад: 1 650 000 грн"
                    value={form.certificateSum}
                    onChange={(e) => setForm({ ...form, certificateSum: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Побажання щодо району або типу житла
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Кількість кімнат, район Харкова, бажані терміни переїзду..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-navy"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-emerald-600 text-white text-xs tracking-widest uppercase font-bold hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Надсилання...' : 'Отримати консультацію щодо сертифіката'}</span>
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

export default EVidnovlennya

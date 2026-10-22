import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react'
import { formatPhone, cn } from '@/lib/utils'
import { submitLead } from '@/lib/leadService'
import { getPhonesForToday, getPhoneLink } from '@/lib/phones'
import { OFFICES, HOTLINE_PHONE, GENERAL_EMAIL } from '@/data/offices'

const ContactPage = () => {
  const phones = getPhonesForToday()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', type: 'buy' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setErrorMessage('')

    const res = await submitLead({
      type: form.type,
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message
    })

    setSending(false)

    if (!res.success) {
      setErrorMessage(res.error || 'Не вдалося надіслати заявку. Будь ласка, зателефонуйте нам.')
      return
    }

    setSent(true)
  }

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16 border-b border-border mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3 font-inter font-semibold">Зворотній зв'язок</p>
        <h1 className="font-cormorant text-5xl sm:text-6xl font-bold text-foreground">Зв'яжіться з нами</h1>
        <p className="text-muted-foreground font-inter text-sm mt-3 max-w-xl">
          Оберіть зручний офіс у вашому районі, зателефонуйте черговому спеціалісту або залиште запит на підбір нерухомості.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-gold/30 bg-card rounded-3xl p-8">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
                <h2 className="font-cormorant text-4xl mb-3 font-bold text-foreground">Дякуємо!</h2>
                <p className="text-muted-foreground font-inter text-sm max-w-md">
                  Ми успішно отримали вашу заявку. Черговий спеціаліст зв'яжеться з вами протягом 15 хвилин.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', message: '', type: 'buy' }) }}
                  className="mt-8 text-sm text-gold hover:text-gold/80 transition-colors font-inter font-semibold"
                >
                  Відправити ще одне повідомлення
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3 font-inter font-semibold">Тема звернення</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-muted p-1.5 rounded-2xl">
                    {[
                      ['buy', 'Купівля'],
                      ['rent', 'Оренда'],
                      ['sell', 'Продаж'],
                      ['consult', 'Консультація']
                    ].map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, type: v }))}
                        className={cn(
                          'py-2.5 text-[11px] tracking-wider uppercase font-inter rounded-xl transition-all duration-200 font-semibold',
                          form.type === v ? 'gradient-gold text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5 font-semibold">Ім'я *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-border bg-card text-foreground px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all font-inter placeholder:text-muted-foreground rounded-2xl"
                      placeholder="Ваше ім'я"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5 font-semibold">Телефон *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      className="w-full border border-border bg-card text-foreground px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all font-inter placeholder:text-muted-foreground rounded-2xl"
                      placeholder="+380 (50) 000-00-00"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5 font-semibold">Email (необов'язково)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-border bg-card text-foreground px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all font-inter placeholder:text-muted-foreground rounded-2xl"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-1.5 font-semibold">Повідомлення або побажання</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full border border-border bg-card text-foreground px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all font-inter placeholder:text-muted-foreground resize-none rounded-2xl"
                    placeholder="Опишіть бажаний район, кількість кімнат або орієнтовний бюджет..."
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-inter">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 gradient-gold text-xs tracking-widest uppercase font-inter font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-70 rounded-full shadow-md mt-6 text-white"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Відправляємо запит...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Відправити заявку</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-muted-foreground font-inter text-center">
                  Натискаючи кнопку, ви погоджуєтеся з обробкою персональних даних
                </p>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 p-6 border border-border bg-card rounded-3xl shadow-sm">
                <p className="text-[10px] tracking-widest uppercase text-gold font-inter font-semibold">Консультації та черговий номер</p>
                <a href={getPhoneLink(HOTLINE_PHONE)} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-white shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-inter font-bold text-xl text-foreground group-hover:text-gold transition-colors">{HOTLINE_PHONE}</p>
                    <p className="text-xs text-muted-foreground font-inter">Щоденні консультації та запис на огляд</p>
                  </div>
                </a>

                <div className="pt-3 border-t border-border flex flex-wrap gap-2">
                  <a
                    href="https://t.me/kharkov_realter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-colors text-xs font-inter font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Telegram канал
                  </a>
                  <a
                    href="viber://chat?number=%2B380507136363"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors text-xs font-inter font-semibold"
                  >
                    Viber чат
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`mailto:${GENERAL_EMAIL}`}
                  className="flex items-center gap-3.5 p-5 border border-border bg-card rounded-2xl hover:border-gold/50 transition-colors group shadow-sm"
                >
                  <Mail className="w-5 h-5 text-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter">Email</p>
                    <p className="font-inter font-semibold text-sm text-foreground truncate group-hover:text-gold transition-colors">{GENERAL_EMAIL}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-5 border border-border bg-card rounded-2xl shadow-sm">
                  <Clock className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter">Графік роботи</p>
                    <p className="font-inter font-semibold text-sm text-foreground">Пн–Пт: 10:00 – 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offices list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-inter font-semibold">13 відділень у Харкові</p>
                <span className="text-xs text-gold font-inter font-semibold">Поруч з кожним метро</span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {OFFICES.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 border border-border bg-card rounded-2xl hover:border-navy/40 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="font-inter font-bold text-sm text-foreground">{o.name}</p>
                          <p className="text-muted-foreground text-xs font-inter mt-0.5">{o.address}</p>
                          {o.metro && (
                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-inter">
                              м. {o.metro}
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('АН "Харків-Ріелтер" ' + o.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-gold hover:underline font-inter shrink-0"
                      >
                        Карта ↗
                      </a>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-wrap gap-2">
                      {o.phones.map((phone) => (
                        <a
                          key={phone}
                          href={getPhoneLink(phone)}
                          className="text-xs font-inter text-foreground/80 hover:text-gold transition-colors font-medium"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', type: 'buy' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    
    // WARNING: Storing bot token in frontend is not secure for production.
    const BOT_TOKEN = '8682779916:AAHs83CU6whQibCqugxPf7cWZAcFCeLuv38'
    const CHAT_ID = '-5119703724' 
    
    const types = { buy: 'Купівля', rent: 'Оренда', sell: 'Продаж', consult: 'Консультація' }
    const typeLabel = types[form.type] || form.type
    
    const text = `Новая заявка с сайта! 🏢\nТема: ${typeLabel}\nИмя: ${form.name}\nТелефон: ${form.phone}\nEmail: ${form.email || '—'}\nПожелания: ${form.message || '—'}`

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text })
      })
    } catch (err) {
      console.error('Telegram error:', err)
    }

    setSending(false)
    setSent(true)
  }

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-b border-border mb-16">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-inter">Зворотній зв'язок</p>
        <h1 className="font-cormorant text-6xl sm:text-7xl font-light">Зв'яжіться з нами</h1>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-gold/30 bg-card">
                <CheckCircle className="w-16 h-16 text-gold mb-6" />
                <h2 className="font-cormorant text-4xl mb-3">Дякуємо!</h2>
                <p className="text-muted-foreground font-inter text-sm">Ми отримали вашу заявку і зв'яжемося з вами найближчим часом.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', message: '', type: 'buy' }) }}
                  className="mt-8 text-sm text-gold hover:text-gold/70 transition-colors font-inter">
                  Відправити ще раз
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4 font-inter">Тема звернення</p>
                  <div className="flex gap-1 bg-muted p-1 rounded-full">
                    {[['buy', 'Купівля'], ['rent', 'Оренда'], ['sell', 'Продаж'], ['consult', 'Консультація']].map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setForm(f => ({ ...f, type: v }))}
                        className={`flex-1 py-3 text-[10px] tracking-widest uppercase font-inter rounded-full transition-all duration-300 ${form.type === v ? 'gradient-gold shadow-md' : 'text-muted-foreground hover:text-navy'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Ім'я *</label>
                    <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:border-navy transition-colors font-inter placeholder:text-muted-foreground rounded-2xl"
                      placeholder="Ваше ім'я" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Телефон *</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:border-navy transition-colors font-inter placeholder:text-muted-foreground rounded-2xl"
                      placeholder="+380 (50) 000-00-00" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:border-navy transition-colors font-inter placeholder:text-muted-foreground rounded-2xl"
                    placeholder="email@example.com" />
                </div>

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Повідомлення</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={5}
                    className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:border-navy transition-colors font-inter placeholder:text-muted-foreground resize-none rounded-2xl"
                    placeholder="Розкажіть про ваші побажання..." />
                </div>

                <button type="submit" disabled={sending}
                  className="w-full py-4 gradient-gold text-xs tracking-widest uppercase font-inter font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-70 rounded-full shadow-md mt-6">
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Відправляємо...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Відправити заявку</>
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
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4 font-inter">Наші офіси</p>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--muted-foreground) / 0.3) transparent' }}>
                {[
                  { title: 'Центр-1 (Головний)', addr: 'вул. Григорія Сковороди, 65, оф. 3' },
                  { title: 'Центр-2', addr: 'вул. Сумська, 80' },
                  { title: 'Салтівка-1', addr: 'вул. Героїв Праці, 20/321' },
                  { title: 'Салтівка-2', addr: 'просп. Тракторобудівників, 108' },
                  { title: 'Салтівка-3', addr: 'вул. Героїв Праці, 30' },
                  { title: 'Салтівка-4', addr: 'вул. Амосова, 25' },
                  { title: 'Салтівка-5', addr: 'вул. Героїв Праці, 30' },
                  { title: 'Павлове Поле', addr: 'вул. 23-го Серпня, 38' },
                  { title: 'Олексіївка', addr: 'просп. Людвіга Свободи, 39' },
                  { title: 'Холодна Гора', addr: 'вул. Холодногірська, 3' },
                  { title: 'Одеська', addr: 'просп. Гагаріна, 176' },
                  { title: 'Нові Будинки', addr: 'просп. Маршала Жукова, 7' },
                  { title: 'ХТЗ', addr: 'просп. Олександрівський, 154' },
                  { title: 'Аерокосмічний', addr: 'просп. Гагаріна, 48' },
                ].map(o => (
                  <div key={o.title} className="flex gap-4 p-5 border border-border bg-card rounded-2xl hover:shadow-md transition-shadow">
                    <MapPin className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                    <div>
                      <p className="font-inter font-medium text-base leading-tight mb-1 text-foreground">{o.title}</p>
                      <p className="text-muted-foreground text-sm font-inter">{o.addr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <a href="tel:+380501234567" className="flex items-center gap-4 p-5 border border-border bg-card rounded-2xl hover:border-navy/40 hover:shadow-md transition-all group">
                <Phone className="w-5 h-5 text-muted-foreground group-hover:text-navy transition-colors" />
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-0.5">Телефон</p>
                  <p className="font-inter font-medium text-lg group-hover:text-navy transition-colors">+380 (50) 123-45-67</p>
                </div>
              </a>
              <a href="mailto:info@kharkiv-realty.ua" className="flex items-center gap-4 p-5 border border-border bg-card rounded-2xl hover:border-navy/40 hover:shadow-md transition-all group">
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-navy transition-colors" />
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-0.5">Email</p>
                  <p className="font-inter font-medium text-lg group-hover:text-navy transition-colors">info@kharkiv-realty.ua</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-5 border border-border bg-card rounded-2xl">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-0.5">Режим роботи</p>
                  <p className="font-inter font-medium text-lg">Пн–Пт: 10:00 – 18:00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

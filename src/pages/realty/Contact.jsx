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
    await new Promise(r => setTimeout(r, 1200))
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
                  <p className="text-xs tracking-[0.2em] uppercase text-gold mb-4 font-inter">Тема звернення</p>
                  <div className="flex gap-0 border border-border">
                    {[['buy', 'Купівля'], ['rent', 'Оренда'], ['sell', 'Продаж'], ['consult', 'Консультація']].map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setForm(f => ({ ...f, type: v }))}
                        className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase font-inter transition-colors ${form.type === v ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Ім'я *</label>
                    <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-border bg-card text-foreground px-4 py-3 text-sm outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground"
                      placeholder="Ваше ім'я" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Телефон *</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-border bg-card text-foreground px-4 py-3 text-sm outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground"
                      placeholder="+380 (50) 000-00-00" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-border bg-card text-foreground px-4 py-3 text-sm outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground"
                    placeholder="email@example.com" />
                </div>

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Повідомлення</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={5}
                    className="w-full border border-border bg-card text-foreground px-4 py-3 text-sm outline-none focus:border-gold/50 transition-colors font-inter placeholder:text-muted-foreground resize-none"
                    placeholder="Розкажіть про ваші побажання..." />
                </div>

                <button type="submit" disabled={sending}
                  className="w-full py-4 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-70">
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> Відправляємо...</>
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
              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-6 font-inter">Наші офіси</p>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CCA565 transparent' }}>
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
                  <div key={o.title} className="flex gap-4 p-4 border border-border bg-card">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-cormorant text-lg leading-tight mb-1">{o.title}</p>
                      <p className="text-muted-foreground text-sm font-inter">{o.addr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <a href="tel:+380501234567" className="flex items-center gap-4 p-5 border border-border bg-card hover:border-gold/40 transition-colors group">
                <Phone className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-0.5">Телефон</p>
                  <p className="font-cormorant text-xl group-hover:text-gold transition-colors">+380 (50) 123-45-67</p>
                </div>
              </a>
              <a href="mailto:info@kharkiv-realty.ua" className="flex items-center gap-4 p-5 border border-border bg-card hover:border-gold/40 transition-colors group">
                <Mail className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-[10px] tracking-widests uppercase text-muted-foreground font-inter mb-0.5">Email</p>
                  <p className="font-cormorant text-xl group-hover:text-gold transition-colors">info@kharkiv-realty.ua</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-5 border border-border bg-card">
                <Clock className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter mb-0.5">Режим роботи</p>
                  <p className="font-cormorant text-xl">Пн–Пт: 10:00 – 18:00</p>
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

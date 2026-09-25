import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { formatPhone } from '@/lib/utils'

export default function VacancyForm() {
  const [form, setForm] = useState({ name: '', phone: '', about: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    // Simulate API request
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <CheckCircle className="w-16 h-16 text-gold mb-6" />
        <h2 className="font-cormorant text-4xl mb-3">Заявка відправлена!</h2>
        <p className="text-muted-foreground font-inter text-sm">Ми зв'яжемося з вами найближчим часом для призначення співбесіди.</p>
        <button onClick={() => { setSent(false); setForm({ name: '', phone: '', about: '' }) }}
          className="mt-8 text-sm text-gold hover:text-gold/70 transition-colors font-inter">
          Відправити ще одну
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Ім'я *</label>
          <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:border-navy transition-colors font-inter placeholder:text-muted-foreground rounded-2xl"
            placeholder="Ваше ім'я" />
        </div>
        <div>
          <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Телефон *</label>
          <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
            className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:border-navy transition-colors font-inter placeholder:text-muted-foreground rounded-2xl"
            placeholder="+380 (50) 000-00-00" />
        </div>
      </div>

      <div>
        <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2">Коротко про себе (досвід)</label>
        <textarea value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
          rows={4}
          className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:border-navy transition-colors font-inter placeholder:text-muted-foreground resize-none rounded-2xl"
          placeholder="Де працювали раніше, чому хочете до нас..." />
      </div>

      <button type="submit" disabled={sending}
        className="w-full py-4 gradient-gold text-xs tracking-widest uppercase font-inter font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-70 rounded-full shadow-md mt-6 text-white">
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
  )
}

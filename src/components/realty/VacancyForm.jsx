import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { formatPhone } from '@/lib/utils'
import { submitLead } from '@/lib/leadService'

const VacancyForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', about: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setErrorMessage('')

    const res = await submitLead({
      type: 'vacancy',
      name: form.name,
      phone: form.phone,
      message: form.about
    })

    setSending(false)

    if (!res.success) {
      setErrorMessage(res.error || 'Помилка надсилання. Спробуйте зв\'язатися з HR у Telegram.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
        <h2 className="font-cormorant text-4xl mb-3 font-bold text-foreground">Заявка відправлена!</h2>
        <p className="text-muted-foreground font-inter text-sm max-w-md">
          Ми отримали вашу анкету і наш HR-менеджер зв'яжеться з вами найближчим часом для узгодження співбесіди.
        </p>
        <button
          type="button"
          onClick={() => { setSent(false); setForm({ name: '', phone: '', about: '' }) }}
          className="mt-8 text-sm text-gold hover:text-gold/80 transition-colors font-inter font-semibold"
        >
          Відправити ще одну анкету
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2 font-semibold">Ім'я *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all font-inter placeholder:text-muted-foreground rounded-2xl"
            placeholder="Ваше ім'я"
          />
        </div>
        <div>
          <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2 font-semibold">Телефон *</label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
            className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all font-inter placeholder:text-muted-foreground rounded-2xl"
            placeholder="+380 (50) 000-00-00"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] tracking-widest uppercase text-muted-foreground font-inter block mb-2 font-semibold">Коротко про себе (досвід, побажання)</label>
        <textarea
          value={form.about}
          onChange={(e) => setForm((prev) => ({ ...prev, about: e.target.value }))}
          rows={4}
          className="w-full border border-border bg-card text-foreground px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all font-inter placeholder:text-muted-foreground resize-none rounded-2xl"
          placeholder="Де працювали раніше, в якому районі Харкова вам зручніше працювати..."
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
            <span>Відправляємо анкету...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Відправити заявку на співбесіду</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-muted-foreground font-inter text-center">
        Натискаючи кнопку, ви погоджуєтеся з обробкою персональних даних
      </p>
    </form>
  )
}

export default VacancyForm

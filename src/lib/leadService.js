const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

export const submitLead = async ({ type = 'consult', name, phone, email = '', message = '', propertyId = null, propertyTitle = null }) => {
  if (!name || !name.trim() || !phone || !phone.trim()) {
    return { success: false, error: "Будь ласка, заповніть обов'язкові поля: ім'я та телефон" }
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    return { success: false, error: 'Будь ласка, введіть коректний номер телефону (наприклад: +380 50 123 45 67)' }
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { success: false, error: 'Форма тимчасово недоступна. Будь ласка, зателефонуйте нам.' }
  }

  const topicLabels = {
    buy: 'Купівля нерухомості',
    rent: 'Оренда житла',
    sell: 'Продаж нерухомості',
    consult: 'Загальна консультація',
    viewing: 'Запис на перегляд об\'єкта',
    vacancy: 'Відгук на вакансію',
    eoselia_consultation: 'Консультація по програмі «єОселя»',
    evidnovlennya_consultation: 'Консультація по програмі «єВідновлення»'
  }

  const topic = topicLabels[type] || type
  const lines = [
    '🏢 <b>Нова заявка з сайту kharkov-realter.com.ua</b>',
    `📌 <b>Тема:</b> ${topic}`,
    `👤 <b>Ім'я:</b> ${name.trim()}`,
    `📞 <b>Телефон:</b> ${phone.trim()}`,
  ]

  if (email && email.trim()) {
    lines.push(`✉️ <b>Email:</b> ${email.trim()}`)
  }

  if (propertyId) {
    lines.push(`🔑 <b>ID об'єкта:</b> #${propertyId}`)
  }

  if (propertyTitle) {
    lines.push(`🏠 <b>Об'єкт:</b> ${propertyTitle}`)
  }

  if (message && message.trim()) {
    lines.push(`💬 <b>Повідомлення:</b>\n${message.trim()}`)
  }

  lines.push(`⏰ <i>${new Date().toLocaleString('uk-UA')}</i>`)

  const payloadText = lines.join('\n')

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: payloadText,
        parse_mode: 'HTML'
      })
    })

    const data = await res.json()
    if (!res.ok || !data.ok) {
      console.error('Telegram notification error:', data)
      return {
        success: false,
        error: 'Не вдалося надіслати заявку онлайн. Будь ласка, зателефонуйте нам або напишіть у месенджер.'
      }
    }

    return { success: true }
  } catch (err) {
    console.error('Network error sending lead:', err)
    return {
      success: false,
      error: 'Помилка мережі при надсиланні. Будь ласка, перевірте з\'єднання або зателефонуйте нам.'
    }
  }
}

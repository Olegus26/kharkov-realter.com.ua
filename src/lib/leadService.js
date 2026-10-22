const TELEGRAM_BOT_TOKEN = '8682779916:AAHs83CU6whQibCqugxPf7cWZAcFCeLuv38'
const TELEGRAM_CHAT_ID = '-1004492752360'

export const submitLead = async ({ type = 'consult', name, phone, email = '', message = '', propertyId = null, propertyTitle = null }) => {
  if (!name || !phone) {
    return { success: false, error: "Будь ласка, заповніть обов'язкові поля: ім'я та телефон" }
  }

  const topicLabels = {
    buy: 'Купівля нерухомості',
    rent: 'Оренда житла',
    sell: 'Продаж нерухомості',
    consult: 'Загальна консультація',
    viewing: 'Запис на перегляд об\'єкта',
    vacancy: 'Відгук на вакансію'
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

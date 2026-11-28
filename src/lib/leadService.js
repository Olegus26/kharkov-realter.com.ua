const LEAD_ENDPOINTS = ['/api/lead', '/api/lead.php']

export const submitLead = async ({
  type = 'consult',
  name,
  phone,
  email = '',
  message = '',
  propertyId = null,
  propertyTitle = null,
}) => {
  if (!name || !name.trim() || !phone || !phone.trim()) {
    return { success: false, error: "Будь ласка, заповніть обов'язкові поля: ім'я та телефон" }
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    return { success: false, error: 'Будь ласка, введіть коректний номер телефону (наприклад: +380 50 123 45 67)' }
  }

  const body = JSON.stringify({
    type,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    message: message ? message.trim() : '',
    propertyId: propertyId ? String(propertyId) : '',
    propertyTitle: propertyTitle ? String(propertyTitle) : '',
  })

  let lastServerError = ''

  for (const endpoint of LEAD_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body,
      })

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) continue

      const data = await res.json()
      if (res.ok && data?.ok) {
        return { success: true }
      }

      if (data?.error) {
        lastServerError = data.error
        if (res.status === 400 || res.status === 429) {
          return { success: false, error: data.error }
        }
      }
    } catch {
      // Try next endpoint
    }
  }

  return {
    success: false,
    error:
      lastServerError ||
      'Не вдалося надіслати заявку онлайн. Будь ласка, зателефонуйте нам або напишіть у месенджер.',
  }
}

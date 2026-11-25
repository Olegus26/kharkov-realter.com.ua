export const normalizePhoneDigits = (value = '') => {
  const digits = String(value).replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('380')) {
    return digits.slice(2)
  }
  if (digits.length === 11 && digits.startsWith('80')) {
    return digits.slice(1)
  }
  if (digits.length === 9) {
    return `0${digits}`
  }
  return digits
}

export const parseSearchIntent = (rawQuery = '') => {
  const trimmed = String(rawQuery).trim()
  if (!trimmed) {
    return { type: 'empty', value: '', raw: '' }
  }

  if (/^[+\d\s().-]+$/.test(trimmed)) {
    const digits = trimmed.replace(/\D/g, '')
    if (digits.length >= 9 && digits.length <= 12) {
      return { type: 'phone', value: normalizePhoneDigits(digits), raw: trimmed }
    }
  }

  const tagMatch = trimmed.match(/^(?:#|№|id[:\s#]*)\s*(\d{3,8})$/i)
  if (tagMatch) {
    return { type: 'tag', value: tagMatch[1], raw: trimmed }
  }

  if (/^\d{4,8}$/.test(trimmed)) {
    return { type: 'tag', value: trimmed, raw: trimmed }
  }

  return { type: 'text', value: trimmed, raw: trimmed }
}

export const matchesPropertyTag = (property, tagId) =>
  Boolean(tagId && String(property?.id || '') === String(tagId))

export const matchesPropertyPhone = (property, normalizedPhone) => {
  if (!normalizedPhone || !Array.isArray(property?.agent_phones) || property.agent_phones.length === 0) {
    return false
  }
  const tail9 = normalizedPhone.length >= 9 ? normalizedPhone.slice(-9) : normalizedPhone
  return property.agent_phones.some((phone) => {
    const norm = normalizePhoneDigits(phone)
    return norm === normalizedPhone || (tail9.length === 9 && norm.endsWith(tail9))
  })
}

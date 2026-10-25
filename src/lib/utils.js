import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

export const isIframe = typeof window !== 'undefined' && window.self !== window.top

export const formatPhone = (value) => {
  if (!value) return ''

  let digits = value.replace(/\D/g, '')

  if (digits.startsWith('380')) digits = digits.substring(3)
  else if (digits.startsWith('80')) digits = digits.substring(2)
  else if (digits.startsWith('0')) digits = digits.substring(1)
  else if (digits.startsWith('38')) digits = digits.substring(2)
  else if (digits.startsWith('3')) digits = digits.substring(1)

  digits = digits.substring(0, 9)

  let formatted = '+380'
  if (digits.length > 0) formatted += ` (${digits.substring(0, 2)}`
  if (digits.length >= 3) formatted += `) ${digits.substring(2, 5)}`
  if (digits.length >= 6) formatted += `-${digits.substring(5, 7)}`
  if (digits.length >= 8) formatted += `-${digits.substring(7, 9)}`

  return formatted
}

export const isValidPhone = (value) => {
  if (!value) return false
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 13
}

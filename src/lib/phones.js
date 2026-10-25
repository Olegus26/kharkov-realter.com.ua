import { OFFICES, HOTLINE_PHONE } from '@/data/offices'

export const DIRECTORS = [
  { name: 'Аксєнова', phones: ['+380 (98) 284-33-43', '+380 (95) 775-08-88'] },
  { name: 'Бузинкова', phones: ['+380 (50) 749-85-60', '+380 (67) 571-89-44'] },
  { name: 'Ганшина', phones: ['+380 (50) 135-18-16'] },
  { name: 'Гнитій', phones: ['+380 (99) 924-90-31', '+380 (96) 076-02-99'] },
  { name: 'Гудз', phones: ['+380 (97) 943-07-93', '+380 (97) 016-15-07', '+380 (95) 816-21-63'] },
  { name: 'Іванова', phones: ['+380 (99) 933-89-02'] },
  { name: 'Кабанець', phones: ['+380 (67) 803-52-48', '+380 (50) 505-91-78'] },
  { name: 'Калуцький', phones: ['+380 (67) 714-36-52', '+380 (66) 909-51-04'] },
  { name: 'Кіщенко', phones: ['+380 (73) 056-16-70', '+380 (67) 575-51-09'] },
  { name: 'Коробейник', phones: ['+380 (99) 049-83-91', '+380 (96) 201-02-20'] },
  { name: 'Легенька', phones: ['+380 (67) 713-63-63', '+380 (50) 713-63-63'] },
  { name: 'Майба', phones: ['+380 (50) 949-14-87', '+380 (97) 520-87-50'] },
  { name: 'Малініна', phones: ['+380 (99) 484-46-69', '+380 (67) 113-11-95'] },
  { name: 'Моісеєва', phones: ['+380 (95) 737-22-61', '+380 (93) 396-35-10'] }
]

export const getPhoneLink = (phoneStr) => {
  if (!phoneStr) return 'tel:+380957372261'
  return `tel:${phoneStr.replace(/[^0-9+]/g, '')}`
}

export const getDutyDirectorToday = () => {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const diff = now - startOfYear
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  const index = dayOfYear % DIRECTORS.length
  return DIRECTORS[index] || DIRECTORS[0]
}

export const getPhonesForToday = () => {
  const duty = getDutyDirectorToday()
  if (duty?.phones && duty.phones.length > 0) {
    return duty.phones
  }
  return [HOTLINE_PHONE]
}

export const getAllOffices = () => OFFICES

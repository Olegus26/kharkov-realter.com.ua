import { OFFICES, HOTLINE_PHONE } from '@/data/offices'

export const getPhoneLink = (phoneStr) => {
  if (!phoneStr) return 'tel:+380507136363'
  return `tel:${phoneStr.replace(/[^0-9+]/g, '')}`
}

export const getPhonesForToday = () => {
  const day = new Date().getDate()
  const officeIndex = day % OFFICES.length
  const dutyOffice = OFFICES[officeIndex]

  if (dutyOffice?.phones && dutyOffice.phones.length > 0) {
    return dutyOffice.phones
  }

  return [HOTLINE_PHONE]
}

export const getAllOffices = () => OFFICES

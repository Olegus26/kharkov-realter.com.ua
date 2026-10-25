// Geocoding cache using Nominatim (OpenStreetMap) with fallback coords
const cache = {}

const DISTRICT_COORDS = {
  Центр: [49.9935, 36.2304],
  Салтовка: [50.038, 36.298],
  'Сев.Салтовка': [50.065, 36.32],
  Алексеевка: [49.952, 36.205],
  'Хол.Гора': [49.972, 36.218],
  'Нов.Дома': [50.005, 36.312],
  'П.Поле': [49.968, 36.31],
  ХТЗ: [49.953, 36.345],
  Основа: [49.939, 36.272],
  Немышля: [49.968, 36.34],
  Москалевка: [49.998, 36.218],
  Журавлевка: [50.025, 36.205],
  Одесская: [49.985, 36.198],
  Аэропорт: [49.925, 36.29],
  Роганский: [49.97, 36.39],
  'ЮВ и ЦР': [49.956, 36.27],
  Сортировка: [49.979, 36.18],
  Залютино: [50.01, 36.15],
  Пятихатки: [50.075, 36.26],
  Жуковского: [49.98, 36.26],
  'Конный рынок': [49.996, 36.244],
  Ивановка: [50.052, 36.18],
  default: [49.9935, 36.2304],
}

export const getFallbackCoords = (region, index) => {
  const base = DISTRICT_COORDS[region] || DISTRICT_COORDS.default
  // Spread markers in a golden-ratio spiral so they don't overlap
  const angle = (index * 137.5) % 360
  const r = 0.002 + (index % 6) * 0.0015
  return [
    base[0] + r * Math.cos((angle * Math.PI) / 180),
    base[1] + r * Math.sin((angle * Math.PI) / 180),
  ]
}

export const geocodeAddress = async (address) => {
  if (cache[address]) return cache[address]
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
    const res = await fetch(url, { headers: { 'Accept-Language': 'uk,ru' } })
    const data = await res.json()
    if (data?.length) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      cache[address] = coords
      return coords
    }
  } catch {
    // Return null on network or parser errors
  }
  return null
}
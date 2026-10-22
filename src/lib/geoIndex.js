let geoIndexPromise = null

const normalizeStreet = (name) => {
  if (!name) return ''
  return name.toLowerCase()
    .replace(/(^|\s+)(вул\.|вулиця|пров\.|провулок|просп\.|проспект|пр-т|пер\.|ул\.|улица|шосе|наб\.|набережна|бульвар|бул\.|б-р|майдан|м-н|площа|пл\.|в'їзд|в-д|вїзд|тупик|узв\.|узвіз|пр-д|проїзд|проезд)(\s+|$)/gi, ' ')
    .replace(/[.,]/g, '')
    .trim()
}

const normalizeHouse = (b) => {
  if (!b) return []
  const clean = String(b).trim().toUpperCase()
  const variants = [clean]
  variants.push(clean.replace(/\s+/g, '-'))
  variants.push(clean.replace(/[\s-]+/g, ''))
  variants.push(clean.replace(/-/g, ' '))
  // Cyrillic letter normalization
  variants.push(clean.replace(/А/g, 'А').replace(/Б/g, 'Б').replace(/В/g, 'В'))
  const digits = clean.replace(/[^\d]/g, '')
  if (digits) variants.push(digits)
  return Array.from(new Set(variants))
}

export const getGeoIndex = async () => {
  if (geoIndexPromise) return geoIndexPromise

  geoIndexPromise = (async () => {
    const [streetsModule, housesModule] = await Promise.all([
      import('@/data/streets.json'),
      import('@/data/houses.json')
    ])

    const streets = streetsModule.default || streetsModule
    const houses = housesModule.default || housesModule

    const streetMap = new Map()

    streets.forEach(s => {
      const names = [s.current_name, ...(s.old_names || [])]
      names.forEach(n => {
        const norm = normalizeStreet(n)
        if (!norm) return
        if (!streetMap.has(norm)) streetMap.set(norm, [])
        streetMap.get(norm).push(s)
      })
    })

    const findCoords = (street, building) => {
      if (!street) return null
      const clean = normalizeStreet(street)
      if (!clean) return null

      const candidates = streetMap.get(clean)
      if (!candidates || candidates.length === 0) return null

      const houseVariants = normalizeHouse(building)

      // 1. Exact house match across candidate streets
      for (const s of candidates) {
        const streetHouses = houses[s.street_id]
        if (!streetHouses) continue
        for (const hv of houseVariants) {
          if (streetHouses[hv]) return streetHouses[hv]
        }
      }

      // 2. Base house number match (e.g. '14-А' -> '14')
      for (const s of candidates) {
        const streetHouses = houses[s.street_id]
        if (!streetHouses) continue
        const digits = String(building).replace(/[^\d]/g, '')
        if (digits && streetHouses[digits]) return streetHouses[digits]
      }

      // 3. Fallback to middle of the street from map_bounds
      for (const s of candidates) {
        if (s.map_bounds && s.map_bounds.top_lat && s.map_bounds.bottom_lat) {
          const lat = (s.map_bounds.top_lat + s.map_bounds.bottom_lat) / 2
          const lon = (s.map_bounds.top_lon + s.map_bounds.bottom_lon) / 2
          return [lat, lon]
        }
      }

      return null
    }

    return {
      streets,
      houses,
      streetMap,
      findCoords,
      normalizeStreet
    }
  })()

  return geoIndexPromise
}

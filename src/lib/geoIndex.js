let geoIndexPromise = null

const normalizeStreet = (name) => {
  if (!name) return ''
  return name.toLowerCase().replace(/вул\.|пров\.|просп\.|пр-т|м\.|пер\.|ул\.|проспект/g, '').trim()
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
      const cur = normalizeStreet(s.current_name)
      if (cur) streetMap.set(cur, s.street_id)
      if (s.old_names && Array.isArray(s.old_names)) {
        s.old_names.forEach(old => {
          const normOld = normalizeStreet(old)
          if (normOld) streetMap.set(normOld, s.street_id)
        })
      }
    })

    const findCoords = (street, building) => {
      if (!street || !building) return null
      const clean = normalizeStreet(street)
      if (!clean) return null

      const streetId = streetMap.get(clean)
      if (!streetId) return null

      const streetHouses = houses[streetId]
      if (!streetHouses) return null

      if (streetHouses[building]) return streetHouses[building]

      const digitsOnly = building.replace(/[^\d]/g, '')
      if (digitsOnly && streetHouses[digitsOnly]) return streetHouses[digitsOnly]

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

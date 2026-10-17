const API_BASE = 'https://novostoy.com.ua/api/json'
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP'

const post = async (method, data) => {
  const res = await fetch(`${API_BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ key: API_KEY, data }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  if (json.status === 'false') throw new Error(json.errors?.join(', ') || 'API error')
  return json
}

export const getConfig = () => post('getConfig', ['all'])

export const getObjects = (filters = {}) =>
  post('getObjects', { start_id: 0, limit: 100, ...filters })

// Helper to delay execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PAGE_LIMIT = 100
const MAX_PRICE = 100000000
const PRICE_STEP = 0.01
const MAX_RANGE_RETRIES = 3

// Price bands holding roughly equal numbers of sale objects, so most of them fit into a single request
const SALE_PRICE_EDGES = [
  5500, 7500, 10000, 12000, 13900, 15000, 16000, 17300, 18000, 19000, 20000, 20700, 22000, 23000, 23500,
  24000, 25000, 25500, 26500, 27000, 28000, 28500, 29900, 30000, 31500, 32000, 33000, 34000, 35000, 36000,
  37000, 38000, 39000, 40000, 42000, 43000, 44500, 45000, 46500, 48000, 50000, 52500, 55000, 56000, 58000,
  60000, 62000, 65000, 67500, 71000, 75000, 80000, 85000, 95000, 110000, 120000, 150000, 180000, 350000,
]
const PRICE_EDGES_BY_SELL_TYPE = { '2': SALE_PRICE_EDGES }

const buildPriceRanges = (edges) => {
  const bounds = [0, ...edges, MAX_PRICE]
  return bounds.slice(0, -1).map((min, index) => ({
    min: index === 0 ? min : min + PRICE_STEP,
    max: bounds[index + 1],
  }))
}

// Splits an overfull range at the median price of the returned sample
const splitRange = ({ min, max }, items) => {
  const prices = items.map((item) => Number(item.price)).sort((a, b) => a - b)
  const median = Math.min(Math.max(prices[Math.floor(prices.length / 2)], min), max)
  if (median >= max) return [{ min, max: max - PRICE_STEP }, { min: max, max }]
  return [{ min, max: median }, { min: median + PRICE_STEP, max }]
}

const ROOM_SUBFILTERS = [
  { rooms: '1' }, { rooms: '2' }, { rooms: '3' }, { rooms: '4' }, { rooms: '5' },
  { parent_id: '4' }, { parent_id: '6' }
]

export const getAllObjects = async (filters = {}) => {
  const results = new Map()
  const queue = buildPriceRanges(PRICE_EDGES_BY_SELL_TYPE[filters.sell_type] || SALE_PRICE_EDGES)
  let activeRequests = 0
  const MAX_CONCURRENT = 8
  let resolveAll
  const allDone = new Promise((resolve) => { resolveAll = resolve })

  const checkDone = () => {
    if (queue.length === 0 && activeRequests === 0) {
      resolveAll()
    }
  }

  const processQueue = () => {
    while (queue.length > 0 && activeRequests < MAX_CONCURRENT) {
      const range = queue.shift()
      activeRequests++

      ;(async () => {
        try {
          const payload = {
            limit: PAGE_LIMIT,
            price_from: range.min,
            price_to: range.max,
            ...filters,
            ...(range.extra || {})
          }
          const res = await post('getObjects', payload)

          const items = res.data || []
          const isOverfull = items.length >= PAGE_LIMIT
          if (isOverfull) {
            if (range.min < range.max) {
              queue.push(...splitRange(range, items))
              return
            }
            if (!range.hasSubdivided) {
              queue.push(...ROOM_SUBFILTERS.map((subFilter) => ({
                min: range.min,
                max: range.max,
                extra: subFilter,
                hasSubdivided: true
              })))
              return
            }
          }
          items.forEach((item) => results.set(item.id, item))
        } catch (e) {
          console.error('Error fetching range', range, e)
          const retries = (range.retries || 0) + 1
          if (retries <= MAX_RANGE_RETRIES) {
            range.retries = retries
            queue.push(range)
            await sleep(800)
          }
        } finally {
          activeRequests--
          processQueue()
          checkDone()
        }
      })()
    }
    checkDone()
  }

  processQueue()
  await allDone

  return Array.from(results.values())
}

// sell_type: "1" = Аренда, "2" = Продажа
// parent_id: "2" = Квартиры, "4" = Коммерческая, "6" = Дома
const PARENT_TYPE = { '2': 'apartment', '4': 'commercial', '6': 'house' }

const buildTitle = (obj) => {
  const type = PARENT_TYPE[obj.parent_id] || 'apartment'
  let label = 'Об\'єкт'

  if (type === 'apartment') {
    label = obj.rooms ? `${obj.rooms}-кімн. квартира` : 'Квартира'
  } else if (type === 'house') {
    label = obj.rooms ? `${obj.rooms}-кімн. будинок` : 'Будинок'
  } else if (type === 'commercial') {
    label = obj.rooms ? `${obj.rooms}-кімн. приміщення` : 'Комерційне приміщення'
  }

  const street = obj.street || ''
  const building = obj.building ? `, ${obj.building}` : ''
  const region = obj.region ? ` (${obj.region})` : ''
  return `${label}, ${street}${building}${region}`.replace(/^, /, '')
}

const buildLocation = (obj) => {
  return [obj.region, obj.mregion, obj.street, obj.building].filter(Boolean).join(', ')
}

const buildGeoAddress = (obj) => {
  const parts = []
  if (obj.street) parts.push(obj.street)
  if (obj.building) parts.push(obj.building)
  parts.push('Харків', 'Україна')
  return parts.join(', ')
}

export const mapObject = (obj) => ({
  id: String(obj.id),
  title: buildTitle(obj),
  price: Number(obj.price) || 0,
  location: buildLocation(obj),
  address_full: buildGeoAddress(obj),
  type: PARENT_TYPE[obj.parent_id] || 'apartment',
  deal: obj.sell_type === '1' ? 'rent' : 'sale',
  area: obj.area ? Number(obj.area) : null,
  area_live: obj.area_live ? Number(obj.area_live) : null,
  area_kitchen: obj.area_kitchen ? Number(obj.area_kitchen) : null,
  rooms: obj.rooms ? Number(obj.rooms) : null,
  floor: obj.stage ? Number(obj.stage) : null,
  floors_total: obj.stages ? Number(obj.stages) : null,
  description: obj.info || '',
  image_url: obj.images?.[0] || null,
  images: obj.images || [],
  featured: false,
  new_building: false,
  year_built: obj.building_year ? Number(obj.building_year) : null,
  state: obj.state || null,
  agent_phones: obj.agent_phones || [],
  region: obj.region || '',
  mregion: obj.mregion || '',
  street: obj.street || '',
  building: obj.building || '',
  flat: obj.flat || '',
  source_url: obj.url || null,
  views: Number(obj.views) || 0,
  date_edit: Number(obj.date_edit) || 0,
  eoselia: obj.eoselia === '1' || obj.eoselia === true,
  erecovery: obj.erecovery === '1' || obj.erecovery === true,
  tender: obj.tender === '1' || obj.tender === true,
  deposit: obj.deposit === '1' || obj.deposit === true,
  is_sold: obj.is_sold === '1' || obj.is_sold === true,
  metro: obj.metro || null,
})

// Maps raw API objects and puts the most recently edited ones first (id as a stable tie-breaker)
export const mapObjects = (items = []) =>
  items.map(mapObject).sort((a, b) => b.date_edit - a.date_edit || Number(b.id) - Number(a.id))
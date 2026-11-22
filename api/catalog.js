import zlib from 'zlib'
import { getAllObjects, mapObjects, findObjectById } from '../src/lib/novostoyApi.js'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }
const CACHE_TTL_MS = 5 * 60 * 1000
const catalogCache = new Map()
const objectByIdCache = new Map()

const trimForCatalog = (item) => ({
  id: item.id,
  title: item.title,
  price: item.price,
  location: item.location,
  type: item.type,
  deal: item.deal,
  area: item.area,
  area_live: item.area_live,
  area_kitchen: item.area_kitchen,
  rooms: item.rooms,
  floor: item.floor,
  floors_total: item.floors_total,
  description: item.description,
  image_url: item.image_url,
  images: item.images,
  agent_phones: item.agent_phones,
  featured: item.featured,
  new_building: item.new_building,
  year_built: item.year_built,
  state: item.state,
  region: item.region,
  mregion: item.mregion,
  street: item.street,
  building: item.building,
  source_url: item.source_url,
  views: item.views,
  date_edit: item.date_edit,
  eoselia: item.eoselia,
  erecovery: item.erecovery,
  tender: item.tender,
  deposit: item.deposit,
  is_sold: item.is_sold,
  metro: item.metro,
})

const createCompressedEntry = (payloadObj) => {
  const raw = Buffer.from(JSON.stringify(payloadObj), 'utf8')
  return {
    updatedAt: Date.now(),
    raw,
    gzip: zlib.gzipSync(raw),
    br: zlib.brotliCompressSync(raw),
  }
}

const sendCompressedEntry = (req, res, entry) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')

  const acceptEncoding = String(req.headers['accept-encoding'] || '')
  if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br')
    res.status(200).send(entry.br)
    return
  }

  if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip')
    res.status(200).send(entry.gzip)
    return
  }

  res.status(200).send(entry.raw)
}

const getCachedCatalog = async (deal) => {
  const existing = catalogCache.get(deal)
  if (existing && Date.now() - existing.updatedAt < CACHE_TTL_MS) {
    return existing
  }

  const sellType = SELL_TYPE_BY_DEAL[deal]
  const raw = await getAllObjects(sellType ? { sell_type: sellType } : {})
  const mapped = mapObjects(raw).map(trimForCatalog)
  const now = Date.now()

  mapped.forEach((item) => {
    objectByIdCache.set(String(item.id), { entry: createCompressedEntry(item), updatedAt: now })
  })

  const entry = createCompressedEntry(mapped)
  catalogCache.set(deal, entry)
  return entry
}

const getCachedObjectById = async (id) => {
  const key = String(id)
  const existing = objectByIdCache.get(key)
  if (existing && Date.now() - existing.updatedAt < CACHE_TTL_MS) {
    return existing.entry
  }

  const found = await findObjectById(key)
  if (!found) return null

  const entry = createCompressedEntry(trimForCatalog(found))
  objectByIdCache.set(key, { entry, updatedAt: Date.now() })
  return entry
}

const handler = async (req, res) => {
  const url = new URL(req.url || '/api/catalog', 'https://kharkov-realter-com-ua.vercel.app')
  const idParam = url.searchParams.get('id')

  try {
    if (idParam) {
      const entry = await getCachedObjectById(idParam)
      if (!entry) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      sendCompressedEntry(req, res, entry)
      return
    }

    const dealParam = url.searchParams.get('deal')
    const deal = dealParam === 'rent' ? 'rent' : dealParam === 'all' ? 'all' : 'sale'
    const entry = await getCachedCatalog(deal)
    sendCompressedEntry(req, res, entry)
  } catch (error) {
    res.status(500).json({ error: error?.message || 'Failed to load catalog' })
  }
}

export default handler

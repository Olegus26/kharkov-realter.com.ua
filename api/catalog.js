import zlib from 'zlib'
import { getAllObjects, mapObjects, findObjectById } from '../src/lib/novostoyApi.js'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }

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

const sendCompressedJson = (req, res, payloadObj) => {
  const jsonBuffer = Buffer.from(JSON.stringify(payloadObj), 'utf8')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')

  const acceptEncoding = String(req.headers['accept-encoding'] || '')
  if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br')
    res.status(200).send(zlib.brotliCompressSync(jsonBuffer))
    return
  }

  if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip')
    res.status(200).send(zlib.gzipSync(jsonBuffer))
    return
  }

  res.status(200).send(jsonBuffer)
}

const handler = async (req, res) => {
  const url = new URL(req.url || '/api/catalog', 'https://kharkov-realter-com-ua.vercel.app')
  const idParam = url.searchParams.get('id')

  try {
    if (idParam) {
      const found = await findObjectById(idParam)
      if (!found) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      sendCompressedJson(req, res, trimForCatalog(found))
      return
    }

    const dealParam = url.searchParams.get('deal')
    const deal = dealParam === 'rent' ? 'rent' : dealParam === 'all' ? 'all' : 'sale'
    const sellType = SELL_TYPE_BY_DEAL[deal]

    const raw = await getAllObjects(sellType ? { sell_type: sellType } : {})
    const mapped = mapObjects(raw).map(trimForCatalog)
    sendCompressedJson(req, res, mapped)
  } catch (error) {
    res.status(500).json({ error: error?.message || 'Failed to load catalog' })
  }
}

export default handler

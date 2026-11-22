import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import zlib from 'zlib'
import { getAllObjects, mapObjects, findObjectById } from './src/lib/novostoyApi.js'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }
const CACHE_TTL_MS = 5 * 60 * 1000
const localCatalogCache = new Map()
const localObjectByIdCache = new Map()

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

const getCachedCatalogBuffers = async (deal) => {
  const existing = localCatalogCache.get(deal)
  if (existing && Date.now() - existing.updatedAt < CACHE_TTL_MS) {
    return existing
  }
  const sellType = SELL_TYPE_BY_DEAL[deal]
  const raw = await getAllObjects(sellType ? { sell_type: sellType } : {})
  const mapped = mapObjects(raw).map(trimForCatalog)
  mapped.forEach((item) => {
    localObjectByIdCache.set(String(item.id), { item, updatedAt: Date.now() })
  })
  const rawBuf = Buffer.from(JSON.stringify(mapped), 'utf8')
  const entry = {
    updatedAt: Date.now(),
    raw: rawBuf,
    gzip: zlib.gzipSync(rawBuf),
    br: zlib.brotliCompressSync(rawBuf),
  }
  localCatalogCache.set(deal, entry)
  return entry
}

const getCachedObjectById = async (id) => {
  const key = String(id)
  const existing = localObjectByIdCache.get(key)
  if (existing && Date.now() - existing.updatedAt < CACHE_TTL_MS) {
    return existing.item
  }
  const found = await findObjectById(key)
  if (!found) return null
  const trimmed = trimForCatalog(found)
  localObjectByIdCache.set(key, { item: trimmed, updatedAt: Date.now() })
  return trimmed
}

const createCatalogMiddleware = () => async (req, res, next) => {
  if (!req.url || !req.url.startsWith('/api/catalog')) {
    next()
    return
  }

  const parsedUrl = new URL(req.url, 'http://localhost')
  const idParam = parsedUrl.searchParams.get('id')

  try {
    if (idParam) {
      const obj = await getCachedObjectById(idParam)
      if (!obj) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Not found' }))
        return
      }
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
      res.end(JSON.stringify(obj))
      return
    }

    const dealParam = parsedUrl.searchParams.get('deal')
    const deal = dealParam === 'rent' ? 'rent' : dealParam === 'all' ? 'all' : 'sale'
    const entry = await getCachedCatalogBuffers(deal)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')

    const acceptEncoding = String(req.headers['accept-encoding'] || '')
    if (acceptEncoding.includes('br')) {
      res.setHeader('Content-Encoding', 'br')
      res.end(entry.br)
      return
    }
    if (acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip')
      res.end(entry.gzip)
      return
    }
    res.end(entry.raw)
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err?.message || 'Catalog fetch failed' }))
  }
}

const catalogApiPlugin = () => ({
  name: 'catalog-api-middleware',
  configureServer(server) {
    server.middlewares.use(createCatalogMiddleware())
  },
  configurePreviewServer(server) {
    getCachedCatalogBuffers('sale').catch(() => {})
    server.middlewares.use(createCatalogMiddleware())
  },
})

export default defineConfig({
  logLevel: 'error',
  plugins: [react(), catalogApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'react-vendor'
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
  },
})

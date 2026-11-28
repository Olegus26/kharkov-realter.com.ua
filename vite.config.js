import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import zlib from 'zlib'
import { getAllObjects, mapObjects, findObjectById } from './src/lib/novostoyApi.js'

const SELL_TYPE_BY_DEAL = { sale: '2', rent: '1' }
const CACHE_TTL_MS = 5 * 60 * 1000
const BROTLI_OPTIONS = { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } }
const localCatalogCache = new Map()
const inFlightCatalog = new Map()
const localObjectByIdCache = new Map()

const trimForCatalog = (item) => ({
  id: item.id,
  title: item.title,
  price: item.price,
  location: item.location,
  address_full: item.address_full,
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

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })

const escapeHtml = (val) =>
  String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const getCachedCatalogBuffers = async (deal) => {
  const existing = localCatalogCache.get(deal)
  if (existing && Date.now() - existing.updatedAt < CACHE_TTL_MS) {
    return existing
  }

  const inflight = inFlightCatalog.get(deal)
  if (inflight) return inflight

  const promise = (async () => {
    const sellType = SELL_TYPE_BY_DEAL[deal]
    const raw = await getAllObjects(sellType ? { sell_type: sellType } : {})
    const mapped = mapObjects(raw).map(trimForCatalog)
    const now = Date.now()
    mapped.forEach((item) => {
      localObjectByIdCache.set(String(item.id), { item, updatedAt: now })
    })
    const rawBuf = Buffer.from(JSON.stringify(mapped), 'utf8')
    const entry = {
      updatedAt: now,
      raw: rawBuf,
      gzip: zlib.gzipSync(rawBuf),
      br: zlib.brotliCompressSync(rawBuf, BROTLI_OPTIONS),
    }
    localCatalogCache.set(deal, entry)
    return entry
  })().finally(() => {
    inFlightCatalog.delete(deal)
  })

  inFlightCatalog.set(deal, promise)
  return promise
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

const createApiMiddleware = () => async (req, res, next) => {
  if (!req.url || !req.url.startsWith('/api/')) {
    next()
    return
  }

  const parsedUrl = new URL(req.url, 'http://localhost')

  if (parsedUrl.pathname === '/api/novostoy' || parsedUrl.pathname === '/api/novostoy.php') {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ status: 'false', errors: ['Method not allowed'] }))
      return
    }
    try {
      const payload = await readJsonBody(req)
      const method = String(payload?.method || '')
      if (!['getObjects', 'getConfig'].includes(method)) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'false', errors: ['Unsupported method'] }))
        return
      }
      const upstream = await fetch(`https://novostoy.com.ua/api/json/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: process.env.NOVOSTOY_API_KEY || '', data: payload?.data || {} }),
      })
      const text = await upstream.text()
      res.statusCode = upstream.status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(text)
    } catch (err) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ status: 'false', errors: [err?.message || 'Proxy error'] }))
    }
    return
  }

  if (parsedUrl.pathname === '/api/lead' || parsedUrl.pathname === '/api/lead.php') {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
      return
    }
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN || ''
      const chatId = process.env.TELEGRAM_CHAT_ID || ''
      if (!botToken || !chatId) {
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, error: 'Сервіс заявок тимчасово недоступний' }))
        return
      }
      const payload = await readJsonBody(req)
      const name = String(payload?.name || '').trim()
      const phone = String(payload?.phone || '').trim()
      if (!name || phone.replace(/\D/g, '').length < 10) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, error: "Будь ласка, перевірте ім'я та номер телефону" }))
        return
      }
      const topicLabels = {
        buy: 'Купівля нерухомості',
        rent: 'Оренда житла',
        sell: 'Продаж нерухомості',
        consult: 'Загальна консультація',
        viewing: "Запис на перегляд об'єкта",
        vacancy: 'Відгук на вакансію',
        eoselia_consultation: 'Консультація по програмі «єОселя»',
        evidnovlennya_consultation: 'Консультація по програмі «єВідновлення»',
      }
      const type = String(payload?.type || 'consult').trim()
      const lines = [
        '🏢 <b>Нова заявка з сайту kharkov-realter.com.ua</b>',
        `📌 <b>Тема:</b> ${topicLabels[type] || escapeHtml(type)}`,
        `👤 <b>Ім'я:</b> ${escapeHtml(name)}`,
        `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
      ]
      if (payload?.email) lines.push(`✉️ <b>Email:</b> ${escapeHtml(payload.email)}`)
      if (payload?.propertyId) lines.push(`🔑 <b>ID об'єкта:</b> #${escapeHtml(payload.propertyId)}`)
      if (payload?.propertyTitle) lines.push(`🏠 <b>Об'єкт:</b> ${escapeHtml(payload.propertyTitle)}`)
      if (payload?.message) lines.push(`💬 <b>Повідомлення:</b>\n${escapeHtml(payload.message)}`)
      lines.push(`⏰ <i>${new Date().toLocaleString('uk-UA')}</i>`)

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' }),
      })
      const tgJson = await tgRes.json()
      res.statusCode = tgRes.ok && tgJson?.ok ? 200 : 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(tgRes.ok && tgJson?.ok ? { ok: true } : { ok: false, error: 'Не вдалося надіслати заявку онлайн' }))
    } catch {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Не вдалося надіслати заявку онлайн' }))
    }
    return
  }

  if (parsedUrl.pathname !== '/api/catalog' && parsedUrl.pathname !== '/api/catalog.php') {
    next()
    return
  }

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
    server.middlewares.use(createApiMiddleware())
  },
  configurePreviewServer(server) {
    getCachedCatalogBuffers('sale').catch(() => {})
    server.middlewares.use(createApiMiddleware())
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.NOVOSTOY_API_KEY) process.env.NOVOSTOY_API_KEY = env.NOVOSTOY_API_KEY
  if (env.TELEGRAM_BOT_TOKEN) process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN
  if (env.TELEGRAM_CHAT_ID) process.env.TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID

  return {
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
  }
})

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getFallbackCoords } from '@/lib/geocode'
import { useVisited } from '@/lib/useVisited'
import { getGeoIndex } from '@/lib/geoIndex'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
// @ts-ignore
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const createCustomIcon = (isSelected, isVisited) => {
  const size = isSelected ? 18 : 13
  const bg = isSelected ? '#ff7a00' : isVisited ? '#10b981' : '#60a5fa'
  const border = isSelected ? 'white' : isVisited ? '#a7f3d0' : '#bfdbfe'

  return L.divIcon({
    className: 'custom-dot-marker',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${bg};
      border: 2px solid ${border};
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      transition: all 0.2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const formatPrice = (price, deal) => {
  if (!price) return '—'
  if (deal === 'rent') return `${price.toLocaleString('uk-UA')} грн/міс`
  return `$${price.toLocaleString('uk-UA')}`
}

const MapView = ({ properties = [] }) => {
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [markers, setMarkers] = useState([])
  const [isProcessing, setIsProcessing] = useState(true)
  const { isVisited, markVisited } = useVisited()

  useEffect(() => {
    let isCancelled = false
    setIsProcessing(true)

    const processMarkers = async () => {
      if (!properties.length) {
        if (!isCancelled) {
          setMarkers([])
          setIsProcessing(false)
        }
        return
      }

      const geoIndex = await getGeoIndex()
      if (isCancelled) return

      // Process asynchronously to keep map mounting buttery smooth at 60fps
      setTimeout(() => {
        if (isCancelled) return

        const groups = {}
        let groupIndex = 0

        for (let i = 0; i < properties.length; i++) {
          const p = properties[i]
          const exactCoords = geoIndex.findCoords(p.street, p.building)
          const coords = exactCoords || getFallbackCoords(p.region, groupIndex++)
          const groupKey = exactCoords 
            ? `${coords[0].toFixed(5)},${coords[1].toFixed(5)}` 
            : (p.location || `fallback-${groupIndex}`)

          if (!groups[groupKey]) {
            const title = (p.street && p.building) ? `${p.street}, ${p.building}` : (p.location || "Об'єкти за адресою")
            groups[groupKey] = {
              key: title,
              groupKey,
              properties: [],
              coords,
            }
          }
          groups[groupKey].properties.push(p)
        }

        if (!isCancelled) {
          setMarkers(Object.values(groups))
          setIsProcessing(false)
        }
      }, 30)
    }

    processMarkers()

    return () => {
      isCancelled = true
    }
  }, [properties])

  const getGroupIcon = (count, isSelected, isVisited) => {
    if (count > 1) {
      const bgClass = isSelected ? 'bg-[#ff7a00]' : isVisited ? 'bg-emerald-500' : 'bg-blue-500'
      return L.divIcon({
        html: `<div class="w-8 h-8 ${bgClass} text-white flex items-center justify-center rounded-full font-bold shadow-[0_2px_8px_rgba(0,0,0,0.5)] border-2 border-white text-xs transition-colors">${count}</div>`,
        className: 'custom-group-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })
    }
    return createCustomIcon(isSelected, isVisited)
  }

  const handleMarkerClick = (group) => {
    setSelectedGroup(group)
    group.properties.forEach(p => markVisited(p.id))
  }

  return (
    <div className="w-full h-full min-h-[500px] z-0 relative">
      <MapContainer
        center={[49.9935, 36.2304]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-grayscale"
        />

        {markers.length > 0 && (
          <MarkerClusterGroup 
            chunkedLoading={true}
            chunkInterval={50}
            chunkDelay={30}
            maxClusterRadius={60} 
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={false}
            disableClusteringAtZoom={15}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount()
              return L.divIcon({
                html: `<div class="w-10 h-10 bg-navy text-white flex items-center justify-center rounded-full font-bold shadow-lg border-2 border-white">${count}</div>`,
                className: 'custom-cluster-icon',
                iconSize: [40, 40],
              })
            }}
          >
            {markers.map((group) => {
              const groupVisited = group.properties.every(p => isVisited(p.id))
              return (
                <Marker
                  key={`${group.groupKey}-${groupVisited}`}
                  position={group.coords}
                  icon={getGroupIcon(group.properties.length, selectedGroup?.groupKey === group.groupKey, groupVisited)}
                  eventHandlers={{ 
                    click: () => handleMarkerClick(group)
                  }}
                />
              )
            })}
          </MarkerClusterGroup>
        )}
      </MapContainer>

      {/* Property popup sidebar - rendered via Portal to escape z-index context */}
      {selectedGroup && createPortal(
        <div 
          key={selectedGroup.groupKey}
          className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto z-[60] w-auto sm:w-[340px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left-8 duration-300 rounded-2xl overflow-hidden border border-border/50 max-h-[75vh] h-[480px]" 
        >
          <div className="p-4 flex items-center justify-between border-b border-border bg-white z-10 shrink-0">
            <div className="pr-2 flex-1">
              <h3 className="font-inter font-bold text-sm text-foreground leading-tight line-clamp-1">{selectedGroup.key}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedGroup.properties.length} об'єктів за цією адресою</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedGroup(null)}
              aria-label="Закрити інформаційне вікно"
              className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar snap-y snap-mandatory">
            {selectedGroup.properties.map((p) => (
              <div key={p.id} className="p-4 h-full w-full shrink-0 snap-start snap-always flex flex-col justify-between">
                <div className="mb-3 rounded-xl overflow-hidden shrink-0 relative" style={{ height: '180px' }}>
                  <img
                    src={p.image_url || '/hero-bg.webp'}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = '/hero-bg.webp' }}
                    className="w-full h-full object-cover"
                  />
                  {(p.is_sold || p.deposit) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                      <img
                        src={p.is_sold ? '/stamp-sold.webp' : '/stamp-deposit.webp'}
                        alt={p.is_sold ? 'Продано' : 'Завдаток'}
                        className="w-3/4 h-3/4 object-contain drop-shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="font-inter font-bold text-2xl text-foreground mb-1">
                    {formatPrice(p.price, p.deal)}
                  </p>
                  
                  <p className="font-inter font-medium text-sm text-foreground line-clamp-2 leading-relaxed mb-2.5">
                    {p.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-inter">
                    {p.rooms && <span>{p.rooms} кім.</span>}
                    {p.rooms && <span className="opacity-30">•</span>}
                    {p.area && <span>{p.area} м²</span>}
                    {p.floor && <span className="opacity-30">•</span>}
                    {p.floor && <span>{p.floor}/{p.floors_total} пов.</span>}
                  </div>
                </div>

                <Link
                  to={`/property/${p.id}`}
                  aria-label={`Переглянути оголошення ${p.title}`}
                  tabIndex="0"
                  className="flex items-center justify-center w-full py-3.5 text-white text-sm font-inter font-semibold rounded-xl transition-all duration-200 mt-auto shrink-0 bg-navy hover:bg-navy/90 active:scale-[0.99] shadow-sm"
                >
                  Переглянути
                </Link>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}

      {/* Overlay objects count / status pill */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] px-5 py-2.5 bg-white/95 backdrop-blur rounded-full shadow-lg border border-border/50 text-sm font-inter font-semibold text-navy flex items-center gap-2">
        {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
        <span>{isProcessing ? 'Підготовка міток на карті...' : `${properties.length} об'єктів`}</span>
      </div>
    </div>
  )
}

export default MapView

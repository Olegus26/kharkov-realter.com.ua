import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, ExternalLink } from 'lucide-react'
import { getGeoIndex } from '@/lib/geoIndex'
import { getFallbackCoords } from '@/lib/geocode'

const MapUpdater = ({ coords, zoom }) => {
  const map = useMap()

  useEffect(() => {
    if (!coords) return
    map.setView(coords, zoom)
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 120)
    return () => clearTimeout(timer)
  }, [map, coords, zoom])

  return null
}

const createPropertyPinIcon = () =>
  L.divIcon({
    className: 'property-location-pin',
    html: '<div class="relative flex items-center justify-center w-8 h-8"><span class="absolute inset-0 rounded-full bg-navy/20"></span><span class="relative w-4 h-4 rounded-full bg-navy border-2 border-white shadow-md"></span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

const PropertyLocationMap = ({ property }) => {
  const [locationState, setLocationState] = useState({ coords: null, isExact: false })
  const pinIcon = useMemo(() => createPropertyPinIcon(), [])

  useEffect(() => {
    if (!property) return
    let isCancelled = false

    const resolveCoords = async () => {
      try {
        const geoIndex = await getGeoIndex()
        const exactCoords = geoIndex.findCoords(property.street, property.building)
        if (isCancelled) return

        if (exactCoords) {
          setLocationState({ coords: exactCoords, isExact: true })
          return
        }
      } catch {
        // Fallback below if geo index fails to load
      }

      if (isCancelled) return
      setLocationState({
        coords: getFallbackCoords(property.region, 0),
        isExact: false,
      })
    }

    resolveCoords()

    return () => {
      isCancelled = true
    }
  }, [property])

  if (!property) return null

  const { coords, isExact } = locationState
  const zoom = isExact ? 16 : 14

  const streetPart = property.street
    ? (property.building ? `${property.street}, ${property.building}` : property.street)
    : ''
  const addressText = [property.region, streetPart].filter(Boolean).join(', ') || property.location || 'Харків'
  const googleMapsUrl = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Харків ${addressText}`)}`

  return (
    <section
      aria-label="Розташування об'єкта на карті"
      className="mt-8 border border-border bg-card rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-1" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="font-cormorant text-xl font-bold text-foreground leading-tight">
              Розташування на карті
            </h2>
            <p className="text-xs text-muted-foreground font-inter truncate mt-0.5" title={addressText}>
              {addressText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={0}
            aria-label="Відкрити розташування у Google Maps"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/90 border border-amber-300/80 rounded-full px-3.5 py-1.5 shadow-sm transition-colors font-inter"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="relative h-[240px] sm:h-[280px] w-full z-0">
        {!coords ? (
          <div className="w-full h-full animate-pulse bg-muted/40" />
        ) : (
          <MapContainer
            center={coords}
            zoom={zoom}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
          >
            <MapUpdater coords={coords} zoom={zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords} icon={pinIcon} />
            {!isExact && (
              <Circle
                center={coords}
                radius={350}
                pathOptions={{ color: '#1b2a4a', fillColor: '#3b82f6', fillOpacity: 0.12, weight: 1.5 }}
              />
            )}
          </MapContainer>
        )}
      </div>
    </section>
  )
}

export default PropertyLocationMap

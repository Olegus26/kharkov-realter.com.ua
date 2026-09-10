import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Link } from 'react-router-dom'
import { BedDouble, Maximize2, X, MapPin, Phone } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getFallbackCoords } from '@/lib/geocode'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
// @ts-ignore
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createCustomIcon(isSelected) {
    return L.divIcon({
        className: '',
        html: `<div style="
      width: ${isSelected ? 18 : 13}px; height: ${isSelected ? 18 : 13}px;
      background: hsl(210,70%,${isSelected ? 70 : 55}%);
      border: 2px solid ${isSelected ? 'white' : 'hsl(210,70%,80%)'};
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      transition: all 0.2s;
    "></div>`,
        iconSize: [isSelected ? 18 : 13, isSelected ? 18 : 13],
        iconAnchor: [isSelected ? 9 : 6.5, isSelected ? 9 : 6.5],
    })
}

function formatPrice(p, deal) {
    if (!p) return '—'
    return `$${p.toLocaleString('uk-UA')}${deal === 'rent' ? '/міс' : ''}`
}

function FitBounds({ coords }) {
    const map = useMap()
    const fitted = useRef(false)
    useEffect(() => {
        if (!fitted.current && coords.length > 0) {
            const bounds = L.latLngBounds(coords)
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 })
            fitted.current = true
        }
    }, [coords.length])
    return null
}

const MapView = ({ properties }) => {
    const [selected, setSelected] = useState(null)
    const [markers, setMarkers] = useState([])

    // Instantly map to fallback coordinates since we don't have accurate API coords
    // and client-side bulk geocoding is rate-limited and very slow.
    useEffect(() => {
        if (!properties.length) {
            setMarkers([])
            return
        }
        
        const results = properties.map((p, i) => ({
            property: p,
            coords: getFallbackCoords(p.region, i)
        }))
        setMarkers(results)
    }, [properties])

    const allCoords = markers.map(m => m.coords)

    return (
        <div className="relative w-full h-[calc(100vh-220px)] min-h-[500px] border border-border overflow-hidden rounded-md z-0">
            <MapContainer
                center={[49.9935, 36.2304]}
                zoom={12}
                style={{ width: '100%', height: '100%' }}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="dark-map-tiles"
                />

                {allCoords.length > 0 && <FitBounds coords={allCoords} />}

                {markers.length > 0 && (
                    <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
                        {markers.map(({ property, coords }) => (
                            <Marker
                                key={property.id}
                                position={coords}
                                icon={createCustomIcon(selected?.id === property.id)}
                                eventHandlers={{ click: () => setSelected(property) }}
                            />
                        ))}
                    </MarkerClusterGroup>
                )}
            </MapContainer>


            {/* Property popup */}
            {selected && (
                <div className="absolute bottom-6 left-6 z-[1000] w-80 bg-card border border-gold/40 shadow-2xl overflow-hidden">
                    <button
                        onClick={() => setSelected(null)}
                        className="absolute top-3 right-3 z-10 w-7 h-7 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                    >
                        <X className="w-3.5 h-3.5 text-foreground" />
                    </button>

                    <div className="relative h-44 overflow-hidden">
                        <img
                            src={selected.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'}
                            alt={selected.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                            <p className="font-cormorant text-2xl font-semibold text-white">
                                {formatPrice(selected.price, selected.deal)}
                            </p>
                        </div>
                        <div className="absolute top-3 left-3">
                            <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase font-inter bg-background/80 text-foreground">
                                {selected.deal === 'sale' ? 'Продаж' : 'Оренда'}
                            </span>
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="font-cormorant text-lg font-medium mb-1 line-clamp-1">{selected.title}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="line-clamp-1">{selected.location}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                            {selected.rooms && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{selected.rooms} кімн.</span>}
                            {selected.area && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{selected.area} м²</span>}
                            {selected.floor && <span>{selected.floor}/{selected.floors_total} пов.</span>}
                        </div>

                        {selected.agent_phones?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selected.agent_phones.map(phone => (
                                    <a key={phone} href={`tel:+38${phone}`}
                                        className="flex items-center gap-1 text-xs text-gold hover:text-gold/70 font-inter transition-colors">
                                        <Phone className="w-3 h-3" />+38 {phone}
                                    </a>
                                ))}
                            </div>
                        )}

                        <Link
                            to={`/property/${selected.id}`}
                            className="block w-full py-2.5 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium text-center hover:opacity-90 transition-opacity"
                        >
                            Детальніше
                        </Link>
                    </div>
                </div>
            )}

            <div className="absolute top-4 right-4 z-[1000] px-3 py-1.5 bg-card/90 backdrop-blur border border-border text-xs font-inter text-muted-foreground">
                {properties.length} об'єктів на карті
            </div>
        </div>
    )
}
export default MapView

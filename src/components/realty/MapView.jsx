import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
    const size = isSelected ? 18 : 13;
    const bg = isSelected ? '#ff7a00' : '#60a5fa';
    const border = isSelected ? 'white' : '#bfdbfe';
    
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
        iconAnchor: [size/2, size/2],
    })
}

function formatPrice(p, deal) {
    if (!p) return '—'
    return `$${p.toLocaleString('en-US').replace(/,/g, ' ')}`
}

function FitBounds({ coords }) {
    const map = useMap()
    const fitted = useRef(false)
    useEffect(() => {
        if (!fitted.current && coords.length > 0) {
            const bounds = L.latLngBounds(coords)
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 })
            fitted.current = true
        }
    }, [coords.length, map])
    return null
}

const MapView = ({ properties }) => {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [markers, setMarkers] = useState([])

    // Instantly map to fallback coordinates since we don't have accurate API coords
    // and client-side bulk geocoding is rate-limited and very slow.
    useEffect(() => {
        if (!properties.length) {
            setMarkers([])
            return
        }
        
        const groups = {};
        let groupIndex = 0;
        
        properties.forEach(p => {
            const key = p.location || 'Unknown';
            if (!groups[key]) {
                groups[key] = {
                    key,
                    properties: [],
                    coords: getFallbackCoords(p.region, groupIndex++)
                };
            }
            groups[key].properties.push(p);
        });
        
        setMarkers(Object.values(groups))
    }, [properties])

    const allCoords = markers.map(m => m.coords)

    // Helper to render icon based on count
    const getGroupIcon = (count, isSelected) => {
        if (count > 1) {
            return L.divIcon({
                html: `<div class="w-8 h-8 ${isSelected ? 'bg-[#ff7a00]' : 'bg-blue-500'} text-white flex items-center justify-center rounded-full font-bold shadow-[0_2px_8px_rgba(0,0,0,0.5)] border-2 border-white text-xs transition-colors">${count}</div>`,
                className: 'custom-group-icon',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });
        }
        return createCustomIcon(isSelected);
    }

    return (
        <div className="w-full h-full min-h-[500px] z-0">
            <MapContainer
                center={[49.9935, 36.2304]}
                zoom={13}
                style={{ width: '100%', height: '100%' }}
                zoomControl={true}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors | 3D by OSMBuildings'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles-grayscale"
                />

                {markers.length > 0 && (
                    <MarkerClusterGroup 
                        chunkedLoading 
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
                        {markers.map((group) => (
                            <Marker
                                key={group.key}
                                position={group.coords}
                                icon={getGroupIcon(group.properties.length, selectedGroup?.key === group.key)}
                                eventHandlers={{ click: () => setSelectedGroup(group) }}
                            />
                        ))}
                    </MarkerClusterGroup>
                )}
            </MapContainer>

            {/* Property popup sidebar (like dim.ria) - rendered via Portal to escape z-index context */}
            {selectedGroup && createPortal(
                <div 
                    key={selectedGroup.key}
                    className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto z-[60] w-auto sm:w-[340px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left-8 duration-300 rounded-2xl overflow-hidden border border-border/50" 
                    style={{ height: '480px' }}
                >
                    <div className="p-4 flex items-center justify-between border-b border-border bg-white z-10 shrink-0">
                        <div className="pr-2 flex-1">
                            <h3 className="font-inter font-bold text-sm text-foreground leading-tight line-clamp-1">{selectedGroup.key}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{selectedGroup.properties.length} об'єктів за цією адресою</p>
                        </div>
                        <button
                            onClick={() => setSelectedGroup(null)}
                            className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar snap-y snap-mandatory">
                        {selectedGroup.properties.map((p, index) => (
                            <div key={p.id} className="p-4 h-full w-full shrink-0 snap-start snap-always flex flex-col justify-between">
                                <div className="mb-3 rounded-xl overflow-hidden shrink-0 relative" style={{ height: '180px' }}>
                                    <img
                                        src={p.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'}
                                        alt={p.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
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
                                    className="flex items-center justify-center w-full py-3.5 bg-navy text-white text-sm font-inter font-medium rounded-xl hover:bg-navy-light transition-colors mt-auto shrink-0"
                                >
                                    Дивитися оголошення
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}

            {/* Overlay objects count */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] px-5 py-2.5 bg-white/90 backdrop-blur rounded-full shadow-md text-sm font-inter font-semibold text-navy">
                {properties.length} об'єктів
            </div>
        </div>
    )
}
export default MapView

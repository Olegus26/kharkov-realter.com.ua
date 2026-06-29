// Simple geocoding cache using Nominatim (OpenStreetMap)
const cache = {};

// Fallback coords by Kharkiv district (from API `region` field)
const DISTRICT_COORDS = {
    'Центр': [49.9935, 36.2304],
    'Салтовка': [50.0380, 36.2980],
    'Сев.Салтовка': [50.0650, 36.3200],
    'Алексеевка': [49.9520, 36.2050],
    'Хол.Гора': [49.9720, 36.2180],
    'Нов.Дома': [50.0050, 36.3120],
    'П.Поле': [49.9680, 36.3100],
    'ХТЗ': [49.9530, 36.3450],
    'Основа': [49.9390, 36.2720],
    'Немышля': [49.9680, 36.3400],
    'Москалевка': [49.9980, 36.2180],
    'Журавлевка': [50.0250, 36.2050],
    'Одесская': [49.9850, 36.1980],
    'Аэропорт': [49.9250, 36.2900],
    'Роганский': [49.9700, 36.3900],
    'ЮВ и ЦР': [49.9560, 36.2700],
    'Сортировка': [49.9790, 36.1800],
    'Залютино': [50.0100, 36.1500],
    'Пятихатки': [50.0750, 36.2600],
    'Жуковского': [49.9800, 36.2600],
    'Конный рынок': [49.9960, 36.2440],
    'Ивановка': [50.0520, 36.1800],
    'default': [49.9935, 36.2304],
};

export function getFallbackCoords(region, index) {
    const base = DISTRICT_COORDS[region] || DISTRICT_COORDS.default;
    // Spread markers so they don't overlap
    const angle = (index * 137.5) % 360;
    const r = 0.002 + (index % 6) * 0.0015;
    return [
        base[0] + r * Math.cos((angle * Math.PI) / 180),
        base[1] + r * Math.sin((angle * Math.PI) / 180),
    ];
}

export async function geocodeAddress(address) {
    if (cache[address]) return cache[address];
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'uk,ru' } });
        const data = await res.json();
        if (data?.length) {
            const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            cache[address] = coords;
            return coords;
        }
    } catch (_) { }
    return null;
}
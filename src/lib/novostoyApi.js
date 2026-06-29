const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

const post = async (method, data) => {
    const res = await fetch(`${API_BASE}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    if (json.status === 'false') throw new Error(json.errors?.join(', ') || 'API error');
    return json;
};

export const getConfig = () => post('getConfig', ['all']);

export const getObjects = (filters = {}) =>
    post('getObjects', { start_id: 0, limit: 100, ...filters });

// sell_type: "1" = Аренда, "2" = Продажа
// parent_id: "2" = Квартиры, "4" = Коммерческая, "6" = Дома
const PARENT_TYPE = { '2': 'apartment', '4': 'commercial', '6': 'house' };

export const mapObject = (obj) => ({
    id: String(obj.id),
    // Build a readable title
    title: buildTitle(obj),
    price: Number(obj.price) || 0,
    // Full address for display and geocoding
    location: buildLocation(obj),
    // Short address for geocoding
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
    new_building: obj.building_type === '1',
    year_built: obj.building_year ? Number(obj.building_year) : null,
    agent_phones: obj.agent_phones || [],
    region: obj.region || '',
    mregion: obj.mregion || '',
    street: obj.street || '',
    building: obj.building || '',
    flat: obj.flat || '',
    source_url: obj.url || null,
});

function buildTitle(obj) {
    const rooms = obj.rooms ? `${obj.rooms}-кімн. квартира` : 'Квартира';
    const street = obj.street || '';
    const building = obj.building ? `, ${obj.building}` : '';
    const region = obj.region ? `, ${obj.region}` : '';
    return `${rooms}, ${street}${building}${region}`;
}

function buildLocation(obj) {
    return [obj.region, obj.mregion, obj.street, obj.building].filter(Boolean).join(', ');
}

function buildGeoAddress(obj) {
    // For Nominatim geocoding — precise street+building in Kharkiv
    const parts = [];
    if (obj.street) parts.push(obj.street);
    if (obj.building) parts.push(obj.building);
    parts.push('Харків', 'Україна');
    return parts.join(', ');
}
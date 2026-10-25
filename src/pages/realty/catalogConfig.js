export const CATEGORIES = [
  { value: 'apartment', label: 'Квартири', path: '/flats' },
  { value: 'house', label: 'Будинки', path: '/houses' },
  { value: 'commercial', label: 'Комерція', path: '/realtys' },
]

export const SUBTYPES_BY_CATEGORY = {
  apartment: [
    { value: 'rooms_1', label: '1-кімн. квартира' },
    { value: 'rooms_2', label: '2-кімн. квартира' },
    { value: 'rooms_3', label: '3-кімн. квартира' },
    { value: 'rooms_4', label: '4-кімн. квартира' },
    { value: 'rooms_5+', label: '5 і більше кімнат' },
    { value: 'gostinka', label: 'Гостинка' },
    { value: 'gostinka_su', label: 'Гостинка зі своїм с/в' },
    { value: 'podselenie', label: 'Підселення' },
  ],
  house: [
    { value: 'whole', label: 'Окремий будинок' },
    { value: 'half', label: 'Частина будинку (1/2)' },
    { value: 'third', label: 'Частина будинку (1/3)' },
    { value: 'dacha', label: 'Дача' },
    { value: 'land', label: 'Земельна ділянка' },
  ],
  commercial: [
    { value: 'premises', label: 'Нежитлове приміщення' },
    { value: 'building', label: 'Окрема будівля' },
    { value: 'land_comm', label: 'Ділянка під комерцію' },
    { value: 'garage', label: 'Гараж / паркінг' },
    { value: 'shop', label: 'Магазин / торгова площа' },
    { value: 'office', label: 'Офіс' },
    { value: 'production', label: 'Виробниче приміщення' },
    { value: 'sto', label: 'СТО / автосервіс' },
    { value: 'warehouse', label: 'Склад' },
    { value: 'non_res_complex', label: 'Майновий комплекс' },
    { value: 'cafe', label: 'Кафе / ресторан' },
    { value: 'kiosk', label: 'Кіоск / павільйон' },
  ],
}

export const STATES = [
  { value: '1', label: 'Житловий' },
  { value: '2', label: 'Косметичний ремонт' },
  { value: '3', label: 'Євроремонт' },
  { value: '4', label: 'Капітальний ремонт' },
  { value: '5', label: 'Без ремонту' },
  { value: '6', label: 'Старий' },
  { value: '7', label: 'Недобудова' },
  { value: '8', label: 'Будівельний стан' },
  { value: '9', label: 'Під обробку' },
]

export const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Новіші спочатку' },
  { value: 'price_asc', label: 'Ціна: від дешевших' },
  { value: 'price_desc', label: 'Ціна: від дорожчих' },
  { value: 'area_asc', label: 'Площа: від меншої' },
  { value: 'area_desc', label: 'Площа: від більшої' },
]

const ROOMS_BY_SUBTYPE = { rooms_1: 1, rooms_2: 2, rooms_3: 3, rooms_4: 4 }

// Keyword groups: a property matches when its title/description contains any of the keywords
const KEYWORDS_BY_SUBTYPE = {
  gostinka: ['гостинк', 'малогабарит'],
  podselenie: ['подселен', 'підселен', 'комнат', 'кімнат'],
  half: ['1/2', 'полдома', 'півбудинк', 'часть', 'частин'],
  third: ['1/3', 'треть'],
  dacha: ['дач'],
  land: ['участок', 'ділянк', 'земл'],
  land_comm: ['участок', 'ділянк', 'земл'],
  office: ['офис', 'офіс'],
  shop: ['магазин', 'торгов'],
  warehouse: ['склад'],
  production: ['производ', 'виробниц', 'цех'],
  garage: ['гараж', 'паркинг', 'паркінг', 'машином'],
  cafe: ['кафе', 'ресторан', 'общепит', 'харчуван'],
  kiosk: ['киоск', 'кіоск', 'павильон', 'павільйон'],
  sto: ['сто', 'автосервис', 'автосервіс', 'мойка', 'мийка'],
  building: ['здание', 'будівля', 'комплекс'],
  non_res_complex: ['здание', 'будівля', 'комплекс'],
}

const SEPARATE_BATHROOM_KEYWORDS = ['свой с/у', 'своїм с/в', 'свій с/в', 'санвуз', 'сануз']
const WHOLE_HOUSE_EXCLUDED_KEYWORDS = ['1/2', '1/3', 'часть', 'частин', 'дач']

const includesAny = (text, keywords) => keywords.some((keyword) => text.includes(keyword))

export const checkSubTypeMatch = (property, subType) => {
  if (subType in ROOMS_BY_SUBTYPE) return property.rooms === ROOMS_BY_SUBTYPE[subType]
  if (subType === 'rooms_5+') return property.rooms >= 5
  if (subType === 'premises') return property.type === 'commercial'

  const text = `${property.title || ''} ${property.description || ''}`.toLowerCase()

  if (subType === 'gostinka_su') {
    return includesAny(text, KEYWORDS_BY_SUBTYPE.gostinka) && includesAny(text, SEPARATE_BATHROOM_KEYWORDS)
  }
  if (subType === 'whole') {
    return property.type === 'house' && !includesAny(text, WHOLE_HOUSE_EXCLUDED_KEYWORDS)
  }

  const keywords = KEYWORDS_BY_SUBTYPE[subType]
  return keywords ? includesAny(text, keywords) : true
}

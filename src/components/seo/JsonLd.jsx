const JsonLd = ({ data }) => {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

// Generates ItemList schema capped at the current visible window (max 50) to prevent DOM bloat
export const generateItemListSchema = (items = [], url = 'https://kharkov-realter.com.ua/flats') => {
  const pageItems = items.slice(0, 50)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url,
    numberOfItems: items.length,
    itemListElement: pageItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://kharkov-realter.com.ua/property/${item.id}`,
    })),
  }
}

export const generateRealEstateSchema = (property, url) => {
  if (!property) return null

  const areaPart = property.area ? `${property.area} м²` : ''
  const roomsPart = property.rooms ? `${property.rooms}-кімнатна` : ''
  const typePart = property.type === 'house' ? 'будинок' : property.type === 'commercial' ? 'комерційна нерухомість' : 'квартира'
  const fallbackName = [roomsPart, typePart, areaPart].filter(Boolean).join(' ')

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title || fallbackName,
    description: property.description || fallbackName,
    url,
    image: property.images && property.images.length > 0 ? property.images : 'https://kharkov-realter.com.ua/og-image.jpg',
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.deal === 'rent' ? 'UAH' : 'USD',
      availability: property.is_sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kharkiv',
      addressRegion: 'Kharkiv Oblast',
      addressCountry: 'UA',
      streetAddress: property.street || property.building || 'Харків',
    },
    accommodationCategory: property.type === 'apartment' ? 'Apartment' : property.type === 'house' ? 'House' : 'Commercial',
    floorSize: property.area ? {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'MTK',
    } : undefined,
    numberOfRooms: property.rooms || undefined,
  }
}

export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Харків Ріелтер',
    alternateName: 'Корпорація нерухомості Харків-Ріелтер',
    url: 'https://kharkov-realter.com.ua',
    logo: 'https://kharkov-realter.com.ua/logo.png',
    image: 'https://kharkov-realter.com.ua/og-image.jpg',
    telephone: '+380577320000',
    email: 'info@kharkov-realter.com.ua',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Харків',
      addressRegion: 'Харківська область',
      addressCountry: 'UA',
    },
    priceRange: '$$',
    foundingDate: '1996',
    numberOfEmployees: '100+',
  }
}

export const generateRealEstateAgentSchema = generateLocalBusinessSchema

export const generateBreadcrumbSchema = (crumbs = []) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://kharkov-realter.com.ua${crumb.url}`,
    })),
  }
}

export default JsonLd

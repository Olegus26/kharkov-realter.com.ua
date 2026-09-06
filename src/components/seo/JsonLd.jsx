export default function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Helpers for specific schema types
export const generateItemListSchema = (items, url) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": url,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://kharkov-realter.com.ua/property/${item.id}`
    }))
  };
};

export const generateRealEstateSchema = (property, url) => {
  if (!property) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title || `${property.rooms}-кімнатна квартира, ${property.area} м²`,
    "description": property.description,
    "url": url,
    "image": property.images && property.images.length > 0 ? property.images : "https://kharkov-realter.com.ua/og-image.jpg",
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kharkiv",
      "addressRegion": "Kharkiv Oblast",
      "addressCountry": "UA",
      "streetAddress": property.street || property.building || "Харків"
    },
    "accommodationCategory": property.type === 'apartment' ? "Apartment" : property.type === 'house' ? "House" : "Commercial",
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK" // Square meters
    },
    "numberOfRooms": property.rooms
  };
};

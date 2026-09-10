import { Helmet } from 'react-helmet-async'

const SeoMeta = ({ title, description, url, image, type = 'website' }) => {
  const defaultTitle = "Агентство нерухомості Харків Ріелтер"
  const defaultDescription = "Найбільша база актуальної нерухомості в Харкові. Купити чи орендувати квартиру, будинок, комерційні об'єкти з допомогою професіоналів агентства Харків Ріелтер."
  const defaultImage = "https://kharkov-realter.com.ua/og-image.jpg"
  const defaultUrl = "https://kharkov-realter.com.ua"

  const finalTitle = title ? `${title} | Харків Ріелтер` : defaultTitle
  const finalDescription = description || defaultDescription
  const finalImage = image || defaultImage
  const finalUrl = url ? `${defaultUrl}${url}` : defaultUrl

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  )
}

export default SeoMeta

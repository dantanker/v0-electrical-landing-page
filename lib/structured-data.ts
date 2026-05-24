import {
  FAQS,
  PHONE_NUMBER,
  SERVICE_AREA_CITIES,
  SHOP_ADDRESS,
  SITE_SUBHEADLINE,
  SOCIAL_LINKS,
} from "./constants"
import { SERVICE_AREA_CENTER } from "./service-area-locations"
import {
  getOgImagePath,
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "./site-metadata"

function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`
}

function isProfileUrl(href: string): boolean {
  try {
    const url = new URL(href)
    return url.pathname.length > 1 || url.search.length > 0
  } catch {
    return false
  }
}

export function buildStructuredDataGraph() {
  const siteUrl = getSiteUrl()
  const ogImageUrl = absoluteUrl(getOgImagePath())

  const electrician = {
    "@type": "Electrician",
    "@id": `${siteUrl}/#electrician`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    telephone: PHONE_NUMBER,
    image: ogImageUrl,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SHOP_ADDRESS.street,
      addressLocality: SHOP_ADDRESS.city,
      addressRegion: SHOP_ADDRESS.state,
      postalCode: SHOP_ADDRESS.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SERVICE_AREA_CENTER.lat,
      longitude: SERVICE_AREA_CENTER.lng,
    },
    areaServed: SERVICE_AREA_CITIES.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "State",
        name: "Illinois",
      },
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "07:00",
        closes: "21:00",
      },
    ],
    sameAs: SOCIAL_LINKS.map((link) => link.href).filter(isProfileUrl),
  }

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    description: SITE_SUBHEADLINE,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#electrician` },
  }

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return {
    "@context": "https://schema.org",
    "@graph": [electrician, website, faqPage],
  }
}

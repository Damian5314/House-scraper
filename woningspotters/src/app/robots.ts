import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/debug/'],
    },
    sitemap: 'https://woningspotter.nl/sitemap.xml',
  }
}

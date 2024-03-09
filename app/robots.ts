import { type MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL!)

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
      },
    ],
    sitemap: [
        new URL("/sitemap.xml", BASE_URL),
        new URL("/pages/sitemap.xml", BASE_URL),
        new URL("/articles/sitemap.xml", BASE_URL),
    ].map(_ => _.toString()),
    host: process.env.NEXT_PUBLIC_SITE_URL,
  }
}
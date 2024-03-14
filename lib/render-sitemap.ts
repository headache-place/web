import { type MetadataRoute } from "next"
import { format } from "date-fns"

function toXmlResponse(content: string, headers = {}) {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
      ...headers,
    },
  })
}

export function getServerSideSitemapIndex(
  locations: MetadataRoute.Sitemap,
  headers = {}
) {
  const contents = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...locations
      .map((location) =>
        [
          "<url>",
          `<loc>${location.url}</loc>`,
          location.changeFrequency &&
            `<changefreq>${location.changeFrequency}</changefreq>`,
          location.lastModified &&
            `<lastmod>${format(location.lastModified, "yyyy-MM-dd'T'HH:mm:ss'Z'")}</lastmod>`,
          location.priority && `<priority>${location.priority}</priority>`,
          "</url>",
        ].filter((item) => item !== undefined)
      )
      .flat(),
    "</urlset>",
  ].join("\n")

  // Return response
  return toXmlResponse(contents, headers)
}

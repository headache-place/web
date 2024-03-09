import { type MetadataRoute } from "next"
import { allPages } from "contentlayer/generated"
import { parseISO } from "date-fns"

const BASE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "")

export default function sitemap(): MetadataRoute.Sitemap {
  const changeFrequency: "daily" = "daily"
  return [
    ...allPages.map((page) => ({
      changeFrequency,
      lastModified: parseISO(page.updatedAt),
      priority: 1,
      url: new URL(page.slugAsParams, BASE_URL).toString(),
    })),
  ]
}

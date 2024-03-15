import { allPages } from "contentlayer/generated"
import { parseISO } from "date-fns"

import { getServerSideSitemapIndex } from "@/lib/render-sitemap"
import { INDEXNOW_ENDPOINTS, submitMultipleUrls } from "@/lib/update-indexnow"

export const revalidate = false
export const fetchCache = "force-cache"
export const dynamic = "force-dynamic"

const BASE_URL = new URL("/", process.env.NEXT_PUBLIC_SITE_URL)

export async function GET(_: Request) {
  const changeFrequency: "weekly" = "weekly"
  const priority = 0.7

  const pages = allPages.map((page) => ({
    changeFrequency,
    lastModified: parseISO(page.updatedAt),
    priority,
    url: new URL(`/pages/${page.slugAsParams}`, BASE_URL.toString()).toString(),
  }))

  await Promise.all(
    INDEXNOW_ENDPOINTS.map((endpoint) =>
      submitMultipleUrls({
        apiEndpoint: endpoint,
        apiKey: process.env.INDEXNOW_KEY!,
        newPages: pages.map((page) => page.url),
        siteHost: BASE_URL,
      })
    )
  )

  return getServerSideSitemapIndex(
    [
      {
        url: BASE_URL.toString(),
        changeFrequency,
        priority,
      },
      ...pages,
    ],
    {
      "Cache-Control": "max-age=60",
      "CDN-Cache-Control": "max-age=600",
      "Vercel-CDN-Cache-Control": "max-age=3600",
    }
  )
}

import { allPages } from "contentlayer/generated"
import { differenceInDays, parseISO } from "date-fns"

import { getServerSideSitemapIndex } from "@/lib/render-sitemap"
import { INDEXNOW_ENDPOINTS, submitMultipleUrls } from "@/lib/update-indexnow"

export const revalidate = false
export const fetchCache = "force-cache"

const BASE_URL = new URL("/", process.env.NEXT_PUBLIC_SITE_URL)

export async function GET(_: Request) {
  const changeFrequency: "weekly" = "weekly"
  const priority = 1

  const pages = allPages.map((page) => ({
    changeFrequency,
    lastModified: parseISO(page.updatedAt),
    priority,
    url: new URL(`/pages/${page.slugAsParams}`, BASE_URL.toString()).toString(),
  }))

  const newPages = pages.filter(
    (page) => differenceInDays(new Date(), page.lastModified) > 1
  )

  if (newPages.length !== 0) {
    await Promise.all(
      INDEXNOW_ENDPOINTS.map((endpoint) =>
        submitMultipleUrls({
          apiEndpoint: endpoint,
          apiKey: process.env.INDEXNOW_KEY!,
          newPages: newPages.map((page) => page.url),
          siteHost: BASE_URL,
        })
      )
    )
  }

  return getServerSideSitemapIndex([
    {
      url: BASE_URL.toString(),
      changeFrequency,
      priority,
    },
    ...pages,
  ])
}

import {
  listArticlesByMenuIdAsync,
  type IArticleInfo,
} from "@/lib/naver-cafe/list-articles"
import { listMenusAsync } from "@/lib/naver-cafe/list-menus"
import { getServerSideSitemapIndex } from "@/lib/render-sitemap"
import { INDEXNOW_ENDPOINTS, submitMultipleUrls } from "@/lib/update-indexnow"

const BASE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "")

interface IArticleInfoResult {
  articleId: number
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
  priority?: number
}

function calculatePriority(info: IArticleInfo) {
  // 비공개 게시물은 low-priority
  if (!info.openArticle) {
    return 0.1
  }

  // 공지일 때 최대 priority
  return !info.noticeType ? 0.7 : 1.0
}

async function getArticlesByMenuId(
  cafeId: number,
  menuId: number
): Promise<IArticleInfoResult[]> {
  let params = {
    cafeId,
    menuId,
    page: 1,
    perPage: 50,
  }

  const items: IArticleInfoResult[] = []
  while (true) {
    const { result } = await listArticlesByMenuIdAsync(params)
    if (!result) {
      break
    }

    const { articleList, hasNext } = result
    items.push(
      ...articleList.map(
        (info) =>
          ({
            articleId: info.articleId,
            changeFrequency: "hourly",
            priority: calculatePriority(info),
            url: new URL(`/articles/${info.articleId}`, BASE_URL).toString(),
          }) satisfies IArticleInfoResult
      )
    )

    if (!hasNext) {
      break
    }

    params = {
      ...params,
      page: params.page + 1,
    }
  }

  return items
}

export const revalidate = 3600
export const fetchCache = "auto"
export const dynamic = "force-dynamic"

export async function GET(_: Request) {
  const cafeId = Number.parseInt(process.env.NAVER_CAFE_ID!)
  const { menus } = await listMenusAsync(cafeId)

  if (!menus) {
    return getServerSideSitemapIndex([])
  }

  const locations = (
    await Promise.all(
      menus.map((menu) => getArticlesByMenuId(cafeId, menu.menuId))
    )
  )
    .flat()
    .sort((x, y) => x.articleId - y.articleId)
    .map(({ changeFrequency, priority, url }) => ({
      changeFrequency,
      priority,
      url,
    }))

  await Promise.all(
    INDEXNOW_ENDPOINTS.map((endpoint) =>
      submitMultipleUrls({
        apiEndpoint: endpoint,
        apiKey: process.env.INDEXNOW_KEY!,
        newPages: locations.map((location) => location.url),
        siteHost: BASE_URL,
      })
    )
  )

  return getServerSideSitemapIndex(locations, {
    "Cache-Control": "max-age=60",
    "CDN-Cache-Control": "max-age=600",
    "Vercel-CDN-Cache-Control": "max-age=3600",
  })
}

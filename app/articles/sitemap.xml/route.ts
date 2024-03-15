import { type Redis } from "@upstash/redis"

import {
  listArticlesByMenuIdAsync,
  type IArticleInfo,
} from "@/lib/naver-cafe/list-articles"
import { listMenusAsync } from "@/lib/naver-cafe/list-menus"
import { getRedisClient } from "@/lib/redis"
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
  redis: Redis,
  cafeId: number,
  menuId: number
): Promise<IArticleInfoResult[]> {
  let params = {
    cafeId,
    menuId,
    page: 1,
    perPage: 50,
    queryType: "lastArticle",
  }

  const pageKeyName = `listArticlesByMenuId:${menuId}:${params.queryType}:${params.page}-${params.perPage}`
  const keyName = `getArticlesByMenuId:${params.menuId}`

  const items: IArticleInfoResult[] = []

  while (true) {
    // 캐시가 있어도 첫 페이지는 가져온다.
    const { result } = await listArticlesByMenuIdAsync(params)
    if (!result) {
      break
    }

    const { articleList, hasNext } = result
    if (params.page === 1) {
      const cachedArticleIds = new Set(await redis.get<number[]>(pageKeyName))
      const targetArticleIds = new Set(
        articleList.map((article) => article.articleId).toSorted()
      )

      const sameResult =
        cachedArticleIds.size !== 0 &&
        cachedArticleIds.isSupersetOf(targetArticleIds) &&
        cachedArticleIds.isSupersetOf(targetArticleIds)

      // 결과가 같으면 Redis에 이미 결과가 있는지 체크한 다음, 그대로 반환.
      if (sameResult && (await redis.exists(keyName))) {
        items.push(...((await redis.get<IArticleInfoResult[]>(keyName)) ?? []))
        return items
      }

      await redis.set(pageKeyName, Array.from(targetArticleIds), {
        ex: revalidate,
      })
    }

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

  await redis.set(keyName, items, { ex: revalidate })
  return items
}

// cache는 4시간으로 처리, Redis도 같이 사용함.
export const revalidate = 60 * 60 * 4
export const fetchCache = "auto"
export const dynamic = "force-dynamic"

export async function GET(_: Request) {
  const cafeId = Number.parseInt(process.env.NAVER_CAFE_ID!)
  const { menus } = await listMenusAsync(cafeId)

  if (!menus) {
    return getServerSideSitemapIndex([])
  }

  const redis = getRedisClient(
    process.env.UPSTASH_REDIS_REST_URL!,
    process.env.UPSTASH_REDIS_REST_TOKEN!
  )

  const locations = (
    await Promise.all(
      menus.map((menu) => getArticlesByMenuId(redis, cafeId, menu.menuId))
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

import { type MetadataRoute } from "next"

import {
  listArticlesByMenuId,
  type IArticleInfo,
} from "@/lib/naver-cafe/list-articles"
import { listMenus } from "@/lib/naver-cafe/list-menus"

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
    const { result } = await listArticlesByMenuId(params)
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cafeId = Number.parseInt(process.env.NAVER_CAFE_ID!)
  const { menus } = await listMenus(cafeId)

  if (!menus) {
    return []
  }

  return (
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
}

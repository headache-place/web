export interface IArticleListQuery {
  page?: number
  perPage?: number
  queryType?: string
}

export interface IArticleInfo {
  // productSale 생략함.
  articleId: number
  attachCalendar: boolean
  attachFile: boolean
  attachGpx: boolean
  attachImage: boolean
  attachLink: boolean
  attachMap: boolean
  attachMovie: boolean
  attachMusic: boolean
  attachPoll: boolean
  blindArticle: boolean
  blogScrap: boolean
  boardType: string
  cafeId: number
  commentCount: number
  cost: number
  delParent: boolean
  enableComment: boolean
  escrow: boolean
  formattedCost: string
  hasNewComment: boolean
  likeItCount: number
  marketArticle: boolean
  memberKey: string
  memberLevel: number
  memberLevelIconId: number
  menuId: number
  menuName: string
  menuType: string
  newArticle: boolean
  noticeType: string
  onSale: boolean
  openArticle: boolean
  popular: boolean
  profileImage: string
  readCount: number
  refArticleCount: number
  refArticleId: number
  replyArticle: boolean
  replyListOrder: string
  restrictMenu: boolean
  showNoticeDelete: boolean
  subject: string
  useSafetyPayment: boolean
  writeDateTimestamp: number
  writerNickname: string
}

// 네이버 게시물 목록 조회
export async function listArticlesByMenuIdAsync({
  cafeId,
  menuId,
  page,
  perPage,
  queryType = "lastArticle",
}: {
  cafeId: number
  menuId: number
  page: number
  perPage: number
  queryType?: string
}) {
  const base = "https://apis.naver.com/cafe-web/cafe2/ArticleListV2dot1.json"
  const params = new URLSearchParams({
    "search.clubid": cafeId.toString(),
    "search.menuid": menuId.toString(),
    queryType: queryType,
    page: page.toString(),
    perPage: perPage.toString(),
    ad: "false",
  })

  const response = await fetch(`${base}?${params}`, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
    },
    next: {
      revalidate: 30,
      tags: [
        "listArticlesByMenuId",
        `listArticlesByMenuId:${menuId}:${page}-${perPage}:${queryType}`,
      ],
    },
  })

  if (!response.ok) {
    return { success: false }
  }

  const body = await response.json()
  if (!body?.message?.result || !body?.message?.result?.articleList) {
    return { success: false }
  }

  const hasNext: boolean = body.message.result.hasNext
  const articleList: IArticleInfo[] = body.message.result.articleList

  return {
    success: true,
    result: {
      articleList,
      hasNext,
    },
  }
}

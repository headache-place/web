interface IImage {
  url: string
}

export interface IArticle {
  result: {
    cafeId: number
    articleId: number

    article: {
      id: number

      menu: {
        id: number
        name: string
      }

      subject: string

      writer: {
        id: string
        memberKey: string
        baMemberKey: string
        nick: string
        image: IImage
      }

      writeDate: number
      contentHtml: string
    }

    cafe: {
      id: number
      name: string
      pcCafeName: string
      url: string
      image: IImage
      introduction: string
      memberCount: number
    }

    tags: string[]
  }
}

// 전체 공개인 네이버 카페 게시글일 경우 API로 바로 가져올 수 있음.
export async function fetchArticleAsync({
  articleId,
  cafeId,
}: {
  articleId: number
  cafeId: number
}) {
  const base = "https://apis.naver.com/cafe-web/cafe-articleapi/v2.1"
  const params = new URLSearchParams({
    useCafeId: "true",
    requestedFrom: "A",
  })

  const response = await fetch(
    new URL(`${base}/cafes/${cafeId}/articles/${articleId}?${params}`),
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        Referer: `https://cafe.naver.com/ca-fe/cafes/${cafeId}/articles/${articleId}`,
        "X-Cafe-Product": "pc",
      },
      next: {
        revalidate: 60 * 60,
      },
    }
  )

  if (!response.ok) {
    return null
  }

  return (await response.json()) as IArticle
}

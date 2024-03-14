import "../../smart-editor.desktop.css"

import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { addHours, format } from "date-fns"
import { convert } from "html-to-text"

import { fetchArticleAsync } from "@/lib/naver-cafe/fetch-article"
import { RedirectExceptBot } from "@/components/redirect"
import { SmartEditorEscaper } from "@/components/smart-editor-escaper"

interface TArticleProps {
  params: {
    articleId: number
  }
}

async function fetchArticleMetadata(articleId: number) {
  if (!process.env.NAVER_CAFE_ID) return undefined

  const response = await fetchArticleAsync({
    cafeId: Number.parseInt(process.env.NAVER_CAFE_ID),
    articleId,
  })

  if (!response) return undefined

  // UTC to KST
  const createdAt = addHours(new Date(response.result.article.writeDate), 9)
  // HTML to Human Readable Text
  const description = convert(response.result.article.contentHtml)
    .split("\n")
    .join(" ")
    .slice(0, 150)

  return {
    title: response.result.article.subject,
    description,
    html: response.result.article.contentHtml,
    keywords: response.result.tags,
    author: {
      id: response.result.article.writer.id,
      nick: response.result.article.writer.nick,
    },
    createdAt,
  }
}

export async function generateMetadata({
  params,
}: TArticleProps): Promise<Metadata> {
  const siteName = "두통과 함께하는 사람들"

  const page = await fetchArticleMetadata(params.articleId)

  // 메타 데이터를 가져올 수 없으면, 검색 엔진에 남아선 안 됨.
  if (!page) {
    return {
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    }
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    creator: siteName,
    authors: [{ name: page.author.nick }],
    openGraph: {
      description: page.description,
      locale: "ko_KR",
      siteName: siteName,
      title: page.title,
      type: "article",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        nocache: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function Article({
  params: { articleId },
}: TArticleProps) {
  const url = `https://cafe.naver.com/${process.env.NAVER_CAFE_URL}/${articleId}`
  const ignoreByCookie = cookies().has("AutoRedirect")

  const page = await fetchArticleMetadata(articleId)
  if (!page) {
    return redirect(url)
  }

  return (
    <>
      <article className="mx-4">
        <header>
          <h1 className="mb-2 text-4xl font-extrabold text-foreground">
            {page.title}
          </h1>
          <p className="mb-3 mt-0 text-xl text-foreground">
            <b>작성자:</b> {page.author.nick}
          </p>
          <p className="mb-3 mt-0 text-sm text-foreground">
            <b>작성일:</b>{" "}
            {format(new Date(page.createdAt), "yyyy년 MM월 dd일")}
          </p>
        </header>
        <hr className="my-6" />
        <SmartEditorEscaper html={page.html} />
      </article>
      <Redirect
        url={url}
        ignoreParamKey="noredirect"
        checkBotOrHeadless={true}
        forceIgnore={ignoreByCookie}
      />
    </>
  )
}

import { notFound } from "next/navigation"
import { allPages } from "contentlayer/generated"
import { format, isSameDay, parseISO } from "date-fns"

import { Mdx } from "@/components/mdx-components"

interface TPageProps {
  params: {
    slug: string[]
  }
}

async function getPageFromParams(params: TPageProps["params"]) {
  return allPages.find((page) => page.slugAsParams === params?.slug?.join("/"))
}

export async function generateMetadata({ params }: TPageProps) {
  const defaultTitle = "두통과 함께하는 사람들"
  const defaultDescription =
    "두통과 함께하는 사람들은 두통 환자와 보호자 등 두통에 관련된 다양한 사람들이 모일 수 있는 환자 모임입니다."
  const defaultKeywords = [
    "두통",
    "편두통",
    "긴장형 두통",
    "군발두통",
    "만성 두통",
    "환자 커뮤니티",
    "환자 모임",
  ]
  const page = await getPageFromParams(params)

  // 페이지 정보를 가져올 수 없으면, 검색 엔진에 남아선 안 됨.
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
    title: page.title ?? defaultTitle,
    description: (page.description ?? defaultDescription).slice(0, 150),
    keywords: [new Set(...defaultKeywords, ...page.keywords)],
    creator: defaultTitle,
    openGraph: {
      description: (page.description ?? defaultDescription).slice(0, 150),
      locale: "ko_KR",
      siteName: defaultTitle,
      title: page.title ?? defaultTitle,
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

export async function generateStaticParams(): Promise<TPageProps["params"][]> {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }))
}

export default async function Page({ params }: TPageProps) {
  const page = await getPageFromParams(params)

  if (!page) {
    notFound()
  }

  // TODO: i18n and refactor it (240226)
  const createdAt = parseISO(page.createdAt)
  const updatedAt = parseISO(page.updatedAt)
  const formattedDate = isSameDay(createdAt, updatedAt)
    ? `${format(createdAt, "yyyy년 MM월 dd일")} 작성`
    : `${format(updatedAt, "yyyy년 MM월 dd일")} 업데이트, ${format(
        createdAt,
        "yyyy년 MM월 dd일"
      )} 작성`

  return (
    <article className="prose mx-4 dark:prose-invert">
      <header>
        <h1 className="mb-2">{page.title}</h1>
        {page.description && <p className="mb-6 mt-0">{page.description}</p>}
        <p className="mb-3 mt-0">{formattedDate}</p>
      </header>
      <hr className="my-6" />
      <Mdx code={page.body.code} />
    </article>
  )
}

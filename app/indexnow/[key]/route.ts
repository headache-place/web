import { notFound } from "next/navigation"

interface IParameterInfo {
  params: { key: string }
}

export const revalidate = false
export async function GET(_: Request, { params }: IParameterInfo) {
  const key = process.env.INDEXNOW_KEY!

  if (params.key !== `${key}.txt`) {
    notFound()
  }

  // 한번 저장된 결과는 계속 Cache되어도 됨.
  return new Response(process.env.INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "max-age=31536000",
      "CDN-Cache-Control": "max-age=31536000",
      "Vercel-CDN-Cache-Control": "max-age=31536000",
    },
  })
}

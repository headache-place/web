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

  return new Response(process.env.INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}

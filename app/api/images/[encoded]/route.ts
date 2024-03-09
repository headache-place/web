export const revalidate = false
export const fetchCache = "force-cache"

interface IParameterInfo {
  params: { encoded: string }
}

export async function GET(_: Request, { params: { encoded } }: IParameterInfo) {
  const originUrl = atob(encoded)

  const response = await fetch(originUrl)

  const clonedResponse = response.clone()
  if (clonedResponse.headers.has("Cache-Control")) {
    return clonedResponse
  }

  clonedResponse.headers.append("Cache-Control", "max-age=31536000")
  clonedResponse.headers.append("CDN-Cache-Control", "max-age=31536000")
  clonedResponse.headers.append("Vercel-CDN-Cache-Control", "max-age=31536000")
  return clonedResponse
}

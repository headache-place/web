export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org",
  "https://www.bing.com",
  "https://searchadvisor.naver.com",
]

export async function submitSingleUrl({
  apiEndpoint,
  apiKey,
  newPage,
  siteHost,
  revalidate = 60 * 60 * 4,
}: {
  apiEndpoint: string
  apiKey: string
  newPage: string
  siteHost: URL
  revalidate?: false | number
}) {
  const params = new URLSearchParams({
    url: newPage,
    key: apiKey,
    keyLocation: new URL(`/indexnow.txt`, siteHost).toString(),
  })
  const url = new URL(`/indexnow?${params.toString()}`, apiEndpoint)
  const response = await fetch(url, {
    method: "GET",
    next: {
      revalidate,
    },
  })

  if (!response.ok) {
    console.log(
      url.toString(),
      response.status,
      response.headers,
      await response.text()
    )
  }
}

export async function submitMultipleUrls({
  apiEndpoint,
  apiKey,
  newPages,
  siteHost,
  revalidate = 60 * 60 * 4,
}: {
  apiEndpoint: string
  apiKey: string
  newPages: string[]
  siteHost: URL
  revalidate?: false | number
}) {
  const url = new URL(`/indexnow`, apiEndpoint)
  const body = JSON.stringify({
    host: new URL(siteHost).hostname,
    key: apiKey,
    keyLocation: new URL(`/indexnow.txt`, siteHost).toString(),
    urlList: newPages,
  })
  const response = await fetch(url, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    next: {
      revalidate,
    },
  })

  if (!response.ok) {
    console.log(
      url.toString(),
      body,
      response.status,
      response.headers,
      await response.text()
    )
  }
}

import { type MetadataRoute } from "next"

const BASE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "")

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", BASE_URL).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/pages", BASE_URL).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/articles", BASE_URL).toString(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]
}

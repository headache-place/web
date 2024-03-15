import { Redis } from "@upstash/redis"

let redis: Redis | null = null

export function getRedisClient(url: string, token: string) {
  if (redis !== null) return redis
  redis = new Redis({ url, token })
  return redis
}

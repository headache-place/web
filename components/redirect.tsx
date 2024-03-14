"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { isbot } from "isbot"

import { isHeadless } from "@/lib/detect-headless"

export function Redirect({
  delay = 0,
  forceIgnore = false,
  checkBotOrHeadless = false,
  ignoreParamKey,
  url,
}: {
  delay?: number
  forceIgnore?: boolean
  checkBotOrHeadless?: boolean
  ignoreParamKey?: string
  url: string
}) {
  const params = useSearchParams()

  useEffect(() => {
    const isBotOrHeadless =
      !checkBotOrHeadless || (!isbot(navigator.userAgent) && !isHeadless())
    const ignoreRedirect =
      !ignoreParamKey || (ignoreParamKey && params.get(ignoreParamKey))

    if (forceIgnore || (isBotOrHeadless && !ignoreRedirect)) {
      setTimeout(() => {
        location.href = url
      }, delay)
    }
  }, [checkBotOrHeadless, delay, forceIgnore, ignoreParamKey, params, url])

  return <></>
}

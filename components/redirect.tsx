"use client"

import { useEffect } from "react"
import { isbot } from "isbot"

import { isHeadless } from "@/lib/detect-headless"

export function Redirect({ delay = 0, url }: { delay?: number; url: string }) {
  useEffect(() => {
    setTimeout(() => {
      location.href = url
    }, delay)
  }, [delay, url])

  return <></>
}

export function RedirectExceptBot({
  delay = 0,
  url,
}: {
  delay?: number
  url: string
}) {
  useEffect(() => {
    // NOTE: Bot and Headless Detection in Client-level JavaScript
    if (!isbot(navigator.userAgent) && !isHeadless()) {
      setTimeout(() => {
        location.href = url
      }, delay)
    }
  }, [delay, url])

  return <></>
}

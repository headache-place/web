"use client"

import { useEffect } from "react"
import { isbot } from "isbot"

export function Redirect({ delay = 0, url }: { delay?: number; url: string }) {
  useEffect(() => {
    // NOTE: Bot Detection in Client-level JavaScript
    if (!isbot(navigator.userAgent)) {
      setTimeout(() => {
        location.href = url
      }, delay)
    }
  }, [delay, url])

  return <></>
}

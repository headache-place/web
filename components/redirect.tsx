"use client"

import { useEffect } from "react"

export function Redirect({ delay = 0, url }: { delay?: number; url: string }) {
  useEffect(() => {
    setTimeout(() => {
      location.href = url
    }, delay)
  }, [delay, url])

  return <></>
}

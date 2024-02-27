import { Redirect } from "@/components/redirect"

export default function Home() {
  return (
    <Redirect
      url={`https://cafe.naver.com/${process.env.NEXT_NAVER_CAFE_URL}`}
    />
  )
}

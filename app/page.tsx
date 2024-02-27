import { Redirect } from "@/components/redirect"

export default function Home() {
  return (
    <Redirect url={`https://cafe.naver.com/${process.env.NAVER_CAFE_URL}`} />
  )
}

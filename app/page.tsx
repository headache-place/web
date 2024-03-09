export default function Home() {
  const className = [
    "mx-4",
    "select-none",
    "rounded-lg",
    "border",
    "border-foreground",
    "px-6",
    "py-3",
    "text-center",
    "align-middle",
    "text-lg",
    "font-bold",
    "text-foreground",
    "transition-all",
    "hover:opacity-75",
    "focus:ring",
    "focus:ring-foreground",
    "active:opacity-[0.85]",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "disabled:shadow-none",
  ].join(" ")

  const cafeUrl = `https://cafe.naver.com/${process.env.NAVER_CAFE_URL}`

  return (
    <>
      <div className="mx-4">
        <header>
          <h1 className="mb-2 text-4xl font-extrabold text-foreground">
            두통과 함께하는 사람들
          </h1>
          <p className="mb-6 mt-0 text-xl text-foreground">
            두통 환자와 보호자 등 두통에 관련된 다양한 사람들이 모일 수 있는
            카페
          </p>
        </header>
        <div className="mt-12 text-center">
          <a className={className} href="/pages/about">
            소개
          </a>
          <a className={className} href={cafeUrl}>
            네이버 카페 가기
          </a>
        </div>
      </div>
    </>
  )
}

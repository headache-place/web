import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-24 flex justify-center">
      <div className="space-y-12 pt-16">
        <nav className="space-x-6 text-center text-sm font-medium">
          <Link href="/">커뮤니티</Link>
          <Link href="/pages/about">소개</Link>
          <Link href="/pages/contact">연락하기</Link>
          <Link href="https://github.com/headache-place">GitHub</Link>
        </nav>

        <div className="text-center">
          <p className="text-sm text-foreground">
            &copy; 2024 <Link href="/">두통과 함께하는 사람들</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

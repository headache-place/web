import "./globals.css"

import { type Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

interface RootLayoutProps {
  children: React.ReactNode
}

const defaultTitle = "두통과 함께하는 사람들"
const description =
  "두통과 함께하는 사람들은 두통 환자와 보호자 등 두통에 관련된 다양한 사람들이 모일 수 있는 환자 모임입니다."
const defaultKeywords = [
  "두통",
  "편두통",
  "긴장형 두통",
  "군발두통",
  "만성 두통",
  "환자 커뮤니티",
  "환자 모임",
]

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    default: defaultTitle,
    template: `%s | ${defaultTitle}`,
  },
  description,
  keywords: defaultKeywords,
  creator: defaultTitle,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: defaultTitle,
    description,
    siteName: defaultTitle,
    images: [
      {
        url: "/ci/logo.svg",
        type: "image/svg",
      },
    ],
  },
  manifest: "/icon/manifest.json",
  icons: {
    icon: [
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/icon/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      { url: "/icon/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      {
        url: "/icon/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/icon/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icon/apple-touch-icon-precomposed.png",
      },
    ],
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className={"min-h-screen bg-background font-sans antialiased"}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          forcedTheme="dark"
        >
          <div className="mx-auto max-w-3xl px-4 py-10">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

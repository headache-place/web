"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen)

  return (
    <nav className="mb-12">
      <div className="mx-auto">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">메뉴 열기</span>
              <MenuIcon className="size-5 text-foreground" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Image
                  src="/ci/logo.svg"
                  alt="두통과 함께하는 사람들"
                  width={48}
                  height={48}
                  className="logo"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-12 sm:flex sm:items-center">
              <div className="space-x-6 text-base font-bold">
                <Link href="/pages/about">소개</Link>
                <Link href="/pages/rules">규칙 및 가이드</Link>
                <Link href="/pages/chats">회원용 채팅방</Link>
                <Link href="/pages/contacts">연락하기</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`space-y-4 px-2 text-base font-bold sm:hidden ${
          isMobileOpen ? "block" : "hidden"
        }`}
        id="mobile-menu"
      >
        <div>
          <Link onClick={toggleMobileMenu} href="/pages/about">
            소개
          </Link>
        </div>
        <div>
          <Link onClick={toggleMobileMenu} href="/pages/rules">
            규칙 및 가이드
          </Link>
        </div>
        <div>
          <Link onClick={toggleMobileMenu} href="/pages/chats">
            회원용 채팅방
          </Link>
        </div>
        <div>
          <Link onClick={toggleMobileMenu} href="/pages/contacts">
            연락하기
          </Link>
        </div>
      </div>
    </nav>
  )
}

import { parse } from "date-fns"

export interface IMenu {
  alarm: boolean
  commentAlarm: boolean
  subscription: boolean
  cafeId: number
  menuId: number
  menuName: string
  menuType: string
  boardType: string
  linkUrl: string
  listOrder: number
  fold: boolean
  indent: boolean
  // yyyy.MM.dd. HH:mm:ss
  lastUpdateDate: string
  searchRefDate: string
  badMenu: boolean
  favorite: boolean
  hasNewArticle: boolean
  hasRegion: boolean
}

export async function listMenus(cafeId: number) {
  const response = await fetch(
    `https://apis.naver.com/cafe-web/cafe2/SideMenuList?cafeId=${cafeId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      next: {
        revalidate: 60 * 60,
      },
    }
  )

  if (!response.ok) {
    return { success: false }
  }

  const body = await response.json()
  if (!body?.message?.result?.menus) {
    return { success: false }
  }

  const menus = (body.message.result.menus as IMenu[])
    .filter((menu) => menu.linkUrl === "")
    .map((menu) => ({
      hasNewArticle: menu.hasNewArticle,
      lastUpdateDate: parse(
        menu.lastUpdateDate,
        "yyyy.MM.dd. HH:mm:ss",
        new Date()
      ),
      menuId: menu.menuId,
      menuName: menu.menuName,
      menuType: menu.menuType,
      searchRefDate: parse(
        menu.searchRefDate,
        "yyyy.MM.dd. HH:mm:ss",
        new Date()
      ),
    }))

  return {
    success: true,
    menus,
  }
}

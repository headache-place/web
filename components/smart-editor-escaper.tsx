/* eslint-disable react/no-children-prop */
"use server"

import React, { type CSSProperties, type ReactElement } from "react"
import { HTMLElement, NodeType, parse } from "node-html-parser"

// 다음 조건에 따라 HTML 문자열을 DOM Tree로 파싱한다.
function parseDomTree(contentHtml: string) {
  return parse(contentHtml, {
    lowerCaseTagName: true,
    comment: false,
    voidTag: {
      tags: ["style", "script", "input"],
      closingSlash: true,
    },
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true,
    },
  }).firstChild as HTMLElement
}

// DOM 트리에서 SmartEditor로 만들어진 잡다한 것들을 제거한다.
function refineDomTree(domTree: HTMLElement) {
  // 필요 없는 id나 style에 대한 처리
  domTree
    .querySelectorAll("*")
    .forEach((item) =>
      ["id", "style"].forEach((attr) => item.removeAttribute(attr))
    )

  // 이미지는 Next.js에서 Proxy로 처리하게 수정
  domTree.querySelectorAll("img").forEach((image, _) => {
    const source = image.getAttribute("src")
    if (source) {
      image.setAttribute("src", `/api/images/${btoa(source)}`)
    }
  })

  // inline script injection은 실제 Youtube Video만 남김.
  domTree.querySelectorAll("script").forEach((script) => {
    const dataModuleAttr = script.getAttribute("data-module")
    if (!dataModuleAttr) {
      return script.remove()
    }

    const dataModule = JSON.parse(dataModuleAttr)
    if (
      !dataModule.type ||
      dataModule.type !== "v2_oembed" ||
      dataModule.data?.type !== "video"
    ) {
      return script.remove()
    }

    const iframe = parseDomTree(dataModule.data.html)

    // width, height를 1.5배 늘림
    for (const key of ["width", "height"]) {
      iframe.setAttribute(
        key,
        String(Math.floor(Number.parseInt(iframe.getAttribute(key)!) * 1.5))
      )
    }

    script.replaceWith(iframe)
  })

  return domTree.outerHTML
}

function extractProperties(dom: HTMLElement) {
  return Object.fromEntries(
    Object.entries(dom.attrs)
      .filter(([key]) => key !== "class")
      .map(([key, value]) => [key === "class" ? "className" : key, value])
  )
}

function parseAndRefineDomTree(contentHtml: string) {
  return parseDomTree(refineDomTree(parseDomTree(contentHtml)))
}

// React 객체를 생성하는 부분, img 태그는 children이 있으면 안됨.
function constructDefaultElement(
  dom: HTMLElement,
  childrens: any = undefined,
  style: CSSProperties = {}
) {
  return React.createElement(dom.rawTagName.toLowerCase(), {
    children: childrens,
    className: dom.classNames,
    style,
    ...extractProperties(dom),
  })
}

// 파싱한 DOM Tree를 React VDOM으로 변환한다.
function domTreeToReactElement(dom: HTMLElement): ReactElement {
  // 당연히 하위 노드를 가져오는 방식은 재귀 호출.
  const childrens = dom.childNodes
    .filter((node) => node.nodeType !== NodeType.COMMENT_NODE)
    .map((node) => {
      switch (node.nodeType) {
        case NodeType.ELEMENT_NODE:
          return domTreeToReactElement(node as HTMLElement)
        case NodeType.TEXT_NODE:
          return <>{node.textContent}</>
      }
    })

  switch (dom.rawTagName.toLowerCase()) {
    // NOTE: next/image를 쓰지 않는 이유는 이미지 프록시용 API를 만들었기 때문임.
    case "img":
      return constructDefaultElement(dom)
    case "iframe":
      return constructDefaultElement(dom, childrens, { margin: "auto" })
    default:
      return constructDefaultElement(dom, childrens)
  }
}

export async function SmartEditorEscaper({ html }: { html: string }) {
  const domTree = parseAndRefineDomTree(html)
  return !domTree ? <></> : domTreeToReactElement(domTree)
}

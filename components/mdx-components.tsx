import Image from "next/image"
import Link from "next/link"
import { useMDXComponent } from "next-contentlayer/hooks"

const mdxComponents = {
  Image,
  Link,
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const MDXContent = useMDXComponent(code)
  return <MDXContent components={mdxComponents} />
}

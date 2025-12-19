"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLoading } from "@/contexts/loading-context"
import { ReactNode, MouseEvent } from "react"

interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
  const router = useRouter()
  const { startLoading } = useLoading()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Nếu là external link hoặc có modifier keys, không intercept
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      if (onClick) onClick(e)
      return
    }

    // Prevent default navigation
    e.preventDefault()
    
    // Hiển thị loading ngay lập tức
    startLoading("Đang chuyển trang...")
    
    // Call custom onClick nếu có
    if (onClick) onClick(e)
    
    // Navigate sau một chút để đảm bảo loading được hiển thị
    setTimeout(() => {
      router.push(href)
    }, 50)
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}


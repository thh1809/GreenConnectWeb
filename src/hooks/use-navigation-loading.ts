"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLoading } from "@/contexts/loading-context"

export function useNavigationLoading() {
  const pathname = usePathname()
  const { stopLoading } = useLoading()

  useEffect(() => {
    // Tắt loading khi pathname thay đổi (trang đã load xong)
    // Loading đã được bắt đầu bởi NavigationLink khi click
    const timer = setTimeout(() => {
      stopLoading()
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, stopLoading])
}


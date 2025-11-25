import type { Metadata } from "next"
import { AdminLoginContent } from "@/page/admin/components/admin-login-content"

export const metadata: Metadata = {
  title: "Đăng nhập quản trị | GreenConnect",
}

export default function AdminLoginPage() {
  return <AdminLoginContent />
}


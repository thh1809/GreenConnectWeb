"use client"

import { FormEvent, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Leaf, LogIn, ShieldCheck, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import Logo from "@public/Eco-Tech-logo-web-no-background.ico"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { adminLogin, type AdminLoginResponse } from "@/lib/api/auth"

export function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [responseData, setResponseData] = useState<AdminLoginResponse | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setResponseData(null)

    try {
      const result = await adminLogin({ email, password })
      if (typeof window !== "undefined") {
        sessionStorage.setItem("authToken", result.accessToken)
        if (rememberMe) {
          localStorage.setItem("authToken", result.accessToken)
        } else {
          localStorage.removeItem("authToken")
        }
      }
      const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 4
      document.cookie = `authToken=${result.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
      setResponseData(result)
      router.push(redirectPath)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể kết nối tới máy chủ. Vui lòng thử lại."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        {/* Left Panel - GreenConnect Admin Information */}
        <section className="flex flex-col gap-6 rounded-2xl bg-card p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Image
                src={Logo}
                alt="GreenConnect Logo"
                className="h-8 w-8"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bảng điều khiển</p>
              <h1 className="text-2xl font-bold text-foreground">
                GreenConnect Admin
              </h1>
            </div>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            Theo dõi báo cáo, xử lý khiếu nại và quản lý cộng đồng tái chế ngay trên một giao diện thống nhất.
            Đăng nhập an toàn với lớp bảo mật chuẩn hoá bởi nhóm GreenConnect.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Bảo mật đa lớp</p>
                <p className="text-sm text-muted-foreground">
                  Phiên đăng nhập được mã hoá và ghi nhận nhật ký truy cập theo thời gian thực.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Giao diện thân thiện</p>
                <p className="text-sm text-muted-foreground">
                  Tối ưu cho cả desktop và tablet, đồng thời tương thích chế độ tối/sáng.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-primary">+240</p>
              <p className="text-sm text-muted-foreground">Điểm thu gom đang hoạt động</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">99.95%</p>
              <p className="text-sm text-muted-foreground">Thời gian sẵn sàng hệ thống</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Leaf className="h-4 w-4 text-primary" />
            <span>Cam kết vận hành xanh và minh bạch cùng GreenConnect.</span>
          </div>
        </section>

          {/* Right Panel - Admin Login Form */}
          <Card className="flex flex-col border shadow-lg rounded-2xl lg:max-w-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold">Đăng nhập quản trị</CardTitle>
              <CardDescription>
                Nhập thông tin tài khoản được cấp để truy cập bảng điều khiển.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email tổ chức</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@greenconnect.vn"
                    autoComplete="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    className="bg-muted/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link
                      href="/quen-mat-khau"
                      className="text-sm text-primary hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    className="bg-muted/50"
                    required
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">Ghi nhớ đăng nhập</span>
                    <p className="text-xs text-muted-foreground">
                      Chỉ bật trên thiết bị đáng tin cậy
                    </p>
                  </div>
                  <Switch
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={checked => setRememberMe(Boolean(checked))}
                  />
                </div>

                <Button type="submit" className="w-full" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Đang xác thực..." : "Đăng nhập"}
                </Button>

                <Button type="button" variant="outline" className="w-full gap-2 bg-muted/30">
                  <LogIn className="h-4 w-4" />
                  Đăng nhập nhanh bằng OTP
                </Button>
              </form>

              {errorMessage && (
                <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {errorMessage}
                </div>
              )}

              {responseData && (
                <div className="mt-4 space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-left text-xs text-foreground">
                  <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                    <span>Response 200</span>
                    <span>/api/v1/auth/admin-login</span>
                  </div>
                  <div className="rounded-lg bg-background/80 p-3 font-mono text-[0.75rem]">
                    <div className="mb-2 font-semibold text-primary">accessToken</div>
                    <p className="break-all text-muted-foreground">{responseData.accessToken}</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-3 font-mono text-[0.75rem]">
                    <div className="mb-1 font-semibold text-primary">user</div>
                    <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words text-muted-foreground">
                      {JSON.stringify(responseData.user, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 text-center text-sm">
              <p className="text-muted-foreground">
                Bạn chưa có tài khoản quản trị?{" "}
                <Link href="/lien-he" className="font-medium text-primary hover:underline">
                  Liên hệ nhóm GreenConnect
                </Link>
              </p>
              <Link href="/" className="text-primary hover:underline flex items-center justify-center gap-1">
                <span>←</span> Quay về trang chủ
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
  )
}

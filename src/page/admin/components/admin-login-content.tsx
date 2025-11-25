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
    <div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-background px-4 py-10 text-foreground">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute right-12 top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-10 bottom-10 h-40 w-40 rounded-full bg-secondary/40 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
        <section className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-card/70 p-8 shadow-2xl shadow-primary/5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Image
                src={Logo}
                alt="GreenConnect Logo"
                className="h-10 w-10"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bảng điều khiển</p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                GreenConnect Admin
              </h1>
            </div>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            Theo dõi báo cáo, xử lý khiếu nại và quản lý cộng đồng tái chế ngay trên một giao diện thống nhất.
            Đăng nhập an toàn với lớp bảo mật chuẩn hoá bởi nhóm GreenConnect.
          </p>

          <div className="grid gap-4 rounded-2xl border border-border/70 bg-background/60 p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/15 p-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Bảo mật đa lớp</p>
                <p className="text-sm text-muted-foreground">
                  Phiên đăng nhập được mã hoá và ghi nhận nhật ký truy cập theo thời gian thực.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/15 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Giao diện thân thiện</p>
                <p className="text-sm text-muted-foreground">
                  Tối ưu cho cả desktop và tablet, đồng thời tương thích chế độ tối/sáng.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-2xl font-semibold text-primary">+240</p>
              <p className="text-muted-foreground">Điểm thu gom đang hoạt động</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-primary">99.95%</p>
              <p className="text-muted-foreground">Thời gian sẵn sàng hệ thống</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Leaf className="h-4 w-4 text-primary" />
            Cam kết vận hành xanh và minh bạch cùng GreenConnect.
          </div>
        </section>

        <Card className="flex flex-col border border-border/70 shadow-2xl shadow-primary/10 rounded-3xl lg:max-w-none">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold">Đăng nhập quản trị</CardTitle>
            <CardDescription>
              Nhập thông tin tài khoản được cấp để truy cập bảng điều khiển.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email tổ chức</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@greenconnect.vn"
                  autoComplete="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href="/quen-mat-khau"
                    className="text-sm text-primary hover:opacity-80"
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
                  required
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Ghi nhớ đăng nhập</span>
                  <span className="text-xs text-muted-foreground">
                    Chỉ bật trên thiết bị đáng tin cậy
                  </span>
                </div>
                <Switch
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={checked => setRememberMe(Boolean(checked))}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang xác thực..." : "Đăng nhập"}
              </Button>

              <Button type="button" variant="outline" className="w-full gap-2">
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

          <CardFooter className="flex flex-col gap-3 text-center text-sm text-muted-foreground">
            <p>
              Bạn chưa có tài khoản quản trị?{" "}
              <Link href="/lien-he" className="font-medium text-primary">
                Liên hệ nhóm GreenConnect
              </Link>
            </p>
            <Link href="/" className="text-primary hover:opacity-80">
              ← Quay về trang chủ
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


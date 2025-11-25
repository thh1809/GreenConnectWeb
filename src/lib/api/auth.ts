import { post } from "@/lib/api/client"

export type AdminLoginRequest = {
  email: string
  password: string
}

export type AdminLoginResponse = {
  accessToken: string
  user: {
    id: string
    fullName: string
    phoneNumber: string
    pointBalance: number
    rank: string
    roles: string[]
    avatarUrl: string | null
  }
}

export const adminLogin = (payload: AdminLoginRequest) =>
  post<AdminLoginResponse>("/api/v1/auth/admin-login", payload)


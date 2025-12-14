import { post } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/constants"

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
  post<AdminLoginResponse>(`${API_ENDPOINTS.AUTH}/admin-login`, payload)


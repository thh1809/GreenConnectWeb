import Loading from '@/app/loading';
import { AdminLoginContent } from '@/page/admin/components/admin-login-content';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Đăng nhập quản trị | GreenConnect',
};

export default function AdminLoginPage() {
  return <AdminLoginContent />;
}

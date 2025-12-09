'use client';

import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LogOut, Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ items, logo, children }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem('sidebar-collapsed', String(newValue));
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      document.cookie =
        'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      router.push('/admin/login');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground transition-colors">
      {/* ===== Sidebar ===== */}
      <aside
        className={`${
          isCollapsed ? 'w-18' : 'w-64'
        } border-r border-border bg-card px-4 py-4 transition-all duration-300 flex flex-col`}
      >
        {/* Logo + Name */}
        <div
          className={`flex items-center gap-2 px-2 mb-6 cursor-pointer${
            isCollapsed ? 'justify-center' : ''
          }`}
          onClick={() => {
            router.push('/');
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground font-bold text-lg ">
            <Image src={logo} alt="Green Connect Logo" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold whitespace-nowrap">
              Green Connect
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-2">
          {items.map((it: any) => {
            const active = pathname === it.href;

            const Icon = Icons[it.icon as keyof typeof Icons] as
              | LucideIcon
              | undefined;

            return (
              <Link
                key={it.label}
                href={it.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/10 text-foreground'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {Icon ? (
                  <Icon
                    className={`h-5 w-5 ${
                      active
                        ? 'text-primary-foreground'
                        : 'text-primary group-hover:text-primary'
                    }`}
                  />
                ) : (
                  <div className="h-5 w-5" />
                )}

                {!isCollapsed && <span>{it.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-border pt-4">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ===== Right Section ===== */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ===== Header ===== */}
        <header className="border-b border-border bg-card px-6 py-4 flex justify-between items-center">
          <button
            onClick={toggleCollapse}
            className="rounded-full p-2 hover:bg-muted transition"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5 text-muted-foreground" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-muted transition"
          >
            {isDark ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </header>

        {/* ===== Main Content ===== */}
        <main className="flex-1 bg-background px-6 py-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

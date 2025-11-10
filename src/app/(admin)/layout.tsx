"use client";
 
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/users", label: "User" },
    { href: "/posts", label: "Posts" },
    { href: "/categories", label: "Categories" },
    { href: "/complaints", label: "Complaints" },
  ];
  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="sticky top-6 h-fit w-60 flex-shrink-0 rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 px-2 text-lg font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white">GC</span>
            <span>Green Connect</span>
          </div>
          <Separator className="my-2" />
          <nav className="flex flex-col gap-1">
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.label}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-sm transition-colors ${
                      active ? "bg-primary-foreground" : "bg-primary/80 group-hover:bg-primary-foreground"
                    }`}
                  />
                  <span className="font-medium">{it.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}




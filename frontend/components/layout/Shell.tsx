"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Clock, Info,
  Sun, Moon, Menu, X, Shield,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/",         icon: LayoutDashboard },
  { label: "Analyze",   href: "/analyze",  icon: Search           },
  { label: "History",   href: "/history",  icon: Clock            },
  { label: "About",     href: "/about",    icon: Info             },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-app">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-base bg-surface",
          "transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-base px-6">
          <Shield className="h-6 w-6 text-[--accent]" />
          <span className="font-display text-xl font-bold tracking-tight text-base shimmer-text">
            VeritAI
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-[--accent]/10 text-[--accent]"
                    : "text-muted hover:bg-[--border]/40 hover:text-base"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: theme toggle */}
        <div className="border-t border-base p-4">
          <button
            onClick={toggle}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-[--border]/40 hover:text-base transition-all"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar (mobile) */}
        <header className="flex h-16 items-center justify-between border-b border-base bg-surface px-4 lg:px-6">
          <button
            className="lg:hidden text-muted hover:text-base"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <Shield className="h-5 w-5 text-[--accent]" />
            <span className="font-display text-lg font-bold text-base">VeritAI</span>
          </div>
          <button
            onClick={toggle}
            className="ml-auto hidden lg:flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-[--border]/40 hover:text-base transition-all"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button className="lg:hidden text-muted" onClick={() => setOpen(false)}>
            {open ? <X className="h-5 w-5" /> : null}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

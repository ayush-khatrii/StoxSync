"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Applied", href: "/applied", icon: ListChecks },
  { label: "All IPOs", href: "/all-ipos", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            SS
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-normal sm:text-base">
              Stoxsync
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              IPO Tracker
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-lg border bg-muted/30 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
                  active &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden text-sm font-medium text-muted-foreground sm:block">
          IPO Tracker
        </div>
      </div>

      <nav className="border-t px-4 py-2 md:hidden">
        <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
                  active &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

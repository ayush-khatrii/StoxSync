"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, ListChecks, LockKeyhole, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Applied", href: "/applied", icon: ListChecks },
  { label: "All IPOs", href: "/all-ipos", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed w-full mb-10 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-normal sm:text-base">
              Stoxsync
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative flex h-10 items-center gap-2 px-3 text-sm font-medium text-muted-foreground transition hover:text-foreground",
                  active &&
                  "text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-primary"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden text-sm font-medium text-muted-foreground md:block">
          <Link href="/dashboard" className="inline-flex items-center gap-2 transition hover:text-foreground"><LockKeyhole className="size-4" />Account</Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation"><Menu className="size-5" /></Button>} />
            <SheetContent side="right" className="w-[min(86vw,360px)] sm:max-w-sm">
              <SheetHeader className="pr-10"><SheetTitle>Stoxsync</SheetTitle><SheetDescription>IPO tracker navigation</SheetDescription></SheetHeader>
              <nav className="mt-5 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <SheetClose key={item.label} render={<Link href={item.href} className={cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground", active && "bg-primary/10 text-primary")} />}>
                      <Icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </SheetClose>
                  );
                })}
                <div className="my-3 border-t border-border/70" />
                <SheetClose render={<Link href="/dashboard" className={cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground", pathname.startsWith("/dashboard") && "bg-primary/10 text-primary")} />}>
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  Account
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

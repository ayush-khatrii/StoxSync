import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden px-5 py-16 sm:px-8">
        <DotGrid />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-sm font-medium text-primary">Personal IPO tracker</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-balance sm:text-5xl lg:text-6xl">
            Every IPO application, clearly tracked.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Keep bids, lots, dates, and blocked amounts together in one private workspace.
          </p>
          <Link
            href="/applied"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 h-12 w-full justify-center px-7 text-base shadow-lg shadow-primary/10 sm:w-auto"
            )}
          >
            Track an application
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function DotGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 grid grid-cols-[repeat(16,minmax(0,1fr))] grid-rows-[repeat(24,minmax(0,1fr))] opacity-60 sm:grid-cols-[repeat(24,minmax(0,1fr))] sm:grid-rows-[repeat(16,minmax(0,1fr))]" aria-hidden="true">
      {Array.from({ length: 384 }, (_, index) => (
        <span key={index} className="m-auto size-px rounded-full bg-border" />
      ))}
    </div>
  );
}

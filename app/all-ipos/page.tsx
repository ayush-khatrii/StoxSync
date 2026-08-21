"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Navbar } from "@/components/Navbar";
import { IpoCategoryTabs } from "@/components/market-ipos/IpoCategoryTabs";
import { IpoPagination } from "@/components/market-ipos/IpoPagination";
import { MarketIpoList } from "@/components/market-ipos/MarketIpoList";
import { MarketIpoListSkeleton } from "@/components/market-ipos/MarketIpoListSkeleton";
import { IPO_CATEGORY_LABELS, type IpoCategory, type PaginatedIpoResponse } from "@/lib/market-ipos";

const PAGE_SIZE = 10;

export default function AllIposPage() {
  const [category, setCategory] = useState<IpoCategory>("active");
  const [page, setPage] = useState(1);

  const { data, error, isPending, isFetching } = useQuery({
    queryKey: ["market-ipos", category, page],
    queryFn: () => fetchIpos(category, page),
  });

  function changeCategory(nextCategory: IpoCategory) {
    setCategory(nextCategory);
    setPage(1);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-7 sm:py-12 lg:px-10">
        <header className="border-b border-border/70 pb-7">
          <p className="text-xs font-medium uppercase text-primary">IPO market</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">All IPOs</h1>
          <p className="mt-2 text-sm text-muted-foreground">Browse current and historical issues by status.</p>
        </header>

        <section className="mt-7">
          <IpoCategoryTabs activeCategory={category} onChange={changeCategory} />

          <div className="flex min-h-12 items-center justify-between gap-3 py-4">
            <div>
              <h2 className="text-sm font-semibold">{IPO_CATEGORY_LABELS[category]} IPOs</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {isPending ? "Loading records" : `${data?.total ?? 0} record${data?.total === 1 ? "" : "s"}`}
              </p>
            </div>
            {isFetching && !isPending && <span className="text-xs text-muted-foreground">Refreshing...</span>}
          </div>

          {error && <div className="border-y border-destructive/40 py-4 text-sm text-destructive">{error.message}</div>}
          {isPending ? (
            <MarketIpoListSkeleton />
          ) : (
            <MarketIpoList
              items={data?.items ?? []}
              category={category}
              startIndex={((data?.page ?? page) - 1) * PAGE_SIZE}
            />
          )}

          {!isPending && !error && data && (
            <>
              <p className="mt-5 text-center text-xs text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </p>
              <IpoPagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

async function fetchIpos(category: IpoCategory, page: number) {
  const params = new URLSearchParams({
    category,
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  const response = await fetch(`/api/market/ipos?${params.toString()}`);
  const body = await response.json().catch(() => ({})) as PaginatedIpoResponse & { error?: string };

  if (!response.ok) throw new Error(body.error || "Unable to load IPOs.");
  return body;
}

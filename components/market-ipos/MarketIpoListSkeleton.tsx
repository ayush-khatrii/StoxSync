import { Skeleton } from "@/components/ui/skeleton";

export function MarketIpoListSkeleton() {
  return (
    <div className="max-w-full overflow-hidden border-t border-border/70" role="status" aria-label="Loading IPOs">
      <span className="sr-only">Loading IPOs</span>
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-x-2 gap-y-3 border-b border-border/70 px-1 py-4 lg:grid-cols-[40px_minmax(0,1fr)_140px_100px_130px_180px] lg:items-center lg:gap-4 lg:px-2" aria-hidden="true">
          <Skeleton className="h-3 w-5" />
          <div><Skeleton className="h-4 w-44 max-w-full" /><Skeleton className="mt-2 h-3 w-20" /></div>
          <div className="col-start-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-4 lg:contents">
            <div><Skeleton className="h-2.5 w-16 max-w-full" /><Skeleton className="mt-2 h-3 w-24 max-w-full" /></div>
            <div><Skeleton className="h-2.5 w-14 max-w-full" /><Skeleton className="mt-2 h-3 w-20 max-w-full" /></div>
            <div><Skeleton className="h-2.5 w-20 max-w-full" /><Skeleton className="mt-2 h-3 w-24 max-w-full" /></div>
            <div><Skeleton className="h-2.5 w-20 max-w-full" /><Skeleton className="mt-2 h-3 w-32 max-w-full" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

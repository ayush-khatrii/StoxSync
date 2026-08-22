import { Skeleton } from "@/components/ui/skeleton";

export function MarketIpoListSkeleton() {
  return (
    <div className="subtle-scrollbar w-full overflow-x-auto pb-1" role="status" aria-label="Loading IPOs">
      <span className="sr-only">Loading IPOs</span>
      <div className="w-full border-t border-border/70 xl:min-w-[1320px]">
        <div className="hidden h-10 bg-muted/60 xl:block" aria-hidden="true" />
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-x-2 gap-y-4 border-b border-border/70 px-2 py-4 sm:px-3 xl:grid-cols-[36px_minmax(220px,1fr)_130px_100px_130px_180px_100px_230px] xl:items-center xl:gap-4 xl:px-2" aria-hidden="true">
            <Skeleton className="h-3 w-5" />
            <div><Skeleton className="h-4 w-44 max-w-full" /><Skeleton className="mt-2 h-4 w-24" /></div>
            <div className="col-start-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 xl:contents">
              {Array.from({ length: 6 }, (_, detailIndex) => (
                <div key={detailIndex}><Skeleton className="h-2.5 w-16 max-w-full xl:hidden" /><Skeleton className="mt-2 h-4 w-24 max-w-full xl:mt-0" /></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

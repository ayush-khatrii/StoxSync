import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ApplicationSummarySkeleton() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="border border-border/70 bg-card p-5 sm:p-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ApplicationTableSkeleton() {
  return (
    <div role="status" aria-label="Loading applications">
      <span className="sr-only">Loading applications</span>
      <Table className="min-w-[980px] text-xs" aria-hidden="true">
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {["IPO", "Offer dates", "Offer price", "Lot size", "Bid lots", "Applied on", "Applicant", "Total", "Status", "Actions"].map((label) => (
              <TableHead key={label} className="h-9 px-3 text-[11px] uppercase tracking-wider">{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }, (_, row) => (
            <TableRow key={row} className="border-border/70 hover:bg-transparent">
              <TableCell className="px-3 py-3"><div className="flex items-center gap-2.5"><Skeleton className="size-8 shrink-0" /><div><Skeleton className="h-3 w-40" /><Skeleton className="mt-2 h-2.5 w-16" /></div></div></TableCell>
              <SkeletonCell width="w-32" />
              <SkeletonCell width="w-16" />
              <SkeletonCell width="w-20" />
              <SkeletonCell width="w-8" />
              <SkeletonCell width="w-24" />
              <SkeletonCell width="w-24" />
              <SkeletonCell width="w-20" />
              <SkeletonCell width="w-14" />
              <SkeletonCell width="w-7" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function IpoTableSkeleton() {
  return (
    <div role="status" aria-label="Loading IPOs">
      <span className="sr-only">Loading IPOs</span>
      <Table className="min-w-[760px] text-xs" aria-hidden="true">
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {["IPO", "Offer dates", "Offer price", "Lot size", "Actions"].map((label) => (
              <TableHead key={label} className="h-9 px-3 text-[11px] uppercase tracking-wider">{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }, (_, row) => (
            <TableRow key={row} className="border-border/70 hover:bg-transparent">
              <TableCell className="px-3 py-3"><div className="flex items-center gap-2.5"><Skeleton className="size-8 shrink-0" /><div><Skeleton className="h-3 w-44" /><Skeleton className="mt-2 h-2.5 w-16" /></div></div></TableCell>
              <SkeletonCell width="w-32" />
              <SkeletonCell width="w-16" />
              <SkeletonCell width="w-20" />
              <SkeletonCell width="w-7" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SkeletonCell({ width }: { width: string }) {
  return <TableCell className="px-3 py-3"><Skeleton className={`h-3 ${width}`} /></TableCell>;
}

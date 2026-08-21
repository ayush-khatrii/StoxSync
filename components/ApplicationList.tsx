import { CalendarDays, PackageOpen } from "lucide-react";

import { INITIAL_APPLICATIONS, IPOS, PANS } from "@/constants";
import type { ApplicationEntry } from "@/components/ApplicationSheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RowActions } from "@/components/RowActions";

export function initialApplicationEntries(): ApplicationEntry[] {
  return INITIAL_APPLICATIONS.map((application) => {
    const ipo = IPOS.find((item) => item.id === application.ipoId);
    const pan = PANS.find((item) => item.id === application.panId);
    const lotSize = ipo?.lotSize ?? 0;

    return {
      id: application.id,
      company: ipo?.company ?? "Unknown IPO",
      symbol: ipo?.symbol ?? "IPO",
      initials: ipo?.initials ?? "IPO",
      applicant: pan?.name ?? "Unassigned",
      applicationDate: new Date().toISOString().slice(0, 10),
      offerDate: ipo?.offerDate ?? "",
      offerPrice: ipo?.offerPrice ?? String(application.price),
      lots: application.lots,
      cutOffPrice: application.price,
      lotSize,
      total: application.lots * lotSize * application.price,
      status: "Tracked",
    };
  });
}

export function ApplicationList({ applications, onEdit, onDelete }: { applications: ApplicationEntry[]; onEdit?: (application: ApplicationEntry) => void; onDelete?: (application: ApplicationEntry) => void }) {
  if (applications.length === 0) {
    return (
      <div className="border-b border-border/70 py-12 text-center">
        <PackageOpen className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 font-medium">No applications tracked yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">Add an application to start monitoring blocked funds.</p>
      </div>
    );
  }

  return (
    <Table className="min-w-[980px] text-xs">
      <caption className="sr-only">Tracked IPO applications and blocked amounts</caption>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">IPO</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Offer dates</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Offer price</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Lot size</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Bid lots</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Applied on</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Applicant</TableHead>
          <TableHead className="h-9 px-3 text-right text-[11px] uppercase tracking-wider">Total</TableHead>
          <TableHead className="h-9 px-3 text-right text-[11px] uppercase tracking-wider">Status</TableHead>
          {onEdit && onDelete && <TableHead className="h-9 px-3 text-right text-[11px] uppercase tracking-wider">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id} className="border-border/70 hover:bg-muted/20">
            <TableCell className="px-3 py-3"><div className="flex items-center gap-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold">{application.initials}</span><div className="min-w-0"><p className="max-w-[220px] truncate font-medium">{application.company}</p><p className="text-[11px] text-muted-foreground">{application.symbol}</p></div></div></TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3 text-muted-foreground">{application.offerDate || "—"}</TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3 font-medium">₹{application.offerPrice || application.cutOffPrice}</TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3">{application.lotSize} shares</TableCell>
            <TableCell className="px-3 py-3">{application.lots}</TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{formatDate(application.applicationDate)}</span></TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3">{application.applicant}</TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3 text-right font-semibold">{formatCurrency(application.total)}</TableCell>
            <TableCell className="px-3 py-3 text-right"><span className={cn("font-medium", application.status === "Tracked" ? "text-primary" : "text-muted-foreground")}>{application.status}</span></TableCell>
            {onEdit && onDelete && <TableCell className="px-3 py-3"><RowActions itemLabel={application.company} onEdit={() => onEdit(application)} onDelete={() => onDelete(application)} /></TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

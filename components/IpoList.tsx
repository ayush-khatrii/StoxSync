import { ArrowUpRight, CalendarDays, Layers3, PackageOpen } from "lucide-react";
import Link from "next/link";

import { type Ipo } from "@/constants";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RowActions } from "@/components/RowActions";

export function IpoList({ ipos, onEdit, onDelete }: { ipos: Ipo[]; onEdit?: (ipo: Ipo) => void; onDelete?: (ipo: Ipo) => void }) {
  if (ipos.length === 0) {
    return (
      <div className="border-b border-border/70 py-12 text-center">
        <PackageOpen className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 font-medium">No IPOs added yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">Add the five essential IPO details to start tracking.</p>
      </div>
    );
  }

  return (
    <Table className="min-w-[760px] text-xs">
      <caption className="sr-only">Manually added IPO details</caption>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">IPO</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Offer dates</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Offer price</TableHead>
          <TableHead className="h-9 px-3 text-[11px] uppercase tracking-wider">Lot size</TableHead>
          <TableHead className="h-9 px-3 text-right text-[11px] uppercase tracking-wider">{onEdit && onDelete ? "Actions" : "Track"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ipos.map((ipo) => (
          <TableRow key={ipo.id} className="border-border/70 hover:bg-muted/20">
            <TableCell className="px-3 py-3"><div className="flex items-center gap-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold">{ipo.initials}</span><div className="min-w-0"><p className="max-w-[240px] truncate font-medium">{ipo.company}</p><p className="text-[11px] text-muted-foreground">{ipo.symbol}</p></div></div></TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{ipo.offerDate}</span></TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3 font-medium">₹{ipo.offerPrice}</TableCell>
            <TableCell className="whitespace-nowrap px-3 py-3"><span className="inline-flex items-center gap-1.5"><Layers3 className="size-3.5 text-muted-foreground" aria-hidden="true" />{ipo.lotSize} shares</span></TableCell>
            <TableCell className="px-3 py-3 text-right">{onEdit && onDelete ? <RowActions itemLabel={ipo.company} onEdit={() => onEdit(ipo)} onDelete={() => onDelete(ipo)} /> : <Link href="/applied" className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))} aria-label={`Track ${ipo.company}`}><ArrowUpRight className="size-4" aria-hidden="true" /></Link>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

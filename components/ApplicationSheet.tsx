"use client";

import { FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Check, Plus } from "lucide-react";

import { DatePicker, formatDateRange } from "@/components/DatePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketIpo, PaginatedIpoResponse } from "@/lib/market-ipos";

export type ApplicationEntry = {
  id: string;
  company: string;
  symbol: string;
  initials: string;
  applicant: string;
  applicationDate: string;
  offerDate: string;
  offerStart?: string;
  offerEnd?: string;
  offerPrice: string;
  lots: number;
  cutOffPrice: number;
  lotSize: number;
  total: number;
  status: "Tracked";
};

export function ApplicationSheet({ onAdd, onUpdate, editingApplication, onEditClose }: { onAdd: (application: ApplicationEntry) => void; onUpdate?: (application: ApplicationEntry) => void; editingApplication?: ApplicationEntry | null; onEditClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [offerStart, setOfferStart] = useState("");
  const [offerEnd, setOfferEnd] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [lots, setLots] = useState("1");
  const [applicationDate, setApplicationDate] = useState(today());
  const [applicant, setApplicant] = useState("");
  const [selectedIpoId, setSelectedIpoId] = useState("");

  const { data: activeIpos, error: ipoError, isPending: loadingIpos } = useQuery({
    queryKey: ["market-ipos", "open", 1, 30],
    queryFn: fetchActiveIpos,
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });
  const selectedIpo = activeIpos?.items.find((ipo) => ipo.id === selectedIpoId);

  const cutOffPrice = parsePrice(offerPrice);
  const total = cutOffPrice * numberValue(lotSize) * numberValue(lots);

  useEffect(() => {
    if (!editingApplication) return;
    setCompany(editingApplication.company);
    setOfferStart(editingApplication.offerStart ?? "");
    setOfferEnd(editingApplication.offerEnd ?? "");
    setOfferPrice(editingApplication.offerPrice ?? String(editingApplication.cutOffPrice));
    setLotSize(String(editingApplication.lotSize));
    setLots(String(editingApplication.lots));
    setApplicationDate(editingApplication.applicationDate);
    setApplicant(editingApplication.applicant);
    setSelectedIpoId("");
    setOpen(true);
  }, [editingApplication]);

  function selectIpo(ipoId: string | null) {
    const nextId = ipoId ?? "";
    const ipo = activeIpos?.items.find((item) => item.id === nextId);
    setSelectedIpoId(nextId);
    if (!ipo) return;

    setCompany(ipo.name);
    setOfferStart(ipo.bidding_start_date ?? "");
    setOfferEnd(ipo.bidding_end_date ?? "");
    setOfferPrice(formPriceBand(ipo));
    setLotSize(ipo.lot_size ? String(ipo.lot_size) : "");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = company.trim();
    if (!name || !offerStart || !offerEnd || !offerPrice.trim() || !numberValue(lotSize) || !applicant.trim() || !applicationDate || total <= 0) return;

    const nextApplication = {
      id: `application-${Date.now()}`,
      company: name,
      symbol: selectedIpo?.symbol || editingApplication?.symbol || symbolFor(name),
      initials: initialsFor(name),
      applicant: applicant.trim(),
      applicationDate,
      offerDate: formatDateRange(offerStart, offerEnd),
      offerStart,
      offerEnd,
      offerPrice: offerPrice.trim(),
      lots: numberValue(lots),
      cutOffPrice,
      lotSize: numberValue(lotSize),
      total,
      status: "Tracked",
    } satisfies ApplicationEntry;

    if (editingApplication && onUpdate) onUpdate({ ...nextApplication, id: editingApplication.id });
    else onAdd(nextApplication);

    handleClose();
    resetForm();
  }

  function handleClose() {
    setOpen(false);
    onEditClose?.();
  }

  function resetForm() {
    setCompany("");
    setOfferStart("");
    setOfferEnd("");
    setOfferPrice("");
    setLotSize("");
    setLots("1");
    setApplicationDate(today());
    setApplicant("");
    setSelectedIpoId("");
  }

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) handleClose(); else setOpen(true); }}>
      <SheetTrigger render={<Button><Plus className="size-4" aria-hidden="true" />Add application</Button>} />
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pr-10">
          <SheetTitle>Track an application</SheetTitle>
          <SheetDescription>Select an active IPO, then add the applicant and number of lots you want to track.</SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {editingApplication ? (
              <Field id="ipo-name" label="IPO name" placeholder="IPO name" value={company} onChange={setCompany} />
            ) : (
              <div className="space-y-2">
                <Label>Active IPO</Label>
                {loadingIpos ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <Select value={selectedIpoId || null} onValueChange={selectIpo} disabled={!activeIpos?.items.length}>
                    <SelectTrigger className="h-12 w-full px-3">
                      <SelectValue placeholder="Select an active IPO" />
                    </SelectTrigger>
                    <SelectContent align="start" className="max-h-80">
                      {activeIpos?.items.map((ipo) => (
                        <SelectItem key={ipo.id} value={ipo.id} className="py-2.5">
                          <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <span className="min-w-0">
                              <span className="block truncate font-medium">{ipo.name}</span>
                              <span className="block text-[11px] text-muted-foreground">{ipo.symbol} · {formatIssueType(ipo.issue_type)}</span>
                            </span>
                            <span className="shrink-0 text-right text-[11px] text-muted-foreground">
                              <span className="block text-foreground">{displayPriceBand(ipo)}</span>
                              <span>{ipo.lot_size ? `${ipo.lot_size} shares` : "Lot pending"}</span>
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {ipoError && <p className="text-xs text-destructive">{ipoError.message}</p>}
                {!loadingIpos && !ipoError && activeIpos?.items.length === 0 && <p className="text-xs text-muted-foreground">No active IPOs are available right now.</p>}
              </div>
            )}

            {selectedIpo && (
              <div className="border-y border-border bg-muted/35 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Building2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{selectedIpo.name}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{selectedIpo.symbol} · {formatDateRange(selectedIpo.bidding_start_date ?? "", selectedIpo.bidding_end_date ?? "")}</p>
                    </div>
                  </div>
                  <Badge variant="accent">{formatIssueType(selectedIpo.issue_type)}</Badge>
                </div>
              </div>
            )}
            <div className="space-y-2"><Label>Offer dates</Label><div className="grid grid-cols-2 gap-3"><DatePicker value={offerStart} onChange={setOfferStart} placeholder="Opens" /><DatePicker value={offerEnd} onChange={setOfferEnd} placeholder="Closes" /></div></div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="offer-price" label="Offer price" placeholder="190-201" value={offerPrice} onChange={setOfferPrice} readOnly={Boolean(selectedIpo)} />
              <Field id="lot-size" label="Lot size" placeholder="74" value={lotSize} onChange={setLotSize} type="number" min="1" readOnly={Boolean(selectedIpo)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
            <Field id="lots" label="Bid lots" placeholder="1" value={lots} onChange={setLots} type="number" min="1" />
            <div className="space-y-2"><Label>Application date</Label><DatePicker value={applicationDate} onChange={setApplicationDate} /></div>
          </div>

          <Field id="applicant" label="Applicant name" placeholder="Enter applicant name" value={applicant} onChange={setApplicant} />

          <div className="mt-auto border-y border-border py-5"><div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">Total application</span><strong className="text-xl">{formatCurrency(total)}</strong></div><p className="mt-2 text-xs text-muted-foreground">{numberValue(lots) || 0} lot{numberValue(lots) === 1 ? "" : "s"} · {numberValue(lotSize) || 0} shares per lot · ₹{cutOffPrice || 0} cut-off</p></div>
          <SheetFooter><Button type="submit" className="h-10 w-full" disabled={!editingApplication && !selectedIpo}><Check className="size-4" aria-hidden="true" />{editingApplication ? "Save changes" : "Add to applications"}</Button></SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ id, label, placeholder, value, onChange, type = "text", min, readOnly = false }: { id: string; label: string; placeholder: string; value: string; onChange: (value: string) => void; type?: string; min?: string; readOnly?: boolean }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} min={min} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="h-10" readOnly={readOnly} required /></div>;
}

function numberValue(value: string) { return Number(value) || 0; }
function parsePrice(value: string) { const values = value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? []; return values.length ? Math.max(...values) : 0; }
function today() { return new Date().toISOString().slice(0, 10); }
function initialsFor(value: string) { return value.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function symbolFor(value: string) { return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase(); }
function formatCurrency(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value); }

async function fetchActiveIpos() {
  const response = await fetch("/api/upstox/ipos?status=open&page=1&limit=30");
  const body = await response.json().catch(() => ({})) as PaginatedIpoResponse & { error?: string };
  if (!response.ok) throw new Error(body.error || "Unable to load active IPOs.");
  return body;
}

function formPriceBand(ipo: MarketIpo) {
  if (ipo.minimum_price && ipo.maximum_price) return `${ipo.minimum_price}-${ipo.maximum_price}`;
  return String(ipo.maximum_price || ipo.minimum_price || "");
}

function displayPriceBand(ipo: MarketIpo) {
  const value = formPriceBand(ipo);
  return value ? `₹${value.replace("-", " - ₹")}` : "Price pending";
}

function formatIssueType(value: string) {
  return value === "regular" ? "Mainboard" : value.toUpperCase();
}

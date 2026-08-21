"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Plus, UserRound } from "lucide-react";

import { PANS } from "@/constants";
import { DatePicker, formatDateRange } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  const [applicantId, setApplicantId] = useState(PANS[0]?.id ?? "");

  const cutOffPrice = parsePrice(offerPrice);
  const total = cutOffPrice * numberValue(lotSize) * numberValue(lots);
  const applicant = PANS.find((pan) => pan.id === applicantId);

  useEffect(() => {
    if (!editingApplication) return;
    setCompany(editingApplication.company);
    setOfferStart(editingApplication.offerStart ?? "");
    setOfferEnd(editingApplication.offerEnd ?? "");
    setOfferPrice(editingApplication.offerPrice ?? String(editingApplication.cutOffPrice));
    setLotSize(String(editingApplication.lotSize));
    setLots(String(editingApplication.lots));
    setApplicationDate(editingApplication.applicationDate);
    const existingApplicant = PANS.find((pan) => pan.name === editingApplication.applicant);
    setApplicantId(existingApplicant?.id ?? PANS[0]?.id ?? "");
    setOpen(true);
  }, [editingApplication]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = company.trim();
    if (!name || !offerStart || !offerEnd || !offerPrice.trim() || !numberValue(lotSize) || !applicant || !applicationDate || total <= 0) return;

    const nextApplication = {
      id: `application-${Date.now()}`,
      company: name,
      symbol: symbolFor(name),
      initials: initialsFor(name),
      applicant: applicant.name,
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
    setApplicantId(PANS[0]?.id ?? "");
  }

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) handleClose(); else setOpen(true); }}>
      <SheetTrigger render={<Button><Plus className="size-4" aria-hidden="true" />Add application</Button>} />
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pr-10">
          <SheetTitle>Track an application</SheetTitle>
          <SheetDescription>Enter the essential IPO and bid details. No IPO dropdown or API data is required.</SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Field id="ipo-name" label="IPO name" placeholder="Lalithaa Jewellery Mart IPO" value={company} onChange={setCompany} />
            <div className="space-y-2"><Label>Offer dates</Label><div className="grid grid-cols-2 gap-3"><DatePicker value={offerStart} onChange={setOfferStart} placeholder="Opens" /><DatePicker value={offerEnd} onChange={setOfferEnd} placeholder="Closes" /></div></div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="offer-price" label="Offer price" placeholder="190-201" value={offerPrice} onChange={setOfferPrice} />
              <Field id="lot-size" label="Lot size" placeholder="74" value={lotSize} onChange={setLotSize} type="number" min="1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
            <Field id="lots" label="Bid lots" placeholder="1" value={lots} onChange={setLots} type="number" min="1" />
            <div className="space-y-2"><Label>Application date</Label><DatePicker value={applicationDate} onChange={setApplicationDate} /></div>
          </div>

          <div className="space-y-2"><Label htmlFor="applicant">Applicant</Label><Select value={applicantId} onValueChange={(value) => setApplicantId(value ?? "")}><SelectTrigger id="applicant" className="h-10 w-full"><UserRound className="size-4 text-muted-foreground" aria-hidden="true" /><SelectValue placeholder="Select applicant" /></SelectTrigger><SelectContent>{PANS.map((pan) => <SelectItem key={pan.id} value={pan.id}>{pan.name} · {pan.relation}</SelectItem>)}</SelectContent></Select></div>

          <div className="mt-auto border-y border-border py-5"><div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">Total application</span><strong className="text-xl">{formatCurrency(total)}</strong></div><p className="mt-2 text-xs text-muted-foreground">{numberValue(lots) || 0} lot{numberValue(lots) === 1 ? "" : "s"} · {numberValue(lotSize) || 0} shares per lot · ₹{cutOffPrice || 0} cut-off</p></div>
          <SheetFooter><Button type="submit" className="h-10 w-full"><Check className="size-4" aria-hidden="true" />Add to applications</Button></SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ id, label, placeholder, value, onChange, type = "text", min }: { id: string; label: string; placeholder: string; value: string; onChange: (value: string) => void; type?: string; min?: string }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} min={min} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="h-10" required /></div>;
}

function numberValue(value: string) { return Number(value) || 0; }
function parsePrice(value: string) { const values = value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? []; return values.length ? Math.max(...values) : 0; }
function today() { return new Date().toISOString().slice(0, 10); }
function initialsFor(value: string) { return value.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function symbolFor(value: string) { return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase(); }
function formatCurrency(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value); }

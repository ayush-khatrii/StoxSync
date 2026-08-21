"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";

import type { Ipo } from "@/constants";
import { DatePicker, formatDateRange } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function IpoSheet({ onAdd, onUpdate, editingIpo, onEditClose }: { onAdd: (ipo: Ipo) => void; onUpdate?: (ipo: Ipo) => void; editingIpo?: Ipo | null; onEditClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [offerStart, setOfferStart] = useState("");
  const [offerEnd, setOfferEnd] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [issueSize, setIssueSize] = useState("");

  useEffect(() => {
    if (!editingIpo) return;
    setCompany(editingIpo.company);
    setOfferStart(editingIpo.offerStart ?? "");
    setOfferEnd(editingIpo.offerEnd ?? "");
    setOfferPrice(editingIpo.offerPrice);
    setLotSize(String(editingIpo.lotSize));
    setIssueSize(editingIpo.issueSize);
    setOpen(true);
  }, [editingIpo]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = company.trim();
    const prices = parsePrices(offerPrice);
    if (!name || !offerStart || !offerEnd || !prices.length || !numberValue(lotSize) || !issueSize.trim()) return;

    const nextIpo = {
      id: editingIpo?.id ?? `ipo-${Date.now()}`,
      company: name,
      symbol: symbolFor(name),
      initials: initialsFor(name),
      offerDate: formatDateRange(offerStart, offerEnd),
      offerStart,
      offerEnd,
      offerPrice: offerPrice.trim(),
      cutOffPrice: Math.max(...prices),
      lotSize: numberValue(lotSize),
      issueSize: issueSize.trim(),
    } satisfies Ipo;

    if (editingIpo && onUpdate) onUpdate(nextIpo);
    else onAdd(nextIpo);

    handleClose();
    setCompany("");
    setOfferStart("");
    setOfferEnd("");
    setOfferPrice("");
    setLotSize("");
    setIssueSize("");
  }

  function handleClose() {
    setOpen(false);
    onEditClose?.();
  }

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) handleClose(); else setOpen(true); }}>
      <SheetTrigger render={<Button><Plus className="size-4" aria-hidden="true" />Add IPO</Button>} />
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pr-10">
          <SheetTitle>Add IPO details</SheetTitle>
          <SheetDescription>Save only the essential IPO data you have available. No API response is required.</SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Field id="ipo-company" label="Company / IPO name" placeholder="Lalithaa Jewellery Mart" value={company} onChange={setCompany} />
            <div className="space-y-2"><Label>Offer dates</Label><div className="grid grid-cols-2 gap-3"><DatePicker value={offerStart} onChange={setOfferStart} placeholder="Opens" /><DatePicker value={offerEnd} onChange={setOfferEnd} placeholder="Closes" /></div></div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="ipo-price" label="Offer price" placeholder="190-201" value={offerPrice} onChange={setOfferPrice} />
              <Field id="ipo-lot" label="Lot size" placeholder="74" value={lotSize} onChange={setLotSize} type="number" min="1" />
            </div>
            <Field id="ipo-size" label="Issue size" placeholder="₹1,700 Cr" value={issueSize} onChange={setIssueSize} />
          </div>

          <div className="mt-auto border-y border-border py-5 text-sm text-muted-foreground">Offer price and lot size are used later to calculate each application total.</div>
          <SheetFooter><Button type="submit" className="h-10 w-full"><Check className="size-4" aria-hidden="true" />Save IPO</Button></SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ id, label, placeholder, value, onChange, type = "text", min }: { id: string; label: string; placeholder: string; value: string; onChange: (value: string) => void; type?: string; min?: string }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} min={min} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="h-10" required /></div>;
}

function numberValue(value: string) { return Number(value) || 0; }
function parsePrices(value: string) { return value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? []; }
function initialsFor(value: string) { return value.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function symbolFor(value: string) { return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase(); }

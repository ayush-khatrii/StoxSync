import type { ApplicationEntry } from "@/components/ApplicationSheet";

export type ApplicationDbRow = {
  id: string;
  company: string;
  symbol: string;
  initials: string;
  applicant: string;
  application_date: string;
  offer_date: string;
  offer_start: string;
  offer_end: string;
  offer_price: string;
  lots: number;
  cut_off_price: number | string;
  lot_size: number;
  total: number | string;
  status: "Tracked";
};

export function fromApplicationRow(row: ApplicationDbRow): ApplicationEntry {
  return {
    id: row.id,
    company: row.company,
    symbol: row.symbol,
    initials: row.initials,
    applicant: row.applicant,
    applicationDate: row.application_date,
    offerDate: row.offer_date,
    offerStart: row.offer_start,
    offerEnd: row.offer_end,
    offerPrice: row.offer_price,
    lots: row.lots,
    cutOffPrice: Number(row.cut_off_price),
    lotSize: row.lot_size,
    total: Number(row.total),
    status: row.status,
  };
}

export function toApplicationRow(application: ApplicationEntry) {
  return {
    company: application.company,
    symbol: application.symbol,
    initials: application.initials,
    applicant: application.applicant,
    application_date: application.applicationDate,
    offer_date: application.offerDate,
    offer_start: application.offerStart,
    offer_end: application.offerEnd,
    offer_price: application.offerPrice,
    lots: application.lots,
    cut_off_price: application.cutOffPrice,
    lot_size: application.lotSize,
    total: application.total,
    status: application.status,
    updated_at: new Date().toISOString(),
  };
}

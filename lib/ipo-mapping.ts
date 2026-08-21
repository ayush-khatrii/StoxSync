import type { Ipo } from "@/constants";

export type IpoDbRow = {
  id: string;
  company: string;
  symbol: string;
  initials: string;
  offer_start: string;
  offer_end: string;
  offer_price: string;
  cut_off_price: number | string;
  lot_size: number;
};

export function formatIpoDate(start: string, end: string) {
  const formatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${formatter.format(new Date(`${start}T00:00:00`))} - ${formatter.format(new Date(`${end}T00:00:00`))}`;
}

export function fromIpoRow(row: IpoDbRow): Ipo {
  return {
    id: row.id,
    company: row.company,
    symbol: row.symbol,
    initials: row.initials,
    offerDate: formatIpoDate(row.offer_start, row.offer_end),
    offerStart: row.offer_start,
    offerEnd: row.offer_end,
    offerPrice: row.offer_price,
    cutOffPrice: Number(row.cut_off_price),
    lotSize: row.lot_size,
  };
}

export function toIpoRow(ipo: Ipo) {
  return {
    company: ipo.company,
    symbol: ipo.symbol,
    initials: ipo.initials,
    offer_start: ipo.offerStart,
    offer_end: ipo.offerEnd,
    offer_price: ipo.offerPrice,
    cut_off_price: ipo.cutOffPrice,
    lot_size: ipo.lotSize,
    updated_at: new Date().toISOString(),
  };
}

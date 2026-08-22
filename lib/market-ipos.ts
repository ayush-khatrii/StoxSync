export const IPO_CATEGORIES = [
  "open",
  "upcoming",
  "closed",
  "listed",
] as const;

export type IpoCategory = (typeof IPO_CATEGORIES)[number];
export type MarketIpo = {
  id: string;
  name: string;
  symbol: string;
  maximum_price: number | null;
  minimum_price: number | null;
  lot_size: number | null;
  issue_type: "regular" | "sme" | string;
  bidding_start_date: string | null;
  bidding_end_date: string | null;
  total_subscription: string | null;
  allotment_date: string | null;
  listing_date: string | null;
  cutoff_total: number | null;
};

export type UpstoxPage = {
  page_number: number;
  total_pages: number;
  records: number;
  total_records: number;
};

export type PaginatedIpoResponse = {
  items: MarketIpo[];
  page: UpstoxPage;
};

export const IPO_CATEGORY_LABELS: Record<IpoCategory, string> = {
  open: "Active",
  upcoming: "Upcoming",
  closed: "Closed",
  listed: "Listed",
};

export const IPO_CATEGORIES = [
  "active",
  "upcoming",
  "pre_apply",
  "closed",
  "listed",
] as const;

export type IpoCategory = (typeof IPO_CATEGORIES)[number];
export type MarketIpo = Record<string, unknown>;

export type PaginatedIpoResponse = {
  category: IpoCategory;
  items: MarketIpo[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export const IPO_CATEGORY_LABELS: Record<IpoCategory, string> = {
  active: "Active",
  upcoming: "Upcoming",
  pre_apply: "Pre-apply",
  closed: "Closed",
  listed: "Listed",
};

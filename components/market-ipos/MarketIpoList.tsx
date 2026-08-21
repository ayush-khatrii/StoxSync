import type { ReactNode } from "react";
import { CalendarDays, Layers3 } from "lucide-react";

import type { IpoCategory, MarketIpo } from "@/lib/market-ipos";

export function MarketIpoList({ items, category, startIndex }: { items: MarketIpo[]; category: IpoCategory; startIndex: number }) {
  if (items.length === 0) {
    return <div className="border-b border-border/70 py-14 text-center text-sm text-muted-foreground">No IPOs found in this category.</div>;
  }

  return (
    <ol className="max-w-full overflow-hidden border-t border-border/70">
      {items.map((ipo, index) => {
        const name = readValue(ipo, ["name", "company_name", "companyName", "company"]) || "Unnamed IPO";
        const symbol = readValue(ipo, ["symbol", "ticker", "stock_symbol"]);
        const issueType = readValue(ipo, ["issue_type", "issueType"]);
        const lotSize = readValue(ipo, ["lot_size", "lotSize", "min_bid_quantity", "minBidQuantity"]);

        return (
          <li key={itemKey(ipo, index)} className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-x-2 gap-y-3 border-b border-border/70 px-1 py-4 lg:grid-cols-[40px_minmax(0,1fr)_140px_100px_130px_180px] lg:items-center lg:gap-4 lg:px-2">
            <span className="text-xs tabular-nums text-muted-foreground">{String(startIndex + index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-semibold">{name}</h2>
                <span className="shrink-0 text-[11px] font-medium capitalize text-primary">{category.replace("_", "-")}</span>
              </div>
              {(symbol || issueType) && <p className="mt-1 truncate text-xs text-muted-foreground">{[symbol, issueType].filter(Boolean).join(" · ")}</p>}
            </div>
            <div className="col-start-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-4 lg:contents">
              <Detail label="Price band" value={priceBand(ipo)} />
              <Detail label="Lot size" value={lotSize ? `${lotSize} shares` : "-"} icon={<Layers3 className="size-3" />} />
              <Detail label="Cut-off total" value={cutOffTotal(ipo)} />
              <Detail label="Bidding dates" value={dateRange(ipo)} icon={<CalendarDays className="size-3" />} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium">{icon}{value}</p>
    </div>
  );
}

function readValue(item: MarketIpo, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return "";
}

function priceBand(item: MarketIpo) {
  const minimum = readValue(item, ["min_price", "minimumPrice", "minimum_price"]);
  const maximum = readValue(item, ["max_price", "maximumPrice", "maximum_price"]);
  const issuePrice = readValue(item, ["issue_price", "issuePrice", "price"]);
  if (minimum && maximum) return `₹${minimum} - ₹${maximum}`;
  if (maximum || minimum) return `₹${maximum || minimum}`;
  if (issuePrice) return `₹${issuePrice}`;
  return "Not available";
}

function cutOffTotal(item: MarketIpo) {
  const maximum = numberValue(readValue(item, ["max_price", "maximumPrice", "maximum_price"]));
  const lotSize = numberValue(readValue(item, ["lot_size", "lotSize", "min_bid_quantity", "minBidQuantity"]));
  if (!maximum || !lotSize) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(maximum * lotSize);
}

function numberValue(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateRange(item: MarketIpo) {
  const start = readValue(item, ["bidding_start_date", "biddingStartDate", "start_date"]);
  const end = readValue(item, ["bidding_end_date", "biddingEndDate", "end_date"]);
  if (!start && !end) return "Not announced";
  return [formatDate(start), formatDate(end)].filter(Boolean).join(" - ");
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function itemKey(item: MarketIpo, index: number) {
  return readValue(item, ["id", "symbol", "name", "company_name"]) || `ipo-${index}`;
}

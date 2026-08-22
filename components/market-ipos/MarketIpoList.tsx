import type { ReactNode } from "react";
import { CalendarDays, Layers3, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IPO_CATEGORY_LABELS, type IpoCategory, type MarketIpo } from "@/lib/market-ipos";
import { cn } from "@/lib/utils";

export function MarketIpoList({ items, category, startIndex }: { items: MarketIpo[]; category: IpoCategory; startIndex: number }) {
  if (items.length === 0) {
    return <div className="border-b border-border/70 py-14 text-center text-sm text-muted-foreground">No IPOs found in this category.</div>;
  }

  return (
    <div className="subtle-scrollbar w-full overflow-x-auto pb-1">
      <ol className="w-full border-t border-border/70 xl:min-w-[1320px]">
        <li className="hidden grid-cols-[36px_minmax(220px,1fr)_130px_100px_130px_180px_100px_230px] items-center gap-4 border-b border-border bg-muted/60 px-2 py-3 text-[10px] font-semibold uppercase text-muted-foreground xl:grid">
          <span>No.</span>
          <span>Company</span>
          <span>Price band</span>
          <span>Lot size</span>
          <span>Cut-off total</span>
          <span>Bidding dates</span>
          <span>Subscription</span>
          <span>Allotment &amp; listing</span>
        </li>
        {items.map((ipo, index) => {
          return (
            <li key={ipo.id} className="group grid min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-x-2 gap-y-4 border-b border-border/70 px-2 py-4 transition-colors hover:bg-muted/25 sm:px-3 xl:grid-cols-[36px_minmax(220px,1fr)_130px_100px_130px_180px_100px_230px] xl:items-center xl:gap-4 xl:px-2">
              <span className="text-xs tabular-nums text-muted-foreground">{String(startIndex + index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2 xl:flex-nowrap">
                  <h2 className="line-clamp-2 text-sm font-semibold leading-5 group-hover:text-primary xl:truncate" title={ipo.name}>{ipo.name || "Unnamed IPO"}</h2>
                  <Badge variant={statusVariant(category)}>{IPO_CATEGORY_LABELS[category]}</Badge>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="truncate text-xs text-muted-foreground">{ipo.symbol}</span>
                  <Badge variant="outline">{formatIssueType(ipo.issue_type)}</Badge>
                </div>
              </div>
              <div className="col-start-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 xl:contents">
                <Detail label="Price band" value={priceBand(ipo)} />
                <Detail label="Lot size" value={ipo.lot_size ? `${ipo.lot_size} shares` : "-"} icon={<Layers3 className="size-3" />} />
                <Detail label="Cut-off total" value={<Badge variant="accent" className="text-xs font-semibold tabular-nums">{cutOffTotal(ipo)}</Badge>} />
                <Detail label="Bidding dates" value={dateRange(ipo)} icon={<CalendarDays className="size-3" />} />
                <Detail label="Subscription" value={<Badge variant={subscriptionValue(ipo) > 0 ? "success" : "secondary"}><TrendingUp className="size-3" />{subscription(ipo)}</Badge>} />
                <Detail label="Timeline" value={timeline(ipo)} icon={<CalendarDays className="size-3" />} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Detail({ label, value, icon, className }: { label: string; value: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase text-muted-foreground xl:sr-only">{label}</p>
      <div className={cn("mt-1 flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-medium xl:mt-0 xl:flex-nowrap", className)}>{icon}{value}</div>
    </div>
  );
}

function priceBand(item: MarketIpo) {
  if (item.minimum_price && item.maximum_price) return `₹${item.minimum_price} - ₹${item.maximum_price}`;
  if (item.maximum_price || item.minimum_price) return `₹${item.maximum_price || item.minimum_price}`;
  return "-";
}

function cutOffTotal(item: MarketIpo) {
  if (!item.cutoff_total) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(item.cutoff_total);
}

function dateRange(item: MarketIpo) {
  const start = item.bidding_start_date || "";
  const end = item.bidding_end_date || "";
  if (!start && !end) return "Not announced";
  return [formatDate(start), formatDate(end)].filter(Boolean).join(" - ");
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function subscription(item: MarketIpo) {
  return item.total_subscription ? `${item.total_subscription}x` : "-";
}

function subscriptionValue(item: MarketIpo) {
  return Number(item.total_subscription) || 0;
}

function timeline(item: MarketIpo) {
  const allotment = item.allotment_date ? `Allot ${formatDate(item.allotment_date)}` : "";
  const listing = item.listing_date ? `List ${formatDate(item.listing_date)}` : "";
  return [allotment, listing].filter(Boolean).join(" · ") || "-";
}

function formatIssueType(value: string) {
  if (value === "regular") return "Mainboard";
  return value.toUpperCase();
}

function statusVariant(category: IpoCategory): "accent" | "secondary" | "outline" | "success" {
  if (category === "open") return "accent";
  if (category === "listed") return "success";
  if (category === "closed") return "outline";
  return "secondary";
}

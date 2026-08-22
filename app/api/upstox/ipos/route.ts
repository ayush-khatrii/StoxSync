import { getCurrentUserId } from "@/lib/custom-auth";
import { IPO_CATEGORIES, type IpoCategory, type MarketIpo } from "@/lib/market-ipos";
import { NextRequest, NextResponse } from "next/server";

const UPSTOX_URL = "https://api.upstox.com/v2/ipos";

type UpstoxListItem = {
  id: string;
  name: string;
  symbol: string;
  maximum_price: number;
  minimum_price: number;
  issue_type: string;
  bidding_start_date: string;
  bidding_end_date: string;
  total_subscription: string | null;
};

type UpstoxDetails = {
  lot_size?: number | null;
  total_subscription?: string | null;
  timeline?: {
    allotment_date?: string | null;
    listing_date?: string | null;
  };
};

async function upstoxFetch(url: string, token: string) {
  return fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 300 },
  });
}

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.UPSTOX_ACCESS_TOKEN?.trim();

  if (!token) {
    return NextResponse.json(
      { error: "Upstox access token is missing." },
      { status: 503 },
    );
  }

  const requestedStatus = request.nextUrl.searchParams.get("status") ?? "open";
  const status: IpoCategory = IPO_CATEGORIES.includes(requestedStatus as IpoCategory)
    ? (requestedStatus as IpoCategory)
    : "open";
  const page = Math.max(Number(request.nextUrl.searchParams.get("page")) || 1, 1);
  const limit = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("limit")) || 10, 1),
    30,
  );

  try {
    const params = new URLSearchParams({
      status,
      page_number: String(page),
      records: String(limit),
    });
    const listResponse = await upstoxFetch(`${UPSTOX_URL}?${params}`, token);
    const listBody = await listResponse.json().catch(() => null);

    if (!listResponse.ok) {
      console.error("[Upstox IPO] List request failed:", {
        status: listResponse.status,
        errors: listBody?.errors,
      });
      return NextResponse.json(
        {
          error: "Unable to fetch IPO data from Upstox.",
          upstreamStatus: listResponse.status,
        },
        { status: 502 },
      );
    }

    const listItems: UpstoxListItem[] = Array.isArray(listBody?.data)
      ? listBody.data
      : [];
    const items: MarketIpo[] = await Promise.all(
      listItems.map(async (ipo) => {
        const detailsResponse = await upstoxFetch(
          `${UPSTOX_URL}/${encodeURIComponent(ipo.id)}`,
          token,
        );
        const detailsBody = detailsResponse.ok
          ? await detailsResponse.json().catch(() => null)
          : null;
        const details = (detailsBody?.data ?? {}) as UpstoxDetails;
        const lotSize = details.lot_size ?? null;

        return {
          id: ipo.id,
          name: ipo.name,
          symbol: ipo.symbol,
          maximum_price: ipo.maximum_price ?? null,
          minimum_price: ipo.minimum_price ?? null,
          lot_size: lotSize,
          issue_type: ipo.issue_type,
          bidding_start_date: ipo.bidding_start_date ?? null,
          bidding_end_date: ipo.bidding_end_date ?? null,
          total_subscription:
            details.total_subscription ?? ipo.total_subscription ?? null,
          allotment_date: details.timeline?.allotment_date ?? null,
          listing_date: details.timeline?.listing_date ?? null,
          cutoff_total:
            lotSize && ipo.maximum_price ? lotSize * ipo.maximum_price : null,
        };
      }),
    );

    return NextResponse.json({
      items,
      page: listBody.meta_data.page,
    });
  } catch (error) {
    console.error("[Upstox IPO] Request error:", error);
    return NextResponse.json(
      { error: "Unable to connect to Upstox." },
      { status: 502 },
    );
  }
}

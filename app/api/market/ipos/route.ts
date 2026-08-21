import { getCurrentUserId } from "@/lib/custom-auth";
import {
  IPO_CATEGORIES,
  type IpoCategory,
  type MarketIpo,
} from "@/lib/market-ipos";
import { NextRequest, NextResponse } from "next/server";

const IPO_API_URL = process.env.INDIAN_API_IPO_URL!;

export async function GET(request: NextRequest) {
  if (!IPO_API_URL) {
    console.error("[IndianAPI IPO] Missing BASE URL in .env");
    return NextResponse.json(
      { error: "IndianAPI key is not configured." },
      { status: 503 },
    );
  }
  const apiKey = process.env.INDIAN_API_IPO_KEY!;

  if (!apiKey) {
    return NextResponse.json(
      { error: "IndianAPI key is not configured." },
      { status: 503 },
    );
  }

  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(IPO_API_URL, {
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      next: { revalidate: 300 },
    });

    const data = (await response.json().catch(() => null)) as Partial<
      Record<IpoCategory, MarketIpo[]>
    > | null;

    console.info("[IndianAPI IPO] Response status:", response.status);

    if (!response.ok) {
      console.error("[IndianAPI IPO] Upstream request failed");
      return NextResponse.json(
        {
          error: "Unable to fetch IPO data from IndianAPI.",
          upstreamStatus: response.status,
        },
        { status: 502 },
      );
    }

    const requestedCategory =
      request.nextUrl.searchParams.get("category") ?? "active";
    const category: IpoCategory = IPO_CATEGORIES.includes(
      requestedCategory as IpoCategory,
    )
      ? (requestedCategory as IpoCategory)
      : "active";
    const page = Math.max(
      Number(request.nextUrl.searchParams.get("page")) || 1,
      1,
    );
    const limit = Math.min(
      Math.max(Number(request.nextUrl.searchParams.get("limit")) || 10, 1),
      25,
    );
    const items = Array.isArray(data?.[category]) ? data[category] : [];
    const total = items.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);

    console.info(
      `[IndianAPI IPO] category=${category} page=${safePage} returned=${paginatedItems.length} total=${total}`,
    );

    return NextResponse.json({
      category,
      items: paginatedItems,
      page: safePage,
      limit,
      total,
      totalPages,
      hasMore: start + limit < total,
    });
  } catch (error) {
    console.error("[IndianAPI IPO] Request error:", error);
    return NextResponse.json(
      { error: "Unable to connect to IndianAPI." },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";

import { fromIpoRow, toIpoRow, type IpoDbRow } from "@/lib/ipo-mapping";
import { getCurrentUserId } from "@/lib/custom-auth";
import { createAdminClient } from "@/utils/supabase/admin";

function validIpo(value: Record<string, unknown>) {
  return (
    typeof value.company === "string" &&
    value.company.trim() &&
    typeof value.offerStart === "string" &&
    typeof value.offerEnd === "string" &&
    typeof value.offerPrice === "string" &&
    Number(value.cutOffPrice) > 0 &&
    Number(value.lotSize) > 0
  );
}




export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { data, error } = await createAdminClient()
    .from("ipos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json(
      { error: "Unable to load IPOs." },
      { status: 500 },
    );
  return NextResponse.json({ ipos: (data as IpoDbRow[]).map(fromIpoRow) });
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const value = await request.json().catch(() => ({}));
  if (!validIpo(value))
    return NextResponse.json(
      {
        error:
          "Add the IPO name, dates, offer price, cut-off price, and lot size.",
      },
      { status: 400 },
    );

  const { data, error } = await createAdminClient()
    .from("ipos")
    .insert({ ...toIpoRow(value), user_id: userId })
    .select("*")
    .single();
  if (error)
    return NextResponse.json({ error: "Unable to add IPO." }, { status: 500 });
  return NextResponse.json(
    { ipo: fromIpoRow(data as IpoDbRow) },
    { status: 201 },
  );
}

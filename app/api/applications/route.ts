import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/lib/custom-auth";
import { fromApplicationRow, toApplicationRow, type ApplicationDbRow } from "@/lib/application-mapping";
import { createAdminClient } from "@/utils/supabase/admin";

function validApplication(value: Record<string, unknown>) {
  return typeof value.company === "string" && value.company.trim() && typeof value.offerStart === "string" && typeof value.offerEnd === "string" && typeof value.applicationDate === "string" && typeof value.offerPrice === "string" && typeof value.applicant === "string" && Number(value.cutOffPrice) > 0 && Number(value.lotSize) > 0 && Number(value.lots) > 0 && Number(value.total) > 0;
}

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { data, error } = await createAdminClient().from("ipo_applications").select("*").eq("user_id", userId).order("application_date", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to load applications." }, { status: 500 });
  return NextResponse.json({ applications: (data as ApplicationDbRow[]).map(fromApplicationRow) });
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const value = await request.json().catch(() => ({}));
  if (!validApplication(value)) return NextResponse.json({ error: "Add the IPO, offer dates, offer price, lot size, and application date." }, { status: 400 });

  const { data, error } = await createAdminClient().from("ipo_applications").insert({ ...toApplicationRow(value), user_id: userId }).select("*").single();
  if (error) return NextResponse.json({ error: "Unable to add application." }, { status: 500 });
  return NextResponse.json({ application: fromApplicationRow(data as ApplicationDbRow) }, { status: 201 });
}

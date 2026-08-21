import { NextResponse } from "next/server";

import { fromIpoRow, toIpoRow, type IpoDbRow } from "@/lib/ipo-mapping";
import { getCurrentUserId } from "@/lib/custom-auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const value = await request.json().catch(() => ({}));
  const { id } = await params;
  const { data, error } = await createAdminClient().from("ipos").update(toIpoRow(value)).eq("id", id).eq("user_id", userId).select("*").maybeSingle();
  if (error || !data) return NextResponse.json({ error: "IPO not found or could not be updated." }, { status: 404 });
  return NextResponse.json({ ipo: fromIpoRow(data as IpoDbRow) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { id } = await params;
  const { error } = await createAdminClient().from("ipos").delete().eq("id", id).eq("user_id", userId);
  if (error) return NextResponse.json({ error: "Unable to delete IPO." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
